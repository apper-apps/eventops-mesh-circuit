import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import budgetService from '@/services/api/budgetService';
const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [budgetSummary, setBudgetSummary] = useState(null);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const budgetsData = budgetService.getAll();
      const summary = budgetService.getBudgetSummary();
      
      setBudgets(budgetsData);
      setBudgetSummary(summary);
    } catch (error) {
      toast.error('Error loading budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateActual = async (budgetId, categoryId, actualAmount) => {
    try {
      await budgetService.updateCategoryActual(budgetId, categoryId, actualAmount);
      loadBudgets(); // Reload to get updated data
    } catch (error) {
      toast.error('Error updating actual amount');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "En progreso": return "info";
      case "Casi completo": return "warning";
      case "Iniciado": return "success";
      default: return "default";
    }
  };

  const getVarianceColor = (variance) => {
    if (variance > 10) return "error";
    if (variance > 0) return "warning";
    return "success";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateProgress = (actual, estimated) => {
    return estimated > 0 ? Math.min((actual / estimated) * 100, 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading budgets...</p>
        </div>
      </div>
    );
  }

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
{/* Budget Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Estimado</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {formatCurrency(budgetSummary?.totalEstimated || 0)}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
              <ApperIcon name="Target" size={20} className="text-primary sm:!w-6 sm:!h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Gastado</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {formatCurrency(budgetSummary?.totalActual || 0)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {budgetSummary?.averageProgress?.toFixed(1)}% del presupuesto
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-error/20 rounded-lg flex items-center justify-center shrink-0">
              <ApperIcon name="TrendingDown" size={20} className="text-error sm:!w-6 sm:!h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Disponible</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {formatCurrency(budgetSummary?.totalRemaining || 0)}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-success/20 rounded-lg flex items-center justify-center shrink-0">
              <ApperIcon name="TrendingUp" size={20} className="text-success sm:!w-6 sm:!h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Eventos Activos</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {budgetSummary?.totalEvents || 0}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {budgetSummary?.onTrackEvents || 0} en progreso
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-info/20 rounded-lg flex items-center justify-center shrink-0">
              <ApperIcon name="Calendar" size={20} className="text-info sm:!w-6 sm:!h-6" />
            </div>
          </div>
        </Card>
      </div>

{/* Budget Events List */}
      <div className="space-y-4 sm:space-y-6">
        {budgets.map((budget) => {
          const progress = calculateProgress(budget.totalActual, budget.totalEstimated);
          const variance = ((budget.totalActual - budget.totalEstimated) / budget.totalEstimated) * 100;
          
          return (
            <motion.div
              key={budget.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-4 sm:p-6">
                <div className="flex flex-col space-y-4 sm:space-y-6">
                  {/* Budget Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 truncate">
                        {budget.eventName}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                        <Badge variant={getStatusColor(budget.status)}>
                          {budget.status}
                        </Badge>
                        <span className="text-slate-400 break-all sm:break-normal">
                          {formatCurrency(budget.totalActual)} / {formatCurrency(budget.totalEstimated)}
                        </span>
                        <span className={`font-medium ${
                          variance > 0 ? 'text-error' : 'text-success'
                        }`}>
                          {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedBudget(
                          selectedBudget?.Id === budget.Id ? null : budget
                        )}
                        className="h-10 px-4 touch-manipulation active:scale-95"
                      >
                        <ApperIcon 
                          name={selectedBudget?.Id === budget.Id ? "ChevronUp" : "ChevronDown"} 
                          size={16} 
                        />
                        <span className="ml-2 hidden sm:inline">Detalles</span>
                        <span className="ml-2 sm:hidden">Ver</span>
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Progreso</span>
                      <span className="text-white font-medium">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          progress > 90 ? 'bg-gradient-to-r from-warning to-error' :
                          progress > 70 ? 'bg-gradient-to-r from-info to-warning' :
                          'bg-gradient-to-r from-success to-info'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  {selectedBudget?.Id === budget.Id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-slate-600/30 pt-4 sm:pt-6"
                    >
                      <h4 className="text-lg font-semibold text-white mb-4">
                        Desglose por Categoría
                      </h4>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
                        {budget.categories.map((category) => {
                          const catProgress = calculateProgress(category.actual, category.estimated);
                          const catVariance = category.estimated > 0 ? 
                            ((category.actual - category.estimated) / category.estimated) * 100 : 0;
                          
                          return (
                            <div 
                              key={category.Id}
                              className="bg-slate-800/50 rounded-lg p-3 sm:p-4 space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 min-w-0 flex-1">
                                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                                    <ApperIcon 
                                      name={category.icon} 
                                      size={16} 
                                      className="text-primary" 
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-white text-sm sm:text-base truncate">{category.name}</p>
                                    <p className="text-xs text-slate-400">
                                      {formatCurrency(category.actual)} / {formatCurrency(category.estimated)}
                                    </p>
                                  </div>
                                </div>
                                <span className={`text-xs font-medium shrink-0 ml-2 ${
                                  catVariance > 0 ? 'text-error' : 'text-success'
                                }`}>
                                  {catVariance > 0 ? '+' : ''}{catVariance.toFixed(1)}%
                                </span>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="w-full bg-slate-700 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                      catProgress > 100 ? 'bg-error' :
                                      catProgress > 80 ? 'bg-warning' :
                                      'bg-success'
                                    }`}
                                    style={{ width: `${Math.min(catProgress, 100)}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs text-slate-400 text-right">
                                  {catProgress.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="PiggyBank" size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Budgets Found</h3>
          <p className="text-slate-400 mb-6">
            Start by creating your first event budget to track estimated vs actual spending.
          </p>
          <Button variant="primary">
            <ApperIcon name="Plus" size={16} />
            Create Budget
          </Button>
        </Card>
      )}

)}
    </motion.div>
  );
};

export default Budgets;