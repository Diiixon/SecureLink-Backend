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

  // Fechas de registro / última conexión (si están disponibles en currentUser)
  const memberSinceDate = currentUser?.memberSince ? new Date(currentUser.memberSince).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';
  const lastLoginDate = currentUser?.lastLogin ? new Date(currentUser.lastLogin).toLocaleString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  // Estadísticas: contar reportes por categoría
  const categorize = (r) => {
    const p = (r.peligro || '').toLowerCase();
    if (p.includes('bloque') || p.includes('phish') || p.includes('fraud') || p.includes('mal')) return 'blocked';
    if (p.includes('sospech') || p.includes('suspici')) return 'suspicious';
    return 'safe';
  };

  const stats = reports.reduce((acc, r) => {
    const cat = categorize(r);
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, { safe: 0, suspicious: 0, blocked: 0 });

  return (
    <div className="profile-container">
      {/* Mostrar nombre de usuario preferente: nombre registrado o el prefijo del email */}
      <h1 className="welcome-message">Hola bienvenido: {currentUser.nombre || (currentUser.email ? currentUser.email.split('@')[0] : currentUser.email)}</h1>
      <div className="profile-grid">
        <div className="profile-card profile-user-card">
          <img src={profilePhoto} alt="Foto de Perfil" className="profile-photo" />
          <div className="profile-user-info">
            <h2 className="profile-username">{currentUser.nombre || (currentUser.email ? currentUser.email.split('@')[0] : currentUser.email)}</h2>
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
            <li><strong>Enlaces Seguros:</strong> <span>{stats.safe ?? 0}</span></li>
            <li><strong>Sitios Sospechosos:</strong> <span>{stats.suspicious ?? 0}</span></li>
            <li><strong>Amenazas Bloqueadas:</strong> <span>{stats.blocked ?? 0}</span></li>
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
                  reports.map((r) => {
                    const peligro = (r.peligro || '').toLowerCase();
                    let icon = '🎫';
                    let statusClass = 'status-ticket';
                    if (peligro.includes('bloque') || peligro.includes('phish') || peligro.includes('fraud') || peligro.includes('mal')) {
                      icon = '✕';
                      statusClass = 'status-danger';
                    } else if (peligro.includes('sospech') || peligro.includes('suspici')) {
                      icon = '!';
                      statusClass = 'status-warning';
                    } else {
                      // seguro / por defecto -> mostrar check verde
                      icon = '✓';
                      statusClass = 'status-safe';
                    }

                    return (
                      <tr key={r.id}>
                        <td><span className={`status-icon ${statusClass}`}>{icon}</span></td>
                        <td><a className="link-text" href={r.url} target="_blank" rel="noreferrer">{r.url}</a></td>
                        <td>{r.peligro || 'N/A'}</td>
                        <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString('es-ES') : '—'}</td>
                        <td>{r.imitaA || '—'}</td>
                      </tr>
                    );
                  })
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
