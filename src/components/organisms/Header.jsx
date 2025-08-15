import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useFilters } from "@/contexts/FilterContext";
import { useAuth } from "@/contexts/AuthContext";
const Header = ({ title, onMenuClick, showMenuButton = true }) => {
const { events, globalFilters, updateGlobalFilters, resetFilters, getActiveFiltersCount } = useFilters();
  const { user, logout, getAccessibleEvents } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const accessibleEvents = getAccessibleEvents(events);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface/80 backdrop-blur-md border-b border-slate-600/20 px-4 lg:px-8 py-4 sticky top-0 z-30"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="sm"
              icon="Menu"
              onClick={onMenuClick}
              className="lg:hidden"
            />
          )}
          <div>
            <h1 className="text-xl font-bold text-white">{title}</h1>
            <p className="text-slate-400 text-sm">Gestión de Operaciones y Finanzas</p>
          </div>
        </div>

<div className="flex items-center gap-4">
          {/* Global Filters */}
          <div className="flex items-center gap-3">
            {/* Event Selector */}
<div className="flex items-center gap-2">
              <Select
                value={globalFilters.selectedEventId}
                onChange={(e) => updateGlobalFilters({ selectedEventId: e.target.value })}
                className="w-48 text-sm"
              >
                <option value="all">Todos los Eventos</option>
                {accessibleEvents.map(event => (
                  <option key={event.Id} value={event.Id}>
                    {event.title}
                  </option>
                ))}
              </Select>
              {globalFilters.selectedEventId !== 'all' && (
                <Badge variant="accent" size="sm">1</Badge>
              )}
            </div>

            {/* Month/Year Picker */}
            <div className="flex items-center gap-2">
              <Select
                value={globalFilters.selectedMonth}
                onChange={(e) => updateGlobalFilters({ selectedMonth: parseInt(e.target.value) })}
                className="w-32 text-sm"
              >
                <option value={1}>Enero</option>
                <option value={2}>Febrero</option>
                <option value={3}>Marzo</option>
                <option value={4}>Abril</option>
                <option value={5}>Mayo</option>
                <option value={6}>Junio</option>
                <option value={7}>Julio</option>
                <option value={8}>Agosto</option>
                <option value={9}>Septiembre</option>
                <option value={10}>Octubre</option>
                <option value={11}>Noviembre</option>
                <option value={12}>Diciembre</option>
              </Select>
              
              <Select
                value={globalFilters.selectedYear}
                onChange={(e) => updateGlobalFilters({ selectedYear: parseInt(e.target.value) })}
                className="w-24 text-sm"
              >
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </Select>
              
              {(globalFilters.selectedMonth !== new Date().getMonth() + 1 || 
                globalFilters.selectedYear !== new Date().getFullYear()) && (
                <Badge variant="accent" size="sm">1</Badge>
              )}
            </div>

            {/* Clear Filters */}
            {getActiveFiltersCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-slate-400 hover:text-slate-200"
              >
                <ApperIcon name="X" size={14} />
              </Button>
            )}
          </div>

          <div className="w-px h-6 bg-slate-600"></div>

{/* User Section */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" icon="Bell" className="relative">
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"></span>
            </Button>
            
            <Button variant="ghost" size="sm" icon="Search" />
            
            <div className="w-px h-6 bg-slate-600"></div>
            
            <div className="relative">
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-200">{user?.name || 'Usuario'}</p>
                  <p className="text-xs text-slate-400">{user?.roleLabel || 'Sin rol'}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={16} className="text-white" />
                </div>
                <ApperIcon name="ChevronDown" size={16} className="text-slate-400" />
              </div>

              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-surface border border-slate-600 rounded-lg shadow-lg z-50"
                >
                  <div className="p-3 border-b border-slate-600">
                    <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                    <div className="mt-1">
                      <Badge variant="outline" size="sm">
                        {user?.roleLabel}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 rounded flex items-center gap-2"
                    >
                      <ApperIcon name="LogOut" size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;