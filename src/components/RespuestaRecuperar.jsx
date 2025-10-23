function RespuestaRecuperar({ email, onClose }) { // Toma correo ingresado para mostrarlo en el mensaje de confirmación, cuando el usuario presione Ok se cierra la ventana

    // Muestra la ventana emergente en pantalla
    return ( 
    <div className="modal-overlay visible" id="moduloRespuesta">
        <div className="modal-content">
            <div className="modal-icon">&#10003;</div>
            <h2>¡Enlace Enviado!</h2>
            <p>Se ha enviado un enlace de recuperación a: <strong id="correoUsuario" className="user-email">{email}</strong></p>
            <button className="modal-btn" id="botonOk" onClick={onClose}>OK</button>
        </div>
    </div>
    )
}

export default RespuestaRecuperar;