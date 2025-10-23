import '../style/Stats.css';

function Stats() {
    return ( // Renderiza la sección de estadísticas
        <section id="estadisticas" className="stats-section">
            <div className="section-header"> 
                <h2>El Pulso de la Seguridad Digital</h2>
                <p>Visualiza las tendencias actuales de amenazas y nuestra efectividad en proteger a la comunidad.</p>
            </div>
            <div className="stats-container"> {/* Contenedor de estadísticas */}
                <div className="stats-grid">
                    <div className="stats-card">
                        <h3>1.2M</h3>
                        <p>Enlaces Analizados Este Mes</p>
                    </div>
                    <div className="stats-card">
                        <h3>87.000+</h3>
                        <p>Amenazas Fraudulentas Bloqueadas</p>
                    </div>
                    <div className="stats-card">
                        <h3>99.8%</h3>
                        <p>Tasa de Detección Precisa</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Stats;