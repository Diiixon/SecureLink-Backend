import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import SuccessModal from './SuccessModal'; 

// Importa el hook `useAuth` del contexto de autenticación para acceder a la función de registro.
import { useAuth } from '../context/AuthContext';


/**
 * Componente que renderiza un formulario de registro para nuevos usuarios.
 */
function RegisterForm() {
    // --- ESTADOS ---

    // Estado para almacenar todos los datos del formulario en un solo objeto.
    const [formData, setFormData] = useState({ 
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    // Estado específico para los mensajes de error relacionados con la contraseña.
    const [passwordError, setPasswordError] = useState(""); 
    // Estado para controlar la visibilidad del modal de éxito.
    const [isModalVisible, setIsModalVisible] = useState(false);

    // --- HOOKS ---
    const navigate = useNavigate(); // Hook para la navegación programática.
    const { register } = useAuth(); // Obtiene la función `register` del contexto de autenticación.

    /**
     * Maneja los cambios en cualquiera de los campos del formulario.
     * Actualiza el estado `formData` de manera genérica.
     * @param {Event} e - El evento de cambio del input.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Actualiza la propiedad correspondiente en el estado `formData`.
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        // Si el cambio ocurre en un campo de contraseña, limpia el error.
        if (name === "password" || name === "confirmPassword") {
            setPasswordError("");
        }
    };

    /**
     * Cierra el modal de registro exitoso y redirige al usuario a la página de inicio de sesión.
     */
    const handleCloseModal = () => {
        setIsModalVisible(false);
        navigate('/login');
    };

    /**
     * Maneja el envío del formulario de registro.
     * Realiza validaciones y llama a la API de registro.
     * @param {Event} e - El evento de envío del formulario.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue.

        // Validación: Verifica que las contraseñas coincidan.
        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Las contraseñas no coinciden.");
            return; // Detiene el envío si no coinciden.
        }
        setPasswordError(""); // Limpia el error si coinciden.

        try {
            // Llama a la función `register` del contexto con los datos del formulario.
            const response = await register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            if (response.ok) {
                // Si el registro es exitoso (ej. status 201), muestra el modal de éxito.
                setIsModalVisible(true);
            } else {
                // Si hay un error (ej. usuario ya existe), muestra el mensaje de la API.
                const data = await response.json().catch(() => ({}));
                alert(data.message || data.error || 'Ocurrió un error al registrar.');
            }
        } catch (error) {
            // Maneja errores de red o de conexión con el servidor.
            console.error('Error de red:', error);
            alert('No se pudo conectar al servidor.');
        }
    };

    // Renderiza el formulario de registro.
    return (
        <>
            <main className="auth-container">
                <div className="form-card">
                    <div className="form-header">
                        <h2>Crea tu Cuenta</h2>
                        <p>Únete para proteger tu navegación.</p>
                    </div>
                    <form id="formulario" onSubmit={handleSubmit}>
                        {/* Grupo de input para el nombre de usuario */}
                        <div className="input-group">
                            <label htmlFor="username">Nombre de Usuario</label>
                            <input type="text" id="username" name="username" placeholder="Elige un nombre de usuario" required value={formData.username} onChange={handleChange} />
                        </div>
                        {/* Grupo de input para el correo */}
                        <div className="input-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input type="email" id="email" name="email" placeholder="tu@email.com" required value={formData.email} onChange={handleChange} />
                        </div>
                        {/* Grupo de input para la contraseña */}
                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" id="password" name="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} />
                        </div>
                        {/* Grupo de input para confirmar la contraseña */}
                        <div className="input-group">
                            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="••••••••" required value={formData.confirmPassword} onChange={handleChange} />
                            {/* Muestra el mensaje de error de contraseña si existe */}
                            {passwordError && <p className="error-message">{passwordError}</p>}
                        </div>
                        <button type="submit" className="submit-btn">Crear Cuenta</button>
                        <div className="form-footer">
                            <p>¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link></p>
                        </div>
                    </form>
                </div>
            </main>

            {/* Modal de éxito que se muestra cuando el registro es correcto */}
            <SuccessModal 
                isVisible={isModalVisible}
                onClose={handleCloseModal}
            />
        </>
    );
}

export default RegisterForm;