import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className, 
  hover = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-lg shadow-card border border-gray-100 transition-shadow duration-200";
  const hoverStyles = hover ? "hover:shadow-card-hover cursor-pointer" : "";
  
  if (hover) {
    return (
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.01 }}
        className={cn(baseStyles, hoverStyles, className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div
      ref={ref}
      className={cn(baseStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;