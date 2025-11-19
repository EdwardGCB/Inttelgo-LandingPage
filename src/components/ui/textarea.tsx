import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[160px] w-full rounded-md border border-transparent bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 shadow-sm transition focus:border-[#EC5406] focus:outline-none focus:ring-2 focus:ring-[#EC5406]/70 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
