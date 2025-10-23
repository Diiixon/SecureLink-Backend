import { useAuth } from '../context/AuthContext';
import profilePhoto from '../assets/UsuarioIcon.png';


function ProfileContent() { // Al iniciar el componente utiza el hook de autenticacion para obtener el usuario actual y guarda su información
  const { currentUser } = useAuth();

  if (!currentUser) { // Si no hay usuario actual, muestra un mensaje de carga, para evitar errores
    return <div className="profile-container"><p>Cargando perfil...</p></div>;
  }

  const memberSinceDate = new Date(currentUser.memberSince).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  const lastLoginDate = currentUser.lastLogin ? new Date(currentUser.lastLogin).toLocaleString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Nunca';

  // Manejo de fechas de registro y última conexión

  return (
    // Contenido del perfil
    <div className="profile-container">
      <h1 className="welcome-message">Hola bienvenido: {currentUser.nombre}</h1>
      <div className="profile-grid">
        <div className="profile-card profile-user-card">
          <img src={profilePhoto} alt="Foto de Perfil" className="profile-photo" />
          <div className="profile-user-info">
            <h2 className="profile-username">{currentUser.nombre}</h2>
            <p className="profile-member-since">Usuario desde: {memberSinceDate}</p>
          </div>
        </div>
        <div className="profile-card profile-reports-count">
          <p className="count-label">Reportes Realizados</p>
          <p className="count-number">{currentUser.reportsCount || 0}</p>
        </div>
        <div className="profile-card profile-stats-summary">
          <h3>Resumen de Estadísticas</h3>
          <ul>
            <li><strong>Enlaces Seguros:</strong> <span>{currentUser.stats?.seguros || 0}</span></li>
            <li><strong>Sitios Sospechosos:</strong> <span>{currentUser.stats?.sospechosos || 0}</span></li>
            <li><strong>Amenazas Bloqueadas:</strong> <span>{currentUser.stats?.bloqueadas || 0}</span></li>
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
                { /* Si el usuario tiene reportes generados, forma una lista con cada uno de ellos, de lo contrario muestra un mensaje*/ }
                {currentUser.history.length > 0 ? (
                  currentUser.history.map((item, index) => (
                    <tr key={index}>
                      <td><span className={`status-icon status-${item.status}`}>{item.status === 'danger' ? '✕' : item.status === 'warning' ? '!' : '✓'}</span></td>
                      <td><span className="link-text">{item.link}</span></td>
                      <td>{item.peligro}</td>
                      <td>{new Date(item.fecha).toLocaleDateString('es-ES')}</td>
                      <td>{item.imita}</td>
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