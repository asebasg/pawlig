import { describe, test, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductForm from "../product-form";
import { toast } from "sonner";

// ID de 24 caracteres hexadecimales válido para MongoDB
const VALID_VENDOR_ID = "507f1f77bcf86cd799439011";

// Mocks de Next.js y Sonner
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    loading: vi.fn(() => "toast-loading-id"),
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock de AI button
vi.mock("@/components/ui/ai-refine-button", () => ({
  AiRefineButton: () => <button type="button">Refinar</button>,
}));

describe("ProductForm - Upload de Imágenes (Fase 7)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock FileReader
    class MockFileReader {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      result = "data:image/png;base64,mockedbase64string";
      readAsDataURL() {
        if (this.onload) {
          setTimeout(() => this.onload!(), 10);
        }
      }
    }
    global.FileReader = MockFileReader as unknown as typeof FileReader;

    // Mock URL methods
    global.URL.createObjectURL = vi.fn((file) => `blob:http://localhost/${file.name}`);
    global.URL.revokeObjectURL = vi.fn();

    // Mock Fetch global
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("debería permitir subir imágenes válidas y mostrar preview de inmediato", async () => {
    const user = userEvent.setup();

    // Mock de upload exitoso en Cloudinary
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ url: "https://res.cloudinary.com/pawlig/products/alimento.png" }),
    });

    render(<ProductForm vendorId={VALID_VENDOR_ID} />);

    const fileInput = screen.getByLabelText(/Subir imágenes/i) as HTMLInputElement;
    const validFile = new File(["valid image content"], "alimento.png", { type: "image/png" });

    // Lanzar el input change
    await user.upload(fileInput, validFile);

    // Debe mostrar la imagen con su preview blob temporal de inmediato
    await waitFor(() => {
      const previewImg = screen.getByAltText("Imagen producto 1");
      expect(previewImg).toBeInTheDocument();
      expect(previewImg).toHaveAttribute("src", "blob:http://localhost/alimento.png");
    });

    // Esperar a que la promesa de fetch termine y se actualice al estado success (borde verde)
    await waitFor(() => {
      const previewImg = screen.getByAltText("Imagen producto 1");
      expect(previewImg.className).toContain("border-green-300");
    });

    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining("1 imagen(es) subida(s) correctamente"));
  });

  test("debería rechazar archivos que excedan el límite de tamaño de 5MB localmente", async () => {
    const user = userEvent.setup();
    render(<ProductForm vendorId={VALID_VENDOR_ID} />);

    const fileInput = screen.getByLabelText(/Subir imágenes/i) as HTMLInputElement;
    
    // Crear un archivo ficticio de 6MB
    const bigFile = new File(["a".repeat(6 * 1024 * 1024)], "grande.png", { type: "image/png" });

    await user.upload(fileInput, bigFile);

    // No debe haber llamado al backend (fetch)
    expect(global.fetch).not.toHaveBeenCalled();

    // Debe mostrar un toast de error por la validación previa de la Fase 1
    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("excede 5MB"));
  });

  test("debería rechazar formatos no permitidos localmente", async () => {
    render(<ProductForm vendorId={VALID_VENDOR_ID} />);

    const fileInput = screen.getByLabelText(/Subir imágenes/i) as HTMLInputElement;
    const pdfFile = new File(["fake pdf content"], "doc.pdf", { type: "application/pdf" });

    // Usar fireEvent.change para evitar que userEvent filtre el archivo por el atributo accept
    fireEvent.change(fileInput, {
      target: { files: [pdfFile] }
    });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("formato inválido"));
  });

  test("caso mixto: debería subir la válida y rechazar la inválida, reflejando el toast de resumen", async () => {
    const user = userEvent.setup();

    // Mock de upload exitoso
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ url: "https://res.cloudinary.com/pawlig/products/mix-success.png" }),
    });

    render(<ProductForm vendorId={VALID_VENDOR_ID} />);

    const fileInput = screen.getByLabelText(/Subir imágenes/i) as HTMLInputElement;
    const validFile = new File(["valid image"], "buena.png", { type: "image/png" });
    const invalidFile = new File(["a".repeat(6 * 1024 * 1024)], "pesada.png", { type: "image/png" });

    await user.upload(fileInput, [validFile, invalidFile]);

    // Debe haber llamado a fetch solo una vez (para la buena)
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Debe mostrar preview solo para la válida
    await waitFor(() => {
      expect(screen.getByAltText("Imagen producto 1")).toBeInTheDocument();
    });
    expect(screen.queryByAltText("Imagen producto 2")).not.toBeInTheDocument();

    // Resumen toast de advertencia
    expect(toast.warning).toHaveBeenCalledWith(
      expect.stringContaining("1 subida(s) con éxito. 1 rechazada(s) localmente.")
    );
  });

  test("debería permitir eliminar una imagen fallida del estado sin afectar al resto", async () => {
    const user = userEvent.setup();

    // Simular error del servidor para la subida
    (global.fetch as Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "Error de conexión con Cloudinary" }),
    });

    render(<ProductForm vendorId={VALID_VENDOR_ID} />);

    const fileInput = screen.getByLabelText(/Subir imágenes/i) as HTMLInputElement;
    const file = new File(["image data"], "fail.png", { type: "image/png" });

    await user.upload(fileInput, file);

    // Debería marcarse en estado de error en la UI
    await waitFor(() => {
      expect(screen.getByText("Error de conexión con Cloudinary")).toBeInTheDocument();
    });

    // Encontrar y clickear el botón de eliminar de esa imagen
    const removeBtn = screen.getByLabelText("Eliminar imagen");
    await user.click(removeBtn);

    // La imagen y su mensaje de error deben desaparecer de la UI
    expect(screen.queryByText("Error de conexión con Cloudinary")).not.toBeInTheDocument();
    expect(screen.queryByAltText("Imagen producto 1")).not.toBeInTheDocument();

    // No debe haber llamado al endpoint de delete de Cloudinary porque falló al subir
    expect(global.fetch).toHaveBeenCalledTimes(1); // Solo el POST de upload
  });

  test("el submit final del formulario debería mandar solo URLs con status 'success'", async () => {
    const user = userEvent.setup();

    // Mock de uploads: primero falla, segundo éxito
    (global.fetch as Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Fallo temporal" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: "https://res.cloudinary.com/pawlig/products/exito.png" }),
      })
      // Mock para la llamada de submit final (/api/products)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

    render(<ProductForm vendorId={VALID_VENDOR_ID} />);

    // Llenar campos obligatorios
    await user.type(screen.getByLabelText(/Nombre del producto/i), "Juguete");
    await user.selectOptions(screen.getByLabelText(/Categoría/i), "JUGUETES");
    await user.type(screen.getByLabelText(/Stock disponible/i), "10");
    await user.type(screen.getByLabelText(/Precio/i), "5000");
    await user.type(screen.getByLabelText(/Descripción/i), "Un juguete muy entretenido para perros.");

    const fileInput = screen.getByLabelText(/Subir imágenes/i) as HTMLInputElement;
    const file1 = new File(["data"], "fail.png", { type: "image/png" });
    const file2 = new File(["data"], "success.png", { type: "image/png" });

    // Subir la primera imagen (fallará)
    await user.upload(fileInput, file1);
    await waitFor(() => {
      expect(screen.getByText("Fallo temporal")).toBeInTheDocument();
    });

    // Subir la segunda imagen (tendrá éxito)
    await user.upload(fileInput, file2);
    await waitFor(() => {
      expect(screen.getByAltText("Imagen producto 2")).toBeInTheDocument();
    });

    // Enviar el formulario
    const submitBtn = screen.getByRole("button", { name: /Publicar Producto/i });
    await user.click(submitBtn);

    // Validar el payload del submit enviado por fetch
    await waitFor(() => {
      const lastFetchCall = (global.fetch as Mock).mock.calls.find((call: unknown[]) => call[0] === "/api/products");
      expect(lastFetchCall).toBeDefined();

      const payload = JSON.parse(lastFetchCall[1].body);
      expect(payload.images).toEqual(["https://res.cloudinary.com/pawlig/products/exito.png"]);
    });
  });
});