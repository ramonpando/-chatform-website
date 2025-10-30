import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-whatsapp text-white hover:bg-whatsapp-hover active:scale-[0.98] shadow-md hover:shadow-lg focus-visible:ring-[var(--color-primary)] rounded-lg",
        secondary:
          "bg-white text-[var(--text-primary)] border-2 border-[var(--color-gray-200)] hover:bg-[var(--color-gray-50)] hover:border-[var(--color-gray-300)] rounded-lg",
        ghost:
          "text-[var(--text-secondary)] hover:bg-[var(--color-gray-100)] hover:text-[var(--text-primary)] rounded-lg",
        link:
          "text-whatsapp underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-[var(--text-sm)]",
        md: "h-11 px-6 text-[var(--text-base)]",
        lg: "h-14 px-8 text-[var(--text-lg)]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
