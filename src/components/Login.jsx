import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MensajeCorreoNoRegistrado from './MensajeCorreoNoRegistrado';

/**
 * Componente del formulario de inicio de sesión.
 * Permite a los usuarios ingresar sus credenciales para autenticarse en la aplicación.
 */
function Login() {
  // --- HOOKS ---
  const navigate = useNavigate(); // Hook de React Router para la navegación programática.
  const { login } = useAuth(); // Hook personalizado para acceder a la función de login del contexto de autenticación.

  // --- ESTADOS DEL FORMULARIO ---
  const [email, setEmail] = useState(''); // Estado para el campo de email.
  const [password, setPassword] = useState(''); // Estado para el campo de contraseña.
  
  // --- ESTADOS DE UI Y ERRORES ---
  const [showErrorModal, setShowErrorModal] = useState(false); // Controla la visibilidad del modal de error.
  const [hasError, setHasError] = useState(false); // Indica si hay un error para aplicar estilos a los inputs.
  const [errorMsg, setErrorMsg] = useState(''); // Mensaje de error a mostrar en el modal.

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * Llama a la función de login del contexto y maneja la respuesta.
   * @param {Event} event - El evento de envío del formulario.
   */
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página).
    try {
      // Intenta iniciar sesión con las credenciales proporcionadas.
      await login({ email, password });
      // Si el login es exitoso, redirige al usuario a la página del analizador.
      navigate('/analizador');
    } catch (err) {
      console.error('Error en el login:', err);
      // Intenta extraer un mensaje de error legible de la respuesta de la API.
      try {
        if (err instanceof Response) {
          const body = await err.json();
          setErrorMsg(body.message || body.error || 'Credenciales inválidas');
        } else {
          // Si el error no es una respuesta HTTP, es probablemente un problema de red.
          setErrorMsg('No se pudo conectar al servidor');
        }
      } catch (e) {
        // Si falla el parseo del JSON del error.
        setErrorMsg('Error en el servidor');
      }
      // Muestra el modal de error y activa el estado de error.
      setShowErrorModal(true);
      setHasError(true);
    }
  };

  /**
   * Crea un manejador de eventos `onChange` para los inputs del formulario.
   * Actualiza el estado correspondiente y limpia el estado de error.
   * @param {Function} setter - La función `set` del estado a actualizar (ej. setEmail).
   * @returns {Function} El manejador de eventos `onChange`.
   */
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    // Limpia el estado de error en cuanto el usuario empieza a corregir los datos.
    setHasError(false);
  };

  return (
    <div className="contenedor-login">
      {/* Modal que se muestra cuando hay un error en el inicio de sesión. */}
      <MensajeCorreoNoRegistrado
        isVisible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMsg}
      />

      <div className="login-titulo">
        <h1>Bienvenido</h1>
        <p>Inicia sesion para acceder a tu perfil</p>
      </div>
      
      {/* Formulario de inicio de sesión */}
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
            // Aplica una clase de error si `hasError` es verdadero.
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
          {/* Enlace para la recuperación de contraseña. */}
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
