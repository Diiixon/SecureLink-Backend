import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegisterForm from '../components/RegisterForm';
import '../style/RegisterForm.css'; 

// Página que muestra el formulario de registro
function RegisterPage() {
  return (
    <div className="register-page-wrapper">
      <Navbar />
      <main>
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
}

export default RegisterPage;