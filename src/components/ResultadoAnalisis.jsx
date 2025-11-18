import '../style/Analizador.css';

function ResultadoAnalisis({ isLoading, result }) { 
  if (!isLoading && !result) {
    return null;
  }

  const renderResultCard = (item) => {
    // Determina el color y mensaje basado en el campo 'peligro'
    const peligro = item.peligro ? item.peligro.toLowerCase() : 'seguro';
    
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
    } else if (peligro === 'sospechosos' || peligro === 'sospechoso' || item.peligro === 'SOSPECHOSOS') {
      return (
        <div key={item.linkReportado} id="resultado-sospechoso" className="resultado-card" style={{ display: 'block' }}>
          <div className="resultado-icono icon-sospechoso">!</div>
          <h2>Sitio Sospechoso</h2>
          <p>URL: {item.linkReportado}</p>
          {item.imitaA && <p>Imita a: {item.imitaA}</p>}
          <p>Este enlace presenta características inusuales. Te recomendamos no ingresar datos personales.</p>
        </div>
      );
    } else {
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
      {isLoading && (
        <>
          <div className="spinner" style={{ display: 'block' }}></div>
          <p className="texto-analizando" style={{ display: 'block' }}>Analizando...</p>
        </>
      )}

      {!isLoading && Array.isArray(result) && result.length > 0 && (
        <div style={{ display: 'block' }}>
          {result.map((item) => renderResultCard(item))}
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