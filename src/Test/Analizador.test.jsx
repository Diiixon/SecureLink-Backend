import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthContext } from '../context/AuthContext';
import Analizador from '../components/Analizador';

// --- Mocks y Configuración ---
const mockLogin = vi.fn();
const mockUser = {
  email: 'test@test.com',
  reportsCount: 0,
  stats: { seguros: 0, sospechosos: 0, bloqueadas: 0 },
  history: [],
};

const renderAnalizador = () => {
  render(
    <AuthContext.Provider value={{ currentUser: mockUser, login: mockLogin }}>
      <Analizador />
    </AuthContext.Provider>
  );
};

// Mock de LocalStorage
let store = {};
const localStorageMock = {
  getItem: vi.fn((key) => store[key] || null),
  setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
  clear: vi.fn(() => { store = {}; }),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });


describe('Componente Analizador', () => {

  beforeEach(() => {
    mockLogin.mockClear();
    localStorageMock.clear();
    localStorageMock.setItem('users', JSON.stringify([mockUser]));
  });

  it('debería renderizar el contenido inicial correctamente', () => {
    renderAnalizador();
    expect(screen.getByRole('heading', { name: /analiza cualquier enlace sospechoso/i })).toBeInTheDocument();
  });

  it('debería permitir al usuario escribir en el textarea', async () => {
    const user = userEvent.setup();
    renderAnalizador();
    const textarea = screen.getByPlaceholderText(/ingresa o pega aquí/i);
    await user.type(textarea, 'http://ejemplo.com');
    expect(textarea.value).toBe('http://ejemplo.com');
  });

  it('debería mostrar la animación de carga y luego el resultado al analizar', async () => {
    // Forzamos a Math.random() para que siempre devuelva 0.
    // Esto hará que el resultado del análisis siempre sea 'seguros'.
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0);
    // -------------------

    const user = userEvent.setup();
    renderAnalizador();

    // 1. Usuario interactúa
    await user.type(screen.getByPlaceholderText(/ingresa o pega aquí/i), 'http://ejemplo-seguro.com');
    await user.click(screen.getByRole('button', { name: /analizar ahora/i }));

    // 2. Verifica la carga
    expect(screen.getByRole('button', { name: /analizando.../i })).toBeDisabled();

    // 3. Espera el resultado en pantalla (ahora siempre será 'Enlace Seguro')
    const resultado = await screen.findByText(/Enlace Seguro/i, {}, { timeout: 3000 });
    expect(resultado).toBeInTheDocument();

    // Restauramos la función original de Math.random() para no afectar otros tests.
    spy.mockRestore();
    // -------------------------
});
});