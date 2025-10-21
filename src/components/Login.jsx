import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MensajeCorreoNoRegistrado from './MensajeCorreoNoRegistrado'; // Asegúrate de que la ruta sea correcta

const API_BASE_URL = "https://demo8589789.mockable.io";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Ya no necesitamos una contraseña fija aquí.

    try {
      const response = await fetch(`${API_BASE_URL}/login`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error('No se pudo obtener la información del servidor.');
      }
      
      // --- CAMBIO PRINCIPAL ---
      // Comparamos el email y la contraseña ingresados con los que vienen de la API.
      // Asegúrate de que tu Mockable devuelva un campo "password" dentro de "user".
      if (data.user && email.trim() === data.user.email && password.trim() === data.user.password) {
        login(data.user);
        navigate('/analizador');
      } else {
        setShowErrorModal(true);
        setHasError(true);
      }

    } catch (error) {
      console.error('Error en el login:', error);
      setShowErrorModal(true);
      setHasError(true);
    }
  };
  
  // Resetea el error visual cuando el usuario vuelve a escribir
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setHasError(false);
  };
  
  return (
    <div className="contenedor-login">
      {/* Renderiza el modal de error y le pasa las props para controlarlo */}
      <MensajeCorreoNoRegistrado 
        isVisible={showErrorModal} 
        onClose={() => setShowErrorModal(false)}
      />

      <div className="login-titulo">
        <h1>Bienvenido</h1>
        <p>Inicia sesion para acceder a tu perfil</p>
      </div>
      <form id="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="correo"
            name="email"
            placeholder="Ingresa tu email"
            type="email"
            required
            value={email}
            onChange={handleInputChange(setEmail)}
            className={hasError ? 'input-error' : ''} 
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="contrasena"
            name="password"
            placeholder="**************"
            type="password"
            required
            value={password}
            onChange={handleInputChange(setPassword)}
            className={hasError ? 'input-error' : ''}
          />
          <Link to="/recuperar" className="forgot-password">¿Olvidaste tu contraseña?</Link>
        </div>
        <div className="login-titulo">
          <button type="submit">Iniciar Sesión</button>
        </div>
        <p className="registro-link">
          ¿No tienes cuenta? <Link to="/registrar">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;