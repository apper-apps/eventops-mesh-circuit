import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Calendar", 
  title = "No hay elementos",
  description = "Parece que no tienes ningún elemento todavía.",
  action,
  actionText = "Crear nuevo",
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-20 px-8 ${className}`}
    >
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-full p-6 mb-6">
        <ApperIcon 
          name={icon} 
          size={64} 
          className="text-primary"
        />
      </div>
      <h3 className="text-2xl font-bold text-slate-200 mb-3 text-center">
        {title}
      </h3>
      <p className="text-slate-400 text-center mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" size={20} />
          {actionText}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;