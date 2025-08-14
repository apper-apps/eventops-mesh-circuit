import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        <ApperIcon 
          name="Loader2" 
          size={48} 
          className="text-primary"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h3 className="text-lg font-semibold text-slate-200 mb-2">
          Cargando datos...
        </h3>
        <p className="text-slate-400 text-sm">
          Preparando la información de tus eventos
        </p>
      </motion.div>
    </div>
  );
};

export default Loading;