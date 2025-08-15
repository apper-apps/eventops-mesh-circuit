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
      className="bg-surface/90 backdrop-blur-sm border-b border-slate-600/20 px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 sticky top-0 z-30"
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

<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4 w-full">
          {/* Global Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-3">
            {/* Event Selector */}
            <div className="flex items-center gap-2 min-w-0">
              <Select
                value={globalFilters.selectedEventId}
                onChange={(e) => updateGlobalFilters({ selectedEventId: e.target.value })}
                className="w-full sm:w-48 md:w-56 text-sm h-10 sm:h-9"
              >
                <option value="all">Todos los Eventos</option>
                {accessibleEvents.map(event => (
                  <option key={event.Id} value={event.Id}>
                    {event.title}
                  </option>
                ))}
              </Select>
              {globalFilters.selectedEventId !== 'all' && (
                <Badge variant="accent" size="sm" className="shrink-0">1</Badge>
              )}
            </div>

            {/* Month/Year Picker */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <Select
                  value={globalFilters.selectedMonth}
                  onChange={(e) => updateGlobalFilters({ selectedMonth: parseInt(e.target.value) })}
                  className="w-28 sm:w-32 text-sm h-10 sm:h-9"
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
                  className="w-20 sm:w-24 text-sm h-10 sm:h-9"
                >
                  <option value={2023}>2023</option>
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                </Select>
              </div>
              
              {(globalFilters.selectedMonth !== new Date().getMonth() + 1 || 
                globalFilters.selectedYear !== new Date().getFullYear()) && (
                <Badge variant="accent" size="sm" className="shrink-0">1</Badge>
              )}
            </div>

            {/* Clear Filters */}
            {getActiveFiltersCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-slate-400 hover:text-slate-200 h-10 sm:h-9 px-3"
              >
                <ApperIcon name="X" size={16} />
                <span className="sr-only sm:not-sr-only sm:ml-1">Limpiar</span>
              </Button>
            )}
          </div>
          <div className="w-px h-6 bg-slate-600"></div>

{/* User Section */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Button variant="ghost" size="sm" className="relative h-10 w-10 sm:h-9 sm:w-auto sm:px-3">
              <ApperIcon name="Bell" size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"></span>
              <span className="sr-only sm:not-sr-only sm:ml-2">Notificaciones</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="h-10 w-10 sm:h-9 sm:w-auto sm:px-3">
              <ApperIcon name="Search" size={18} />
              <span className="sr-only sm:not-sr-only sm:ml-2">Buscar</span>
            </Button>
            
            <div className="w-px h-6 bg-slate-600 hidden sm:block"></div>
            
            <div className="relative">
              <div 
                className="flex items-center gap-2 sm:gap-3 cursor-pointer touch-manipulation min-h-[44px] px-2 py-1 sm:px-3 sm:py-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-slate-200 truncate max-w-32">{user?.name || 'Usuario'}</p>
                  <p className="text-xs text-slate-400 truncate max-w-32">{user?.roleLabel || 'Sin rol'}</p>
                </div>
                <div className="w-9 h-9 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shrink-0">
                  <ApperIcon name="User" size={18} className="text-white" />
                </div>
                <ApperIcon name="ChevronDown" size={16} className="text-slate-400 hidden sm:block" />
              </div>

              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-64 sm:w-56 bg-surface border border-slate-600 rounded-xl shadow-xl z-50"
                >
                  <div className="p-4 border-b border-slate-600">
                    <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    <div className="mt-2">
                      <Badge variant="outline" size="sm">
                        {user?.roleLabel}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700 rounded-lg flex items-center gap-3 touch-manipulation transition-colors"
                    >
                      <ApperIcon name="LogOut" size={18} />
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