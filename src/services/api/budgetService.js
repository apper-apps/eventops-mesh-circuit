import { toast } from 'react-toastify';

class BudgetService {
  constructor() {
    this.budgetTableName = 'budget_c';
    this.categoryTableName = 'budget_category_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "event_name_c" } },
          { field: { Name: "total_estimated_c" } },
          { field: { Name: "total_actual_c" } },
          { field: { Name: "status_c" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.budgetTableName, params);
      
      if (!response.success) {
        console.error("Error fetching budgets:", response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Get categories for each budget
      const budgetsWithCategories = await Promise.all(response.data.map(async (budget) => {
        const categories = await this.getCategoriesByBudgetId(budget.Id);
        
        return {
          Id: budget.Id,
          eventName: budget.event_name_c,
          totalEstimated: budget.total_estimated_c || 0,
          totalActual: budget.total_actual_c || 0,
          status: budget.status_c || "Iniciado",
          categories: categories
        };
      }));

      return budgetsWithCategories;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching budgets:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching budgets:", error.message);
        toast.error("Error loading budgets");
      }
      return [];
    }
  }

  async getCategoriesByBudgetId(budgetId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { 
            field: { Name: "budget_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "estimated_c" } },
          { field: { Name: "actual_c" } },
          { field: { Name: "icon_c" } }
        ],
        where: [
          {
            FieldName: "budget_id_c",
            Operator: "EqualTo",
            Values: [parseInt(budgetId)]
          }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "ASC" }],
        pagingInfo: { limit: 50, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.categoryTableName, params);
      
      if (!response.success) {
        console.error("Error fetching budget categories:", response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Transform database fields to UI format
      return response.data.map(category => ({
        Id: category.Id,
        name: category.Name,
        estimated: category.estimated_c || 0,
        actual: category.actual_c || 0,
        icon: category.icon_c || "Package"
      }));
    } catch (error) {
      console.error("Error fetching budget categories:", error.message);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "event_name_c" } },
          { field: { Name: "total_estimated_c" } },
          { field: { Name: "total_actual_c" } },
          { field: { Name: "status_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.budgetTableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const budget = response.data;
      const categories = await this.getCategoriesByBudgetId(id);

      return {
        Id: budget.Id,
        eventName: budget.event_name_c,
        totalEstimated: budget.total_estimated_c || 0,
        totalActual: budget.total_actual_c || 0,
        status: budget.status_c || "Iniciado",
        categories: categories
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching budget with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching budget:", error.message);
        toast.error("Error loading budget");
      }
      return null;
    }
  }

  async create(budgetData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Create budget first
      const budgetParams = {
        records: [{
          Name: budgetData.eventName,
          Tags: budgetData.tags || "",
          event_name_c: budgetData.eventName,
          total_estimated_c: budgetData.totalEstimated || 0,
          total_actual_c: budgetData.totalActual || 0,
          status_c: budgetData.status || "Iniciado"
        }]
      };

      const budgetResponse = await this.apperClient.createRecord(this.budgetTableName, budgetParams);
      
      if (!budgetResponse.success) {
        console.error("Error creating budget:", budgetResponse.message);
        toast.error(budgetResponse.message);
        return null;
      }

      let createdBudget = null;
      if (budgetResponse.results && budgetResponse.results.length > 0) {
        const successfulBudget = budgetResponse.results.find(result => result.success);
        if (successfulBudget) {
          createdBudget = successfulBudget.data;
          
          // Create categories if provided
          if (budgetData.categories && budgetData.categories.length > 0) {
            const categoryRecords = budgetData.categories.map(cat => ({
              Name: cat.name,
              Tags: "",
              budget_id_c: createdBudget.Id,
              estimated_c: cat.estimated || 0,
              actual_c: cat.actual || 0,
              icon_c: cat.icon || "Package"
            }));

            const categoryParams = {
              records: categoryRecords
            };

            const categoryResponse = await this.apperClient.createRecord(this.categoryTableName, categoryParams);
            
            if (!categoryResponse.success) {
              console.error("Error creating budget categories:", categoryResponse.message);
            }
          }
          
          toast.success(`Budget for "${budgetData.eventName}" created successfully`);
        }
      }
      
      return createdBudget;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating budget:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error creating budget:", error.message);
        toast.error("Error creating budget");
      }
      return null;
    }
  }

