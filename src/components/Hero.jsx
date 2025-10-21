import '../style/Hero.css';
import heroLogo from '../assets/SecureLink logo.png'
import {Link} from "react-router-dom";
//componente que muestra la seccion principal de la pagina con llamada a la accion para registrarse 

function Hero() {
    return (
        <main>
            <section id="home" className="hero-section">
                <div className="hero-content">
                    <h1>Tu primera línea de defensa contra el fraude online.</h1>
                    <p>
                        En un mundo digital lleno de amenazas, SecureLink es tu guardián. Analizamos enlaces, mensajes y
                        códigos QR en tiempo real para
                        protegerte del phishing y el malware antes de que hagas clic. Navega con total tranquilidad.
                    </p>
                    <Link to="registrar" className="btn-cta">Crea tu Cuenta Gratis</Link>
                </div>
                <div className="hero-image">
                    <img src={heroLogo} alt="Escudo SecureLink" className="hero-logo-img"/>
                </div>
            </section>
        </main>
    )
}

export default Hero