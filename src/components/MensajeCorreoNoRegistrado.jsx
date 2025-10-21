// MensajeCorreoNoRegistrado.jsx

import '../style/Login.css';

// 1. Acepta las props "isVisible" y "onClose"
function MensajeCorreoNoRegistrado({ isVisible, onClose }) {

    // 2. Si no es visible, no renderiza nada
    if (!isVisible) {
        return null;
    }

    return(
        // 3. Añade la clase 'visible' dinámicamente
        <div className={`modal-overlay ${isVisible ? 'visible' : ''}`}>
            <div className="modal-content">
                <div className="modal-icon error">!</div>
                <h2>Error de Inicio de Sesión</h2>
                <p>El correo o la contraseña son incorrectos.</p>
                {/* 4. El botón ahora usa la función onClose */}
                <button className="modal-btn" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
}

export default MensajeCorreoNoRegistrado;