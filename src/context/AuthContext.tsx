import React, { createContext, useContext, useState, type ReactNode } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface User {
  name: string;
  email: string;
  avatar?: string;
  role?: 'Verified Investor' | 'Franchise Partner' | 'Business Buyer' | 'Capital Partner';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, mobile: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGmail: (email: string, role?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('venturo_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('venturo_token');
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('venturo_user', JSON.stringify(data.user));
      localStorage.setItem('venturo_token', data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Cannot connect to backend server' };
    }
  };

  const register = async (fullName: string, mobile: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, mobile, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('venturo_user', JSON.stringify(data.user));
      localStorage.setItem('venturo_token', data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Cannot connect to backend server' };
    }
  };

  const loginWithGmail = (emailInput: string, role = 'Verified Investor') => {
    let email = emailInput.trim();
    if (!email) return;
    
    if (!email.includes('@')) {
      email = `${email}@gmail.com`;
    }

    const namePart = email.split('@')[0];
    const formattedName = namePart
      .split(/[\.\-_]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');

    const newUser: User = {
      name: formattedName || 'Google User',
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName || 'G')}&background=0D9488&color=fff&size=128&bold=true`,
      role: role as any
    };

    setUser(newUser);
    const mockToken = 'mock_jwt_token_' + Date.now();
    setToken(mockToken);
    try {
      localStorage.setItem('venturo_user', JSON.stringify(newUser));
      localStorage.setItem('venturo_token', mockToken);
    } catch (e) {}
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('venturo_user');
      localStorage.removeItem('venturo_token');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoginModalOpen, openLoginModal, closeLoginModal, login, register, loginWithGmail, logout }}>
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
