import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LearnGrid from "../components/LearnGrid";

function AprendePage() {
    return (
        <>
            {/* Simplemente eliminamos el prop del Navbar */}
            <Navbar />
            <LearnGrid />
            <Footer />
        </>
    );
}

export default AprendePage;