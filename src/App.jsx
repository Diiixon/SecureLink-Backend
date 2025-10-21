
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Learn from './components/Learn';
import Footer from './components/Footer';
import './App.css'; 
//pagina principal que muestra el hero, las estadisticas y los recursos de aprendizaje

function App() {

  
  return (
    <>
      <Navbar /> 
      <Hero />
      <Stats />
      <Learn />
      <Footer />
    </>
  );
}

export default App;