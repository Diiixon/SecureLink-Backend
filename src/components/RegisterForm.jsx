import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import SuccessModal from './SuccessModal'; 

// usamos el helper de AuthContext para registrar
import { useAuth } from '../context/AuthContext';


// Componente para el formulario de registro
function RegisterForm() {
    const [formData, setFormData] = useState({ // Estado para los datos del formulario
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [passwordError, setPasswordError] = useState(""); // Estado para el mensaje de error de contraseña
    const navigate = useNavigate(); 
    const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
    const { register } = useAuth();

    const handleChange = (e) => { // Función para manejar cambios en los campos del formulario
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        if (name === "password" || name === "confirmPassword") {
            setPasswordError("");
        }
    };

    const handleCloseModal = () => { // Función para cerrar la ventana de registro exitoso y redirige al usuario a la página de inicio de sesión
        setIsModalVisible(false);
        navigate('/login');
    };

    const handleSubmit = async (e) => { // Función para manejar el envío del formulario de registro
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) { // Verifica si las contraseñas coinciden
            setPasswordError("Las contraseñas no coinciden.");
            return;
        }
        setPasswordError(""); 

        try {
            const response = await register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            if (response.ok) {
                setIsModalVisible(true);
            } else {
                const data = await response.json().catch(() => ({}));
                alert(data.message || data.error || 'Ocurrió un error al registrar.');
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('No se pudo conectar al servidor.');
        }
    };

    // Renderiza el formulario de registro
    return (
        <>
            <main className="auth-container">
                <div className="form-card">
                    <div className="form-header">
                        <h2>Crea tu Cuenta</h2>
                        <p>Únete para proteger tu navegación.</p>
                    </div>
                    <form id="formulario" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">Nombre de Usuario</label>
                            <input type="text" id="username" name="username" placeholder="Elige un nombre de usuario" required value={formData.username} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input type="email" id="email" name="email" placeholder="tu@email.com" required value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" id="password" name="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="••••••••" required value={formData.confirmPassword} onChange={handleChange} />
                            {passwordError && <p className="error-message">{passwordError}</p>}
                        </div>
                        <button type="submit" className="submit-btn">Crear Cuenta</button>
                        <div className="form-footer">
                            <p>¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link></p>
                        </div>
                    </form>
                </div>
            </main>

            <SuccessModal 
                isVisible={isModalVisible} // Indica si se debe mostrar el modal
                onClose={handleCloseModal} // Función para cerrar el modal
            />
        </>
    );
}

export default RegisterForm;