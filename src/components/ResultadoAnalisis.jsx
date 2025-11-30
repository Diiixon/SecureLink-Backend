import '../style/Analizador.css';

/**
 * Componente para mostrar el resultado de un análisis de seguridad.
 * Recibe el estado de carga y el objeto de resultado como props.
 * @param {{ isLoading: boolean, result: Array|null }} props
 */
function ResultadoAnalisis({ isLoading, result }) { 
  // Si no está cargando y no hay resultado, no renderiza nada (estado inicial).
  if (!isLoading && !result) {
    return null;
  }

  /**
   * Renderiza una tarjeta de resultado individual basada en su nivel de peligro.
   * @param {object} item - El objeto de resultado para un solo enlace/análisis.
   * @returns {JSX.Element} La tarjeta de resultado con el estilo y mensaje adecuados.
   */
  const renderResultCard = (item) => {
    // Normaliza el campo 'peligro' a minúsculas para una comparación consistente.
    const peligro = item.peligro ? item.peligro.toLowerCase() : 'seguro';
    
    // --- Lógica de Clasificación y Renderizado ---

    // 1. Caso: El enlace es MALICIOSO/FRAUDULENTO.
    if (peligro === 'bloqueadas' || peligro === 'malicioso' || item.peligro === 'BLOQUEADAS') {
      return (
        <div key={item.linkReportado} id="resultado-fraudulento" className="resultado-card" style={{ display: 'block' }}>
          <div className="resultado-icono icon-fraudulento">&#10005;</div>
          <h2>Peligro: Enlace Fraudulento</h2>
          <p>URL: {item.linkReportado}</p>
          {item.imitaA && <p>Imita a: {item.imitaA}</p>}
          <p>Hemos detectado que este sitio es malicioso. Evita interactuar con él.</p>
        </div>
      );
    } 
    // 2. Caso: El enlace es SOSPECHOSO.
    else if (peligro === 'sospechosos' || peligro === 'sospechoso' || item.peligro === 'SOSPECHOSOS') {
      return (
        <div key={item.linkReportado} id="resultado-sospechoso" className="resultado-card" style={{ display: 'block' }}>
          <div className="resultado-icono icon-sospechoso">!</div>
          <h2>Sitio Sospechoso</h2>
          <p>URL: {item.linkReportado}</p>
          {item.imitaA && <p>Imita a: {item.imitaA}</p>}
          <p>Este enlace presenta características inusuales. Te recomendamos no ingresar datos personales.</p>
        </div>
      );
    } 
    // 3. Caso por defecto: El enlace es SEGURO.
    else {
      return (
        <div key={item.linkReportado} id="resultado-seguro" className="resultado-card" style={{ display: 'block' }}>
          <div className="resultado-icono icon-seguro">&#10003;</div>
          <h2>Enlace Seguro</h2>
          <p>URL: {item.linkReportado}</p>
          <p>No hemos encontrado ninguna amenaza. Puedes proceder con tranquilidad.</p>
        </div>
      );
    }
  };

  return (
    <div id="resultado-analisis" style={{ display: 'block' }}>
      {/* Muestra el spinner y el texto "Analizando..." si `isLoading` es verdadero. */}
      {isLoading && (
        <>
          <div className="spinner" style={{ display: 'block' }}></div>
          <p className="texto-analizando" style={{ display: 'block' }}>Analizando...</p>
        </>
      )}

      {/* Muestra los resultados solo si la carga ha terminado y hay un array de resultados con contenido. */}
      {!isLoading && Array.isArray(result) && result.length > 0 && (
        <div style={{ display: 'block' }}>
          {/* Itera sobre el array de resultados y renderiza una tarjeta para cada uno. */}
          {result.map((item) => renderResultCard(item))}
          
          {/* Pie de página de los resultados con información adicional y un descargo de responsabilidad. */}
          <div className="resultado-footer" style={{ display: 'block' }}>
            <p>Resultados revisados por <strong>VirusTotal</strong> y <strong>Google Safe Browsing</strong>.</p>
            <p className="nota-pequena">Estas comprobaciones ayudan a identificar URL maliciosas, pero no garantizan detección completa.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultadoAnalisis;