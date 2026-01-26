import * as React from "react"

const AlertDialogContext = React.createContext<{
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}>({})

const AlertDialog = ({
    open,
    onOpenChange,
    children,
}: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}) => {
    return (
        <AlertDialogContext.Provider value={{ open, onOpenChange }}>
            {open && children}
        </AlertDialogContext.Provider>
    )
}

const AlertDialogTrigger = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    // Nota: Dado que esta implementación se controla a través de la raíz, el disparador podría ser redundante
    // dependiendo del uso, pero lo incluimos por estructura.
    // En modo controlado estricto, el padre maneja el estado de apertura.
    // Renderizamos los hijos tal cual.
    return <div {...props}>{children}</div>
}

const AlertDialogPortal = ({
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return <div {...props}>{children}</div>
}

const AlertDialogOverlay = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ${className || ""}`}
        {...props}
        ref={ref}
    />
))
AlertDialogOverlay.displayName = "AlertDialogOverlay"

const AlertDialogContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { onOpenChange } = React.useContext(AlertDialogContext)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <AlertDialogOverlay onClick={() => onOpenChange?.(false)} />
            <div
                ref={ref}
                className={`relative z-50 grid w-full max-w-lg gap-4 border bg-card p-6 shadow-lg duration-200 sm:rounded-lg md:w-full ${className || ""}`}
                {...props}
            />
        </div>
    )
})
AlertDialogContent.displayName = "AlertDialogContent"

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
        className={`text-sm text-muted-foreground ${className || ""}`}
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
            className={`inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
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
            className={`mt-2 inline-flex h-10 items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-0 ${className || ""}`}
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
}
