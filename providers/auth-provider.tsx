import { User } from '@/types/user.types';
import { getCurrentUser } from '@/utils/auth';
import { AuthContext } from '@/context/auth-context';
import React, { useEffect, useState } from 'react';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fonction pour récupérer l'utilisateur actuel
    const fetchUser = async () => {
        try {
            setIsLoading(true);
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur actuel", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // Valeur du contexte
    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        refetchUser: fetchUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
