import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md", 
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white shadow-md hover:shadow-lg focus:ring-primary",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md focus:ring-primary",
    success: "bg-gradient-to-r from-success to-green-600 hover:from-green-600 hover:to-success text-white shadow-md hover:shadow-lg focus:ring-success",
    warning: "bg-gradient-to-r from-warning to-yellow-500 hover:from-yellow-500 hover:to-warning text-white shadow-md hover:shadow-lg focus:ring-warning",
    error: "bg-gradient-to-r from-error to-red-600 hover:from-red-600 hover:to-error text-white shadow-md hover:shadow-lg focus:ring-error",
    ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-primary"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm rounded-md",
    md: "px-4 py-2.5 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg"
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;