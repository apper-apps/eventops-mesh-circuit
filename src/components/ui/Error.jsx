import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Ha ocurrido un error", onRetry, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center py-16 px-8 ${className}`}
    >
      <div className="bg-error/10 rounded-full p-4 mb-6">
        <ApperIcon 
          name="AlertCircle" 
          size={48} 
          className="text-error"
        />
      </div>
      <h3 className="text-xl font-semibold text-slate-200 mb-3 text-center">
        Oops, algo salió mal
      </h3>
      <p className="text-slate-400 text-center mb-6 max-w-md leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="RotateCcw" size={18} />
          Reintentar
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;