import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '@/services/api/userService';
import { permissionService } from '@/services/api/permissionService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('eventops_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('eventops_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, role, assignedEventIds = []) => {
    try {
      setLoading(true);
      const userData = await userService.authenticate(email, role, assignedEventIds);
      setUser(userData);
      localStorage.setItem('eventops_user', JSON.stringify(userData));
      toast.success(`Bienvenido como ${userData.roleLabel}`);
      return userData;
    } catch (error) {
      toast.error('Error en el inicio de sesión');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eventops_user');
    toast.info('Sesión cerrada correctamente');
  };

  const hasPermission = (permission, resourceId = null) => {
    if (!user) return false;
    return permissionService.checkPermission(user, permission, resourceId);
  };

  const canAccessEvent = (eventId) => {
    if (!user) return false;
    return permissionService.canAccessEvent(user, eventId);
  };

  const getAccessibleEvents = (events) => {
    if (!user) return [];
    return permissionService.filterEventsByAccess(user, events);
  };

  const getAccessibleAccounts = (accounts) => {
    if (!user) return [];
    return permissionService.filterAccountsByAccess(user, accounts);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasPermission,
    canAccessEvent,
    getAccessibleEvents,
    getAccessibleAccounts,
    isAuthenticated: !!user,
    isSaasAdmin: user?.role === 'saas_admin',
    isOwner: user?.role === 'owner',
    isEntrepreneur: user?.role === 'entrepreneur'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};