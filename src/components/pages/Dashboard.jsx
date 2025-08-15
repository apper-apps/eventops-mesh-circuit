import React from "react";
import { motion } from "framer-motion";
import DashboardStats from "@/components/organisms/DashboardStats";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Dashboard = () => {
  const recentActivities = [
    {
      id: 1,
      action: "Evento creado",
      event: "Concierto de Rock 2024",
      time: "Hace 2 horas",
      icon: "Plus",
      color: "success"
    },
    {
      id: 2,
      action: "Presupuesto actualizado",
      event: "Festival de Música",
      time: "Hace 4 horas", 
      icon: "Calculator",
      color: "info"
    },
    {
      id: 3,
      action: "Reserva VIP confirmada",
      event: "Gala de Caridad",
      time: "Hace 6 horas",
      icon: "Crown",
      color: "warning"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">¡Bienvenido de vuelta!</h1>
        <p className="text-slate-400">Aquí tienes un resumen de tus eventos y operaciones.</p>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="xl:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Actividad Reciente</h3>
              <ApperIcon name="Clock" size={20} className="text-slate-400" />
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: activity.id * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.color === "success" ? "bg-success/20 text-success" :
                    activity.color === "info" ? "bg-info/20 text-info" :
                    "bg-warning/20 text-warning"
                  }`}>
                    <ApperIcon name={activity.icon} size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-200 font-medium">{activity.action}</p>
                    <p className="text-slate-400 text-sm">{activity.event}</p>
                  </div>
                  <span className="text-slate-500 text-sm">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
<div className="space-y-6">
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button className="w-full flex items-center justify-center sm:justify-start gap-3 p-4 h-12 sm:h-auto bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20 hover:from-primary/20 hover:to-accent/20 transition-all duration-200 touch-manipulation active:scale-95">
                <ApperIcon name="Plus" size={20} className="text-primary" />
                <span className="text-slate-200 font-medium">Crear Evento</span>
              </button>
              <button className="w-full flex items-center justify-center sm:justify-start gap-3 p-4 h-12 sm:h-auto bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-200 touch-manipulation active:scale-95">
                <ApperIcon name="Calculator" size={20} className="text-info" />
                <span className="text-slate-200 font-medium">Nuevo Presupuesto</span>
              </button>
              <button className="w-full flex items-center justify-center sm:justify-start gap-3 p-4 h-12 sm:h-auto bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-200 touch-manipulation active:scale-95">
                <ApperIcon name="Crown" size={20} className="text-warning" />
                <span className="text-slate-200 font-medium">Reserva VIP</span>
              </button>
            </div>
          </Card>

          {/* Financial Overview */}
          <Card className="p-6 gradient-border">
            <div className="bg-gradient-to-br from-success/20 to-info/20 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <ApperIcon name="TrendingUp" size={24} className="text-success" />
                <h4 className="text-lg font-semibold text-white">Ingresos del Mes</h4>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-white">$125,430</p>
                <p className="text-success text-sm flex items-center gap-1">
                  <ApperIcon name="ArrowUp" size={14} />
                  +18% vs mes anterior
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Upcoming Events Preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Próximos Eventos</h3>
          <button className="text-primary hover:text-primary/80 text-sm font-medium">
            Ver todos →
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Festival de Música", date: "15 Feb 2024", attendees: "2,500" },
            { name: "Conferencia Tech", date: "22 Feb 2024", attendees: "800" },
            { name: "Boda Premium", date: "28 Feb 2024", attendees: "150" }
          ].map((event, index) => (
            <motion.div
              key={event.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-700/30 p-4 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              <h4 className="font-medium text-slate-200 mb-2">{event.name}</h4>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <ApperIcon name="Calendar" size={14} />
                  {event.date}
                </span>
                <span className="flex items-center gap-1">
                  <ApperIcon name="Users" size={14} />
                  {event.attendees}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default Dashboard;