// src/context/AuthContext.jsx

import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // 👇 CAMBIO: En lugar de un booleano, guardamos el objeto del usuario (o null si no hay nadie)
  const [currentUser, setCurrentUser] = useState(null);

  // La variable isLoggedIn ahora se deriva del estado de currentUser
  const isLoggedIn = !!currentUser;

  // 👇 CAMBIO: login ahora acepta los datos del usuario y los guarda en el estado
  const login = (userData) => {
    setCurrentUser(userData);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser, // Compartimos el usuario actual
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};