  async update(id, budgetData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Update budget
      const budgetParams = {
        records: [{
          Id: parseInt(id),
          Name: budgetData.eventName,
          Tags: budgetData.tags || "",
          event_name_c: budgetData.eventName,
          total_estimated_c: budgetData.totalEstimated || 0,
          total_actual_c: budgetData.totalActual || 0,
          status_c: budgetData.status || "Iniciado"
        }]
      };

      const response = await this.apperClient.updateRecord(this.budgetTableName, budgetParams);
      
      if (!response.success) {
        console.error("Error updating budget:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update budget ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success(`Budget for "${budgetData.eventName}" updated successfully`);
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating budget:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating budget:", error.message);
        toast.error("Error updating budget");
      }
      return null;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // First delete all categories
      const categories = await this.getCategoriesByBudgetId(id);
      if (categories.length > 0) {
        const categoryIds = categories.map(cat => cat.Id);
        const categoryParams = {
          RecordIds: categoryIds
        };
        
        await this.apperClient.deleteRecord(this.categoryTableName, categoryParams);
      }
      
      // Then delete the budget
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.budgetTableName, params);
      
      if (!response.success) {
        console.error("Error deleting budget:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete budget ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Budget deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting budget:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error deleting budget:", error.message);
        toast.error("Error deleting budget");
      }
      return false;
    }
  }

  async updateCategoryActual(budgetId, categoryId, actualAmount) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Update category actual amount
      const categoryParams = {
        records: [{
          Id: parseInt(categoryId),
          actual_c: Math.max(0, actualAmount)
        }]
      };

      const categoryResponse = await this.apperClient.updateRecord(this.categoryTableName, categoryParams);
      
      if (!categoryResponse.success) {
        console.error("Error updating category actual:", categoryResponse.message);
        toast.error(categoryResponse.message);
        return null;
      }

      // Recalculate budget totals
      const categories = await this.getCategoriesByBudgetId(budgetId);
      const totalActual = categories.reduce((sum, cat) => sum + cat.actual, 0);
      const totalEstimated = categories.reduce((sum, cat) => sum + cat.estimated, 0);
      
      // Update status based on progress
      const progress = totalEstimated > 0 ? (totalActual / totalEstimated) * 100 : 0;
      let status = "Iniciado";
      if (progress >= 90) {
        status = "Casi completo";
      } else if (progress >= 10) {
        status = "En progreso";
      }

      // Update budget totals
      const budgetParams = {
        records: [{
          Id: parseInt(budgetId),
          total_actual_c: totalActual,
          status_c: status
        }]
      };

      const budgetResponse = await this.apperClient.updateRecord(this.budgetTableName, budgetParams);
      
      if (budgetResponse.success) {
        const categoryName = categories.find(c => c.Id === parseInt(categoryId))?.name || 'Category';
        toast.success(`${categoryName} actual spending updated`);
        return await this.getById(budgetId);
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating category actual:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating category actual:", error.message);
        toast.error("Error updating category actual");
      }
      return null;
    }
  }

  async getBudgetSummary() {
    const budgets = await this.getAll();
    
    const totalEstimated = budgets.reduce((sum, b) => sum + b.totalEstimated, 0);
    const totalActual = budgets.reduce((sum, b) => sum + b.totalActual, 0);
    const totalRemaining = totalEstimated - totalActual;
    
    const overBudgetEvents = budgets.filter(b => b.totalActual > b.totalEstimated).length;
    const onTrackEvents = budgets.filter(b => {
      const progress = b.totalEstimated > 0 ? (b.totalActual / b.totalEstimated) * 100 : 0;
      return progress <= 100 && progress >= 80;
    }).length;

    return {
      totalEstimated,
      totalActual,
      totalRemaining,
      totalEvents: budgets.length,
      overBudgetEvents,
      onTrackEvents,
      averageProgress: budgets.length > 0 && totalEstimated > 0 ? 
        (totalActual / totalEstimated) * 100 : 0
    };
  }

  async getVarianceAnalysis(id) {
    const budget = await this.getById(id);
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