import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '@/types';
import api from '@/lib/axios';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole, filiereId?: number) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_IDS: Record<UserRole, number> = {
  student: 1,
  registrar: 2,
  teacher: 3,
  admin: 4,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get('/user');
      setUser(mapBackendUserToFrontend(response.data));
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const mapBackendUserToFrontend = (backendUser: any): User => ({
    id: backendUser.id.toString(),
    email: backendUser.email,
    name: backendUser.name,
    role: backendUser.role.name as UserRole,
    filiere: backendUser.filiere ? {
      id: backendUser.filiere.id.toString(),
      nom: backendUser.filiere.name || backendUser.filiere.nom,
      niveau: backendUser.filiere.niveau,
    } : undefined,
  });

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      // Note: We don't strictly need to send 'role' to login if the backend just checks email/pass
      // But we can verify if the user has the expected role if we want.
      // For now, standard login.
      const response = await api.post('/login', { email, password });

      const { token, user: backendUser } = response.data;
      localStorage.setItem('token', token);

      const user = mapBackendUserToFrontend(backendUser);

      // Optional: Check if logged in user matches the selected role
      if (user.role !== role) {
        // You might want to allow it anyway or throw error. 
        // For this app, let's just warn or update the context to the real role.
        console.warn(`User logged in as ${user.role} but selected ${role}`);
      }

      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole, filiereId?: number) => {
    try {
      const response = await api.post('/register', {
        email,
        password,
        password_confirmation: password,
        name,
        role_id: ROLE_IDS[role],
        filiere_id: role === 'student' ? filiereId : null,
      });

      const { token, user: backendUser } = response.data;
      localStorage.setItem('token', token);
      setUser(mapBackendUserToFrontend(backendUser));
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
