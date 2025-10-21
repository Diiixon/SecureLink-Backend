// 1. Renombramos el componente para seguir la convención (PascalCase)
//    y aceptamos 'email' y 'onClose' como props.
function RespuestaRecuperar({ email, onClose }) {
    return (
    // 2. Agregamos la clase "visible" para que el CSS lo muestre
    <div className="modal-overlay visible" id="moduloRespuesta">
        <div className="modal-content">
            <div className="modal-icon">&#10003;</div>
            <h2>¡Enlace Enviado!</h2>
            {/* 3. Mostramos el email que recibimos por props */}
            <p>Se ha enviado un enlace de recuperación a: <strong id="correoUsuario" className="user-email">{email}</strong></p>
            {/* 4. Al hacer clic, llamamos a la función onClose que viene del padre */}
            <button className="modal-btn" id="botonOk" onClick={onClose}>OK</button>
        </div>
    </div>
    )
}

// 5. Asegúrate de que el nombre de exportación coincida
export default RespuestaRecuperar;