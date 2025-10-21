import React, { createContext, useState, useContext } from 'react';
//Gestiona el contexto de autenticacion de usuario de la aplicacion

export const AuthContext = createContext();

//hook para usar el contexto de autenticacion
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  
  //Estado para almacenar el usuario actualmente autenticado
  const [currentUser, setCurrentUser] = useState(null);

 // Indica si el usuario esta logueado
  const isLoggedIn = !!currentUser;

  //Funcion para iniciar sesion, recibe los datos del usuario y los guarda en el estado
  const login = (userData) => {
    setCurrentUser(userData);
  };

  //Funcion para cerrar sesion, limpia el estado del usuario actual
  const logout = () => {
    setCurrentUser(null);
  };

  //Valor QUE Se va a compartir con el resto de la aplicacion a traves del contexto
  const value = {
    currentUser, 
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};