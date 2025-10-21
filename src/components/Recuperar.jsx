import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/Recuperar.css'; 
import RespuestaRecuperar from './RespuestaRecuperar'; // 1. Importa el modal aquí

function Recuperar() { // Ya no necesita recibir props
  // 2. Mueve la lógica del estado aquí adentro
  const [email, setEmail] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // El correo para el modal se puede manejar directamente en el submit
  // No necesitamos un estado separado para 'submittedEmail'

  const handleSubmit = (event) => {
    event.preventDefault(); 
    // Al enviar el formulario, simplemente activamos el modal
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    // Opcional: limpiar el campo de email después de cerrar el modal
    setEmail('');
  };

  return (
    // 3. Usamos un Fragment (<>) para devolver dos elementos hermanos: el main y el modal
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

      {/* 4. La lógica para mostrar el modal ahora vive aquí */}
      {isModalVisible && (
        <RespuestaRecuperar 
          email={email} // Usa el email del estado actual
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
}

export default Recuperar;