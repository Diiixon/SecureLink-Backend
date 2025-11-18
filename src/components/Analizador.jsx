import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ResultadoAnalisis from './ResultadoAnalisis';
import '../style/Analizador.css';

function Analizador() {
  const { currentUser, getAuthHeaders, token } = useAuth();

  // Estados para el texto a analizar
  const [textToAnalyze, setTextToAnalyze] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Estados para el archivo
  const [selectedFileName, setSelectedFileName] = useState('Ningún archivo seleccionado');
  const [fileContent, setFileContent] = useState('');

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      if (errorMsg) setErrorMsg('');
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

  const handleAnalizar = async () => {
    const textToProcess = textToAnalyze.trim() || fileContent.trim();

    if (!textToProcess) {
      setErrorMsg("Por favor, ingresa un enlace o selecciona un archivo para analizar.");
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const base = import.meta.env.VITE_ANALYSIS_URL || 'http://localhost:8081';
      const endpoint = fileContent ? `${base}/api/v1/analysis/scan-file` : `${base}/api/v1/analysis/scan-text`;
      
      const headers = getAuthHeaders();

      let body;
      if (fileContent) {
        // Para archivo, usar FormData
        const formData = new FormData();
        formData.append('file', new Blob([textToProcess], { type: 'text/plain' }));
        body = formData;
        // Eliminar Content-Type si es FormData (el navegador lo maneja)
        delete headers['Content-Type'];
      } else {
        // Para texto
        body = JSON.stringify({ textoAnalizar: textToProcess });
      }

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers,
        body,
      });

      const responseData = await resp.json();

      if (resp.status === 400) {
        // Error del cliente - mostrar mensaje amigable
        setErrorMsg(responseData.detalle || responseData.mensaje || responseData.error || 'Error en la solicitud');
      } else if (!resp.ok) {
        // Otros errores
        setErrorMsg(responseData.message || responseData.error || 'Error al analizar');
      } else {
        // Éxito
        setAnalysisResult(Array.isArray(responseData) ? responseData : [responseData]);
      }
    } catch (e) {
      console.error('Error en análisis:', e);
      setErrorMsg('No se pudo conectar al servidor');
    } finally {
      setIsLoading(false);
      setTextToAnalyze('');
      setFileContent('');
      setSelectedFileName('Ningún archivo seleccionado');
      document.getElementById('subir-archivo').value = '';
    }
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
          onChange={(e) => {
            setTextToAnalyze(e.target.value);
            if (errorMsg) setErrorMsg('');
          }}
        />
        
        {errorMsg && <p style={{ color: 'red', marginTop: '5px' }}>{errorMsg}</p>}

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