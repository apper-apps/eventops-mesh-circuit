import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md", 
  icon,
  disabled = false,
  loading = false,
  ...props 
}, ref) => {
const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation select-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-md hover:shadow-lg active:scale-95",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 active:scale-95",
    ghost: "hover:bg-slate-700/50 text-slate-300 hover:text-slate-100 active:scale-95",
    danger: "bg-gradient-to-r from-error to-red-600 hover:from-error/90 hover:to-red-600/90 text-white shadow-md hover:shadow-lg active:scale-95"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm min-h-[36px]",
    md: "px-4 py-2.5 text-sm min-h-[40px]",
    lg: "px-6 py-3 text-base min-h-[44px]",
    xl: "px-8 py-4 text-lg min-h-[48px]"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
      {!loading && icon && <ApperIcon name={icon} size={16} />}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;