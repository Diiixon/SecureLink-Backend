import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
// Ajusta la ruta si tu componente está en otra carpeta (ej. 'components')
import ResultadoAnalisis from '../components/ResultadoAnalisis'; 

describe('Componente ResultadoAnalisis', () => {

  // Estado 1: Inicial (No hay props)
  it('no debería renderizar nada si isLoading es false y no hay resultado', () => {
    // Arrange
    // Desestructuramos 'container' del resultado de render
    const { container } = render(<ResultadoAnalisis isLoading={false} result={null} />);

    // Assert
    // .firstChild revisa si el div contenedor tiene algún elemento hijo.
    // Si el componente retorna 'null', no tendrá hijos.
    expect(container.firstChild).toBeNull();
  });

  // Estado 2: Cargando
  it('debería mostrar el spinner y el texto "Analizando..." cuando isLoading es true', () => {
    // Arrange
    render(<ResultadoAnalisis isLoading={true} result={null} />);

    // Assert
    // Buscamos el texto que debe aparecer
    expect(screen.getByText('Analizando...')).toBeInTheDocument();
    
    // Verificamos que NINGUNA tarjeta de resultado se muestre
    expect(screen.queryByText('Enlace Seguro')).not.toBeInTheDocument();
    expect(screen.queryByText('Sitio Sospechoso')).not.toBeInTheDocument();
  });

  // Estado 3: Resultado "Seguro"
  it('debería mostrar la tarjeta "Enlace Seguro" cuando isLoading es false y result es "seguros"', () => {
    // Arrange
    render(<ResultadoAnalisis isLoading={false} result="seguros" />);

    // Assert
    // Buscamos el título (por rol, es más accesible)
    expect(screen.getByRole('heading', { name: 'Enlace Seguro' })).toBeInTheDocument();
    // Buscamos el texto descriptivo
    expect(screen.getByText('No hemos encontrado ninguna amenaza. Puedes proceder con tranquilidad.')).toBeInTheDocument();
    
    // Verificamos que el texto de carga NO esté
    expect(screen.queryByText('Analizando...')).not.toBeInTheDocument();
  });

  // Estado 4: Resultado "Sospechoso"
  it('debería mostrar la tarjeta "Sitio Sospechoso" cuando isLoading es false y result es "sospechosos"', () => {
    // Arrange
    render(<ResultadoAnalisis isLoading={false} result="sospechosos" />);

    // Assert
    expect(screen.getByRole('heading', { name: 'Sitio Sospechoso' })).toBeInTheDocument();
    expect(screen.getByText('Este enlace presenta características inusuales. Te recomendamos no ingresar datos personales.')).toBeInTheDocument();
    expect(screen.queryByText('Analizando...')).not.toBeInTheDocument();
  });

  // Estado 5: Resultado "Fraudulento/Bloqueado"
  it('debería mostrar la tarjeta "Enlace Fraudulento" cuando isLoading es false y result es "bloqueadas"', () => {
    // Arrange
    render(<ResultadoAnalisis isLoading={false} result="bloqueadas" />);

    // Assert
    expect(screen.getByRole('heading', { name: 'Peligro: Enlace Fraudulento' })).toBeInTheDocument();
    expect(screen.getByText('Hemos detectado que este sitio es malicioso. Evita interactuar con él.')).toBeInTheDocument();
    expect(screen.queryByText('Analizando...')).not.toBeInTheDocument();
  });

});