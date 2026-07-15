import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface User {
  name: string;
  email: string;
  avatar?: string;
  role?: 'Verified Investor' | 'Franchise Partner' | 'Business Buyer' | 'Capital Partner';
}

interface AuthContextType {
  user: User | null;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const loginWithGmail = (emailInput: string, role = 'Verified Investor') => {
    let email = emailInput.trim();
    if (!email) return;
    
    if (!email.includes('@')) {
      email = `${email}@gmail.com`;
    }

    // Extract a nice display name from the gmail address
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
    try {
      localStorage.setItem('venturo_user', JSON.stringify(newUser));
    } catch (e) {}
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('venturo_user');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, isLoginModalOpen, openLoginModal, closeLoginModal, loginWithGmail, logout }}>
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
