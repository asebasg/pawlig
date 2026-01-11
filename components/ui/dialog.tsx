// components/ui/dialog.tsx

import * as React from "react"
import { X } from "lucide-react"

const DialogContext = React.createContext<{
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}>({})

const Dialog = ({
    open,
    onOpenChange,
    children,
}: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}) => {
    return (
        <DialogContext.Provider value={{ open, onOpenChange }}>
            {open && children}
        </DialogContext.Provider>
    )
}

const DialogTrigger = ({ children, onClick, ...props }: React.HTMLAttributes<HTMLDivElement> & { onClick?: () => void }) => {
    const { onOpenChange } = React.useContext(DialogContext)
    return (
        <div onClick={() => {
            onClick?.()
            onOpenChange?.(true)
        }} {...props}>
            {children}
        </div>
    )
}

const DialogPortal = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return <div {...props}>{children}</div>
}

const DialogOverlay = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ${className || ""}`}
        {...props}
    />
))
DialogOverlay.displayName = "DialogOverlay"

const DialogContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { onOpenChange } = React.useContext(DialogContext)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <DialogOverlay onClick={() => onOpenChange?.(false)} />
            <div
                ref={ref}
                className={`relative z-50 flex flex-col w-full max-w-lg border bg-white p-4 sm:p-6 shadow-lg duration-200 sm:rounded-lg md:w-full ${className || ""}`}
                {...props}
            >
                {children}
                <button
                    onClick={() => onOpenChange?.(false)}
                    className="absolute right-4 top-4 p-2 rounded-full text-gray-600 transition-all hover:opacity-100 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:pointer-events-none"
                >
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close</span>
                </button>
            </div>
        </div>
    )
})
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={`flex flex-col space-y-1 text-left ${className || ""}`}
        {...props}
    />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className || ""}`}
        {...props}
    />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={`text-lg font-semibold leading-none tracking-tight ${className || ""}`}
        {...props}
    />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={`text-sm text-gray-500 ${className || ""}`}
        {...props}
    />
))
DialogDescription.displayName = "DialogDescription"

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
}