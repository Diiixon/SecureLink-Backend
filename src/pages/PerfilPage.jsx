import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileContent from '../components/ProfileContent';
import '../style/ProfileContent.css'; // Asegúrate de que la ruta a tu CSS es correcta

function PerfilPage() {
    return (
        <div className="profile-page-wrapper">
            <Navbar />
            <main>
                <ProfileContent />
            </main>
            <Footer />
        </div>
    );
}

export default PerfilPage;