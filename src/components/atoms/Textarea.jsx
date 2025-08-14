import React from "react";
import { cn } from "@/utils/cn";

const Textarea = React.forwardRef(({ 
  className, 
  error = false,
  ...props 
}, ref) => {
  const baseClasses = "flex min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-vertical transition-all duration-200";
  
  const errorClasses = error ? "border-error focus:ring-error" : "";

  return (
    <textarea
      className={cn(baseClasses, errorClasses, className)}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;