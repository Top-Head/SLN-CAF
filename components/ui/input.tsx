import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
           "bg-white w-[400px] h-[47px] border border-[#DEDEE6] rounded-[8px] ",
        className
      )}
      {...props}
    />
  )
}

export { Input }
