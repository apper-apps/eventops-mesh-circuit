import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const EventCard = ({ event, onClick }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "Activo": return "success";
      case "Planificado": return "info";
      case "Completado": return "default";
      case "Cancelado": return "error";
      default: return "default";
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case "Concierto": return "Music";
      case "Conferencia": return "Presentation";
      case "Boda": return "Heart";
      case "Corporativo": return "Building2";
      case "Festival": return "Tent";
      default: return "Calendar";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="p-6 hover-glow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
              <ApperIcon 
                name={getEventTypeIcon(event.eventType)} 
                size={24} 
                className="text-primary"
              />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-lg">{event.title}</h3>
              <p className="text-slate-400 text-sm">{event.venue}</p>
            </div>
          </div>
          <Badge variant={getStatusVariant(event.status)}>
            {event.status}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-300">
            <ApperIcon name="Calendar" size={16} className="text-primary" />
            <span className="text-sm">
              {format(new Date(event.date), "PPP", { locale: es })}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-slate-300">
            <ApperIcon name="Users" size={16} className="text-primary" />
            <span className="text-sm">
              {event.estimatedAttendance} asistentes estimados
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-slate-300">
            <ApperIcon name="Tag" size={16} className="text-primary" />
            <span className="text-sm">{event.eventType}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default EventCard;