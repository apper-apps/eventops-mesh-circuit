import React from "react";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const EventFilters = ({ filters, onFiltersChange, onCreateEvent }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: "all",
      type: "all"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
              />
              <Input
                placeholder="Buscar eventos..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="Planificado">Planificado</option>
              <option value="Activo">Activo</option>
              <option value="Completado">Completado</option>
              <option value="Cancelado">Cancelado</option>
            </Select>

            <Select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="all">Todos los tipos</option>
              <option value="Concierto">Concierto</option>
              <option value="Conferencia">Conferencia</option>
              <option value="Boda">Boda</option>
              <option value="Corporativo">Corporativo</option>
              <option value="Festival">Festival</option>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={clearFilters}
              icon="X"
            >
              Limpiar
            </Button>
            <Button
              onClick={onCreateEvent}
              icon="Plus"
            >
              Crear Evento
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default EventFilters;