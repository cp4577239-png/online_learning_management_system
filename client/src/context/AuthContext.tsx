import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole | 'guest';
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  switchRole: (role: UserRole | 'guest') => void;
  login: (email: string, role?: UserRole, password?: string) => Promise<boolean>;
  register: (name: string, email: string, role: UserRole, password?: string) => Promise<boolean>;
  updateProfile: (profile: Pick<User, 'name' | 'headline' | 'bio' | 'avatar'>) => Promise<void>;
  logout: () => void;
  addPoints: (points: number) => void;
}

interface AuthResponse {
  user: User;
}

class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

async function authRequest(path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    let message = `Authentication request failed (${response.status})`;
    if (text) {
      try {
        const body = JSON.parse(text) as { error?: unknown };
        message = typeof body.error === 'string' ? body.error : text;
      } catch (error) {
        if (!(error instanceof SyntaxError)) throw error;
        message = text;
      }
    }
    throw new ApiError(message, response.status);
  }

  return response;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | 'guest'>('guest');
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    const loadCurrentUser = async () => {
      try {
        const response = await authRequest('/auth/me');
        const { user } = await response.json() as AuthResponse;
        if (active) {
          setCurrentUser(user);
          setRole(user.role);
        }
      } catch (error) {
        if (!(error instanceof ApiError && error.status === 401)) {
          console.error('Unable to restore the Learnova session:', error);
        }
      } finally {
        if (active) setIsAuthLoading(false);
      }
    };

    void loadCurrentUser();
    return () => {
      active = false;
    };
  }, []);

  const switchRole = (newRole: UserRole | 'guest') => {
    if (newRole === 'guest') {
      logout();
    } else if (currentUser?.role !== newRole) {
      console.warn('Role switching is not supported by the authentication API.');
    }
  };

  const login = async (email: string, requestedRole: UserRole = 'student', password = '') => {
    const response = await authRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const { user } = await response.json() as AuthResponse;

    if (user.role !== requestedRole) {
      await authRequest('/auth/logout', { method: 'POST' });
      throw new Error(`This account is registered as ${user.role}. Select the matching account role and try again.`);
    }

    setCurrentUser(user);
    setRole(user.role);
    return true;
  };

  const register = async (name: string, email: string, newRole: UserRole, password = '') => {
    const response = await authRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role: newRole }),
    });
    const { user } = await response.json() as AuthResponse;
    setCurrentUser(user);
    setRole(user.role);
    return true;
  };

  const updateProfile = async (profile: Pick<User, 'name' | 'headline' | 'bio' | 'avatar'>) => {
    const response = await authRequest('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(profile),
    });
    const { user } = await response.json() as AuthResponse;
    setCurrentUser((current) => current?.id === user.id ? user : current);
  };

  const logout = () => {
    void authRequest('/auth/logout', { method: 'POST' })
      .catch((error: unknown) => console.error('Unable to end the Learnova session:', error));
    setCurrentUser(null);
    setRole('guest');
  };

  const addPoints = (points: number) => {
    if (!currentUser) return;

    void authRequest('/auth/me/points', {
      method: 'PATCH',
      body: JSON.stringify({ points }),
    })
      .then(async (response) => {
        const { user } = await response.json() as AuthResponse;
        setCurrentUser((prev) => prev?.id === user.id ? user : prev);
      })
      .catch((error: unknown) => console.error('Unable to update learning points:', error));
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        role,
        isAuthenticated: !!currentUser,
        isAuthLoading,
        switchRole,
        login,
        register,
        updateProfile,
        logout,
        addPoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
