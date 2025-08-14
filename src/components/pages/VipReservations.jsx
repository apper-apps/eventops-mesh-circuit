import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import vipReservationsService from "@/services/api/vipReservationsService";
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
      className="space-y-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reservas VIP</h1>
        <p className="text-slate-400">Gestiona las reservas especiales y experiencias premium</p>
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Filtros y Búsqueda</h2>
            <Button icon="Plus" onClick={() => toast.info('Nueva reserva - Funcionalidad en desarrollo')}>
              Nueva Reserva
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
          <div className="overflow-x-auto">
            <table className="w-full">
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
                      className="text-left py-3 px-4 text-slate-300 font-medium cursor-pointer hover:text-white transition-colors"
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
                  <th className="text-left py-3 px-4 text-slate-300 font-medium w-32">Acciones</th>
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
                    <td className="py-3 px-4 text-slate-200 font-medium">{reservation.tableNumber}</td>
                    <td className="py-3 px-4 text-slate-200 max-w-48 truncate" title={reservation.event}>
                      {reservation.event}
                    </td>
                    <td className="py-3 px-4 text-slate-200 font-medium">{reservation.clientName}</td>
                    <td className="py-3 px-4 text-slate-300">{reservation.phone}</td>
                    <td className="py-3 px-4 text-slate-300 max-w-48 truncate" title={reservation.email}>
                      {reservation.email}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="default">{reservation.tableType}</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-200 font-medium">
                      {formatCurrency(reservation.totalPrice)}
                    </td>
                    <td className="py-3 px-4 text-success font-medium">
                      {formatCurrency(reservation.advancePaid)}
                    </td>
                    <td className="py-3 px-4 text-warning font-medium">
                      {formatCurrency(reservation.pendingBalance)}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{reservation.paymentMethod}</td>
                    <td className="py-3 px-4 text-slate-200">{reservation.responsiblePerson}</td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusVariant(reservation.status)}>
                        {reservation.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{reservation.origin}</td>
                    <td className="py-3 px-4 text-slate-300">{formatDate(reservation.creationDate)}</td>
                    <td className="py-3 px-4 text-slate-300">{formatDate(reservation.lastPaymentDate)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(reservation)}
                          className="p-2"
                          title="Ver detalles"
                        >
                          <ApperIcon name="Eye" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(reservation)}
                          className="p-2"
                          title="Editar"
                        >
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(reservation.Id)}
                          className="p-2 text-error hover:text-error/80"
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
        )}
      </Card>

      {/* Notes Section (Mobile Friendly) */}
      {filteredReservations.some(r => r.notes) && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Notas de Reservas</h3>
          <div className="space-y-4">
            {filteredReservations
              .filter(r => r.notes)
              .map(reservation => (
                <div key={reservation.Id} className="bg-slate-700/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ApperIcon name="FileText" size={16} className="text-primary" />
                    <span className="font-medium text-white">{reservation.clientName}</span>
                    <span className="text-slate-400">-</span>
                    <span className="text-slate-400">{reservation.event}</span>
                  </div>
                  <p className="text-slate-300">{reservation.notes}</p>
                </div>
              ))}
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default VipReservations;