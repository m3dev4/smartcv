import { AuthContext } from '@/context/auth-context';
import { useContext, useEffect } from 'react';

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Hook pour vérifier si l'utilisateur est authentifié
export const useRequireAuth = (redirectTo = '/login') => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = redirectTo;
    }
  }, [user, isLoading, redirectTo]);

  return { user, isLoading };
};

// Hooke pour vérifier si l'utilisateur est un admin
export const useAdminAuth = (redirectTo = '/dashboard') => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      window.location.href = redirectTo;
    }
  }, [user, isLoading, redirectTo]);

  return { user, isLoading };
};
