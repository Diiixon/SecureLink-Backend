import { useAuth } from '../context/AuthContext';
import profilePhoto from '../assets/UsuarioIcon.png';
import { useEffect, useState } from 'react';

function ProfileContent() {
  const { currentUser, getAuthHeaders } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const base = import.meta.env.VITE_ANALYSIS_URL || 'http://localhost:8081';
        const resp = await fetch(`${base}/api/v1/reports`, { headers: getAuthHeaders() });
        if (resp.status === 401) {
          setError('No autenticado. Inicia sesión.');
          setReports([]);
        } else if (!resp.ok) {
          const body = await resp.json().catch(() => ({}));
          setError(body.message || body.error || 'Error al obtener reportes');
        } else {
          const data = await resp.json();
          setReports(data || []);
        }
      } catch (e) {
        console.error(e);
        setError('No se pudo conectar al servidor');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchReports();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  if (!currentUser) {
    return <div className="profile-container"><p>Por favor inicia sesión para ver tu perfil.</p></div>;
  }

  const memberSinceDate = currentUser?.memberSince ? new Date(currentUser.memberSince).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';
  const lastLoginDate = currentUser?.lastLogin ? new Date(currentUser.lastLogin).toLocaleString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Nunca';

  return (
    <div className="profile-container">
      <h1 className="welcome-message">Hola bienvenido: {currentUser.nombre || currentUser.email}</h1>
      <div className="profile-grid">
        <div className="profile-card profile-user-card">
          <img src={profilePhoto} alt="Foto de Perfil" className="profile-photo" />
          <div className="profile-user-info">
            <h2 className="profile-username">{currentUser.nombre || currentUser.email}</h2>
            <p className="profile-member-since">Usuario desde: {memberSinceDate}</p>
          </div>
        </div>
        <div className="profile-card profile-reports-count">
          <p className="count-label">Reportes Realizados</p>
          <p className="count-number">{reports.length}</p>
        </div>
        <div className="profile-card profile-stats-summary">
          <h3>Resumen de Estadísticas</h3>
          <ul>
            <li><strong>Enlaces Seguros:</strong> <span>—</span></li>
            <li><strong>Sitios Sospechosos:</strong> <span>—</span></li>
            <li><strong>Amenazas Bloqueadas:</strong> <span>—</span></li>
          </ul>
        </div>
        <div className="profile-card profile-history">
          <h3>Historial de Links Reportados</h3>
          <div className="table-responsive-wrapper">
            <table>
              <thead>
                <tr><th>Estado</th><th>Link Reportado</th><th>Peligro</th><th>Fecha</th><th>Imita a</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>Cargando...</td></tr>
                ) : error ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', color: 'red' }}>{error}</td></tr>
                ) : reports.length > 0 ? (
                  reports.map((r) => (
                    <tr key={r.id}>
                      <td><span className={`status-icon`}>{r.peligro === 'Phishing' ? '✕' : r.peligro ? '!' : '✓'}</span></td>
                      <td><a className="link-text" href={r.url} target="_blank" rel="noreferrer">{r.url}</a></td>
                      <td>{r.peligro || 'N/A'}</td>
                      <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString('es-ES') : '—'}</td>
                      <td>{r.imitaA || '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>No has realizado ningún reporte todavía.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="profile-card profile-last-connection">
          <h3>Última Conexión</h3>
          <p>{lastLoginDate}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileContent;
