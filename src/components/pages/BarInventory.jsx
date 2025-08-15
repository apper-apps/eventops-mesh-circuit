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
      name: "Cerveza Suelta",
      category: "Cerveza",
      currentStock: 150,
      initialStock: 200,
      finalStock: 150,
      minStock: 50,
      maxStock: 400,
      unit: "unidades",
      costPrice: 2.50,
      salePrice: 4.00,
      supplier: "Distribuidora de Cervezas",
      status: "Disponible"
    },
    {
      id: 2,
      name: "Bucket Tecate (10 unidades)",
      category: "Cerveza",
      currentStock: 25,
      initialStock: 50,
      finalStock: 25,
      minStock: 10,
      maxStock: 100,
      unit: "buckets",
      costPrice: 22.00,
      salePrice: 35.00,
      supplier: "Tecate Distribuidora",
      status: "Disponible"
    },
    {
      id: 3,
      name: "6-Pack Cerveza Corona",
      category: "Cerveza",
      currentStock: 8,
      initialStock: 30,
      finalStock: 8,
      minStock: 15,
      maxStock: 80,
      unit: "paquetes",
      costPrice: 12.00,
      salePrice: 18.00,
      supplier: "Corona Distribuciones",
      status: "Bajo stock"
    },
    {
      id: 4,
      name: "6-Pack Cerveza Modelo",
      category: "Cerveza",
      currentStock: 18,
      initialStock: 25,
      finalStock: 18,
      minStock: 10,
      maxStock: 60,
      unit: "paquetes",
      costPrice: 13.50,
      salePrice: 20.00,
      supplier: "Modelo Distribuciones",
      status: "Disponible"
    },
    {
      id: 5,
      name: "Coca-Cola Lata",
      category: "Refrescos",
      currentStock: 120,
      initialStock: 150,
      finalStock: 120,
      minStock: 50,
      maxStock: 300,
      unit: "latas",
      costPrice: 1.20,
      salePrice: 2.50,
      supplier: "Bebidas del Pacífico",
      status: "Disponible"
    },
    {
      id: 6,
      name: "Pepsi Lata",
      category: "Refrescos",
      currentStock: 85,
      initialStock: 100,
      finalStock: 85,
      minStock: 40,
      maxStock: 250,
      unit: "latas",
      costPrice: 1.15,
      salePrice: 2.50,
      supplier: "Bebidas del Pacífico",
      status: "Disponible"
    },
    {
      id: 7,
      name: "Agua Natural 500ml",
      category: "Sin alcohol",
      currentStock: 5,
      initialStock: 100,
      finalStock: 5,
      minStock: 60,
      maxStock: 300,
      unit: "botellas",
      costPrice: 0.80,
      salePrice: 2.00,
      supplier: "Aguas Cristalinas",
      status: "Crítico"
    },
    {
      id: 8,
      name: "Agua Mineral Sparkling",
      category: "Sin alcohol",
      currentStock: 35,
      initialStock: 60,
      finalStock: 35,
      minStock: 30,
      maxStock: 150,
      unit: "botellas",
      costPrice: 1.50,
      salePrice: 3.00,
      supplier: "Aguas Premium",
      status: "Disponible"
    },
    {
      id: 9,
      name: "Tequila Premium (Producto Personalizado)",
      category: "Licores",
      currentStock: 12,
      initialStock: 20,
      finalStock: 12,
      minStock: 8,
      maxStock: 40,
      unit: "botellas",
      costPrice: 35.00,
      salePrice: 65.00,
      supplier: "Licores Especiales",
      status: "Disponible"
    },
    {
      id: 10,
      name: "Mix de Jugos Naturales (Producto Personalizado)",
      category: "Sin alcohol",
      currentStock: 45,
      initialStock: 50,
      finalStock: 45,
      minStock: 25,
      maxStock: 100,
      unit: "litros",
      costPrice: 3.00,
      salePrice: 6.50,
      supplier: "Jugos Artesanales",
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

const categories = ["Cerveza", "Licores", "Refrescos", "Sin alcohol"];
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.salePrice), 0);
  const totalCost = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0);
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
                        item.category === "Refrescos" ? "Coffee" :
                        item.category === "Sin alcohol" ? "Droplets" :
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
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-slate-400">Costo: ${item.costPrice}</span>
                        <span className="text-green-400 font-medium">Venta: ${item.salePrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-slate-400 text-sm">Stock Actual</p>
                    <p className="text-2xl font-bold text-white">{item.currentStock}</p>
                    <p className="text-slate-400 text-xs">{item.unit}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-slate-400 text-sm">Stock Inicial</p>
                    <p className="text-xl font-semibold text-blue-400">{item.initialStock}</p>
                    <p className="text-slate-400 text-xs">{item.unit}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-slate-400 text-sm">Stock Final</p>
                    <p className="text-xl font-semibold text-purple-400">{item.finalStock}</p>
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
<p className="text-slate-400 text-sm mb-3">
                Stock: {item.currentStock} {item.unit} • 
                Costo: ${item.costPrice} • Venta: ${item.salePrice}
              </p>
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