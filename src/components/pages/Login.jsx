import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'owner',
    assignedEventIds: []
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const roleOptions = [
    { value: 'saas_admin', label: 'Administrador SaaS', description: 'Acceso completo al sistema' },
    { value: 'owner', label: 'Propietario', description: 'Acceso completo a sus eventos' },
    { value: 'entrepreneur', label: 'Emprendedor', description: 'Acceso a eventos asignados' }
  ];

  const eventOptions = [
    { value: 1, label: 'Festival de Música 2024' },
    { value: 2, label: 'Conferencia Tech Summit' },
    { value: 3, label: 'Gala Benéfica Anual' },
    { value: 4, label: 'Expo Empresarial' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast.error('Por favor ingresa un email');
      return;
    }

    if (formData.role === 'entrepreneur' && formData.assignedEventIds.length === 0) {
      toast.error('Los emprendedores deben tener al menos un evento asignado');
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.role, formData.assignedEventIds);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventSelection = (eventId) => {
    const numericEventId = parseInt(eventId);
    setFormData(prev => ({
      ...prev,
      assignedEventIds: prev.assignedEventIds.includes(numericEventId)
        ? prev.assignedEventIds.filter(id => id !== numericEventId)
        : [...prev.assignedEventIds, numericEventId]
    }));
  };

  const selectedRole = roleOptions.find(option => option.value === formData.role);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Users" size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100 mb-2">EventOps Pro</h1>
            <p className="text-slate-400">Selecciona tu rol para acceder</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Rol de Usuario
              </label>
              <Select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  role: e.target.value,
                  assignedEventIds: e.target.value !== 'entrepreneur' ? [] : prev.assignedEventIds
                }))}
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              {selectedRole && (
                <p className="text-xs text-slate-400 mt-1">
                  {selectedRole.description}
                </p>
              )}
            </div>

            {formData.role === 'entrepreneur' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Eventos Asignados
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {eventOptions.map(event => (
                    <label key={event.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.assignedEventIds.includes(event.value)}
                        onChange={() => handleEventSelection(event.value)}
                        className="w-4 h-4 text-primary bg-surface border-slate-600 rounded focus:ring-primary focus:ring-2"
                      />
                      <span className="text-sm text-slate-300">{event.label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Selecciona los eventos a los que tienes acceso
                </p>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-600">
            <p className="text-xs text-slate-400 text-center">
              Demo: Usa cualquier email válido para probar el sistema
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;