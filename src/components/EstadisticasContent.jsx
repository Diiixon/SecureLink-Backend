import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// Importaciones de Chart.js para crear gráficos.
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Registra los componentes necesarios de Chart.js para poder usarlos.
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// URL base de la API de estadísticas, obtenida desde variables de entorno.
const STATS_API = import.meta.env.VITE_Stats_URL || 'http://localhost:8082';

/**
 * Componente que muestra las estadísticas de seguridad, tanto globales como del usuario.
 * Utiliza gráficos para visualizar la distribución de reportes.
 */
function EstadisticasContent() {
    // Hook para acceder a los datos de autenticación (usuario actual, headers).
    const { currentUser, getAuthHeaders } = useAuth();
    
    // --- ESTADOS DEL COMPONENTE ---

    // Estado para las estadísticas globales de toda la plataforma.
    const [globalStats, setGlobalStats] = useState({ total: 0, seguros: 0, maliciosos: 0, sospechosos: 0 });
    // Estado para las estadísticas del usuario que ha iniciado sesión.
    const [userStats, setUserStats] = useState({ total: 0, seguros: 0, maliciosos: 0, sospechosos: 0 });
    
    // Estado para controlar la visualización del spinner de carga.
    const [loading, setLoading] = useState(true);
    // Estado para almacenar mensajes de error.
    const [errorMsg, setErrorMsg] = useState(null);

    /**
     * Procesa una lista de datos de la API y los clasifica en 'seguros', 'maliciosos' y 'sospechosos'.
     * Esta función unifica la lógica para que las estadísticas globales y de usuario se midan igual.
     * @param {Array} listaDatos - Array de objetos proveniente de la API, cada uno con 'estado' y 'cantidad'.
     * @returns {Object} Un objeto con el total y la distribución de `seguros`, `maliciosos`, y `sospechosos`.
     */
    const procesarDistribucion = (listaDatos) => {
        let seg = 0, mal = 0, sos = 0, tot = 0;
        
        if (Array.isArray(listaDatos)) {
            listaDatos.forEach(item => {
                const estadoRaw = (item.estado || '').toLowerCase().trim(); 
                const cantidad = Number(item.cantidad || 0);

                tot += cantidad;

                // Lógica de clasificación unificada:
                if (estadoRaw.includes('segur') || estadoRaw.includes('safe') || estadoRaw.includes('clean') || estadoRaw === 'ok' || estadoRaw.includes('ninguno')) {
                    seg += cantidad; // Verde
                } else if (estadoRaw.includes('malici') || estadoRaw.includes('malware') || estadoRaw.includes('phish') || estadoRaw.includes('bloq') || estadoRaw.includes('threat')) {
                    mal += cantidad; // Rojo
                } else {
                    sos += cantidad; // Amarillo (para todo lo demás: sospechoso, scam, desconocido, etc.)
                }
            });
        }
        return { total: tot, seguros: seg, maliciosos: mal, sospechosos: sos };
    };

    // Efecto que se ejecuta al montar el componente o cuando `currentUser` cambia.
    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);

            // Si no hay un usuario, no se pueden cargar sus datos.
            if (!currentUser) return;

            const headers = getAuthHeaders();
            
            try {
                // Se preparan las peticiones a la API.
                const promises = [
                    fetch(`${STATS_API}/api/stats/distribucion`, { headers }) // Petición para datos globales.
                ];

                // Si hay un ID de usuario, se añade la petición para sus datos específicos.
                if (currentUser.id) {
                    promises.push(fetch(`${STATS_API}/api/stats/usuario/${currentUser.id}/distribucion`, { headers }));
                }

                // Se ejecutan ambas peticiones en paralelo para mayor eficiencia.
                const responses = await Promise.all(promises);
                const globalRes = responses[0];
                const userRes = currentUser.id ? responses[1] : null;

                // 1. Procesar la respuesta de las estadísticas globales.
                if (globalRes.ok) {
                    const gDataList = await globalRes.json();
                    const statsCalculados = procesarDistribucion(gDataList);
                    setGlobalStats(statsCalculados);
                }

                // 2. Procesar la respuesta de las estadísticas del usuario.
                if (userRes && userRes.ok) {
                    const uDataList = await userRes.json();
                    const statsCalculados = procesarDistribucion(uDataList);
                    setUserStats(statsCalculados);
                }

            } catch (err) {
                console.error("Error de conexión:", err);
                setErrorMsg("No se pudo conectar con el servidor.");
            } finally {
                setLoading(false); // Se deja de cargar, tanto si hubo éxito como si hubo error.
            }
        };

        cargarDatos();
    }, [currentUser, getAuthHeaders]); // Dependencias del efecto.

    // --- RENDERIZADO CONDICIONAL ---
    if (loading) return <div className="dashboard-container" style={{textAlign: 'center', padding: '4rem', color: 'white'}}><h2 className="animate-pulse">Cargando datos...</h2></div>;
    if (errorMsg) return <div className="dashboard-container" style={{textAlign: 'center', padding: '2rem', color: '#ff6b6b'}}><h3>Error</h3><p>{errorMsg}</p></div>;

    // --- PREPARACIÓN DE DATOS PARA LOS GRÁFICOS ---

    // Datos para el gráfico de dona (estadísticas del usuario).
    const chartData = {
        labels: ['Seguros', 'Sospechosos', 'Bloqueadas'],
        datasets: [{
            data: [userStats.seguros, userStats.sospechosos, userStats.maliciosos],
            backgroundColor: ['rgba(52, 152, 219, 0.7)', 'rgba(238, 155, 0, 0.7)', 'rgba(174, 32, 18, 0.7)'],
            borderColor: ['#3498db', '#ee9b00', '#ae2012'],
            borderWidth: 1,
        }],
    };

    // Datos para el gráfico de barras comparativo (usuario vs. global).
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

    // Opciones comunes de estilo para los gráficos.
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
            {/* --- ENCABEZADO DEL DASHBOARD --- */}
            <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Tu Panorama de Seguridad</h1>

                <p style={{ marginTop: '5px', color: '#bdc3c7' }}>
                    Has aportado <strong style={{ color: '#3498db', fontSize: '1.2em' }}>{userStats.total}</strong> de <strong style={{ color: '#95a5a6' }}>{globalStats.total}</strong> reportes a la comunidad.
                </p>

                {/* Mensaje de advertencia si el ID del usuario no está disponible */}
                {!currentUser?.id && (
                    <div style={{backgroundColor: 'rgba(255, 200, 0, 0.2)', padding: '10px', borderRadius: '5px', marginTop: '15px', display: 'inline-block'}}>
                        <span style={{color: '#ffdd57', fontSize: '0.9rem'}}>⚠️ Recarga la página para actualizar tu sesión.</span>
                    </div>
                )}
            </div>

            {/* --- SECCIÓN DE GRÁFICOS --- */}
            <section className="dashboard-main-grid">
                <div className="chart-container card">
                    <h2>Tus Estadísticas (Distribución)</h2>
                    <div className="chart-wrapper">
                        {/* Muestra el gráfico de dona si el usuario tiene reportes, o un mensaje en caso contrario. */}
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
                        {/* Gráfico de barras que compara los datos del usuario con los globales. */}
                        <Bar data={comparativeChartData} options={commonOptions} />
                    </div>
                </div>
            </section>
        </>
    );
}

export default EstadisticasContent;