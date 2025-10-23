import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Login from '../components/Login';
import '../style/Login.css';

// pagina que muestra el login
function LoginPage() {
  return (
    <div className="login-page-wrapper">
      <Navbar />
      <main>
        <Login />
      </main>
      <Footer />
    </div>
  );
}

export default LoginPage;