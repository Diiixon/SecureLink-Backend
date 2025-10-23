import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/RegisterForm.css'; 
import RespuestaRecuperar from './RespuestaRecuperar'; 

function Recuperar() { 
  const [email, setEmail] = useState(''); // Estado para guardar el correo electrónico
  const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad del mensaje de respuesta

  const handleSubmit = (event) => { // Al hacer clic en el botón enviar, evita la recarga de la página y muestra el mensaje de respuesta
    event.preventDefault(); 
    setIsModalVisible(true);
  };

  const handleCloseModal = () => { // Una vez que el usuario presiona Ok se oculta el mensaje de respuesta y se limpia el campo de correo electrónico
    setIsModalVisible(false);
    setEmail('');
  };

  // Contenido de la sección para recuperar contraseña
  return (
    <>
      <main className="auth-container">
        <div className="form-card">
          <div className="form-header">
            <h2>Recupera tu Contraseña</h2>
            <p>Ingresa tu correo y te enviaremos un enlace de recuperación.</p>
          </div>
          <form id="recuperar-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input 
                type="email" 
                placeholder="tu@email.com" 
                name="email" 
                id="correo" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="submit-btn">Enviar Enlace</button>
            <div className="form-footer" id="contraseña">
              <p>¿Recordaste tu contraseña? <Link to="/login">Inicia Sesión</Link></p>
            </div>
          </form>
        </div>
      </main>
    
      {isModalVisible && ( // Si el mensaje de respuesta está visible, muestra el componente RespuestaRecuperar
        <RespuestaRecuperar 
          email={email}
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
}

export default Recuperar;