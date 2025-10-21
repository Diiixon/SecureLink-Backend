import '../style/Footer.css';
//componente que muestra el footer de la pagina con enlaces a terminos y privacidad

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>&copy; 2025 SecureLink. Todos los derechos reservados.</p>
        <div className="footer-links">
          <a href="../public/pdf/Terminos.pdf">Términos de Servicio</a>
          <a href="../public/pdf/Privacidad.pdf">Política de Privacidad</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer;