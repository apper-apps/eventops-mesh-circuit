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