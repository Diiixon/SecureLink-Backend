import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};

// Helper para decodificar JWT en el cliente (payload)
function decodeJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  
  // 1. CORRECCIÓN EN EL ESTADO INICIAL
  const [currentUser, setCurrentUser] = useState(() => {
    const t = localStorage.getItem('token');
    if (!t) return null;
    const payload = decodeJwt(t);
    return {
      id: payload?.userId || null, // <--- IMPORTANTE: Rescatamos el ID aquí
      email: payload?.sub || null,
      nombre: payload?.name || payload?.username || payload?.sub || null,
    };
  });

  const isLoggedIn = !!token;

  // Guarda token y usuario en localStorage y estado
  const loginWithToken = (newToken) => {
    if (!newToken) return;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    
    const payload = decodeJwt(newToken) || {};
    
    // Para depurar: ver qué trae el token realmente
    console.log("Payload del Token:", payload); 

    // 2. CORRECCIÓN AL INICIAR SESIÓN
    setCurrentUser({
      id: payload.userId || null, // <--- IMPORTANTE: Rescatamos el ID aquí también
      email: payload.sub || null,
      nombre: payload.name || payload.username || payload.sub || null,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  // Convenience: return headers to attach to authenticated requests
  const getAuthHeaders = () => {
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Public helper to register using auth-service (returns fetch Response)
  const register = async ({ username, email, password }) => {
    const base = import.meta.env.VITE_AUTH_URL || 'http://98.88.88.48:8080';
    const resp = await fetch(`${base}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return resp;
  };

  // Public helper to login (calls auth-service and stores token)
  const login = async ({ email, password }) => {
    const base = import.meta.env.VITE_AUTH_URL || 'http://98.88.88.48:8080';
    const resp = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!resp.ok) throw resp;
    const data = await resp.json();
    if (data?.token) {
      loginWithToken(data.token);
      return data.token;
    }
    throw new Error('No token in login response');
  };

  useEffect(() => {
    // ensure state matches token storage (in case multiple tabs)
    const onStorage = (e) => {
      if (e.key === 'token') {
        const t = e.newValue;
        if (t) loginWithToken(t);
        else logout();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = {
    currentUser,
    isLoggedIn,
    token,
    login,
    loginWithToken,
    logout,
    register,
    getAuthHeaders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};