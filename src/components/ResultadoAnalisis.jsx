import React from 'react';
import '../style/Analizador.css';

// 1. El componente ahora recibe 'isLoading' y 'result' como props
function ResultadoAnalisis({ isLoading, result }) {
  // Si no estamos cargando y no hay resultado, no mostramos nada
  if (!isLoading && !result) {
    return null;
  }

  return (
    // 2. Usamos className en lugar de class
    <div id="resultado-analisis" style={{ display: 'block' }}>

      {/* 3. Mostramos la animación SOLO si isLoading es true */}
      {isLoading && (
        <>
          <div className="spinner" style={{ display: 'block' }}></div>
          <p className="texto-analizando" style={{ display: 'block' }}>Analizando...</p>
        </>
      )}

      {/* 4. Mostramos la tarjeta de resultado correspondiente SOLO si no estamos cargando */}
      {!isLoading && result === 'seguros' && (
        <div id="resultado-seguro" className="resultado-card" style={{ display: 'block' }}>
          <div className="resultado-icono icon-seguro">&#10003;</div>
          <h2>Enlace Seguro</h2>
          <p>No hemos encontrado ninguna amenaza. Puedes proceder con tranquilidad.</p>
        </div>
      )}

      {!isLoading && result === 'sospechosos' && (
        <div id="resultado-sospechoso" className="resultado-card" style={{ display: 'block' }}>
          <div className="resultado-icono icon-sospechoso">!</div>
          <h2>Sitio Sospechoso</h2>
          <p>Este enlace presenta características inusuales. Te recomendamos no ingresar datos personales.</p>
        </div>
      )}

      {!isLoading && result === 'bloqueadas' && (
        <div id="resultado-fraudulento" className="resultado-card" style={{ display: 'block' }}>
          <div className="resultado-icono icon-fraudulento">&#10005;</div>
          <h2>Peligro: Enlace Fraudulento</h2>
          <p>Hemos detectado que este sitio es malicioso. Evita interactuar con él.</p>
        </div>
      )}
    </div>
  );
}

export default ResultadoAnalisis;