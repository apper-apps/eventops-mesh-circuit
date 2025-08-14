import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const VipReservations = () => {
  const reservations = [
    {
      id: 1,
      guestName: "María García",
      eventName: "Gala de Caridad 2024",
      tableNumber: "Mesa VIP 1",
      partySize: 8,
      specialRequests: "Mesa cerca del escenario, menú vegetariano",
      status: "Confirmada",
      phone: "+34 666 123 456"
    },
    {
      id: 2,
      guestName: "Carlos Rodríguez",
      eventName: "Festival de Música",
      tableNumber: "Palco Premium A",
      partySize: 6,
      specialRequests: "Botella de champán, vista al escenario principal",
      status: "Pendiente",
      phone: "+34 677 987 654"
    },
    {
      id: 3,
      guestName: "Ana Martínez",
      eventName: "Conferencia Tech Summit",
      tableNumber: "Mesa VIP 3",
      partySize: 4,
      specialRequests: "Acceso a wifi prioritario, menú sin gluten",
      status: "Confirmada",
      phone: "+34 655 789 123"
    }
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case "Confirmada": return "success";
      case "Pendiente": return "warning";
      case "Cancelada": return "error";
      default: return "default";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reservas VIP</h1>
        <p className="text-slate-400">Gestiona las reservas especiales y experiencias premium</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Reservas</p>
              <p className="text-2xl font-bold text-white">24</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Crown" size={24} className="text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Confirmadas</p>
              <p className="text-2xl font-bold text-white">18</p>
            </div>
            <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pendientes</p>
              <p className="text-2xl font-bold text-white">6</p>
            </div>
            <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={24} className="text-warning" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Ingresos VIP</p>
              <p className="text-2xl font-bold text-white">$45,200</p>
            </div>
            <div className="w-12 h-12 bg-info/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" size={24} className="text-info" />
            </div>
          </div>
        </Card>
      </div>

      {/* Reservations List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Reservas Recientes</h2>
          <Button icon="Plus">Nueva Reserva</Button>
        </div>

        <div className="space-y-4">
          {reservations.map((reservation, index) => (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover-glow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                      <ApperIcon name="Crown" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{reservation.guestName}</h3>
                      <p className="text-slate-400">{reservation.eventName}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(reservation.status)}>
                    {reservation.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="MapPin" size={16} className="text-primary" />
                    <div>
                      <p className="text-slate-400 text-sm">Ubicación</p>
                      <p className="text-slate-200 font-medium">{reservation.tableNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Users" size={16} className="text-primary" />
                    <div>
                      <p className="text-slate-400 text-sm">Personas</p>
                      <p className="text-slate-200 font-medium">{reservation.partySize} invitados</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Phone" size={16} className="text-primary" />
                    <div>
                      <p className="text-slate-400 text-sm">Teléfono</p>
                      <p className="text-slate-200 font-medium">{reservation.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Star" size={16} className="text-primary" />
                    <div>
                      <p className="text-slate-400 text-sm">Categoría</p>
                      <p className="text-slate-200 font-medium">VIP Premium</p>
                    </div>
                  </div>
                </div>

                {reservation.specialRequests && (
                  <div className="mb-6">
                    <h4 className="text-slate-300 font-medium mb-2 flex items-center gap-2">
                      <ApperIcon name="FileText" size={16} />
                      Solicitudes Especiales
                    </h4>
                    <p className="text-slate-400 bg-slate-700/30 p-3 rounded-lg">
                      {reservation.specialRequests}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" icon="MessageSquare">
                    Contactar
                  </Button>
                  <Button variant="ghost" size="sm" icon="Edit">
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" icon="Eye">
                    Ver detalles
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default VipReservations;