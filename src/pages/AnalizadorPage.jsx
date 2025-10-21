import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Analizador from '../components/Analizador';
//pagina que muestra el analizador de enlaces

function AnalizadorPage() {
  return (
    
    <div className="analizador-page-wrapper">
      <Navbar isAuthenticated={true} />
      <main> 
        <Analizador />
      </main>
      <Footer />
    </div> 
  );
}

export default AnalizadorPage;