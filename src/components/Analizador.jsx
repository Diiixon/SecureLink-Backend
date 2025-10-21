import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ResultadoAnalisis from './ResultadoAnalisis';
import '../style/Analizador.css';

function Analizador() {
  //Obtiene el usuario actual y la funcion de login del contexto de autenticacion
  const { currentUser, login } = useAuth();

  // Estados para el texto a analizar
  const [textToAnalyze, setTextToAnalyze] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // Estados para el archivo
  const [selectedFileName, setSelectedFileName] = useState('Ningún archivo seleccionado');
  const [fileContent, setFileContent] = useState('');

  //estado para el error en caso de no haber texto o archivo
  const [error, setError] = useState('');

  //función para que lea el archivo Y LIMPiE EL ERROR
  const handleFileChange = (event) => {

    // se verifica si se ha seleccionado un archivo (0 significa ninguno) (1 o mas significa archivos)
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

  //funcion para simular el analisis del texto o archivo
  const handleAnalizar = () => {
    const textToProcess = textToAnalyze.trim() || fileContent.trim();

    if (!textToProcess) {
      // Si no hay texto ni archivo, muestra un error y no procede
      setError("Por favor, ingresa un enlace o selecciona un archivo para analizar.");
      return;
    }

    setError(''); // se limpia  el error si la validación pasa
    setIsLoading(true);
    setAnalysisResult(null);


    // Inicia un temporizador para simular el tiempo de análisis
    setTimeout(() => {
      const resultados = ['seguros', 'sospechosos', 'bloqueadas']; //posibles resultados
      const randomKey = resultados[Math.floor(Math.random() * resultados.length)]; //selecciona uno al azar
      
      // se crea un reporte nuevo basado en el resultado aleatorio
      let peligro = 'N/A';
      if (randomKey === 'seguros') peligro = 'Ninguno';
      else if (randomKey === 'sospechosos') peligro = 'Scam';
      else if (randomKey === 'bloqueadas') peligro = 'Phishing';

      //nuevo reporte para agregar al historial del usuario
      const newReport = {
        status: randomKey === 'bloqueadas' ? 'danger' : randomKey === 'sospechosos' ? 'warning' : 'safe',
        link: textToProcess,
        peligro: peligro,
        fecha: new Date().toISOString(),
        imita: 'Sitio Desconocido'
      };
      
      /*

      //Localstorage no Implemetado ya que se simula con api  mockable.io

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
      */

      setIsLoading(false);
      setAnalysisResult(randomKey);
      
      setTextToAnalyze('');
      setFileContent('');
      setSelectedFileName('Ningún archivo seleccionado');
      document.getElementById('subir-archivo').value = '';

      //Timepo antes de mostrar el resultado
    }, 700);
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
          //cada cambio en el textarea, actualiza el estado y limpia el error si existe
          onChange={(e) => {
            setTextToAnalyze(e.target.value);
            if (error) setError('');
          }}
        />
        
        {/*Mostramos el error aquí si existe*/}
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