import React from 'react';

// Recibe las props isVisible y onClose
function SuccessModal({ isVisible, onClose }) {
  // Si no es visible, no renderiza nada.
  if (!isVisible) {
    return null;
  }

  return (
    <div className="modal-overlay visible">
      <div className="modal-content">
        <div className="modal-icon">✔️</div>
        <h2>¡Registro Exitoso!</h2>
        <p>Tu cuenta ha sido creada. Serás redirigido para iniciar sesión.</p>
        {/* Llama a la función onClose que se le pasó como prop */}
        <button onClick={onClose} className="modal-btn">
          Entendido
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;