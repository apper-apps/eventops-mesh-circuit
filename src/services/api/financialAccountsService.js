import mockAccounts from '@/services/mockData/financialAccounts.json';
import mockTransactions from '@/services/mockData/accountTransactions.json';
import { toast } from 'react-toastify';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FinancialAccountsService {
  constructor() {
    this.accounts = [...mockAccounts];
    this.transactions = [...mockTransactions];
  }

  // Account management
  async getAll() {
    await delay(300);
    return [...this.accounts];
  }

  async getById(id) {
    await delay(200);
    const account = this.accounts.find(acc => acc.Id === parseInt(id));
    if (!account) {
      throw new Error(`Cuenta con ID ${id} no encontrada`);
    }
    return { ...account };
  }

  async create(accountData) {
    await delay(400);
    
    const newId = Math.max(...this.accounts.map(a => a.Id), 0) + 1;
    const newAccount = {
      Id: newId,
      ...accountData,
      responsiblePerson: accountData.responsiblePerson || null,
      createdAt: new Date().toISOString()
    };
    
    this.accounts.push(newAccount);
    return { ...newAccount };
  }

  async update(id, accountData) {
    await delay(350);
    
    const index = this.accounts.findIndex(acc => acc.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Cuenta con ID ${id} no encontrada`);
    }
    
    this.accounts[index] = { ...this.accounts[index], ...accountData };
    return { ...this.accounts[index] };
  }

  async delete(id) {
    await delay(250);
    
    const index = this.accounts.findIndex(acc => acc.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Cuenta con ID ${id} no encontrada`);
    }
    
    // Check if account has transactions
    const hasTransactions = this.transactions.some(t => t.accountId === parseInt(id));
    if (hasTransactions) {
      throw new Error('No se puede eliminar una cuenta con transacciones asociadas');
    }
    
    const deletedAccount = this.accounts.splice(index, 1)[0];
    return { ...deletedAccount };
  }

  async updateResponsible(id, responsibleData) {
    await delay(300);
    
    const index = this.accounts.findIndex(acc => acc.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Cuenta con ID ${id} no encontrada`);
    }
    
    this.accounts[index] = {
      ...this.accounts[index],
      responsiblePerson: {
        name: responsibleData.name,
        email: responsibleData.email || null,
        phone: responsibleData.phone || null
      }
    };
    
    return { ...this.accounts[index] };
  }

  // Transaction management
  async getAllTransactions() {
    await delay(300);
    return [...this.transactions];
  }

  async getTransactionById(id) {
    await delay(200);
    const transaction = this.transactions.find(t => t.Id === parseInt(id));
    if (!transaction) {
      throw new Error(`Transacción con ID ${id} no encontrada`);
    }
    return { ...transaction };
  }

  async getTransactionsByAccount(accountId) {
    await delay(250);
    return this.transactions.filter(t => t.accountId === parseInt(accountId));
  }

  async getTransactionsByEvent(eventId) {
    await delay(250);
    return this.transactions.filter(t => t.eventId === parseInt(eventId));
  }

  async createTransaction(transactionData) {
    await delay(400);
    
    // Validate account exists
    const account = this.accounts.find(acc => acc.Id === transactionData.accountId);
    if (!account) {
      throw new Error('Cuenta no encontrada');
    }
    
    // Validate amount
    if (!transactionData.amount || transactionData.amount <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }
    
    // Validate type
    if (!['income', 'expense'].includes(transactionData.type)) {
      throw new Error('Tipo de transacción inválido');
    }
    
    const newId = Math.max(...this.transactions.map(t => t.Id), 0) + 1;
    const newTransaction = {
      Id: newId,
      accountId: parseInt(transactionData.accountId),
      eventId: transactionData.eventId ? parseInt(transactionData.eventId) : null,
      type: transactionData.type,
      amount: parseFloat(transactionData.amount),
      description: transactionData.description,
      date: transactionData.date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    this.transactions.push(newTransaction);
    return { ...newTransaction };
  }

  async updateTransaction(id, transactionData) {
    await delay(350);
    
    const index = this.transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Transacción con ID ${id} no encontrada`);
    }
    
    // Validate data if provided
    if (transactionData.amount !== undefined && transactionData.amount <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }
    
    if (transactionData.type && !['income', 'expense'].includes(transactionData.type)) {
      throw new Error('Tipo de transacción inválido');
    }
    
    const updatedTransaction = {
      ...this.transactions[index],
      ...transactionData,
      eventId: transactionData.eventId ? parseInt(transactionData.eventId) : null
    };
    
    this.transactions[index] = updatedTransaction;
    return { ...updatedTransaction };
  }

  async deleteTransaction(id) {
    await delay(250);
    
    const index = this.transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Transacción con ID ${id} no encontrada`);
    }
    
    const deletedTransaction = this.transactions.splice(index, 1)[0];
    return { ...deletedTransaction };
  }

  // Analytics and reports
  async getAccountSummary(accountId) {
    await delay(200);
    
    const accountTransactions = this.transactions.filter(t => t.accountId === parseInt(accountId));
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
    await delay(200);
    
    const income = this.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = this.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    const transactionCount = this.transactions.length;
    
    return {
      income,
      expenses,
      balance,
      transactionCount,
      accountsCount: this.accounts.length
    };
  }

  async getEventFinancialSummary(eventId) {
    await delay(200);
    
    const eventTransactions = this.transactions.filter(t => t.eventId === parseInt(eventId));
    const income = eventTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = eventTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    
    // Group by account
    const accountSummaries = this.accounts.map(account => {
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