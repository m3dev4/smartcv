import { AuthContextType } from '@/types/user.types';
import { createContext } from 'react';

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    refetchUser: async () => {},
});
