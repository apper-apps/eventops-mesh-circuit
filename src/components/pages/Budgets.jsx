import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Budgets = () => {
  const budgets = [
    {
      id: 1,
      eventName: "Festival de Música 2024",
      totalBudget: 150000,
      spent: 89500,
      remaining: 60500,
      status: "En progreso"
    },
    {
      id: 2,
      eventName: "Conferencia Tech Summit",
      totalBudget: 85000,
      spent: 72000,
      remaining: 13000,
      status: "Casi completo"
    },
    {
      id: 3,
      eventName: "Gala de Caridad",
      totalBudget: 200000,
      spent: 45000,
      remaining: 155000,
      status: "Iniciado"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "En progreso": return "info";
      case "Casi completo": return "warning";
      case "Iniciado": return "success";
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
        <h1 className="text-3xl font-bold text-white mb-2">Presupuestos</h1>
        <p className="text-slate-400">Controla los gastos y ingresos de todos tus eventos</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Presupuesto Total</p>
              <p className="text-2xl font-bold text-white">$435,000</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" size={24} className="text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Gastado</p>
              <p className="text-2xl font-bold text-white">$206,500</p>
            </div>
            <div className="w-12 h-12 bg-error/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingDown" size={24} className="text-error" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Disponible</p>
              <p className="text-2xl font-bold text-white">$228,500</p>
            </div>
            <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-success" />
            </div>
          </div>
        </Card>
      </div>

      {/* Budget List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Presupuestos por Evento</h2>
          <Button icon="Plus">Nuevo Presupuesto</Button>
        </div>

        <div className="space-y-4">
          {budgets.map((budget, index) => (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover-glow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{budget.eventName}</h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    getStatusColor(budget.status) === "info" ? "bg-info/20 text-info border border-info/30" :
                    getStatusColor(budget.status) === "warning" ? "bg-warning/20 text-warning border border-warning/30" :
                    "bg-success/20 text-success border border-success/30"
                  }`}>
                    {budget.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <p className="text-slate-400 text-sm">Presupuesto Total</p>
                    <p className="text-xl font-bold text-white">
                      ${budget.totalBudget.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Gastado</p>
                    <p className="text-xl font-bold text-error">
                      ${budget.spent.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Disponible</p>
                    <p className="text-xl font-bold text-success">
                      ${budget.remaining.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                    <span>Progreso del gasto</span>
                    <span>{Math.round((budget.spent / budget.totalBudget) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(budget.spent / budget.totalBudget) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" icon="Eye">
                    Ver detalles
                  </Button>
                  <Button variant="ghost" size="sm" icon="Edit">
                    Editar
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

export default Budgets;