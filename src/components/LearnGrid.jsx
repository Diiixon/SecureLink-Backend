import maliciousEmailImg from '../assets/Malicious_Emails.png';
import urlAnatomyImg from '../assets/anatomia url.png';
import qrDangersImg from '../assets/peligros ocultos.png';
import contrasenasImg from '../assets/contrasenas.png';
import wifiImg from '../assets/wifi.png';
import pfaImg from '../assets/2fa.png';
import extensionesImg from '../assets/extensiones.png';
import softwareImg from '../assets/software.png';
import estafasImg from '../assets/estafas.png';
import '../style/LearnGrid.css';
//Componente que muestra los recursos de aprendizaje al estar logeado


function LearnGrid() {
    return (
        <main>
            <section id='aprende' className='aprender-section'>
                <div className='section-header'>
                    <h2>Conviértete en un Experto en Ciberseguridad</h2>
                    <p>El conocimiento es tu mejor defensa. Explora nuestra biblioteca de recursos para nevegar seguro</p>
                </div>
                <div className='aprender-grid'>
                    <div className="aprender-card">
                        <img src={maliciousEmailImg} alt="Miniatura de video sobre phishing" />
                        <h3>Señales para Detectar un Email Falso</h3>
                        <p>Aprende a identificar remitentes sospechosos, errores gramaticales y tácticas de urgencia.</p>
                        <a href="https://www.youtube.com/watch?v=SROtt7oc9XQ">Ver Video</a>
                    </div>
                    <div className="aprender-card">
                        <img src={urlAnatomyImg} alt="Miniatura de guía sobre URLs" />
                        <h3>La Anatomia de una URL Maliciosa</h3>
                        <p>Desglosamos cómo los atacantes ocultan dominios falsos en los enlaces que pareecen legítimos.</p>
                        <a href="./public/pdf/url.pdf">Leer Guía</a>
                    </div>
                    <div className="aprender-card">
                        <img src={qrDangersImg} alt="Miniatura de artículo sobre QR seguros" />
                        <h3>Peligros Ocultos. ¿Es seguro ese código QR?</h3>
                        <p>Te enseñamos qué verificar antes de escanear un código QR en lugares públicos.</p>
                        <a href="./public/pdf/qr.pdf">Leer Artículo</a>
                    </div>
                    <div className="aprender-card">
                        <img src={contrasenasImg} alt="Contraseñas seguras" />
                        <h3>Cómo Crear Contraseñas Seguras</h3>
                        <p>Descubre métodos y herramientas para generar y gestionar contraseñas difíciles de vulnerar.</p>
                        <a href="./public/pdf/contrasena.pdf">Leer Artículo</a>
                    </div>
                    <div className="aprender-card">
                        <img src={wifiImg} alt="Red Wi-Fi segura" />
                        <h3>Protege tu Red Wi-Fi en Casa</h3>
                        <p>Sigue estos pasos esenciales para asegurar tu red doméstica contra intrusos no deseados.</p>
                        <a href="./public/pdf/wifi.pdf">Leer Guía</a>
                    </div>
                    <div className="aprender-card">
                        <img src={pfaImg} alt="Autenticación de dos factores" />
                        <h3>¿Qué es la Autenticación de Dos Factores (2FA)?</h3>
                        <p>Entiende por qué esta capa extra de seguridad es crucial para proteger tus cuentas online.</p>
                        <a href="https://www.youtube.com/watch?v=yQnXTQ_GYzg">Ver Video</a>
                    </div>
                    <div className="aprender-card">
                        <img src={extensionesImg} alt="Extensiones de navegador" />
                        <h3>Navegación Segura: Extensiones y Buenas Prácticas</h3>
                        <p>Mejora tu seguridad al navegar con estas herramientas y hábitos recomendados por expertos.</p>
                        <a href="./public/pdf/navegacion.pdf">Leer Artículo</a>
                    </div>
                    <div className="aprender-card">
                        <img src={softwareImg} alt="Software pirata" />
                        <h3>El Peligro del Software Pirata y las Descargas</h3>
                        <p>Conoce los riesgos del malware, ransomware y robo de datos al usar software no oficial.</p>
                        <a href="./public/pdf/software.pdf">Leer Guía</a>
                    </div>
                    <div className="aprender-card">
                        <img src={estafasImg} alt="Estafas en redes sociales" />
                        <h3>Estafas en Redes Sociales y WhatsApp</h3>
                        <p>Aprende a identificar las estafas más comunes que circulan en tus plataformas favoritas.</p>
                        <a href="./public/pdf/estafa.pdf">Leer Artículo</a>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default LearnGrid;