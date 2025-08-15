import mockBudgets from '@/services/mockData/budgets.json';
import { toast } from 'react-toastify';

class BudgetService {
  constructor() {
    this.budgets = [...mockBudgets];
    this.nextId = Math.max(...this.budgets.map(b => b.Id)) + 1;
    this.nextCategoryId = Math.max(
      ...this.budgets.flatMap(b => b.categories.map(c => c.Id))
    ) + 1;
  }

  getAll() {
    return [...this.budgets];
  }

  getById(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid budget ID');
    }
    const budget = this.budgets.find(b => b.Id === id);
    return budget ? { ...budget, categories: [...budget.categories] } : null;
  }

  create(budgetData) {
    const newBudget = {
      ...budgetData,
      Id: this.nextId++,
      categories: budgetData.categories?.map(cat => ({
        ...cat,
        Id: this.nextCategoryId++
      })) || []
    };
    
    this.budgets.push(newBudget);
    toast.success(`Budget for "${newBudget.eventName}" created successfully`);
    return { ...newBudget };
  }

  update(id, budgetData) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid budget ID');
    }

    const index = this.budgets.findIndex(b => b.Id === id);
    if (index === -1) {
      throw new Error('Budget not found');
    }

    const existingBudget = this.budgets[index];
    const updatedBudget = {
      ...existingBudget,
      ...budgetData,
      Id: id,
      categories: budgetData.categories?.map(cat => ({
        ...cat,
        Id: cat.Id || this.nextCategoryId++
      })) || existingBudget.categories
    };

    this.budgets[index] = updatedBudget;
    toast.success(`Budget for "${updatedBudget.eventName}" updated successfully`);
    return { ...updatedBudget };
  }

  delete(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid budget ID');
    }

    const index = this.budgets.findIndex(b => b.Id === id);
    if (index === -1) {
      throw new Error('Budget not found');
    }

    const deletedBudget = this.budgets[index];
    this.budgets.splice(index, 1);
    toast.success(`Budget for "${deletedBudget.eventName}" deleted successfully`);
    return { ...deletedBudget };
  }

  updateCategoryActual(budgetId, categoryId, actualAmount) {
    if (!Number.isInteger(budgetId) || budgetId <= 0) {
      throw new Error('Invalid budget ID');
    }
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      throw new Error('Invalid category ID');
    }

    const budget = this.budgets.find(b => b.Id === budgetId);
    if (!budget) {
      throw new Error('Budget not found');
    }

    const category = budget.categories.find(c => c.Id === categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    const oldActual = category.actual;
    category.actual = Math.max(0, actualAmount);
    
    // Recalculate total actual
    budget.totalActual = budget.categories.reduce((sum, cat) => sum + cat.actual, 0);
    
    // Update status based on progress
    const progress = (budget.totalActual / budget.totalEstimated) * 100;
    if (progress >= 90) {
      budget.status = "Casi completo";
    } else if (progress >= 10) {
      budget.status = "En progreso";
    } else {
      budget.status = "Iniciado";
    }

    toast.success(`${category.name} actual spending updated`);
    return { ...budget };
  }

  getBudgetSummary() {
    const totalEstimated = this.budgets.reduce((sum, b) => sum + b.totalEstimated, 0);
    const totalActual = this.budgets.reduce((sum, b) => sum + b.totalActual, 0);
    const totalRemaining = totalEstimated - totalActual;
    
    const overBudgetEvents = this.budgets.filter(b => b.totalActual > b.totalEstimated).length;
    const onTrackEvents = this.budgets.filter(b => {
      const progress = (b.totalActual / b.totalEstimated) * 100;
      return progress <= 100 && progress >= 80;
    }).length;

    return {
      totalEstimated,
      totalActual,
      totalRemaining,
      totalEvents: this.budgets.length,
      overBudgetEvents,
      onTrackEvents,
      averageProgress: this.budgets.length > 0 ? 
        (totalActual / totalEstimated) * 100 : 0
    };
  }

  getVarianceAnalysis(id) {
    const budget = this.getById(id);
    if (!budget) return null;

    const categoryVariances = budget.categories.map(cat => {
      const variance = cat.actual - cat.estimated;
      const variancePercent = cat.estimated > 0 ? (variance / cat.estimated) * 100 : 0;
      
      return {
        ...cat,
        variance,
        variancePercent,
        status: variance > 0 ? 'over' : variance < 0 ? 'under' : 'on-track'
      };
    });

    const totalVariance = budget.totalActual - budget.totalEstimated;
    const totalVariancePercent = budget.totalEstimated > 0 ? 
      (totalVariance / budget.totalEstimated) * 100 : 0;

    return {
      budget,
      categoryVariances,
      totalVariance,
      totalVariancePercent,
      overallStatus: totalVariance > 0 ? 'over' : totalVariance < 0 ? 'under' : 'on-track'
    };
  }
}

const budgetService = new BudgetService();
export default budgetService;