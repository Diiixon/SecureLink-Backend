import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MensajeCorreoNoRegistrado from './MensajeCorreoNoRegistrado'; // Asegúrate de que la ruta sea correcta

const API_BASE_URL = "https://demo8589789.mockable.io";

function Login() {

  //Estado para los campos del formulario para almacenar lo que escribe el usuario 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //hooks de navegacion y autenticacion utilizados para navegar entre paginas 
  const navigate = useNavigate();
  const { login } = useAuth();
  

  //Estado para controlar la visibilidad del modal de error
  //Estado para controlar si hay un error en el formulario (Inputs en rojo)
  const [showErrorModal, setShowErrorModal] = useState(false); 
  const [hasError, setHasError] = useState(false); 

  //funcion asincronica  para manejar el envio del formulario
  const handleSubmit = async (event) => {

    //prevenir que se recargue la pagina
    event.preventDefault();
    

    try {
      //realiza la peticion a la api(mockable.io) para obtener los datos del usuario usando await que pausa la funcion hasta que la api responda
      //luego convierte la respuesta a formato json
      const response = await fetch(`${API_BASE_URL}/login`);
      const data = await response.json();

      // si la respuesta no es ok (200), lanza un error, capturandolo en el try-catch
      if (!response.ok) {
        throw new Error('No se pudo obtener la información del servidor.');
      }
      
      //compara los datos ingresados con los datos obtenidos de la api
      if (data.user && email.trim() === data.user.email && password.trim() === data.user.password) {
        // Si coinciden, inicia sesion y navega al analizador guardando el usuario en el contexto de autenticacion , si no muestra el modal de error
        login(data.user);
        navigate('/analizador');
      } else {
        setShowErrorModal(true);
        setHasError(true);
      }

      //captura cualquier error que ocurra durante la peticion o el proceso de login y muestra el modal de error
    } catch (error) {
      console.error('Error en el login:', error);
      setShowErrorModal(true);
      setHasError(true);
    }
  };
  
  //Funcion para manejar cambios en los inputs del formulario
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setHasError(false);
  };
  

  return (
    <div className="contenedor-login">
      {/*se llama el modal con las propiedades y se controla para que no se muestre*/}
      <MensajeCorreoNoRegistrado 
        isVisible={showErrorModal} 
        onClose={() => setShowErrorModal(false)}
      />

      <div className="login-titulo">
        <h1>Bienvenido</h1>
        <p>Inicia sesion para acceder a tu perfil</p>
      </div>
      {/*Se asigna funcion para enviar formulario*/}
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
          {/*Especificacion de ruta al apretar olvidaste tu contraseña*/}
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