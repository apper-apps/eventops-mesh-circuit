import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  color = "primary",
  loading = false 
}) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    error: "text-error bg-error/10",
    info: "text-info bg-info/10"
  };

  if (loading) {
    return (
      <Card className="p-6 hover-glow animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-4 bg-slate-600 rounded w-24"></div>
            <div className="h-8 bg-slate-600 rounded w-20"></div>
          </div>
          <div className="w-12 h-12 bg-slate-600 rounded-xl"></div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 hover-glow cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-100">{value}</p>
            {trend && (
              <div className="flex items-center gap-1">
                <ApperIcon 
                  name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                  size={14}
                  className={trend === "up" ? "text-success" : "text-error"}
                />
                <span className={`text-xs font-medium ${trend === "up" ? "text-success" : "text-error"}`}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
            <ApperIcon name={icon} size={24} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;