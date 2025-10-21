import { Link, useLocation } from 'react-router-dom';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import { useAuth } from '../context/AuthContext'; // 1. Importa el hook de autenticación
import logo from '../assets/SecureLink logo.png';
import profileIcon from '../assets/UsuarioIcon.png';
import '../style/Navbar.css'; // Asegúrate que la ruta sea correcta (ej. '../style/Navbar.css')

// 2. El componente ya NO recibe props
function Navbar() {
  const { isLoggedIn, logout } = useAuth(); // 3. Obtén el estado y las funciones del contexto
  const location = useLocation();
  const enPaginaPrincipal = location.pathname === '/';

  const irArriba = () => {
    scroll.scrollToTop();
  };

  return (
    <header className='main-header'>
      <nav className='main-nav navbar navbar-expand-lg'>
        <div className='container-fluid'>
          <div className='nav-logo'>
            <Link className='navbar-brand' to="/" onClick={irArriba}>
              <img src={logo} alt="Logo de SecureLink" className='logo-img' />
            </Link>
          </div>
          <button className='navbar-toggler' type='button' data-bs-toggle='collapse'
            data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent'
            aria-expanded='false' aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav mx-auto mb-2 mb-lg-0 nav-links'>
              <li className='nav-item'>
                {/* 4. Usa isLoggedIn del contexto en lugar de isAuthenticated */}
                {isLoggedIn ? (
                  <Link className='nav-link' to="/analizador">Analizador</Link>
                ) : (
                  <Link className='nav-link' to="/login">Analizador</Link>
                )}
              </li>
              <li className='nav-item'>
                {isLoggedIn ? (
                  <Link className='nav-link' to="/estadisticas">Estadísticas</Link>
                ) : enPaginaPrincipal ? (
                  <ScrollLink className='nav-link' to="estadisticas" smooth={true} duration={500} offset={-80} style={{ cursor: 'pointer' }}>
                    Estadísticas
                  </ScrollLink>
                ) : (
                  <Link className='nav-link' to="/#estadisticas">Estadísticas</Link>
                )}
              </li>
              <li className='nav-item'>
                {isLoggedIn ? (
                  <Link className='nav-link' to="/aprende">Aprende</Link>
                ) : enPaginaPrincipal ? (
                  <ScrollLink className='nav-link' to="aprende" smooth={true} duration={500} offset={-80} style={{ cursor: 'pointer' }}>
                    Aprende
                  </ScrollLink>
                ) : (
                  <Link className='nav-link' to="/#aprende">Aprende</Link>
                )}
              </li>
            </ul>
            <div className='nav-right-actions'>
              {isLoggedIn ? (
                <>
                  <div className="navbar-user-action">
                    <Link to="/perfil" className="nav-profile-link">
                      <img src={profileIcon} alt="Icono de Perfil" className="profile-icon" />
                    </Link>
                  </div>
                  <div className="nav-action">
                    {/* 5. Al hacer clic, llama a la función logout del contexto */}
                    <Link to="/" className="btn-login" onClick={logout}>Cerrar Sesión</Link>
                  </div>
                </>
              ) : (
                <div className='nav-action'>
                  <Link to="/login" className='btn-login'>Iniciar Sesión</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;