import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegisterForm from '../components/RegisterForm';
import '../style/RegisterForm.css'; // Asegúrate de que la ruta a tu CSS es correcta

function RegisterPage() {
  return (
    <div className="register-page-wrapper"> {/* Puedes usar una clase contenedora si necesitas estilos específicos */}
      <Navbar />
      <main>
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
}

export default RegisterPage;