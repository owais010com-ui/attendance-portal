"use client"

// import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  Check,
  Info,
  TriangleAlert,
  X,
  Loader2,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {

  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500">
            <Check className="h-4 w-4 text-white" strokeWidth={3} />
          </div>
        ),

        error: (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500">
            <X className="h-4 w-4 text-white" strokeWidth={3} />
          </div>
        ),

        warning: (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500">
            <TriangleAlert className="h-4 w-4 text-white" />
          </div>
        ),

        info: (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500">
            <Info className="h-4 w-4 text-white" />
          </div>
        ),

        loading: (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500">
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          </div>
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          content: "ml-3",
          title: "font-semibold text-sm",
          description: "text-xs text-gray-500 mt-1",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
