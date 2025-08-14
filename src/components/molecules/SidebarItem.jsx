import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const SidebarItem = ({ to, icon, children, badge }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive 
          ? "bg-gradient-to-r from-primary/20 to-accent/20 text-white border border-primary/30 shadow-lg" 
          : "text-slate-300 hover:text-white hover:bg-slate-700/50"
        }
      `}
    >
      <ApperIcon name={icon} size={20} />
      <span className="flex-1">{children}</span>
      {badge && (
        <span className="bg-primary/20 text-primary px-2 py-0.5 text-xs rounded-full border border-primary/30">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

export default SidebarItem;