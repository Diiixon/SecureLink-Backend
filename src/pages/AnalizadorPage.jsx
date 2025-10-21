import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Analizador from '../components/Analizador';

function AnalizadorPage() {
  return (
    // 👇 Añade este div con su clase
    <div className="analizador-page-wrapper">
      <Navbar isAuthenticated={true} />
      <main> {/* Es buena práctica envolver el contenido principal en un <main> */}
        <Analizador />
      </main>
      <Footer />
    </div> // 👈 Cierra el div aquí
  );
}

export default AnalizadorPage;