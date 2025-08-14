import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ children, className, gradient = false, ...props }, ref) => {
  const baseStyles = "bg-surface rounded-xl border border-slate-600/20 card-shadow";
  const gradientStyles = gradient ? "bg-gradient-to-br from-surface to-slate-800/50" : "";
  
  return (
    <div
      ref={ref}
      className={cn(baseStyles, gradientStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;