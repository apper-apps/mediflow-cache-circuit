import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  children, 
  className, 
  hover = false,
  ...props 
}, ref) => {
  const baseClasses = "bg-white rounded-xl border border-gray-100 shadow-sm";

  const Component = hover ? motion.div : "div";

  const hoverProps = hover ? {
    whileHover: { y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" },
    transition: { type: "spring", stiffness: 300, damping: 20 }
  } : {};

  return (
    <Component
      ref={ref}
      className={cn(baseClasses, className)}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = "Card";

export default Card;