import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  children, 
  className, 
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors appearance-none";
  const errorStyles = error ? "border-error focus:ring-error/50 focus:border-error" : "";

  return (
    <select
      className={cn(baseStyles, errorStyles, className)}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;