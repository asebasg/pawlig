import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PetForm from "../pet-form";
import { toast } from "sonner";

// ID de 24 caracteres hexadecimales válido para MongoDB
const VALID_SHELTER_ID = "507f1f77bcf86cd799439011";

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

describe("PetForm - Upload de Imágenes (Fase 7)", () => {
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
    global.FileReader = MockFileReader as any;

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
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ url: "https://res.cloudinary.com/pawlig/pets/luna.png" }),
    });

    render(<PetForm shelterId={VALID_SHELTER_ID} />);

    const fileInput = screen.getByLabelText(/Subir fotos/i) as HTMLInputElement;
    const validFile = new File(["valid image content"], "luna.png", { type: "image/png" });

    // Lanzar el input change
    await user.upload(fileInput, validFile);

    // Debe mostrar la imagen con su preview blob temporal de inmediato
    await waitFor(() => {
      const previewImg = screen.getByAltText("Foto 1");
      expect(previewImg).toBeInTheDocument();
      expect(previewImg).toHaveAttribute("src", "blob:http://localhost/luna.png");
    });

    // Esperar a que la promesa de fetch termine y se actualice al estado success (borde verde)
    await waitFor(() => {
      const previewImg = screen.getByAltText("Foto 1");
      expect(previewImg.className).toContain("border-green-300");
    });

    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining("1 imagen(es) subida(s) correctamente"));
  });

  test("debería rechazar archivos que excedan el límite de tamaño de 5MB localmente", async () => {
    const user = userEvent.setup();
    render(<PetForm shelterId={VALID_SHELTER_ID} />);

    const fileInput = screen.getByLabelText(/Subir fotos/i) as HTMLInputElement;
    
    // Crear un archivo ficticio de 6MB
    const bigFile = new File(["a".repeat(6 * 1024 * 1024)], "gigante.png", { type: "image/png" });

    await user.upload(fileInput, bigFile);

    // No debe haber llamado al backend (fetch)
    expect(global.fetch).not.toHaveBeenCalled();

    // Debe mostrar un toast de error por la validación previa de la Fase 1
    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("excede 5MB"));
  });

  test("debería rechazar formatos no permitidos localmente", async () => {
    render(<PetForm shelterId={VALID_SHELTER_ID} />);

    const fileInput = screen.getByLabelText(/Subir fotos/i) as HTMLInputElement;
    const txtFile = new File(["fake text content"], "doc.txt", { type: "text/plain" });

    // Usar fireEvent.change para evitar que userEvent filtre el archivo por el atributo accept
    fireEvent.change(fileInput, {
      target: { files: [txtFile] }
    });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("formato inválido"));
  });

  test("caso mixto: debería subir la válida y rechazar la inválida, reflejando el toast de resumen", async () => {
    const user = userEvent.setup();
    
    // Mock de upload exitoso
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ url: "https://res.cloudinary.com/pawlig/pets/mix-success.png" }),
    });

    render(<PetForm shelterId={VALID_SHELTER_ID} />);

    const fileInput = screen.getByLabelText(/Subir fotos/i) as HTMLInputElement;
    const validFile = new File(["valid image"], "buena.png", { type: "image/png" });
    const invalidFile = new File(["a".repeat(6 * 1024 * 1024)], "pesada.png", { type: "image/png" });

    await user.upload(fileInput, [validFile, invalidFile]);

    // Debe haber llamado a fetch solo una vez (para la buena)
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Debe mostrar preview solo para la válida
    await waitFor(() => {
      expect(screen.getByAltText("Foto 1")).toBeInTheDocument();
    });
    expect(screen.queryByAltText("Foto 2")).not.toBeInTheDocument();

    // Resumen toast de advertencia
    expect(toast.warning).toHaveBeenCalledWith(
      expect.stringContaining("1 subida(s) con éxito. 1 rechazada(s) localmente.")
    );
  });

  test("debería permitir eliminar una imagen fallida del estado sin afectar al resto", async () => {
    const user = userEvent.setup();
    
    // Simular error del servidor para la subida
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "Error de conexión con Cloudinary" }),
    });

    render(<PetForm shelterId={VALID_SHELTER_ID} />);

    const fileInput = screen.getByLabelText(/Subir fotos/i) as HTMLInputElement;
    const file = new File(["image data"], "luna-fail.png", { type: "image/png" });

    await user.upload(fileInput, file);

    // Debería marcarse en estado de error en la UI
    await waitFor(() => {
      expect(screen.getByText("Error de conexión con Cloudinary")).toBeInTheDocument();
    });

    // Encontrar y clickear el botón de eliminar de esa imagen
    const removeBtn = screen.getByLabelText("Eliminar foto");
    await user.click(removeBtn);

    // La imagen y su mensaje de error deben desaparecer de la UI
    expect(screen.queryByText("Error de conexión con Cloudinary")).not.toBeInTheDocument();
    expect(screen.queryByAltText("Foto 1")).not.toBeInTheDocument();
    
    // No debe haber llamado al endpoint de delete de Cloudinary porque falló al subir
    expect(global.fetch).toHaveBeenCalledTimes(1); // Solo el POST de upload
  });

  test("el submit final del formulario debería mandar solo URLs con status 'success'", async () => {
    const user = userEvent.setup();

    // Mock de uploads: primero falla, segundo éxito
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Fallo temporal" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: "https://res.cloudinary.com/pawlig/pets/exito.png" }),
      })
      // Mock para la llamada de submit final (/api/pets)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

    render(<PetForm shelterId={VALID_SHELTER_ID} />);

    // Llenar campos obligatorios
    await user.type(screen.getByLabelText(/Nombre de la mascota/i), "Luna");
    await user.type(screen.getByLabelText(/Raza/i), "Labrador");
    await user.type(screen.getByLabelText(/Descripción detallada/i), "Luna es una perrita muy cariñosa y juguetona.");

    const fileInput = screen.getByLabelText(/Subir fotos/i) as HTMLInputElement;
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
      expect(screen.getByAltText("Foto 2")).toBeInTheDocument();
    });

    // Enviar el formulario
    const submitBtn = screen.getByRole("button", { name: /Publicar Mascota/i });
    await user.click(submitBtn);

    // Validar el payload del submit enviado por fetch
    await waitFor(() => {
      const lastFetchCall = (global.fetch as any).mock.calls.find((call: any) => call[0] === "/api/pets");
      expect(lastFetchCall).toBeDefined();
      
      const payload = JSON.parse(lastFetchCall[1].body);
      expect(payload.images).toEqual(["https://res.cloudinary.com/pawlig/pets/exito.png"]);
    });
  });
});
