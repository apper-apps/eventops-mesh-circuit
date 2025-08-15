import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import ApperIcon from "@/components/ApperIcon";
import SidebarItem from "@/components/molecules/SidebarItem";
import { permissionService } from "@/services/api/permissionService";
const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const menuItems = permissionService.getMenuItemsForRole(user);

// Desktop sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 w-64 bg-surface border-r border-slate-600/20 min-h-screen z-30">
      <div className="p-6 border-b border-slate-600/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <ApperIcon name="Zap" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">EventOps Pro</h1>
            <p className="text-slate-400 text-xs">Gestión Integral</p>
          </div>
        </div>
      </div>
      
<nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            badge={item.badge}
          >
            {item.label}
          </SidebarItem>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-600/20">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="Sparkles" size={16} className="text-primary" />
            <span className="text-sm font-semibold text-slate-200">Tip Pro</span>
          </div>
          <p className="text-xs text-slate-400">
            Automatiza tus reportes financieros desde el panel principal
          </p>
        </div>
      </div>
    </div>
  );

  // Mobile sidebar
  const MobileSidebar = () => (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
        className="lg:hidden fixed top-0 left-0 w-80 h-full bg-surface border-r border-slate-600/20 z-50 flex flex-col"
      >
        <div className="p-6 border-b border-slate-600/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <ApperIcon name="Zap" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white">EventOps Pro</h1>
                <p className="text-slate-400 text-xs">Gestión Integral</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-slate-400" />
            </button>
          </div>
        </div>
        
<nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.to} onClick={onClose}>
              <SidebarItem
                to={item.to}
                icon={item.icon}
                badge={item.badge}
              >
                {item.label}
              </SidebarItem>
            </div>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-600/20">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="Sparkles" size={16} className="text-primary" />
              <span className="text-sm font-semibold text-slate-200">Tip Pro</span>
            </div>
            <p className="text-xs text-slate-400">
              Automatiza tus reportes financieros desde el panel principal
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;