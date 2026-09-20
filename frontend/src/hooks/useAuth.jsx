import { createContext, useContext, useState, useCallback } from 'react';
import api, { extractErrorMessage } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('myplace_admin');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('myplace_admin_token', data.token);
      localStorage.setItem('myplace_admin', JSON.stringify(data.admin));
      setAdmin(data.admin);
      return { success: true };
    } catch (err) {
      return { success: false, error: extractErrorMessage(err, 'Invalid email or password.') };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('myplace_admin_token');
    localStorage.removeItem('myplace_admin');
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
