import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import SuccessModal from './SuccessModal'; // 1. Importa el nuevo componente

const API_BASE_URL = "http://demo8589789.mockable.io";

function RegisterForm() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [passwordError, setPasswordError] = useState(""); 
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        if (name === "password" || name === "confirmPassword") {
            setPasswordError("");
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Las contraseñas no coinciden.");
            return;
        }
        setPasswordError(""); 

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setIsModalVisible(true);
            } else {
                alert(data.message || 'Ocurrió un error al registrar.');
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('No se pudo conectar al servidor.');
        }
    };

    return (
        <>
            <main className="auth-container">
                <div className="form-card">
                    <div className="form-header">
                        <h2>Crea tu Cuenta</h2>
                        <p>Únete para proteger tu navegación.</p>
                    </div>
                    <form id="formulario" onSubmit={handleSubmit}>
                        {/* ... tus inputs del formulario no cambian ... */}
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

            {/* 2. Usa el componente y pásale las props */}
            <SuccessModal 
                isVisible={isModalVisible} 
                onClose={handleCloseModal} 
            />
        </>
    );
}

export default RegisterForm;