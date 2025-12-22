import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base styles
        "flex min-h-24 w-full rounded-lg border bg-background px-4 py-3 text-base transition-all duration-200 ease-out outline-none resize-y",
        // Border and shadow
        "border-input shadow-sm",
        // Placeholder
        "placeholder:text-muted-foreground/60",
        // Selection
        "selection:bg-primary/20 selection:text-foreground",
        // Focus state
        "focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-md focus:shadow-primary/5",
        // Dark mode focus
        "dark:focus:ring-primary/20 dark:focus:shadow-primary/10",
        // Disabled state
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
        // Error state
        "aria-invalid:border-destructive aria-invalid:ring-destructive/10 dark:aria-invalid:ring-destructive/20",
        // Hover state
        "hover:border-border/80",
        // Responsive text
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
