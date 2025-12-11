"use client"

import * as React from "react"

interface DropdownMenuProps {
    children: React.ReactNode
}

interface DropdownMenuTriggerProps {
    asChild?: boolean
    children: React.ReactNode
}

interface DropdownMenuContentProps {
    align?: "start" | "center" | "end"
    className?: string
    children: React.ReactNode
}

interface DropdownMenuItemProps {
    onClick?: () => void
    className?: string
    children: React.ReactNode
}

const DropdownMenuContext = React.createContext<{
    open: boolean
    setOpen: (open: boolean) => void
}>({ open: false, setOpen: () => { } })

export function DropdownMenu({ children }: DropdownMenuProps) {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const handleClickOutside = () => setOpen(false)
        if (open) {
            document.addEventListener("click", handleClickOutside)
        }
        return () => document.removeEventListener("click", handleClickOutside)
    }, [open])

    return (
        <DropdownMenuContext.Provider value={{ open, setOpen }}>
            <div className="relative inline-block">{children}</div>
        </DropdownMenuContext.Provider>
    )
}

export function DropdownMenuTrigger({ asChild, children }: DropdownMenuTriggerProps) {
    const { open, setOpen } = React.useContext(DropdownMenuContext)

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setOpen(!open)
    }

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>, {
            onClick: handleClick,
        })
    }

    return <button onClick={handleClick}>{children}</button>
}

export function DropdownMenuContent({ align = "end", className = "", children }: DropdownMenuContentProps) {
    const { open } = React.useContext(DropdownMenuContext)

    if (!open) return null

    const alignClass = align === "end" ? "right-0" : align === "start" ? "left-0" : "left-1/2 -translate-x-1/2"

    return (
        <div
            className={`absolute top-full mt-1 ${alignClass} z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 ${className}`}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    )
}

export function DropdownMenuItem({ onClick, className = "", children }: DropdownMenuItemProps) {
    const { setOpen } = React.useContext(DropdownMenuContext)

    const handleClick = () => {
        onClick?.()
        setOpen(false)
    }

    return (
        <button
            onClick={handleClick}
            className={`relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
        >
            {children}
        </button>
    )
}

export function DropdownMenuSeparator() {
    return <div className="-mx-1 my-1 h-px bg-muted" />
}
