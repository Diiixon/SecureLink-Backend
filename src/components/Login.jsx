import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MensajeCorreoNoRegistrado from './MensajeCorreoNoRegistrado'; // Asegúrate de que la ruta sea correcta

const AUTH_BASE = import.meta.env.VITE_AUTH_URL || 'http://localhost:8080';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login({ email, password });
      navigate('/analizador');
    } catch (err) {
      console.error('Error en el login:', err);
      // intenta leer mensaje de error si es una Response
      try {
        if (err instanceof Response) {
          const body = await err.json();
          setErrorMsg(body.message || body.error || 'Credenciales inválidas');
        } else {
          setErrorMsg('No se pudo conectar al servidor');
        }
      } catch (e) {
        setErrorMsg('Error en el servidor');
      }
      setShowErrorModal(true);
      setHasError(true);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setHasError(false);
  };

  return (
    <div className="contenedor-login">
      <MensajeCorreoNoRegistrado
        isVisible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMsg}
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
