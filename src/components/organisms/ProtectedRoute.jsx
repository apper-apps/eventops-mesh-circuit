import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/Loading';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user, loading, hasPermission, isAuthenticated } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-200 mb-2">
            Acceso Denegado
          </h3>
          <p className="text-slate-400">
            No tienes permisos para acceder a esta sección
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;