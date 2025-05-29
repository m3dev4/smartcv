export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  emailVerified: boolean;
  role: 'USER' | 'ADMIN';
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetchUser: () => Promise<void>;
};
