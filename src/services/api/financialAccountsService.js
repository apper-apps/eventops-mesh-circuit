import { toast } from 'react-toastify';

class FinancialAccountsService {
  constructor() {
    this.accountTableName = 'financial_account_c';
    this.transactionTableName = 'account_transaction_c';
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

  // Account management
  async getAll(user = null) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "description_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "responsible_person_name_c" } },
          { field: { Name: "responsible_person_email_c" } },
          { field: { Name: "responsible_person_phone_c" } },
          { field: { Name: "created_at_c" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.accountTableName, params);
      
      if (!response.success) {
        console.error("Error fetching financial accounts:", response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Transform database fields to UI format
      return response.data.map(account => ({
        Id: account.Id,
        name: account.Name,
        description: account.description_c,
        type: account.type_c,
        responsiblePerson: {
          name: account.responsible_person_name_c,
          email: account.responsible_person_email_c,
          phone: account.responsible_person_phone_c
        },
        createdAt: account.created_at_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching financial accounts:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching financial accounts:", error.message);
        toast.error("Error loading financial accounts");
      }
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
          { field: { Name: "description_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "responsible_person_name_c" } },
          { field: { Name: "responsible_person_email_c" } },
          { field: { Name: "responsible_person_phone_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.accountTableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const account = response.data;
      return {
        Id: account.Id,
        name: account.Name,
        description: account.description_c,
        type: account.type_c,
        responsiblePerson: {
          name: account.responsible_person_name_c,
          email: account.responsible_person_email_c,
          phone: account.responsible_person_phone_c
        },
        createdAt: account.created_at_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching financial account with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching financial account:", error.message);
        toast.error("Error loading financial account");
      }
      return null;
    }
  }

  async create(accountData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Transform UI format to database fields, only include Updateable fields
      const params = {
        records: [{
          Name: accountData.name,
          Tags: accountData.tags || "",
          description_c: accountData.description || "",
          type_c: accountData.type || "",
          responsible_person_name_c: accountData.responsiblePerson?.name || "",
          responsible_person_email_c: accountData.responsiblePerson?.email || "",
          responsible_person_phone_c: accountData.responsiblePerson?.phone || "",
          created_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord(this.accountTableName, params);
      
      if (!response.success) {
        console.error("Error creating financial account:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create financial account ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Financial account created successfully");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating financial account:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error creating financial account:", error.message);
        toast.error("Error creating financial account");
      }
      return null;
    }
  }

  async update(id, accountData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Transform UI format to database fields, only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: accountData.name,
          Tags: accountData.tags || "",
          description_c: accountData.description || "",
          type_c: accountData.type || "",
          responsible_person_name_c: accountData.responsiblePerson?.name || "",
          responsible_person_email_c: accountData.responsiblePerson?.email || "",
          responsible_person_phone_c: accountData.responsiblePerson?.phone || ""
        }]
      };

      const response = await this.apperClient.updateRecord(this.accountTableName, params);
      
      if (!response.success) {
        console.error("Error updating financial account:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update financial account ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Financial account updated successfully");
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating financial account:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating financial account:", error.message);
        toast.error("Error updating financial account");
      }
      return null;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Check if account has transactions
      const transactions = await this.getTransactionsByAccount(id);
      if (transactions.length > 0) {
        toast.error('Cannot delete account with associated transactions');
        return false;
      }
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.accountTableName, params);
      
      if (!response.success) {
        console.error("Error deleting financial account:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete financial account ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Financial account deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting financial account:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error deleting financial account:", error.message);
        toast.error("Error deleting financial account");
      }
      return false;
    }
  }

  async updateResponsible(id, responsibleData) {
    return this.update(id, {
      responsiblePerson: {
        name: responsibleData.name,
        email: responsibleData.email || null,
        phone: responsibleData.phone || null
      }
    });
  }

  // Transaction management
  async getAllTransactions(user = null) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { 
            field: { Name: "account_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "event_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "type_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "created_at_c" } }
        ],
        orderBy: [{ fieldName: "date_c", sorttype: "DESC" }],
        pagingInfo: { limit: 200, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.transactionTableName, params);
      
      if (!response.success) {
        console.error("Error fetching account transactions:", response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Transform database fields to UI format
      return response.data.map(transaction => ({
        Id: transaction.Id,
        accountId: transaction.account_id_c?.Id || transaction.account_id_c,
        eventId: transaction.event_id_c?.Id || transaction.event_id_c,
        type: transaction.type_c,
        amount: transaction.amount_c,
        description: transaction.description_c,
        date: transaction.date_c,
        createdAt: transaction.created_at_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching account transactions:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching account transactions:", error.message);
        toast.error("Error loading account transactions");
      }
      return [];
    }
  }

  async getTransactionById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { 
            field: { Name: "account_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "event_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "type_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.transactionTableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const transaction = response.data;
      return {
        Id: transaction.Id,
        accountId: transaction.account_id_c?.Id || transaction.account_id_c,
        eventId: transaction.event_id_c?.Id || transaction.event_id_c,
        type: transaction.type_c,
        amount: transaction.amount_c,
        description: transaction.description_c,
        date: transaction.date_c,
        createdAt: transaction.created_at_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching account transaction with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching account transaction:", error.message);
        toast.error("Error loading account transaction");
      }
      return null;
    }
  }

  async getTransactionsByAccount(accountId) {
    const allTransactions = await this.getAllTransactions();
    return allTransactions.filter(t => t.accountId === parseInt(accountId));
  }

  async getTransactionsByEvent(eventId) {
    const allTransactions = await this.getAllTransactions();
    return allTransactions.filter(t => t.eventId === parseInt(eventId));
  }

  async createTransaction(transactionData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Validate data
      if (!transactionData.amount || transactionData.amount <= 0) {
        toast.error('Amount must be greater than 0');
        return null;
      }
      
      if (!['income', 'expense'].includes(transactionData.type)) {
        toast.error('Invalid transaction type');
        return null;
      }
      
      // Transform UI format to database fields, only include Updateable fields
      const params = {
        records: [{
          Name: `Transaction ${Date.now()}`,
          Tags: transactionData.tags || "",
          account_id_c: parseInt(transactionData.accountId),
          event_id_c: transactionData.eventId ? parseInt(transactionData.eventId) : null,
          type_c: transactionData.type,
          amount_c: parseFloat(transactionData.amount),
          description_c: transactionData.description || "",
          date_c: transactionData.date || new Date().toISOString(),
          created_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord(this.transactionTableName, params);
      
      if (!response.success) {
        console.error("Error creating account transaction:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create account transaction ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Account transaction created successfully");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating account transaction:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error creating account transaction:", error.message);
        toast.error("Error creating account transaction");
      }
      return null;
    }
  }

  async updateTransaction(id, transactionData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Validate data
      if (transactionData.amount !== undefined && transactionData.amount <= 0) {
        toast.error('Amount must be greater than 0');
        return null;
      }
      
      if (transactionData.type && !['income', 'expense'].includes(transactionData.type)) {
        toast.error('Invalid transaction type');
        return null;
      }
      
      // Transform UI format to database fields, only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Transaction ${id}`,
          Tags: transactionData.tags || "",
          account_id_c: parseInt(transactionData.accountId),
          event_id_c: transactionData.eventId ? parseInt(transactionData.eventId) : null,
          type_c: transactionData.type,
          amount_c: parseFloat(transactionData.amount),
          description_c: transactionData.description || "",
          date_c: transactionData.date
        }]
      };

      const response = await this.apperClient.updateRecord(this.transactionTableName, params);
      
      if (!response.success) {
        console.error("Error updating account transaction:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update account transaction ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Account transaction updated successfully");
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating account transaction:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating account transaction:", error.message);
        toast.error("Error updating account transaction");
      }
      return null;
    }
  }

  async deleteTransaction(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.transactionTableName, params);
      
      if (!response.success) {
        console.error("Error deleting account transaction:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete account transaction ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Account transaction deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting account transaction:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error deleting account transaction:", error.message);
        toast.error("Error deleting account transaction");
      }
      return false;
    }
  }

  // Analytics and reports
  async getAccountSummary(accountId) {
    const accountTransactions = await this.getTransactionsByAccount(accountId);
    const income = accountTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = accountTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    const transactionCount = accountTransactions.length;
    
    return {
      accountId: parseInt(accountId),
      income,
      expenses,
      balance,
      transactionCount,
      lastTransaction: accountTransactions.length > 0 
        ? accountTransactions.sort((a, b) => new Date(b.date) - new Date(a.date))[0] 
        : null
    };
  }

  async getTotalSummary() {
    const allTransactions = await this.getAllTransactions();
    const accounts = await this.getAll();
    
    const income = allTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = allTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    const transactionCount = allTransactions.length;
    
    return {
      income,
      expenses,
      balance,
      transactionCount,
      accountsCount: accounts.length
    };
  }

  async getEventFinancialSummary(eventId) {
    const eventTransactions = await this.getTransactionsByEvent(eventId);
    const accounts = await this.getAll();
    
    const income = eventTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = eventTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    
    // Group by account
    const accountSummaries = accounts.map(account => {
      const accountTransactions = eventTransactions.filter(t => t.accountId === account.Id);
      const accountIncome = accountTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const accountExpenses = accountTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      return {
        account: account.name,
        income: accountIncome,
        expenses: accountExpenses,
        balance: accountIncome - accountExpenses,
        transactionCount: accountTransactions.length
      };
    }).filter(summary => summary.transactionCount > 0);
    
    return {
      eventId: parseInt(eventId),
      totalIncome: income,
      totalExpenses: expenses,
      totalBalance: balance,
      transactionCount: eventTransactions.length,
      accountSummaries
    };
  }
}

export default new FinancialAccountsService();