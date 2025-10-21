// ventana emergente para mostrar el mensaje de error cuando el correo no está registrado

import '../style/Login.css';

//propiedad: isVisible (boolean) controla la visibilidad del modal
//propiedad: onClose (function)  función para cerrar el modal
function MensajeCorreoNoRegistrado({ isVisible, onClose }) {

    //si no es visible, no mostrara nada y retornara null
    if (!isVisible) {
        return null;
    }

    //si es visible, mostrara el modal con el mensaje de error
    return(
        
        //si es visible agrega la clase 'visible' para mostrar el modal, llamando y si no, no la agrega
        <div className={`modal-overlay ${isVisible ? 'visible' : ''}`}>
            <div className="modal-content">
                <div className="modal-icon error">!</div>
                <h2>Error de Inicio de Sesión</h2>
                <p>El correo o la contraseña son incorrectos.</p>
                {/*boton para hacer la funcion cerrar (onClose)*/}
                <button className="modal-btn" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
}

export default MensajeCorreoNoRegistrado;