import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import vipReservationsService from "@/services/api/vipReservationsService";
import eventService from "@/services/api/eventService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";

const VipReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tableTypeFilter, setTableTypeFilter] = useState('');
  const [responsibleFilter, setResponsibleFilter] = useState('');
const [sortField, setSortField] = useState('creationDate');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Quick Add Modal State
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [events, setEvents] = useState([]);
  const [quickFormData, setQuickFormData] = useState({
    tableNumber: '',
    phone: '',
    advancePaid: '',
    event: ''
  });
  const [quickFormLoading, setQuickFormLoading] = useState(false);
  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'Advance Delivered', label: 'Advance Delivered' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Reserved', label: 'Reserved' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Owes', label: 'Owes' },
    { value: 'Canceled', label: 'Canceled' },
    { value: 'No Show', label: 'No Show' }
  ];

  const tableTypeOptions = [
    { value: '', label: 'Todos los tipos' },
    { value: 'Sonafán', label: 'Sonafán' },
    { value: 'Bifronte', label: 'Bifronte' },
    { value: 'Laterales', label: 'Laterales' }
  ];

  const responsibleOptions = [
    { value: '', label: 'Todos los responsables' },
    { value: 'Vanessa', label: 'Vanessa' },
    { value: 'Brenda', label: 'Brenda' },
    { value: 'Jessica', label: 'Jessica' }
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Advance Delivered': return 'info';
      case 'In Progress': return 'warning';
      case 'Delivered': return 'success';
      case 'Reserved': return 'info';
      case 'Pending': return 'warning';
      case 'Owes': return 'error';
      case 'Canceled': return 'error';
      case 'No Show': return 'error';
      default: return 'default';
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vipReservationsService.getAll();
      setReservations(data);
      setFilteredReservations(data);
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar las reservas VIP');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);
// Load events for quick add form
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await eventService.getAll();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };
    loadEvents();
  }, []);
  useEffect(() => {
    let filtered = [...reservations];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(reservation =>
        reservation.clientName.toLowerCase().includes(query) ||
        reservation.event.toLowerCase().includes(query) ||
        reservation.email.toLowerCase().includes(query) ||
        reservation.phone.includes(query)
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(reservation => reservation.status === statusFilter);
    }

    // Apply table type filter
    if (tableTypeFilter) {
      filtered = filtered.filter(reservation => reservation.tableType === tableTypeFilter);
    }

    // Apply responsible person filter
    if (responsibleFilter) {
      filtered = filtered.filter(reservation => reservation.responsiblePerson === responsibleFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle date fields
      if (sortField.includes('Date') && aValue && bValue) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Handle numeric fields
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string fields
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      // Handle date objects
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    setFilteredReservations(filtered);
  }, [reservations, searchQuery, statusFilter, tableTypeFilter, responsibleFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      return;
    }

    try {
      await vipReservationsService.delete(id);
      await fetchReservations();
      toast.success('Reserva eliminada exitosamente');
    } catch (err) {
      toast.error('Error al eliminar la reserva');
    }
  };

  const handleEdit = (reservation) => {
    toast.info(`Editar reserva de ${reservation.clientName} - Funcionalidad en desarrollo`);
  };

  const handleView = (reservation) => {
    toast.info(`Ver detalles de ${reservation.clientName} - Funcionalidad en desarrollo`);
};

  // Quick Add Form Functions
  const handleQuickFormChange = (e) => {
    const { name, value } = e.target;
    setQuickFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateQuickForm = () => {
    const errors = [];
    
    if (!quickFormData.tableNumber.trim()) {
      errors.push('Número de mesa es requerido');
    }
    
if (!quickFormData.phone.trim()) {
      errors.push('Teléfono es requerido');
    } else if (!/^[+]?[\d\s\-()]{9,}$/.test(quickFormData.phone.trim())) {
      errors.push('Formato de teléfono inválido');
    }
    
    if (!quickFormData.event) {
      errors.push('Evento es requerido');
    }
    
    const paidAmount = parseFloat(quickFormData.advancePaid) || 0;
    if (paidAmount < 0) {
      errors.push('El monto pagado no puede ser negativo');
    }
    
    return errors;
  };

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateQuickForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    setQuickFormLoading(true);
    
    try {
const selectedEvent = events.find(event => event.name === quickFormData.event || event.title === quickFormData.event);
      const paidAmount = parseFloat(quickFormData.advancePaid) || 0;
      const defaultPrice = 2500; // Default total price
      
      const reservationData = {
        tableNumber: quickFormData.tableNumber.trim(),
        event: quickFormData.event,
        clientName: "Cliente Rápido", // Default name
        phone: quickFormData.phone.trim(),
        email: "", // Default empty email
        tableType: "Sonafán", // Default table type
        totalPrice: defaultPrice,
        advancePaid: paidAmount,
        pendingBalance: defaultPrice - paidAmount,
        paymentMethod: "Por definir", // Default payment method
        responsiblePerson: "Sistema", // Default responsible person
        status: paidAmount > 0 ? "Advance Delivered" : "Pending",
        origin: "Quick Add",
        notes: "Reserva creada mediante Quick Add"
      };

      await vipReservationsService.create(reservationData);
      
      toast.success('Reserva rápida creada exitosamente');
      setShowQuickAdd(false);
      setQuickFormData({
        tableNumber: '',
        phone: '',
        advancePaid: '',
        event: ''
      });
      
      // Reload reservations
      await fetchReservations();
      
    } catch (error) {
      console.error('Error creating quick reservation:', error);
      toast.error('Error al crear la reserva rápida');
    } finally {
      setQuickFormLoading(false);
    }
  };

  const closeQuickAdd = () => {
    setShowQuickAdd(false);
    setQuickFormData({
      tableNumber: '',
      phone: '',
      advancePaid: '',
      event: ''
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch {
      return '-';
    }
  };

  // Calculate stats
  const stats = {
    total: reservations.length,
    delivered: reservations.filter(r => r.status === 'Delivered').length,
    inProgress: reservations.filter(r => r.status === 'In Progress').length,
    totalRevenue: reservations.reduce((sum, r) => sum + r.totalPrice, 0)
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={fetchReservations} />;

  return (
<motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 sm:space-y-6 lg:space-y-8 max-w-full"
    >
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Reservas VIP</h1>
        <p className="text-slate-400 text-sm sm:text-base">Gestiona las reservas especiales y experiencias premium</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Reservas</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Crown" size={24} className="text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Entregadas</p>
              <p className="text-2xl font-bold text-white">{stats.delivered}</p>
            </div>
            <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">En Progreso</p>
              <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={24} className="text-warning" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Ingresos Totales</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-info/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" size={24} className="text-info" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
<div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Filtros y Búsqueda</h2>
            <Button 
              icon="Plus" 
              onClick={() => setShowQuickAdd(true)}
              className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 h-11 sm:h-10 touch-manipulation active:scale-95"
            >
              <span className="sm:hidden">Añadir</span>
              <span className="hidden sm:inline">Quick Add Reserva</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Buscar por cliente, evento, email o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:col-span-2"
            />

            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />

            <Select
              options={tableTypeOptions}
              value={tableTypeFilter}
              onChange={(e) => setTableTypeFilter(e.target.value)}
            />

            <Select
              options={responsibleOptions}
              value={responsibleFilter}
              onChange={(e) => setResponsibleFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Reservations Table */}
<Card className="overflow-hidden">
        {filteredReservations.length === 0 ? (
          <Empty
            message="No se encontraron reservas VIP"
            description="Intenta ajustar los filtros de búsqueda"
          />
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="block sm:hidden space-y-4 p-4">
              {filteredReservations.map((reservation, index) => (
                <motion.div
                  key={reservation.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-700/30 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-white">Mesa {reservation.tableNumber}</h4>
                      <p className="text-sm text-slate-400">{reservation.clientName}</p>
                    </div>
                    <Badge variant={getStatusVariant(reservation.status)} className="text-xs">
                      {reservation.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-400">Evento</p>
                      <p className="text-slate-200 truncate">{reservation.event}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Teléfono</p>
                      <p className="text-slate-200">{reservation.phone}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Total</p>
                      <p className="text-slate-200 font-medium">{formatCurrency(reservation.totalPrice)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Anticipo</p>
                      <p className="text-success font-medium">{formatCurrency(reservation.advancePaid)}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-600/30">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(reservation)}
                      className="h-9 px-3 touch-manipulation"
                    >
                      <ApperIcon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(reservation)}
                      className="h-9 px-3 touch-manipulation"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(reservation.Id)}
                      className="h-9 px-3 text-error hover:text-error/80 touch-manipulation"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Desktop Table Layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="border-b border-slate-600/20 bg-slate-700/30">
                    {[
                      { key: 'tableNumber', label: 'Mesa' },
                      { key: 'event', label: 'Evento' },
                      { key: 'clientName', label: 'Cliente' },
                      { key: 'phone', label: 'Teléfono' },
                      { key: 'email', label: 'Email' },
                      { key: 'tableType', label: 'Tipo Mesa' },
                      { key: 'totalPrice', label: 'Precio Total' },
                      { key: 'advancePaid', label: 'Anticipo' },
                      { key: 'pendingBalance', label: 'Pendiente' },
                      { key: 'paymentMethod', label: 'Pago' },
                      { key: 'responsiblePerson', label: 'Responsable' },
                      { key: 'status', label: 'Estado' },
                      { key: 'origin', label: 'Origen' },
                      { key: 'creationDate', label: 'Creado' },
                      { key: 'lastPaymentDate', label: 'Último Pago' }
                    ].map(({ key, label }) => (
                      <th
                        key={key}
                        className="text-left py-4 px-4 text-slate-300 font-medium cursor-pointer hover:text-white transition-colors touch-manipulation"
                        onClick={() => handleSort(key)}
                      >
                        <div className="flex items-center gap-2">
                          {label}
                          {sortField === key && (
                            <ApperIcon
                              name={sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown'}
                              size={16}
                              className="text-primary"
                            />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="text-left py-4 px-4 text-slate-300 font-medium w-36">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation, index) => (
                    <motion.tr
                      key={reservation.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-600/10 hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="py-4 px-4 text-slate-200 font-medium">{reservation.tableNumber}</td>
                      <td className="py-4 px-4 text-slate-200 max-w-48 truncate" title={reservation.event}>
                        {reservation.event}
                      </td>
                      <td className="py-4 px-4 text-slate-200 font-medium">{reservation.clientName}</td>
                      <td className="py-4 px-4 text-slate-300">{reservation.phone}</td>
                      <td className="py-4 px-4 text-slate-300 max-w-48 truncate" title={reservation.email}>
                        {reservation.email}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="default">{reservation.tableType}</Badge>
                      </td>
                      <td className="py-4 px-4 text-slate-200 font-medium">
                        {formatCurrency(reservation.totalPrice)}
                      </td>
                      <td className="py-4 px-4 text-success font-medium">
                        {formatCurrency(reservation.advancePaid)}
                      </td>
                      <td className="py-4 px-4 text-warning font-medium">
                        {formatCurrency(reservation.pendingBalance)}
                      </td>
                      <td className="py-4 px-4 text-slate-300">{reservation.paymentMethod}</td>
                      <td className="py-4 px-4 text-slate-200">{reservation.responsiblePerson}</td>
                      <td className="py-4 px-4">
                        <Badge variant={getStatusVariant(reservation.status)}>
                          {reservation.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{reservation.origin}</td>
                      <td className="py-4 px-4 text-slate-300">{formatDate(reservation.creationDate)}</td>
                      <td className="py-4 px-4 text-slate-300">{formatDate(reservation.lastPaymentDate)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(reservation)}
                            className="h-9 w-9 p-0 touch-manipulation"
                            title="Ver detalles"
                          >
                            <ApperIcon name="Eye" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(reservation)}
                            className="h-9 w-9 p-0 touch-manipulation"
                            title="Editar"
                          >
                            <ApperIcon name="Edit" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(reservation.Id)}
                            className="h-9 w-9 p-0 text-error hover:text-error/80 touch-manipulation"
                            title="Eliminar"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

{/* Notes Section (Mobile Friendly) */}
      {filteredReservations.some(r => r.notes) && (
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Notas de Reservas</h3>
          <div className="space-y-3 sm:space-y-4">
            {filteredReservations
              .filter(r => r.notes)
              .map(reservation => (
                <div key={reservation.Id} className="bg-slate-700/30 p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="FileText" size={16} className="text-primary shrink-0" />
                      <span className="font-medium text-white">{reservation.clientName}</span>
                    </div>
                    <span className="text-slate-400 hidden sm:inline">-</span>
                    <span className="text-slate-400 text-sm sm:text-base truncate">{reservation.event}</span>
                  </div>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{reservation.notes}</p>
                </div>
              ))}
          </div>
        </Card>
      )}

{/* Quick Add Reservation Modal */}
      {showQuickAdd && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && closeQuickAdd()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-surface rounded-2xl border border-slate-600/30 w-full max-w-lg max-h-[95vh] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-surface border-b border-slate-600/20 p-4 sm:p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <ApperIcon name="Plus" size={20} className="text-primary" />
                  <span className="hidden sm:inline">Quick Add Reserva</span>
                  <span className="sm:hidden">Añadir Reserva</span>
                </h3>
                <button
                  onClick={closeQuickAdd}
                  className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg touch-manipulation"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleQuickSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6">
              {/* Table Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Número de Mesa *
                </label>
                <Input
                  name="tableNumber"
                  value={quickFormData.tableNumber}
                  onChange={handleQuickFormChange}
                  placeholder="Ej: VIP-001"
                  className="h-11 sm:h-12 text-base"
                  required
                />
              </div>

              {/* Client Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Teléfono Cliente *
                </label>
                <Input
                  name="phone"
                  type="tel"
                  value={quickFormData.phone}
                  onChange={handleQuickFormChange}
                  placeholder="+34 666 123 456"
                  className="h-11 sm:h-12 text-base"
                  required
                />
              </div>

              {/* Event Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Evento *
                </label>
                <Select
                  name="event"
                  value={quickFormData.event}
                  onChange={handleQuickFormChange}
                  className="h-11 sm:h-12 text-base"
                  required
                >
                  <option value="">Seleccionar evento...</option>
                  {events.map((event) => (
                    <option key={event.Id} value={event.title || event.name}>
                      {event.title || event.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Amount Paid */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Monto Pagado (€)
                </label>
                <Input
                  name="advancePaid"
                  type="number"
                  step="0.01"
                  min="0"
                  value={quickFormData.advancePaid}
                  onChange={handleQuickFormChange}
                  placeholder="0.00"
                  className="h-11 sm:h-12 text-base"
                />
                <p className="text-xs text-slate-400">
                  Dejar vacío si no hay pago inicial
                </p>
              </div>

              {/* Default Values Info */}
              <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 space-y-2">
                <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <ApperIcon name="Info" size={16} />
                  Valores por Defecto
                </h4>
                <div className="text-xs text-slate-400 space-y-1">
                  <p>• Tipo de Mesa: Sonafán</p>
                  <p>• Precio Total: €2,500</p>
                  <p>• Cliente: "Cliente Rápido"</p>
                  <p>• Responsable: Sistema</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeQuickAdd}
                  className="flex-1 h-11 sm:h-12 text-base touch-manipulation active:scale-95"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={quickFormLoading}
                  className="flex-1 h-11 sm:h-12 text-base bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 touch-manipulation active:scale-95"
                >
                  {quickFormLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Guardando...
                    </div>
                  ) : (
                    <>
                      <ApperIcon name="Save" size={16} />
                      <span className="hidden sm:inline">Guardar Reserva</span>
                      <span className="sm:hidden">Guardar</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};
export default VipReservations;