
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Learn from './components/Learn';
import Footer from './components/Footer';
import './App.css'; 

function App() {
  // La variable 'isLoggedIn' ya no es necesaria en este componente.
  
  return (
    <>
      {/* El Navbar ahora obtiene el estado por sí mismo desde el contexto */}
      <Navbar /> 
      <Hero />
      <Stats />
      <Learn />
      <Footer />
    </>
  );
}

export default App;