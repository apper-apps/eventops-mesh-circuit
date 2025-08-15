import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import eventService from "@/services/api/eventService";

const CreateEventForm = ({ onSuccess, onCancel }) => {
const [formData, setFormData] = useState({
    title: "",
    date: "",
    venue: "",
    eventType: "",
    estimatedAttendance: "",
    estimatedTables: "",
    entrepreneur: "",
    dealType: "",
    customTickets: "50",
    customBars: "50",
    status: "Planificado"
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

const eventTypes = [
    "Concierto",
    "Conferencia", 
    "Boda",
    "Corporativo",
    "Festival",
    "Otro"
  ];

  const dealTypes = [
    "100% Ours",
    "80-20 tickets, 50-50 bars",
    "90-10 tickets, 50% bars",
    "Custom"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    }
    
    if (!formData.date) {
      newErrors.date = "La fecha es requerida";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "La fecha no puede ser en el pasado";
      }
    }
    
    if (!formData.venue.trim()) {
      newErrors.venue = "El lugar es requerido";
    }
    
    if (!formData.eventType) {
      newErrors.eventType = "El tipo de evento es requerido";
    }
    
    if (!formData.estimatedAttendance || formData.estimatedAttendance <= 0) {
      newErrors.estimatedAttendance = "La asistencia estimada debe ser mayor a 0";
    }

    if (!formData.estimatedTables || formData.estimatedTables <= 0) {
      newErrors.estimatedTables = "Las mesas estimadas deben ser mayor a 0";
    }

    if (!formData.entrepreneur.trim()) {
      newErrors.entrepreneur = "El empresario/compañía es requerido";
    }

    if (!formData.dealType) {
      newErrors.dealType = "El tipo de trato es requerido";
    }

    if (formData.dealType === "Custom") {
      const ticketPercent = parseFloat(formData.customTickets);
      const barPercent = parseFloat(formData.customBars);
      
      if (isNaN(ticketPercent) || ticketPercent < 0 || ticketPercent > 100) {
        newErrors.customTickets = "El porcentaje de tickets debe ser entre 0 y 100";
      }
      
      if (isNaN(barPercent) || barPercent < 0 || barPercent > 100) {
        newErrors.customBars = "El porcentaje de bars debe ser entre 0 y 100";
      }
    }

    return newErrors;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
const eventData = {
        ...formData,
        estimatedAttendance: parseInt(formData.estimatedAttendance),
        estimatedTables: parseInt(formData.estimatedTables),
        customTickets: formData.dealType === "Custom" ? parseFloat(formData.customTickets) : null,
        customBars: formData.dealType === "Custom" ? parseFloat(formData.customBars) : null,
        createdAt: new Date().toISOString()
      };
      
      await eventService.create(eventData);
      toast.success("¡Evento creado exitosamente!");
      onSuccess();
    } catch (error) {
      toast.error("Error al crear el evento. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface rounded-xl border border-slate-600/20 card-shadow p-6 max-w-2xl mx-auto"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Crear Nuevo Evento</h2>
        <p className="text-slate-400">Completa la información para crear tu evento</p>
      </div>

<form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField 
            label="Título del Evento"
            required
            error={errors.title}
          >
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Concierto de Verano 2024"
              error={!!errors.title}
            />
          </FormField>

          <FormField 
            label="Fecha del Evento"
            required
            error={errors.date}
          >
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              error={!!errors.date}
            />
          </FormField>
        </div>

        <FormField 
          label="Lugar del Evento"
          required
          error={errors.venue}
        >
          <Input
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="Ej: Centro de Convenciones Plaza Mayor"
            error={!!errors.venue}
          />
        </FormField>

        <FormField 
          label="Mesas Estimadas"
          required
          error={errors.estimatedTables}
        >
          <Input
            type="number"
            name="estimatedTables"
            value={formData.estimatedTables}
            onChange={handleChange}
            placeholder="Ej: 25"
            min="1"
            error={!!errors.estimatedTables}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField 
            label="Tipo de Evento"
            required
            error={errors.eventType}
          >
            <Select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              error={!!errors.eventType}
            >
              <option value="">Selecciona el tipo</option>
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </FormField>

          <FormField 
            label="Asistencia Estimada"
            required
            error={errors.estimatedAttendance}
          >
            <Input
              type="number"
              name="estimatedAttendance"
              value={formData.estimatedAttendance}
              onChange={handleChange}
              placeholder="Ej: 500"
              min="1"
              error={!!errors.estimatedAttendance}
            />
          </FormField>
        </div>

        <FormField 
          label="Empresario/Compañía"
          required
          error={errors.entrepreneur}
        >
          <Select
            name="entrepreneur"
            value={formData.entrepreneur}
            onChange={handleChange}
            error={!!errors.entrepreneur}
          >
            <option value="">Selecciona una opción</option>
            <option value="Own Event">Own Event</option>
            <option value="External Partner">External Partner</option>
            <option value="Corporate Client">Corporate Client</option>
            <option value="Private Client">Private Client</option>
          </Select>
        </FormField>

        <FormField 
          label="Tipo de Trato"
          required
          error={errors.dealType}
        >
          <Select
            name="dealType"
            value={formData.dealType}
            onChange={handleChange}
            error={!!errors.dealType}
          >
            <option value="">Selecciona el tipo de trato</option>
            {dealTypes.map(deal => (
              <option key={deal} value={deal}>{deal}</option>
            ))}
          </Select>
        </FormField>

        {formData.dealType === "Custom" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField 
              label="Porcentaje Tickets (%)"
              required
              error={errors.customTickets}
            >
              <Input
                type="number"
                name="customTickets"
                value={formData.customTickets}
                onChange={handleChange}
                placeholder="50"
                min="0"
                max="100"
                step="0.1"
                error={!!errors.customTickets}
              />
            </FormField>

            <FormField 
              label="Porcentaje Bars (%)"
              required
              error={errors.customBars}
            >
              <Input
                type="number"
                name="customBars"
                value={formData.customBars}
                onChange={handleChange}
                placeholder="50"
                min="0"
                max="100"
                step="0.1"
                error={!!errors.customBars}
              />
            </FormField>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="flex-1"
          >
            Crear Evento
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateEventForm;