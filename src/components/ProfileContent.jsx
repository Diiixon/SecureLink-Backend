import { useAuth } from '../context/AuthContext';
import profilePhoto from '../assets/UsuarioIcon.png';
import { useEffect, useState } from 'react';

/**
 * Componente que muestra el contenido del perfil del usuario, incluyendo
 * información personal, estadísticas de sus reportes y un historial detallado.
 */
function ProfileContent() {
  // --- HOOKS Y ESTADOS ---
  const { currentUser, getAuthHeaders } = useAuth(); // Obtiene el usuario actual y los headers de autenticación.
  const [reports, setReports] = useState([]); // Almacena la lista de reportes del usuario.
  const [loading, setLoading] = useState(true); // Estado para la carga de datos.
  const [error, setError] = useState(null); // Estado para mensajes de error.

  // Efecto para cargar los datos del perfil cuando el componente se monta o el usuario cambia.
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const base = import.meta.env.VITE_ANALYSIS_URL || 'http://localhost:8081';
        // Petición a la API para obtener los reportes del usuario.
        const resp = await fetch(`${base}/api/v1/reports`, { headers: getAuthHeaders() });
        
        if (resp.status === 401) {
          setError('No autenticado. Inicia sesión.');
          setReports([]);
        } else if (!resp.ok) {
          // Intenta leer un mensaje de error del cuerpo de la respuesta.
          const body = await resp.json().catch(() => ({}));
          setError(body.message || body.error || 'Error al obtener reportes');
        } else {
          const data = await resp.json();
          setReports(data || []); // Asegura que `reports` sea siempre un array.
        }
      } catch (e) {
        console.error(e);
        setError('No se pudo conectar al servidor');
      } finally {
        setLoading(false); // Finaliza el estado de carga.
      }
    };

    if (currentUser) {
      fetchReports();
    } else {
      // Si no hay usuario, no hay nada que cargar.
      setLoading(false);
    }
  }, [currentUser]); // El efecto depende del estado del `currentUser`.

  // Si no hay un usuario logueado, muestra un mensaje para que inicie sesión.
  if (!currentUser) {
    return <div className="profile-container"><p>Por favor inicia sesión para ver tu perfil.</p></div>;
  }

  /**
   * Función auxiliar para categorizar un reporte en 'blocked', 'suspicious', o 'safe'.
   * @param {object} r - El objeto de reporte.
   * @returns {string} La categoría del reporte.
   */
  const categorize = (r) => {
    const p = (r.peligro || '').toLowerCase();
    if (p.includes('bloque') || p.includes('phish') || p.includes('fraud') || p.includes('mal')) return 'blocked';
    if (p.includes('sospech') || p.includes('suspici')) return 'suspicious';
    return 'safe';
  };

  // Calcula las estadísticas sumarias a partir de la lista de reportes usando `reduce`.
  const stats = reports.reduce((acc, r) => {
    const cat = categorize(r);
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, { safe: 0, suspicious: 0, blocked: 0 });

  return (
    <div className="profile-container">
      {/* Mensaje de bienvenida personalizado con el nombre o email del usuario. */}
      <h1 className="welcome-message">Hola bienvenido: {currentUser.nombre || (currentUser.email ? currentUser.email.split('@')[0] : 'Usuario')}</h1>
      
      <div className="profile-grid">
        {/* Tarjeta de información del usuario */}
        <div className="profile-card profile-user-card">
          <img src={profilePhoto} alt="Foto de Perfil" className="profile-photo" />
          <div className="profile-user-info">
            <h2 className="profile-username">{currentUser.email}</h2>
          </div>
        </div>

        {/* Tarjeta con el número total de reportes realizados */}
        <div className="profile-card profile-reports-count">
          <p className="count-label">Reportes Realizados</p>
          <p className="count-number">{reports.length}</p>
        </div>

        {/* Tarjeta con el resumen de estadísticas por categoría */}
        <div className="profile-card profile-stats-summary">
          <h3>Resumen de Estadísticas</h3>
          <ul>
            <li><strong>Enlaces Seguros:</strong> <span>{stats.safe ?? 0}</span></li>
            <li><strong>Sitios Sospechosos:</strong> <span>{stats.suspicious ?? 0}</span></li>
            <li><strong>Amenazas Bloqueadas:</strong> <span>{stats.blocked ?? 0}</span></li>
          </ul>
        </div>

        {/* Tarjeta con la tabla del historial de reportes */}
        <div className="profile-card profile-history">
          <h3>Historial de Links Reportados</h3>
          <div className="table-responsive-wrapper">
            <table>
              <thead>
                <tr><th>Estado</th><th>Link Reportado</th><th>Peligro</th><th>Fecha</th><th>Imita a</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  // Muestra un mensaje de carga mientras se obtienen los datos.
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>Cargando...</td></tr>
                ) : error ? (
                  // Muestra un mensaje de error si la carga falla.
                  <tr><td colSpan="5" style={{ textAlign: 'center', color: 'red' }}>{error}</td></tr>
                ) : reports.length > 0 ? (
                  // Si hay reportes, los mapea para crear las filas de la tabla.
                  reports.map((r) => {
                    const peligro = (r.peligro || '').toLowerCase();
                    let icon, statusClass;

                    // Determina el ícono y la clase CSS según el nivel de peligro del reporte.
                    if (peligro.includes('bloque') || peligro.includes('phish') || peligro.includes('fraud') || peligro.includes('mal')) {
                      icon = '✕'; // Icono de peligro/bloqueado.
                      statusClass = 'status-danger';
                    } else if (peligro.includes('sospech') || peligro.includes('suspici')) {
                      icon = '!'; // Icono de advertencia/sospechoso.
                      statusClass = 'status-warning';
                    } else {
                      icon = '✓'; // Icono de seguro/verificado.
                      statusClass = 'status-safe';
                    }

                    return (
                      <tr key={r.id}>
                        <td><span className={`status-icon ${statusClass}`}>{icon}</span></td>
                        <td><a className="link-text" href={r.url} target="_blank" rel="noreferrer">{r.url}</a></td>
                        <td>{r.tipoAmenaza || 'Ninguna'}</td>
                        <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString('es-ES') : '—'}</td>
                        <td>{r.imitaA || '—'}</td>
                      </tr>
                    );
                  })
                ) : (
                  // Muestra un mensaje si el usuario aún no tiene reportes.
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>No has realizado ningún reporte todavía.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileContent;
