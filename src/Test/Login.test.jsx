import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Login from '../components/Login';

// --- Mocks ---
const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal();
  return { ...original, useNavigate: () => mockNavigate };
});

vi.mock('../context/AuthContext', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useAuth: () => ({
            login: mockLogin,
        }),
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
const mockUserResponse = {
  user: {
    nombre: "Dixon Test",
    email: "test@test.com",
  },
};

describe('Componente Login', () => {
  beforeEach(() => {
    // Limpiamos todos los mocks antes de cada test
    mockNavigate.mockClear();
    mockLogin.mockClear();
    vi.spyOn(window, 'fetch').mockClear();
    // Simulamos window.alert para que no aparezca en la consola de tests
    vi.spyOn(window, 'alert').mockImplementation(() => {}); 
  });

  it('debería renderizar el formulario correctamente', () => {
    renderLogin();
    expect(screen.getByRole('heading', { name: /bienvenido/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ingresa tu email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  // ----- INICIO DE LA MODIFICACIÓN -----

  it('debería llamar a login y navigate con credenciales correctas', async () => {
    const user = userEvent.setup();
    // El fetch SIEMPRE debe ser exitoso para que la lógica de validación se ejecute
    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockUserResponse,
    });

    renderLogin();
    
    // Escribimos las credenciales correctas
    await user.type(screen.getByPlaceholderText(/ingresa tu email/i), 'test@test.com');
    await user.type(screen.getByPlaceholderText(/\*{14}/i), '123456'); // Usamos la contraseña correcta
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Verificamos que se llamó a fetch
    expect(window.fetch).toHaveBeenCalledWith("http://demo8589789.mockable.io/login");

    // Verificamos que se llamó a login y navigate
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(mockUserResponse.user);
      expect(mockNavigate).toHaveBeenCalledWith('/analizador');
    });
  });
  
  it('debería mostrar una alerta con contraseña incorrecta', async () => {
    const user = userEvent.setup();
    // El fetch también debe ser exitoso aquí
    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockUserResponse,
    });
    const alertSpy = vi.spyOn(window, 'alert');

    renderLogin();
    
    // Escribimos la contraseña INCORRECTA
    await user.type(screen.getByPlaceholderText(/ingresa tu email/i), 'test@test.com');
    await user.type(screen.getByPlaceholderText(/\*{14}/i), 'wrong-password');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Verificamos que se muestra la alerta correcta y que no se navega
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Usuario o contraseña incorrectos.');
      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('debería mostrar una alerta con email incorrecto', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockUserResponse,
    });
    const alertSpy = vi.spyOn(window, 'alert');

    renderLogin();
    
    await user.type(screen.getByPlaceholderText(/ingresa tu email/i), 'wrong@email.com');
    await user.type(screen.getByPlaceholderText(/\*{14}/i), '123456');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Usuario o contraseña incorrectos.');
      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});