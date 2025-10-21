import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ResultadoAnalisis from './ResultadoAnalisis';
import '../style/Analizador.css';

function Analizador() {
  const { currentUser, login } = useAuth();
  const [textToAnalyze, setTextToAnalyze] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // Estados para el archivo
  const [selectedFileName, setSelectedFileName] = useState('Ningún archivo seleccionado');
  const [fileContent, setFileContent] = useState('');

  // 1. Nuevo estado para el error
  const [error, setError] = useState('');

  // 2. Modificamos esta función para que lea el archivo Y LIMPIE EL ERROR
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      if (error) setError(''); // Limpia el error si se selecciona un archivo
      const file = event.target.files[0];
      setSelectedFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.readAsText(file);

    } else {
      setSelectedFileName('Ningún archivo seleccionado');
      setFileContent('');
    }
  };

  // 3. Modificamos esta función para que use setError en lugar de alert
  const handleAnalizar = () => {
    const textToProcess = textToAnalyze.trim() || fileContent.trim();

    if (!textToProcess) {
      // Reemplazamos el alert por setError
      setError("Por favor, ingresa un enlace o selecciona un archivo para analizar.");
      return;
    }

    setError(''); // Limpiamos el error si la validación pasa
    setIsLoading(true);
    setAnalysisResult(null);

    setTimeout(() => {
      const resultados = ['seguros', 'sospechosos', 'bloqueadas'];
      const randomKey = resultados[Math.floor(Math.random() * resultados.length)];
      
      let peligro = 'N/A';
      if (randomKey === 'seguros') peligro = 'Ninguno';
      else if (randomKey === 'sospechosos') peligro = 'Scam';
      else if (randomKey === 'bloqueadas') peligro = 'Phishing';

      const newReport = {
        status: randomKey === 'bloqueadas' ? 'danger' : randomKey === 'sospechosos' ? 'warning' : 'safe',
        link: textToProcess,
        peligro: peligro,
        fecha: new Date().toISOString(),
        imita: 'Sitio Desconocido'
      };
      
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex(user => user.email === currentUser.email);

      if (userIndex !== -1) {
        const updatedUser = JSON.parse(JSON.stringify(users[userIndex]));
        updatedUser.reportsCount += 1;
        updatedUser.stats[randomKey] += 1;
        updatedUser.history.unshift(newReport);
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
        login(updatedUser);

        const globalStats = JSON.parse(localStorage.getItem('globalStats')) || { totalReports: 0, seguros: 0, sospechosos: 0, bloqueadas: 0 };
        globalStats.totalReports += 1;
        globalStats[randomKey] += 1;
        localStorage.setItem('globalStats', JSON.stringify(globalStats));
      }

      setIsLoading(false);
      setAnalysisResult(randomKey);
      
      setTextToAnalyze('');
      setFileContent('');
      setSelectedFileName('Ningún archivo seleccionado');
      document.getElementById('subir-archivo').value = '';

    }, 2000);
  };

  return (
    <main>
      <h1>Analiza cualquier enlace sospechoso</h1>
      <p>Pega cualquier enlace, mensaje o sube un archivo. Analizamos su seguridad en segundos.</p>
      <div className="caja-analizador">
        <textarea 
          id="texto-analizar" 
          placeholder="Ingresa o Pega Aquí el mensaje o link..."
          value={textToAnalyze}
          // 4. Modificamos el onChange para limpiar el error al escribir
          onChange={(e) => {
            setTextToAnalyze(e.target.value);
            if (error) setError('');
          }}
        />
        
        {/* 5. Mostramos el error aquí si existe */}
        {error && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}

        <div className="analizador-acciones">
          <div className="grupo-subir-archivo">
            <input 
              type="file" 
              id="subir-archivo" 
              className="input-archivo-oculto" 
              accept=".txt" 
              onChange={handleFileChange} 
            />
            <label htmlFor="subir-archivo" className="btn-subir-archivo">Seleccionar archivo...</label>
            <span id="nombre-archivo">{selectedFileName}</span>
          </div>
          <button id="btn-analizar" className="btn-analizar" onClick={handleAnalizar} disabled={isLoading}>
            {isLoading ? 'Analizando...' : 'Analizar ahora'}
          </button>
        </div>
      </div>
      
      <ResultadoAnalisis isLoading={isLoading} result={analysisResult} />
    </main>
  );
}

export default Analizador;