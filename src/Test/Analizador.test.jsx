// src/Test/Analizador.test.jsx

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

  it('debería mostrar un mensaje de error si se intenta analizar sin texto', async () => {
    const user = userEvent.setup();
    renderAnalizador();
    await user.click(screen.getByRole('button', { name: /analizar ahora/i }));
    expect(await screen.findByText(/Por favor, ingresa un enlace/i)).toBeInTheDocument();
  });

  //  Prueba principal para la animación de carga y resultado
  it('debería mostrar la animación de carga y luego el resultado al analizar', async () => {
    const user = userEvent.setup();
    renderAnalizador();

    //usuario interactúa con la página
    await user.type(screen.getByPlaceholderText(/ingresa o pega aquí/i), 'http://ejemplo-malicioso.com');
    await user.click(screen.getByRole('button', { name: /analizar ahora/i }));

    //Verificamos que el estado de carga aparece inmediatamente
    expect(screen.getByRole('button', { name: /analizando.../i })).toBeDisabled();

    //ESPERAMOS a que la tarjeta de resultado aparezca.
    // 'findBy' esperará automáticamente a que el setTimeout de 2 segundos termine.
    const resultado = await screen.findByText(/enlace seguro|sitio sospechoso|peligro/i, {}, { timeout: 3000 });

    //Una vez que el resultado está en pantalla, verificamos el estado final
    expect(resultado).toBeInTheDocument();
    
    //Usamos waitFor para esperar a que los efectos secundarios (actualización de estado) se completen
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledOnce();
    });
  });
});