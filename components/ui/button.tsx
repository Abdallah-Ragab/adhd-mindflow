import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        navy: "bg-navy text-navy-foreground drop-shadow-sm hover:bg-navy-foreground hover:text-navy",
        light: "bg-white text-[hsl(var(--primary-hue)_84%_4.9%)] shadow-sm hover:text-white hover:bg-[hsl(var(--primary-hue)_84%_4.9%)]",
        dark: "hover:bg-white hover:text-[hsl(var(--primary-hue)_84%_4.9%)] shadow-sm text-white bg-[hsl(var(--primary-hue)_84%_4.9%)]",
        nav: "hover:text-navy active:bg-primary active:text-primary-foreground active:drop-shadow-sm",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      compact:{
        false:"",
        true:"group flex w-fit overflow-hidden",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      compact: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, compact, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ compact, variant, size, className }))}
        ref={ref}
        {...props}
      >
        {props.children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

const CompactButtonLabel = ({className, children}: {className?: string, children: React.ReactNode}) => {
  return (
    <span className={cn("relative transition-all duration-300 ease-in-out -left-36 group-hover:left-0 max-w-0 group-hover:max-w-48 group-hover:mr-2", className)}>
      {children}
    </span>
  )
}

export { Button, CompactButtonLabel, buttonVariants }
