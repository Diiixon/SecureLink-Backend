import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EstadisticasContent from '../components/EstadisticasContent';
import '../style/Estadisticas.css';

function EstadisticasPage() {
  return (
    <div className="estadisticas-page-wrapper">
      <Navbar />
      <main className="dashboard-container">
        <EstadisticasContent />
      </main>
      <Footer />
    </div>
  );
}

export default EstadisticasPage;