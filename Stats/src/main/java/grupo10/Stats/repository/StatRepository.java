package grupo10.Stats.repository;

import grupo10.Stats.dto.reporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

public class StatRepository {


@Repository
public interface AnalisisRepository extends JpaRepository<reporte, Long> {

    // Cuenta cuántos análisis hay en total de un tipo (ej: "MALICIOSO")
    long countByResultado(String resultado);

    // Query personalizada para agrupar por estado (para gráficos de torta)
    @Query("SELECT a.resultado as estado, COUNT(a) as cantidad FROM Analisis a GROUP BY a.resultado")
    List<Map<String, Object>> obtenerDistribucionResultados();

    // Query para obtener los últimos 5 análisis (para una tabla de 'Recientes')
    List<reporte> findTop5ByOrderByFechaEscaneoDesc();
}
    
}


