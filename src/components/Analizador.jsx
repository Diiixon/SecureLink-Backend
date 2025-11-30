import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ResultadoAnalisis from './ResultadoAnalisis';
import '../style/Analizador.css';

/**
 * Componente Analizador: Permite a los usuarios ingresar texto (como un enlace)
 * o subir un archivo de texto para analizar su seguridad.
 */
function Analizador() {
  // Accede al contexto de autenticación para obtener datos del usuario y encabezados.
  const { getAuthHeaders } = useAuth();

  // --- ESTADOS DEL COMPONENTE ---

  // Estado para el contenido del área de texto.
  const [textToAnalyze, setTextToAnalyze] = useState('');
  // Estado para controlar la visualización del indicador de carga.
  const [isLoading, setIsLoading] = useState(false);
  // Estado para almacenar el resultado del análisis recibido de la API.
  const [analysisResult, setAnalysisResult] = useState(null);
  // Estado para mensajes de error que se muestran al usuario.
  const [errorMsg, setErrorMsg] = useState('');
  
  // Estado para el nombre del archivo seleccionado.
  const [selectedFileName, setSelectedFileName] = useState('Ningún archivo seleccionado');
  // Estado para el contenido del archivo de texto leído.
  const [fileContent, setFileContent] = useState('');

  /**
   * Maneja el cambio en el input de tipo 'file'.
   * Lee el archivo de texto y guarda su nombre y contenido en el estado.
   * @param {Event} event - El evento del input de archivo.
   */
  const handleFileChange = (event) => {
    // Si se selecciona un archivo...
    if (event.target.files.length > 0) {
      if (errorMsg) setErrorMsg(''); // Limpia errores previos.
      const file = event.target.files[0];
      setSelectedFileName(file.name); // Muestra el nombre del archivo.

      const reader = new FileReader();
      // Cuando el lector termine de cargar el archivo...
      reader.onload = (e) => {
        setFileContent(e.target.result); // Guarda el contenido del archivo en el estado.
      };
      reader.readAsText(file); // Inicia la lectura del archivo como texto.
    } else {
      // Si se deselecciona el archivo.
      setSelectedFileName('Ningún archivo seleccionado');
      setFileContent('');
    }
  };

  /**
   * Función principal que se ejecuta al presionar el botón "Analizar".
   * Envía el texto o el contenido del archivo a la API para su análisis.
   */
  const handleAnalizar = async () => {
    // Determina qué contenido procesar: el del textarea o el del archivo.
    const textToProcess = textToAnalyze.trim() || fileContent.trim();

    // Validación: no permite enviar si no hay contenido.
    if (!textToProcess) {
      setErrorMsg("Por favor, ingresa un enlace o selecciona un archivo para analizar.");
      return;
    }

    // Resetea el estado antes de una nueva petición.
    setErrorMsg('');
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const base = import.meta.env.VITE_ANALYSIS_URL; // URL base de la API desde variables de entorno.
      // Elige el endpoint correcto si se subió un archivo o se ingresó texto.
      const endpoint = fileContent ? `${base}/api/v1/analysis/scan-file` : `${base}/api/v1/analysis/scan-text`;
      
      const headers = getAuthHeaders(); // Obtiene encabezados de autenticación.

      let body;
      if (fileContent) {
        // Si es un archivo, usa FormData para enviarlo.
        const formData = new FormData();
        formData.append('file', new Blob([textToProcess], { type: 'text/plain' }));
        body = formData;
        // El navegador establece el 'Content-Type' correcto para FormData, así que lo eliminamos.
        delete headers['Content-Type'];
      } else {
        // Si es texto, envía un JSON.
        body = JSON.stringify({ textoAnalizar: textToProcess });
      }

      // Realiza la petición a la API.
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers,
        body,
      });

      const responseData = await resp.json();

      if (resp.status === 400) {
        // Maneja errores de validación del cliente (ej. URL malformada).
        setErrorMsg(responseData.detalle || responseData.mensaje || responseData.error || 'Error en la solicitud');
      } else if (!resp.ok) {
        // Maneja otros errores del servidor.
        setErrorMsg(responseData.message || responseData.error || 'Error al analizar');
      } else {
        // Si la petición es exitosa, guarda el resultado.
        setAnalysisResult(Array.isArray(responseData) ? responseData : [responseData]);
      }
    } catch (e) {
      // Maneja errores de red o conexión.
      console.error('Error en análisis:', e);
      setErrorMsg('No se pudo conectar al servidor');
    } finally {
      // Este bloque se ejecuta siempre, haya habido éxito o error.
      setIsLoading(false); // Detiene el indicador de carga.
      // Limpia los campos de entrada para el siguiente análisis.
      setTextToAnalyze('');
      setFileContent('');
      setSelectedFileName('Ningún archivo seleccionado');
      document.getElementById('subir-archivo').value = ''; // Resetea el input de archivo.
    }
  };

  return (
    <main>
      <h1>Analiza cualquier enlace sospechoso</h1>
      <p>Pega cualquier enlace, mensaje o sube un archivo. Analizamos su seguridad en segundos.</p>
      
      {/* --- CAJA DEL ANALIZADOR --- */}
      <div className="caja-analizador">
        <textarea 
          id="texto-analizar" 
          placeholder="Ingresa o Pega Aquí el mensaje o link..."
          value={textToAnalyze}
          onChange={(e) => {
            setTextToAnalyze(e.target.value);
            if (errorMsg) setErrorMsg(''); // Limpia el mensaje de error al empezar a escribir.
          }}
        />
        
        {/* Muestra el mensaje de error si existe */}
        {errorMsg && <p style={{ color: 'red', marginTop: '5px' }}>{errorMsg}</p>}

        {/* --- ACCIONES: SUBIR ARCHIVO Y ANALIZAR --- */}
        <div className="analizador-acciones">
          <div className="grupo-subir-archivo">
            <input 
              type="file" 
              id="subir-archivo" 
              className="input-archivo-oculto" 
              accept=".txt" // Acepta solo archivos .txt
              onChange={handleFileChange} 
            />
            <label htmlFor="subir-archivo" className="btn-subir-archivo">Seleccionar archivo...</label>
            <span id="nombre-archivo">{selectedFileName}</span>
          </div>
          <button id="btn-analizar" className="btn-analizar" onClick={handleAnalizar} disabled={isLoading}>
            {/* Cambia el texto del botón si está cargando */}
            {isLoading ? 'Analizando...' : 'Analizar ahora'}
          </button>
        </div>
      </div>
      
      {/* --- Muestra los resultados del análisis --- */}
      {/* Pasa el estado de carga y el resultado al componente hijo */}
      <ResultadoAnalisis isLoading={isLoading} result={analysisResult} />
    </main>
  );
}

export default Analizador;