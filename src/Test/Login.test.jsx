import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Login from '../components/Login';

// --- Mocks ---
const mockNavigate = vi.fn();
const mockLogin = vi.fn();

// Mock del componente del modal para que no interfiera con los tests
vi.mock('../components/MensajeCorreoNoRegistrado', () => ({
  default: ({ isVisible, onClose }) => {
    if (!isVisible) return null;
    return (
      <div data-testid="error-modal">
        <h2>Error de Inicio de Sesión</h2>
        <p>El correo o la contraseña son incorrectos.</p>
        <button onClick={onClose}>OK</button>
      </div>
    );
  },
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal();
  return { ...original, useNavigate: () => mockNavigate };
});

vi.mock('../context/AuthContext', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useAuth: () => ({ login: mockLogin }),
    };
});

// Helper para renderizar
const renderLogin = () => {
  render(
    <AuthContext.Provider value={{ login: mockLogin }}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

// Objeto de usuario simulado que devolverá nuestro fetch
// AHORA INCLUYE LA CONTRASEÑA, IGUAL QUE TU MOCKABLE
const mockUserResponse = {
  user: {
    nombre: "Dixon Test",
    email: "test@test.com",
    password: "123456",
  },
};

describe('Componente Login', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Limpia todos los mocks antes de cada test
  });

  it('debería renderizar el formulario y no mostrar el modal de error inicialmente', () => {
    renderLogin();
    expect(screen.getByRole('heading', { name: /bienvenido/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ingresa tu email/i)).toBeInTheDocument();
    // Verifica que el modal NO está visible al inicio
    expect(screen.queryByTestId('error-modal')).not.toBeInTheDocument();
  });

  it('debería llamar a login y navigate con credenciales correctas', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockUserResponse,
    });

    renderLogin();
    
    await user.type(screen.getByPlaceholderText(/ingresa tu email/i), 'test@test.com');
    await user.type(screen.getByPlaceholderText(/\*{14}/i), '123456');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Verificamos que se llamó a fetch con la URL HTTPS correcta
    expect(window.fetch).toHaveBeenCalledWith("https://demo8589789.mockable.io/login");

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(mockUserResponse.user);
      expect(mockNavigate).toHaveBeenCalledWith('/analizador');
    });
  });
  
  it('debería mostrar el modal de error con credenciales incorrectas', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockUserResponse,
    });

    renderLogin();
    
    await user.type(screen.getByPlaceholderText(/ingresa tu email/i), 'test@test.com');
    await user.type(screen.getByPlaceholderText(/\*{14}/i), 'wrong-password'); // Contraseña incorrecta
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Verificamos que el modal de error AHORA es visible
    const modalTitle = await screen.findByText('Error de Inicio de Sesión');
    expect(modalTitle).toBeInTheDocument();
    
    // Verificamos que no se intentó iniciar sesión ni navegar
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});