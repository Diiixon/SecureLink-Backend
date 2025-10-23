function SuccessModal({ isVisible, onClose }) {

  if (!isVisible) { // La ventana se mantiene oculta hasta que se le indique
    return null;
  }

  return ( // Renderiza la ventana o modal
    <div className="modal-overlay visible">
      <div className="modal-content">
        <div className="modal-icon">✔️</div>
        <h2>¡Registro Exitoso!</h2>
        <p>Tu cuenta ha sido creada. Serás redirigido para iniciar sesión.</p>
        <button onClick={onClose} className="modal-btn">
          Entendido
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;