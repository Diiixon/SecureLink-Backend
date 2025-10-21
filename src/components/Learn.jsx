import '../style/Learn.css';
import React from "react";
import maliciousEmailImg from '../assets/Malicious_Emails.png';
import urlAnatomyImg from '../assets/anatomia url.png';
import qrDangersImg from '../assets/peligros ocultos.png';

function Learn() {
    return (
        <section id="aprende" className="learn-section">
            <div className="section-header">
                <h2>Conviértete en un Experto en Ciberseguridad</h2>
                <p>El conocimiento es tu mejor defensa. Aprende a identificar las señales de una estafa</p>
            </div>
            <div className="learn-grid">
                <div className="learn-card">
                    <img src={maliciousEmailImg} alt="Miniatura de video sobre phishing" />
                    <h3>Señales para Detectar un Email Falso</h3>
                    <p>Aprende a identificar remitentes sospechosos, errores gramaticales y tácticas de urgencia.</p>
                    <a href="https://www.youtube.com/watch?v=SROtt7oc9XQ">Ver Video</a>
                </div>
                <div className="learn-card">
                    <img src={urlAnatomyImg} alt="Miniatura de guía sobre URLs" />
                    <h3>La Anatomia de una URL Maliciosa</h3>
                    <p>Desglosamos cómo los atacantes ocultan dominios falsos en los enlaces que pareecen legítimos.</p>
                    <a href="../pdf/url.pdf">Leer Guía</a>
                </div>
                <div className="learn-card">
                    <img src={qrDangersImg} alt=" Miniatura de artículo sobre QR seguros" />
                    <h3>Peligros Ocultos. ¿Es seguro ese código QR?</h3>
                    <p>Te enseñamos qué verificar antes de escanear un código QR en lugares públicos.</p>
                    <a href="../pdf/qr.pdf">Leer Artículo</a>
                </div>
            </div>
        </section>
    )
}

export default Learn;

