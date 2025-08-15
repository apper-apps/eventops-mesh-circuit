import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import financialAccountsService from '@/services/api/financialAccountsService';
import eventService from '@/services/api/eventService';

function FinancialAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showResponsibleModal, setShowResponsibleModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingResponsible, setEditingResponsible] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Form states
  const [transactionForm, setTransactionForm] = useState({
    type: 'income',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    eventId: ''
  });

  const [responsibleForm, setResponsibleForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    loadData();
  }, [selectedEvent]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      
      const [accountsData, eventsData] = await Promise.all([
        financialAccountsService.getAll(),
        eventService.getAll()
      ]);
      
      setAccounts(accountsData);
      setEvents(eventsData);
      
      if (selectedEvent) {
        const transactionsData = await financialAccountsService.getTransactionsByEvent(parseInt(selectedEvent));
        setTransactions(transactionsData);
      } else {
        const allTransactions = await financialAccountsService.getAllTransactions();
        setTransactions(allTransactions);
      }
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar los datos financieros');
    } finally {
      setLoading(false);
    }
  }

  function getAccountTransactions(accountId) {
    return transactions.filter(t => t.accountId === accountId);
  }

  function calculateAccountBalance(accountId) {
    const accountTransactions = getAccountTransactions(accountId);
    return accountTransactions.reduce((balance, transaction) => {
      return transaction.type === 'income' 
        ? balance + transaction.amount 
        : balance - transaction.amount;
    }, 0);
  }

  function calculateAccountIncome(accountId) {
    const accountTransactions = getAccountTransactions(accountId);
    return accountTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  function calculateAccountExpenses(accountId) {
    const accountTransactions = getAccountTransactions(accountId);
    return accountTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  function getBalanceColor(balance) {
    if (balance > 0) return 'text-success';
    if (balance < 0) return 'text-error';
    return 'text-slate-400';
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  }

  function formatDate(dateString) {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
  }

  function handleViewTransactions(account) {
    setSelectedAccount(account);
  }

  function handleAddTransaction(account) {
    setSelectedAccount(account);
    setEditingTransaction(null);
    setTransactionForm({
      type: 'income',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      eventId: selectedEvent || ''
    });
    setShowTransactionModal(true);
  }

  function handleEditTransaction(transaction) {
    setEditingTransaction(transaction);
    setTransactionForm({
      type: transaction.type,
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: transaction.date.split('T')[0],
      eventId: transaction.eventId.toString()
    });
    setShowTransactionModal(true);
  }

  function handleEditResponsible(account) {
    setEditingResponsible(account);
    setResponsibleForm({
      name: account.responsiblePerson?.name || '',
      email: account.responsiblePerson?.email || '',
      phone: account.responsiblePerson?.phone || ''
    });
    setShowResponsibleModal(true);
  }

  function handleTransactionFormChange(e) {
    const { name, value } = e.target;
    setTransactionForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleResponsibleFormChange(e) {
    const { name, value } = e.target;
    setResponsibleForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function validateTransactionForm() {
    if (!transactionForm.amount || isNaN(transactionForm.amount) || parseFloat(transactionForm.amount) <= 0) {
      toast.error('El monto debe ser un número válido mayor a 0');
      return false;
    }
    if (!transactionForm.description.trim()) {
      toast.error('La descripción es requerida');
      return false;
    }
    if (!transactionForm.date) {
      toast.error('La fecha es requerida');
      return false;
    }
    return true;
  }

  async function handleTransactionSubmit(e) {
    e.preventDefault();
    if (!validateTransactionForm()) return;

    try {
      const transactionData = {
        ...transactionForm,
        amount: parseFloat(transactionForm.amount),
        accountId: selectedAccount.Id,
        eventId: transactionForm.eventId ? parseInt(transactionForm.eventId) : null,
        date: new Date(transactionForm.date).toISOString()
      };

      if (editingTransaction) {
        await financialAccountsService.updateTransaction(editingTransaction.Id, transactionData);
        toast.success('Transacción actualizada exitosamente');
      } else {
        await financialAccountsService.createTransaction(transactionData);
        toast.success('Transacción agregada exitosamente');
      }

      setShowTransactionModal(false);
      await loadData();
    } catch (err) {
      toast.error('Error al guardar la transacción');
    }
  }

  async function handleResponsibleSubmit(e) {
    e.preventDefault();
    
    try {
      await financialAccountsService.updateResponsible(editingResponsible.Id, responsibleForm);
      toast.success('Responsable actualizado exitosamente');
      setShowResponsibleModal(false);
      await loadData();
    } catch (err) {
      toast.error('Error al actualizar el responsable');
    }
  }

  async function handleDeleteTransaction(transactionId) {
    if (!window.confirm('¿Estás seguro de eliminar esta transacción?')) return;
    
    try {
      await financialAccountsService.deleteTransaction(transactionId);
      toast.success('Transacción eliminada exitosamente');
      await loadData();
    } catch (err) {
      toast.error('Error al eliminar la transacción');
    }
  }

  function getFilteredTransactions() {
    if (!selectedAccount) return [];
    
    let filtered = getAccountTransactions(selectedAccount.Id);
    
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (dateFilter) {
      filtered = filtered.filter(t => 
        t.date.startsWith(dateFilter)
      );
    }
    
    if (typeFilter) {
      filtered = filtered.filter(t => t.type === typeFilter);
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
<div className="space-y-4 sm:space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100">Cuentas Financieras</h1>
          <p className="text-slate-400 text-sm sm:text-base">Gestiona las cuentas financieras por evento</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="min-w-[200px]"
          >
            <option value="">Todos los eventos</option>
{events.map(event => (
              <option key={event.Id} value={event.Id}>
                {event.title || event.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Ingresos', 
            value: formatCurrency(transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)),
            icon: 'TrendingUp',
            color: 'text-success'
          },
          { 
            label: 'Total Gastos', 
            value: formatCurrency(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)),
            icon: 'TrendingDown',
            color: 'text-error'
          },
          { 
            label: 'Balance Total', 
            value: formatCurrency(transactions.reduce((balance, t) => t.type === 'income' ? balance + t.amount : balance - t.amount, 0)),
            icon: 'DollarSign',
            color: 'text-info'
          },
          { 
            label: 'Transacciones', 
            value: transactions.length.toString(),
            icon: 'Receipt',
            color: 'text-warning'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className={`text-xl font-semibold ${stat.color}`}>{stat.value}</p>
                </div>
                <ApperIcon name={stat.icon} size={24} className={stat.color} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {!selectedAccount ? (
        /* Accounts Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {accounts.map((account, index) => {
            const balance = calculateAccountBalance(account.Id);
            const income = calculateAccountIncome(account.Id);
            const expenses = calculateAccountExpenses(account.Id);
            const transactionCount = getAccountTransactions(account.Id).length;

            return (
              <motion.div
                key={account.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover-glow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">{account.name}</h3>
                      <p className="text-sm text-slate-400">{account.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {transactionCount} mov.
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Balance:</span>
                      <span className={`font-semibold ${getBalanceColor(balance)}`}>
                        {formatCurrency(balance)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Ingresos:</span>
                      <span className="text-success font-medium">{formatCurrency(income)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Gastos:</span>
                      <span className="text-error font-medium">{formatCurrency(expenses)}</span>
                    </div>
                  </div>

                  {account.responsiblePerson && (
                    <div className="mb-4 p-3 bg-slate-800 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Responsable:</p>
                      <p className="text-sm font-medium">{account.responsiblePerson.name}</p>
                      {account.responsiblePerson.email && (
                        <p className="text-xs text-slate-500">{account.responsiblePerson.email}</p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTransactions(account)}
                      className="flex-1"
                    >
                      <ApperIcon name="Eye" size={14} />
                      Ver Movimientos
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddTransaction(account)}
                    >
                      <ApperIcon name="Plus" size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditResponsible(account)}
                    >
                      <ApperIcon name="User" size={14} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Transaction Details View */
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAccount(null)}
                className="mb-2"
              >
                <ApperIcon name="ArrowLeft" size={16} />
                Volver a cuentas
              </Button>
              <h2 className="text-xl font-semibold text-slate-100">{selectedAccount.name}</h2>
              <p className="text-slate-400">{selectedAccount.description}</p>
            </div>
            <Button onClick={() => handleAddTransaction(selectedAccount)}>
              <ApperIcon name="Plus" size={16} />
              Nueva Transacción
            </Button>
          </div>

          {/* Account Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="text-center">
                <p className="text-sm text-slate-400">Balance Actual</p>
                <p className={`text-2xl font-bold ${getBalanceColor(calculateAccountBalance(selectedAccount.Id))}`}>
                  {formatCurrency(calculateAccountBalance(selectedAccount.Id))}
                </p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <p className="text-sm text-slate-400">Total Ingresos</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(calculateAccountIncome(selectedAccount.Id))}
                </p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <p className="text-sm text-slate-400">Total Gastos</p>
                <p className="text-2xl font-bold text-error">
                  {formatCurrency(calculateAccountExpenses(selectedAccount.Id))}
                </p>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Input
              type="text"
              placeholder="Buscar por descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full sm:w-auto"
            />
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full sm:w-auto"
            >
              <option value="">Todos los tipos</option>
              <option value="income">Ingresos</option>
              <option value="expense">Gastos</option>
            </Select>
            {(searchTerm || dateFilter || typeFilter) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('');
                  setTypeFilter('');
                }}
              >
                Limpiar
              </Button>
            )}
          </div>

          {/* Transactions Table */}
<div className="overflow-x-auto">
            {getFilteredTransactions().length > 0 ? (
              <>
                {/* Mobile Card Layout */}
                <div className="block sm:hidden space-y-3 p-4">
                  {getFilteredTransactions().map(transaction => {
                    const event = events.find(e => e.Id === transaction.eventId);
                    return (
                      <div key={transaction.Id} className="bg-slate-700/30 rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{transaction.description}</p>
                            <p className="text-sm text-slate-400">{formatDate(transaction.date)}</p>
                          </div>
                          <Badge 
                            variant={transaction.type === 'income' ? 'success' : 'error'}
                            size="sm"
                          >
                            {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-400">Evento</p>
                            <p className="text-sm text-slate-200 truncate">
                              {event ? (event.title || event.name) : 'Sin evento'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-lg ${
                              transaction.type === 'income' ? 'text-success' : 'text-error'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-600/30">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTransaction(transaction)}
                            className="h-9 px-3 touch-manipulation"
                          >
                            <ApperIcon name="Edit" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTransaction(transaction.Id)}
                            className="h-9 px-3 text-error hover:text-error touch-manipulation"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Desktop Table Layout */}
                <div className="hidden sm:block">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-4 px-3 text-sm font-medium text-slate-400">Fecha</th>
                        <th className="text-left py-4 px-3 text-sm font-medium text-slate-400">Descripción</th>
                        <th className="text-left py-4 px-3 text-sm font-medium text-slate-400">Tipo</th>
                        <th className="text-right py-4 px-3 text-sm font-medium text-slate-400">Monto</th>
                        <th className="text-left py-4 px-3 text-sm font-medium text-slate-400">Evento</th>
                        <th className="text-center py-4 px-3 text-sm font-medium text-slate-400 w-32">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredTransactions().map(transaction => {
                        const event = events.find(e => e.Id === transaction.eventId);
                        return (
                          <tr key={transaction.Id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                            <td className="py-4 px-3 text-sm text-slate-300">
                              {formatDate(transaction.date)}
                            </td>
                            <td className="py-4 px-3 text-sm text-slate-100 max-w-64 truncate" title={transaction.description}>
                              {transaction.description}
                            </td>
                            <td className="py-4 px-3">
                              <Badge 
                                variant={transaction.type === 'income' ? 'success' : 'error'}
                                size="sm"
                              >
                                {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                              </Badge>
                            </td>
                            <td className={`py-4 px-3 text-right font-medium ${
                              transaction.type === 'income' ? 'text-success' : 'text-error'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </td>
                            <td className="py-4 px-3 text-sm text-slate-300 max-w-48 truncate" title={event ? (event.title || event.name) : 'Sin evento'}>
                              {event ? (event.title || event.name) : 'Sin evento'}
                            </td>
                            <td className="py-4 px-3">
                              <div className="flex justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditTransaction(transaction)}
                                  className="h-9 w-9 p-0 touch-manipulation"
                                >
                                  <ApperIcon name="Edit" size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteTransaction(transaction.Id)}
                                  className="h-9 w-9 p-0 text-error hover:text-error touch-manipulation"
                                >
                                  <ApperIcon name="Trash2" size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <Empty message="No hay transacciones registradas para esta cuenta" />
            )}
          </div>
        </Card>
      )}

      {/* Transaction Modal */}
{/* Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-surface rounded-xl p-4 sm:p-6 w-full max-w-lg max-h-[95vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                {editingTransaction ? 'Editar Transacción' : 'Nueva Transacción'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTransactionModal(false)}
                className="h-9 w-9 p-0 touch-manipulation"
              >
                <ApperIcon name="X" size={18} />
              </Button>
            </div>

            <form onSubmit={handleTransactionSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tipo
                </label>
                <Select
                  name="type"
                  value={transactionForm.type}
                  onChange={handleTransactionFormChange}
                  className="h-11 sm:h-12"
                  required
                >
                  <option value="income">Ingreso</option>
                  <option value="expense">Gasto</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Monto *
                </label>
                <Input
                  type="number"
                  name="amount"
                  value={transactionForm.amount}
                  onChange={handleTransactionFormChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  className="h-11 sm:h-12"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Descripción *
                </label>
                <Input
                  type="text"
                  name="description"
                  value={transactionForm.description}
                  onChange={handleTransactionFormChange}
                  placeholder="Descripción de la transacción"
                  className="h-11 sm:h-12"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Fecha *
                </label>
                <Input
                  type="date"
                  name="date"
                  value={transactionForm.date}
                  onChange={handleTransactionFormChange}
                  className="h-11 sm:h-12"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Evento
                </label>
                <Select
                  name="eventId"
                  value={transactionForm.eventId}
                  onChange={handleTransactionFormChange}
                  className="h-11 sm:h-12"
                >
                  <option value="">Seleccionar evento (opcional)</option>
                  {events.map(event => (
                    <option key={event.Id} value={event.Id}>
                      {event.title || event.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 h-11 sm:h-12 touch-manipulation active:scale-95"
                >
                  <ApperIcon name="Save" size={16} />
                  {editingTransaction ? 'Actualizar' : 'Crear'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowTransactionModal(false)}
                  className="flex-1 h-11 sm:h-12 touch-manipulation active:scale-95"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Responsible Person Modal */}
      {showResponsibleModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-surface rounded-xl p-4 sm:p-6 w-full max-w-lg max-h-[95vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white">Asignar Responsable</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResponsibleModal(false)}
                className="h-9 w-9 p-0 touch-manipulation"
              >
                <ApperIcon name="X" size={18} />
              </Button>
            </div>

            <form onSubmit={handleResponsibleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nombre Completo *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={responsibleForm.name}
                  onChange={handleResponsibleFormChange}
                  placeholder="Nombre del responsable"
                  className="h-11 sm:h-12"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={responsibleForm.email}
                  onChange={handleResponsibleFormChange}
                  placeholder="correo@ejemplo.com"
                  className="h-11 sm:h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Teléfono
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={responsibleForm.phone}
                  onChange={handleResponsibleFormChange}
                  placeholder="+52 123 456 7890"
                  className="h-11 sm:h-12"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 h-11 sm:h-12 touch-manipulation active:scale-95"
                >
                  <ApperIcon name="Save" size={16} />
                  Asignar
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowResponsibleModal(false)}
                  className="flex-1 h-11 sm:h-12 touch-manipulation active:scale-95"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default FinancialAccounts;