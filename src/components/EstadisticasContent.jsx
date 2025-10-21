import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

//Biblioteca ChartJS para graficos
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function EstadisticasContent() {
    //Obtiene el usuario actual del contexto de autenticacion para obtener sus estadisticas personales
    const { currentUser } = useAuth();
    const [globalStats, setGlobalStats] = useState(null);

    //Carga las estadisticas globales simuladas desde el almacenamiento local al montar el componente o cuando cambia el usuario actual
    useEffect(() => {
        const stats = JSON.parse(localStorage.getItem('globalStats')) || { totalReports: 0, seguros: 0, sospechosos: 0, bloqueadas: 0 };
        setGlobalStats(stats);
    }, [currentUser]);

    // Si los datos no estan disponibles, muestra un mensaje de carga
    if (!currentUser || !globalStats) {
        return <main className="dashboard-container">Cargando estadísticas...</main>;
    }

    // Preparacion de datos para mostrar en las estadisticas
    const getMostCommonThreat = () => {  };
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


    //Grafico de dona
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

    //Grafico de barras
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

    return (
        <>
            <div className="dashboard-header">
                <h1>Tu Panorama de Seguridad</h1>
                <p>Datos actualizados en tiempo real</p>
            </div>

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