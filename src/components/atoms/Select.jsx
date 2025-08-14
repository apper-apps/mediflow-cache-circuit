import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  className, 
  children,
  error = false,
  ...props 
}, ref) => {
  const baseClasses = "flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";
  
  const errorClasses = error ? "border-error focus:ring-error" : "";

  return (
    <select
      className={cn(baseClasses, errorClasses, className)}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;