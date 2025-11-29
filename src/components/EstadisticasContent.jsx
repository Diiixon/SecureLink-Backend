import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const STATS_API = 'http://localhost:8082';

function EstadisticasContent() {
    const { currentUser, getAuthHeaders } = useAuth();
    
    // Estados para datos
    const [globalStats, setGlobalStats] = useState({ total: 0, seguros: 0, maliciosos: 0, sospechosos: 0 });
    const [userStats, setUserStats] = useState({ total: 0, seguros: 0, maliciosos: 0, sospechosos: 0 });
    
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    // --- FUNCIÓN DE CLASIFICACIÓN COMÚN (Para que Global y User sean iguales) ---
    const procesarDistribucion = (listaDatos) => {
        let seg = 0, mal = 0, sos = 0, tot = 0;
        
        if (Array.isArray(listaDatos)) {
            listaDatos.forEach(item => {
                const estadoRaw = (item.estado || '').toLowerCase().trim(); 
                const cantidad = Number(item.cantidad || 0);

                tot += cantidad;

                // Lógica unificada de clasificación
                if (estadoRaw.includes('segur') || estadoRaw.includes('safe') || estadoRaw.includes('clean') || estadoRaw === 'ok' || estadoRaw.includes('ninguno')) {
                    seg += cantidad;
                } else if (estadoRaw.includes('malici') || estadoRaw.includes('malware') || estadoRaw.includes('phish') || estadoRaw.includes('bloq') || estadoRaw.includes('threat')) {
                    mal += cantidad;
                } else {
                    // Todo lo demás (SCAM, Suspicious, Unknown, etc.) va a AMARILLO
                    sos += cantidad;
                }
            });
        }
        return { total: tot, seguros: seg, maliciosos: mal, sospechosos: sos };
    };

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);

            if (!currentUser) return;

            const headers = getAuthHeaders();
            
            try {
                // --- CAMBIO CLAVE: Pedimos /distribucion TAMBIÉN para el global ---
                const promises = [
                    fetch(`${STATS_API}/api/stats/distribucion`, { headers }) 
                ];

                if (currentUser.id) {
                    promises.push(fetch(`${STATS_API}/api/stats/usuario/${currentUser.id}/distribucion`, { headers }));
                }

                const responses = await Promise.all(promises);
                const globalRes = responses[0];
                const userRes = currentUser.id ? responses[1] : null;

                // 1. Procesar Globales (Ahora usamos la lista detallada)
                if (globalRes.ok) {
                    const gDataList = await globalRes.json();
                    const statsCalculados = procesarDistribucion(gDataList);
                    setGlobalStats(statsCalculados);
                }

                // 2. Procesar Usuario
                if (userRes && userRes.ok) {
                    const uDataList = await userRes.json();
                    const statsCalculados = procesarDistribucion(uDataList);
                    setUserStats(statsCalculados);
                }

            } catch (err) {
                console.error("Error de conexión:", err);
                setErrorMsg("No se pudo conectar con el servidor.");
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [currentUser, getAuthHeaders]); 

    if (loading) return <div className="dashboard-container" style={{textAlign: 'center', padding: '4rem', color: 'white'}}><h2 className="animate-pulse">Cargando datos...</h2></div>;
    if (errorMsg) return <div className="dashboard-container" style={{textAlign: 'center', padding: '2rem', color: '#ff6b6b'}}><h3>Error</h3><p>{errorMsg}</p></div>;

    // --- GRÁFICOS ---
    const chartData = {
        labels: ['Seguros', 'Sospechosos', 'Bloqueadas'],
        datasets: [{
            data: [userStats.seguros, userStats.sospechosos, userStats.maliciosos],
            backgroundColor: ['rgba(52, 152, 219, 0.7)', 'rgba(238, 155, 0, 0.7)', 'rgba(174, 32, 18, 0.7)'],
            borderColor: ['#3498db', '#ee9b00', '#ae2012'],
            borderWidth: 1,
        }],
    };

    const comparativeChartData = {
        labels: ['Seguros', 'Sospechosos', 'Bloqueadas'],
        datasets: [
            {
                label: 'Mis Reportes',
                data: [userStats.seguros, userStats.sospechosos, userStats.maliciosos],
                backgroundColor: ['rgba(52, 152, 219, 0.7)', 'rgba(238, 155, 0, 0.7)', 'rgba(174, 32, 18, 0.7)'],
                borderWidth: 1
            },
            {
                label: 'Globales',
                data: [globalStats.seguros, globalStats.sospechosos, globalStats.maliciosos],
                backgroundColor: ['rgba(52, 152, 219, 0.3)', 'rgba(238, 155, 0, 0.3)', 'rgba(174, 32, 18, 0.3)'],
                borderWidth: 1,
                barPercentage: 0.9, categoryPercentage: 0.9
            },
        ],
    };

    const commonOptions = {
        maintainAspectRatio: false,
        plugins: { 
            legend: { labels: { color: 'white', font: { size: 14 } } }
        },
        scales: { 
            x: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }, 
            y: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } } 
        }
    };

    return (
        <>
            <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Tu Panorama de Seguridad</h1>

                <p style={{ marginTop: '5px', color: '#bdc3c7' }}>
                    Has aportado <strong style={{ color: '#3498db', fontSize: '1.2em' }}>{userStats.total}</strong> de <strong style={{ color: '#95a5a6' }}>{globalStats.total}</strong> reportes a la comunidad.
                </p>

                {!currentUser?.id && (
                    <div style={{backgroundColor: 'rgba(255, 200, 0, 0.2)', padding: '10px', borderRadius: '5px', marginTop: '15px', display: 'inline-block'}}>
                        <span style={{color: '#ffdd57', fontSize: '0.9rem'}}>⚠️ Recarga la página para actualizar tu sesión.</span>
                    </div>
                )}
            </div>

            <section className="dashboard-main-grid">
                <div className="chart-container card">
                    <h2>Tus Estadísticas (Distribución)</h2>
                    <div className="chart-wrapper">
                        {currentUser?.id && userStats.total > 0 ? (
                             <Doughnut data={chartData} options={{maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' } } }}} />
                        ) : (
                            <div style={{display:'flex', height:'100%', alignItems:'center', justifyContent:'center', flexDirection:'column', color:'#aaa'}}>
                                <p>{currentUser?.id ? "Aún no tienes reportes." : "Error de sesión"}</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="chart-container card">
                    <h2>Comparativa: Tú vs Global</h2>
                    <div className="chart-wrapper">
                        <Bar data={comparativeChartData} options={commonOptions} />
                    </div>
                </div>
            </section>
        </>
    );
}

export default EstadisticasContent;