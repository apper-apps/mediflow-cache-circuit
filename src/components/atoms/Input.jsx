import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text",
  error = false,
  ...props 
}, ref) => {
  const baseClasses = "flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";
  
  const errorClasses = error ? "border-error focus:ring-error" : "";

  return (
    <input
      type={type}
      className={cn(baseClasses, errorClasses, className)}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;