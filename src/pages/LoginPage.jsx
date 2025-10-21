import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Login from '../components/Login';
import '../style/Login.css'; // Asegúrate de que la ruta a tu CSS es correcta

function LoginPage() {
  return (
    <div className="login-page-wrapper">
      <Navbar />
      <main>
        <Login />
      </main>
      <Footer />
    </div>
  );
}

export default LoginPage;