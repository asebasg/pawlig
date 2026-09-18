"use client";

import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Descripción: Componente base para diálogos modales de alerta y confirmación.
 * Requiere: React y ReactDOM (createPortal).
 * Implementa: Diálogos accesibles con portal a document.body y blur global de interfaz.
 */

const AlertDialogContext = React.createContext<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}>({});

const AlertDialog = ({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  React.useEffect(() => {
    if (open) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [open]);

  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange }}>
      {open && children}
    </AlertDialogContext.Provider>
  );
};

const AlertDialogTrigger = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div {...props}>{children}</div>;
};

const AlertDialogPortal = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <div {...props}>{children}</div>;
};

const AlertDialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ${className || ""}`}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = "AlertDialogOverlay";

const AlertDialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div data-portal-wrapper className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <AlertDialogOverlay onClick={() => onOpenChange?.(false)} />
      <div
        ref={ref}
        className={`relative z-50 grid w-full max-w-lg gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg md:w-full ${className || ""}`}
        {...props}
      />
    </div>,
    document.body
  );
});
AlertDialogContent.displayName = "AlertDialogContent";

const AlertDialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={`flex flex-col space-y-2 text-center sm:text-left ${className || ""}`}
        {...props}
    />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className || ""}`}
        {...props}
    />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={`text-lg font-semibold ${className || ""}`}
        {...props}
    />
))
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={`text-sm text-gray-500 ${className || ""}`}
        {...props}
    />
))
AlertDialogDescription.displayName = "AlertDialogDescription"

const AlertDialogAction = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {


    return (
        <button
            ref={ref}
            onClick={(e) => {
                onClick?.(e)
                // ¿Cerrar opcionalmente? El usuario podría querer mantenerlo abierto hasta que termine la operación asíncrona.
                // Comportamiento estándar: generalmente el desarrollador lo cierra manualmente si está controlado.
                // ¿Pero sigamos el comportamiento estándar de los botones HTML dentro de un formulario/diálogo?
            }}
            className={`inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
            {...props}
        />
    )
})
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
    const { onOpenChange } = React.useContext(AlertDialogContext)

    return (
        <button
            ref={ref}
            onClick={(e) => {
                onClick?.(e)
                onOpenChange?.(false)
            }}
            className={`mt-2 inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-0 ${className || ""}`}
            {...props}
        />
    )
})
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Componente modal accesible que gestiona alertas y confirmaciones críticas.
 *
 * Lógica Clave:
 * - createPortal: Renderiza el contenido del diálogo directamente en document.body
 *   para evitar quedar atrapado en stacking contexts o contenedores con transformaciones CSS.
 * - data-portal-wrapper: Atributo utilizado para aislar el modal del filtro blur
 *   definido en globals.css cuando la clase modal-open está activa en el body.
 * - modal-open: Agrega y remueve la clase en el body para aplicar desenfoque estructural
 *   a los elementos de cabecera, navegación y pie de página de la aplicación.
 *
 * Dependencias Externas:
 * - React y ReactDOM para el manejo de contexto y renderizado por portales.
 *
 */
