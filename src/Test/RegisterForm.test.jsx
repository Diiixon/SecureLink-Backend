import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

// --- Mocks ---
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal();
  return { ...original, useNavigate: () => mockNavigate };
});

vi.mock('../components/SuccessModal', () => ({
  default: ({ isVisible, onClose }) => {
    if (!isVisible) return null;
    return (
      <div>
        <span>Modal de Éxito</span>
        <button onClick={onClose}>OK</button>
      </div>
    );
  },
}));

const renderRegisterForm = () => {
  render(<MemoryRouter><RegisterForm /></MemoryRouter>);
};

describe('Componente RegisterForm', () => {

  beforeEach(() => {
    mockNavigate.mockClear();
    vi.spyOn(window, 'fetch').mockClear();
  });

  it('debería renderizar el formulario correctamente', () => {
    renderRegisterForm();
    expect(screen.getByRole('heading', { name: /crea tu cuenta/i })).toBeInTheDocument();
  });

  // --- CORRECCIÓN EN ESTA PRUEBA ---
  it('debería mostrar un mensaje de error si las contraseñas no coinciden', async () => {
    const user = userEvent.setup();
    renderRegisterForm();

    // Llenamos TODOS los campos requeridos para pasar la validación del navegador
    await user.type(screen.getByLabelText(/nombre de usuario/i), 'test_user');
    await user.type(screen.getByLabelText(/correo electrónico/i), 'test@test.com');
    // ... pero con contraseñas diferentes
    await user.type(screen.getByLabelText('Contraseña'), 'password123');
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'password456');
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));
    
    // Ahora sí encontrará el mensaje de error
    const errorMessage = await screen.findByText('Las contraseñas no coinciden.');
    expect(errorMessage).toBeInTheDocument();
    expect(window.fetch).not.toHaveBeenCalled();
  });

  it('debería llamar a fetch y mostrar el modal de éxito al registrarse correctamente', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Registro exitoso' }),
    });
    
    renderRegisterForm();

    await user.type(screen.getByLabelText(/nombre de usuario/i), 'nuevo_usuario');
    await user.type(screen.getByLabelText(/correo electrónico/i), 'nuevo@test.com');
    await user.type(screen.getByLabelText('Contraseña'), 'password123');
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'password123');
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

    const modalText = await screen.findByText('Modal de Éxito');
    expect(modalText).toBeInTheDocument();
  });

  it('debería navegar al login al cerrar el modal de éxito', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Registro exitoso' }),
    });
    
    renderRegisterForm();

    await user.type(screen.getByLabelText(/nombre de usuario/i), 'nuevo_usuario');
    await user.type(screen.getByLabelText(/correo electrónico/i), 'nuevo@test.com');
    await user.type(screen.getByLabelText('Contraseña'), 'password123');
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'password123');
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

    const okButton = await screen.findByRole('button', { name: 'OK' });
    await user.click(okButton);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});