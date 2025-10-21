import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function EstadisticasContent() {
    const { currentUser } = useAuth();
    const [globalStats, setGlobalStats] = useState(null);

    useEffect(() => {
        const stats = JSON.parse(localStorage.getItem('globalStats')) || { totalReports: 0, seguros: 0, sospechosos: 0, bloqueadas: 0 };
        setGlobalStats(stats);
    }, [currentUser]);

    if (!currentUser || !globalStats) {
        return <main className="dashboard-container">Cargando estadísticas...</main>;
    }

    const getMostCommonThreat = () => { /* ... tu lógica ... */ };
    const mostCommonThreat = getMostCommonThreat();
    const totalReports = currentUser.reportsCount || 0;
    const safeReports = currentUser.stats?.seguros || 0;
    const safePercentage = totalReports > 0 ? ((safeReports / totalReports) * 100).toFixed(1) : '100';

    // Datos para el gráfico de dona con el color azul
    const chartData = {
        labels: ['Seguros', 'Sospechosos', 'Bloqueadas'],
        datasets: [{
            data: [currentUser.stats?.seguros || 0, currentUser.stats?.sospechosos || 0, currentUser.stats?.bloqueadas || 0],
            backgroundColor: ['rgba(52, 152, 219, 0.7)', 'rgba(238, 155, 0, 0.7)', 'rgba(174, 32, 18, 0.7)'],
            borderColor: ['#3498db', '#ee9b00', '#ae2012'],
            borderWidth: 1,
        }],
    };

    // Datos para el gráfico de barras con el color azul
    const comparativeChartData = {
        labels: ['Seguros', 'Sospechosos', 'Bloqueadas'],
        datasets: [
            {
                label: 'Tus Reportes',
                data: [currentUser.stats?.seguros || 0, currentUser.stats?.sospechosos || 0, currentUser.stats?.bloqueadas || 0],
                backgroundColor: ['rgba(52, 152, 219, 0.7)', 'rgba(238, 155, 0, 0.7)', 'rgba(174, 32, 18, 0.7)'],
            },
            {
                label: 'Reportes Globales (Simulado)',
                data: [globalStats.seguros, globalStats.sospechosos, globalStats.bloqueadas],
                backgroundColor: ['rgba(52, 152, 219, 0.5)', 'rgba(238, 155, 0, 0.5)', 'rgba(174, 32, 18, 0.5)'],
            },
        ],
    };

    // --- INICIO DE LA CORRECCIÓN ---
    // Restauramos la definición completa de las opciones para el texto blanco

    const doughnutOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white',
                    font: { size: 14 }
                }
            }
        }
    };

    const barOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white',
                    font: { size: 14 }
                }
            }
        },
        scales: {
            x: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            y: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        }
    };
    // --- FIN DE LA CORRECCIÓN ---

    return (
        <>
            <div className="dashboard-header">
                <h1>Tu Panorama de Seguridad</h1>
                <p>Datos actualizados en tiempo real</p>
            </div>

            <section className="kpi-grid">
                {/* ... tus tarjetas KPI ... */}
            </section>

            <section className="dashboard-main-grid">
                <div className="chart-container card">
                    <h2>Tus Tipos de Amenazas</h2>
                    <div className="chart-wrapper">
                        <Doughnut data={chartData} options={doughnutOptions} />
                    </div>
                </div>
                
                <div className="chart-container card">
                    <h2>Comparativa Global</h2>
                    <div className="chart-wrapper">
                        <Bar data={comparativeChartData} options={barOptions} />
                    </div>
                </div>
            </section>
        </>
    );
}

export default EstadisticasContent;