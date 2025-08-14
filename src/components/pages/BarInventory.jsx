import React, { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const BarInventory = () => {
  const [filter, setFilter] = useState("all");
  
  const inventory = [
    {
      id: 1,
      name: "Cerveza Premium",
      category: "Cerveza",
      currentStock: 240,
      minStock: 100,
      maxStock: 500,
      unit: "unidades",
      price: 3.50,
      supplier: "Distribuidora Norte",
      status: "Disponible"
    },
    {
      id: 2,
      name: "Whisky Premium",
      category: "Licores",
      currentStock: 15,
      minStock: 20,
      maxStock: 80,
      unit: "botellas",
      price: 45.00,
      supplier: "Licores Selectos",
      status: "Bajo stock"
    },
    {
      id: 3,
      name: "Vino Tinto Reserva",
      category: "Vinos",
      currentStock: 85,
      minStock: 30,
      maxStock: 150,
      unit: "botellas",
      price: 25.00,
      supplier: "Bodega San Miguel",
      status: "Disponible"
    },
    {
      id: 4,
      name: "Agua Mineral",
      category: "Sin alcohol",
      currentStock: 2,
      minStock: 50,
      maxStock: 200,
      unit: "cajas",
      price: 8.00,
      supplier: "Aguas del Valle",
      status: "Crítico"
    },
    {
      id: 5,
      name: "Champán Premium",
      category: "Espumosos",
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      unit: "botellas",
      price: 80.00,
      supplier: "Importadora Fine",
      status: "Disponible"
    }
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case "Disponible": return "success";
      case "Bajo stock": return "warning";
      case "Crítico": return "error";
      case "Agotado": return "error";
      default: return "default";
    }
  };

  const getStockPercentage = (item) => {
    return ((item.currentStock / item.maxStock) * 100);
  };

  const filteredInventory = inventory.filter(item => {
    if (filter === "all") return true;
    if (filter === "low") return item.status === "Bajo stock" || item.status === "Crítico";
    return item.category === filter;
  });

  const categories = ["Cerveza", "Licores", "Vinos", "Sin alcohol", "Espumosos"];
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
  const lowStockItems = inventory.filter(item => item.status === "Bajo stock" || item.status === "Crítico").length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bar e Inventario</h1>
        <p className="text-slate-400">Controla el stock y consumo de bebidas para tus eventos</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Productos Total</p>
              <p className="text-2xl font-bold text-white">{inventory.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Package" size={24} className="text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Valor Total</p>
              <p className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" size={24} className="text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Stock Bajo</p>
              <p className="text-2xl font-bold text-white">{lowStockItems}</p>
            </div>
            <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" size={24} className="text-warning" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Últimas Ventas</p>
              <p className="text-2xl font-bold text-white">$2,340</p>
            </div>
            <div className="w-12 h-12 bg-info/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-info" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
              />
              <Input
                placeholder="Buscar productos..."
                className="pl-10 w-64"
              />
            </div>
            
            <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Todas las categorías</option>
              <option value="low">Stock bajo</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" icon="Download">
              Exportar
            </Button>
            <Button icon="Plus">
              Añadir Producto
            </Button>
          </div>
        </div>
      </Card>

      {/* Inventory List */}
      <div className="space-y-4">
        {filteredInventory.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover-glow cursor-pointer">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                    <ApperIcon 
                      name={
                        item.category === "Cerveza" ? "Beer" :
                        item.category === "Licores" ? "Wine" :
                        item.category === "Vinos" ? "Wine" :
                        item.category === "Sin alcohol" ? "Coffee" :
                        "Sparkles"
                      } 
                      size={24} 
                      className="text-primary" 
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <p className="text-slate-400">{item.category} • {item.supplier}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getStatusVariant(item.status)}>
                        {item.status}
                      </Badge>
                      <span className="text-slate-400 text-sm">${item.price}/{item.unit}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-slate-400 text-sm">Stock Actual</p>
                    <p className="text-2xl font-bold text-white">{item.currentStock}</p>
                    <p className="text-slate-400 text-xs">{item.unit}</p>
                  </div>

                  <div className="w-32">
                    <div className="flex items-center justify-between text-sm text-slate-400 mb-1">
                      <span>Nivel</span>
                      <span>{Math.round(getStockPercentage(item))}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          item.status === "Disponible" ? "bg-gradient-to-r from-success to-success/80" :
                          item.status === "Bajo stock" ? "bg-gradient-to-r from-warning to-warning/80" :
                          "bg-gradient-to-r from-error to-error/80"
                        }`}
                        style={{ width: `${Math.min(getStockPercentage(item), 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Min: {item.minStock}</span>
                      <span>Max: {item.maxStock}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" icon="Plus" />
                    <Button variant="ghost" size="sm" icon="Minus" />
                    <Button variant="ghost" size="sm" icon="Edit" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Reorder Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Reorder Rápido</h3>
          <Button variant="secondary" icon="RefreshCw">
            Actualizar Todo
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventory.filter(item => item.status === "Bajo stock" || item.status === "Crítico").map((item) => (
            <div key={item.id} className="bg-slate-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-200">{item.name}</h4>
                <Badge variant={getStatusVariant(item.status)} className="text-xs">
                  {item.status}
                </Badge>
              </div>
              <p className="text-slate-400 text-sm mb-3">Stock: {item.currentStock} {item.unit}</p>
              <Button size="sm" className="w-full" icon="ShoppingCart">
                Reordenar
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default BarInventory;