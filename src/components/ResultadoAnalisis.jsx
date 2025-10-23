import '../style/Analizador.css';

function ResultadoAnalisis({ isLoading, result }) { 
  if (!isLoading && !result) { // Le dice al componente si el análisis está cargando o no, para no renderizar nada en pantalla si no es necesario
    return null;
  }

  return ( // Muestra el resultado del análisis
    <div id="resultado-analisis" style={{ display: 'block' }}>

      {isLoading && ( // Si está cargando, muestra un spinner y un mensaja de Analizando...
        <>
          <div className="spinner" style={{ display: 'block' }}></div>
          <p className="texto-analizando" style={{ display: 'block' }}>Analizando...</p>
        </>
      )}

      { /* El componente revisa cada posible resultado, siempre y cuando No esté cargando */ }
      {!isLoading && result === 'seguros' && ( // Muestra tarjeta Verde con mensaje de enlace seguro
        <div id="resultado-seguro" className="resultado-card" style={{ display: 'block' }}>
          <div className="resultado-icono icon-seguro">&#10003;</div>
          <h2>Enlace Seguro</h2>
          <p>No hemos encontrado ninguna amenaza. Puedes proceder con tranquilidad.</p>
        </div>
      )}

      {!isLoading && result === 'sospechosos' && ( // Muestra tarjeta Amarilla con mensaje de enlace sospechoso
        <div id="resultado-sospechoso" className="resultado-card" style={{ display: 'block' }}>
          <div className="resultado-icono icon-sospechoso">!</div>
          <h2>Sitio Sospechoso</h2>
          <p>Este enlace presenta características inusuales. Te recomendamos no ingresar datos personales.</p>
        </div>
      )}

      {!isLoading && result === 'bloqueadas' && ( // Muestra tarjeta Roja con mensaje de enlace bloqueado
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