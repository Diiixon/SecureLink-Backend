import React, { createContext, useState, useContext, useEffect } from 'react';

// Crea el Contexto de Autenticación de React. Este será el objeto que los componentes consumirán.
export const AuthContext = createContext();

/**
 * Hook personalizado para acceder fácilmente al contexto de autenticación desde cualquier componente.
 * @returns {object} El valor del contexto de autenticación.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Función de ayuda para decodificar un token JWT y extraer su payload.
 * No verifica la firma, solo decodifica la parte del payload.
 * @param {string} token - El token JWT a decodificar.
 * @returns {object|null} El payload del token como un objeto, or null si hay un error.
 */
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
    // Si la decodificación falla, retorna null.
    return null;
  }
}

/**
 * Componente Provider que envuelve la aplicación y provee el estado y las funciones de autenticación.
 * @param {object} props - Propiedades del componente, incluyendo `children`.
 */
export const AuthProvider = ({ children }) => {
  // Estado para almacenar el token JWT. Se inicializa desde localStorage para persistir la sesión.
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  
  // Estado para almacenar la información del usuario actual.
  // Se inicializa decodificando el token que está en localStorage.
  const [currentUser, setCurrentUser] = useState(() => {
    const t = localStorage.getItem('token');
    if (!t) return null; // Si no hay token, no hay usuario.
    const payload = decodeJwt(t);
    // Extrae la información del usuario del payload del token.
    return {
      id: payload?.userId || null,
      email: payload?.sub || null,
      nombre: payload?.name || payload?.username || payload?.sub || null,
    };
  });

  // Un booleano que indica si el usuario ha iniciado sesión (si existe un token).
  const isLoggedIn = !!token;

  /**
   * Guarda el token en localStorage y en el estado, y actualiza la información del usuario.
   * @param {string} newToken - El nuevo token JWT recibido del servidor.
   */
  const loginWithToken = (newToken) => {
    if (!newToken) return;
    localStorage.setItem('token', newToken); // Guarda el token para persistir la sesión.
    setToken(newToken); // Actualiza el estado del token.
    
    const payload = decodeJwt(newToken) || {};
    
    // Para depurar en la consola del navegador:
    console.log("Payload del Token:", payload); 

    // Actualiza el estado del usuario con la información del nuevo token.
    setCurrentUser({
      id: payload.userId || null,
      email: payload.sub || null,
      nombre: payload.name || payload.username || payload.sub || null,
    });
  };

  /**
   * Cierra la sesión del usuario, eliminando el token de localStorage y reseteando los estados.
   */
  const logout = () => {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local.
    setToken(null); // Limpia el estado del token.
    setCurrentUser(null); // Limpia el estado del usuario.
  };

  /**
   * Retorna los encabezados de autorización para adjuntar a las peticiones a la API.
   * @returns {object} Un objeto con el encabezado de autorización si hay un token.
   */
  const getAuthHeaders = () => {
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  /**
   * Envía una petición de registro al servicio de autenticación.
   * @param {object} credentials - Credenciales de registro { username, email, password }.
   * @returns {Promise<Response>} La respuesta de la petición fetch.
   */
  const register = async ({ username, email, password }) => {
    const base = import.meta.env.VITE_AUTH_URL || 'http://98.88.88.48:8080';
    const resp = await fetch(`${base}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return resp;
  };

  /**
   * Envía una petición de inicio de sesión y guarda el token si es exitosa.
   * @param {object} credentials - Credenciales de inicio de sesión { email, password }.
   * @returns {Promise<string>} El token JWT si el inicio de sesión es exitoso.
   * @throws {Response|Error} Lanza un error si la petición falla o no hay token.
   */
  const login = async ({ email, password }) => {
    const base = import.meta.env.VITE_AUTH_URL || 'http://98.88.88.48:8080';
    const resp = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!resp.ok) throw resp; // Si la respuesta no es 2xx, lanza el objeto de respuesta.
    const data = await resp.json();
    if (data?.token) {
      loginWithToken(data.token); // Si hay token, procesa el inicio de sesión.
      return data.token;
    }
    throw new Error('No se encontró un token en la respuesta de inicio de sesión');
  };

  // Efecto para sincronizar el estado de autenticación entre diferentes pestañas del navegador.
  useEffect(() => {
    const onStorage = (e) => {
      // Si el cambio en localStorage fue en la clave 'token'...
      if (e.key === 'token') {
        const t = e.newValue;
        if (t) {
          // Si hay un nuevo token, inicia sesión con él.
          loginWithToken(t);
        } else {
          // Si el token fue eliminado, cierra la sesión.
          logout();
        }
      }
    };
    // Añade el listener al evento 'storage'.
    window.addEventListener('storage', onStorage);
    // Limpia el listener cuando el componente se desmonta.
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // El valor que será proveído a los componentes hijos a través del contexto.
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

  // Retorna el Provider del contexto, envolviendo a los componentes hijos.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};