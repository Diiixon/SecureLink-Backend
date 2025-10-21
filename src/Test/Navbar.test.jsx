import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';







// --- Mocks ---

// 1. Importa 'animateScroll' (que será el mock)
import { animateScroll } from 'react-scroll'; // <-- CAMBIO 1

// 2. Mock de 'react-scroll'
// La variable 'mockScrollToTop' ya NO se define aquí afuera
vi.mock('react-scroll', () => ({
  // Mockeamos 'Link' (ScrollLink) para que sea un <a> simple
  Link: (props) => <a {...props}>{props.children}</a>,
  
  // Mockeamos 'animateScroll' y creamos el mock 'scrollToTop' AQUÍ DENTRO
  animateScroll: {
    scrollToTop: vi.fn(), // <-- CAMBIO 2
  },
}));

// 3. Mock para la función logout que vendrá del contexto
const mockLogout = vi.fn();

// --- Helper de Renderizado ---
const renderNavbar = (isLoggedIn, route = '/') => {
  render(
    <AuthContext.Provider value={{ isLoggedIn, logout: mockLogout }}>
      <MemoryRouter initialEntries={[route]}>
        <Navbar />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

// --- Tests ---

describe('Componente Navbar', () => {

  beforeEach(() => {
    mockLogout.mockClear();
    // Limpiamos el mock importado, no la variable
    animateScroll.scrollToTop.mockClear(); // <-- CAMBIO 3
  });

  // ... (Las pruebas de Usuario No Autenticado no cambian) ...
  describe('Usuario No Autenticado (Guest)', () => {
    
    it('debería mostrar "Iniciar Sesión" y no "Cerrar Sesión"', () => {
      renderNavbar(false); 
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
      expect(screen.getByText('Iniciar Sesión').closest('a')).toHaveAttribute('href', '/login');
      expect(screen.queryByText('Cerrar Sesión')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Icono de Perfil')).not.toBeInTheDocument();
    });

    it('debería apuntar "Analizador" a /login', () => {
      renderNavbar(false);
      expect(screen.getByText('Analizador').closest('a')).toHaveAttribute('href', '/login');
    });

    it('debería renderizar ScrollLinks si está en la página principal ("/")', () => {
      renderNavbar(false, '/'); 
      const estadisticasLink = screen.getByText('Estadísticas');
      expect(estadisticasLink.closest('a')).not.toHaveAttribute('href', '/#estadisticas');
      expect(estadisticasLink).toHaveStyle({ cursor: 'pointer' });
    });

    it('debería renderizar Links normales si NO está en la página principal', () => {
      renderNavbar(false, '/login'); 
      expect(screen.getByText('Estadísticas').closest('a')).toHaveAttribute('href', '/#estadisticas');
      expect(screen.getByText('Aprende').closest('a')).toHaveAttribute('href', '/#aprende');
    });
  });

  // ... (Las pruebas de Usuario Autenticado no cambian, excepto la de logout) ...
  describe('Usuario Autenticado (Logged In)', () => {

    it('debería mostrar "Cerrar Sesión" y el ícono de perfil', () => {
      renderNavbar(true); 
      expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
      expect(screen.getByAltText('Icono de Perfil')).toBeInTheDocument();
      expect(screen.getByAltText('Icono de Perfil').closest('a')).toHaveAttribute('href', '/perfil');
      expect(screen.queryByText('Iniciar Sesión')).not.toBeInTheDocument();
    });

    it('debería apuntar los links a las rutas protegidas', () => {
      renderNavbar(true);
      expect(screen.getByText('Analizador').closest('a')).toHaveAttribute('href', '/analizador');
      expect(screen.getByText('Estadísticas').closest('a')).toHaveAttribute('href', '/estadisticas');
      expect(screen.getByText('Aprende').closest('a')).toHaveAttribute('href', '/aprende');
    });

    it('debería llamar a la función logout al hacer clic en "Cerrar Sesión"', () => {
      renderNavbar(true);
      const logoutButton = screen.getByText('Cerrar Sesión');
      fireEvent.click(logoutButton);
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  // --- Pruebas de Interacción General ---
  it('debería llamar a scrollToTop al hacer clic en el logo', () => {
    // Arrange
    renderNavbar(false); 
    const logoLink = screen.getByAltText('Logo de SecureLink');

    // Act
    fireEvent.click(logoLink);

    // Assert
    // Comprobamos el mock importado, no la variable
    expect(animateScroll.scrollToTop).toHaveBeenCalledTimes(1); // <-- CAMBIO 4
  });
});