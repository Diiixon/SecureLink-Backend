import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileContent from '../components/ProfileContent';
import '../style/ProfileContent.css';

// Página que muestra el perfil del usuario
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