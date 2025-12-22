import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

export type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev)
    }

    return (
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          data-slot="input"
          className={cn(
            // Base styles
            "flex h-11 w-full min-w-0 rounded-lg border bg-background px-4 py-2.5 pr-12 text-base transition-all duration-200 ease-out outline-none",
            // Border and shadow
            "border-input shadow-sm",
            // Placeholder
            "placeholder:text-muted-foreground/60",
            // Selection
            "selection:bg-primary/20 selection:text-foreground",
            // Focus state - modern glow effect
            "focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-md focus:shadow-primary/5",
            // Dark mode focus adjustments
            "dark:focus:ring-primary/20 dark:focus:shadow-primary/10",
            // Disabled state
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
            // Error state
            "aria-invalid:border-destructive aria-invalid:ring-destructive/10 dark:aria-invalid:ring-destructive/20",
            // Hover state
            "hover:border-border/80 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
            "dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)]",
            // Responsive text
            "md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 px-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
    )
  }
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
