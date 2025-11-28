package grupo10.Stats.repository;

import grupo10.Stats.dto.Reporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalisisRepository extends JpaRepository<Reporte, Long> {

    // Cuenta cuántos análisis hay con un valor de 'peligro' dado
    long countByPeligro(String peligro);

    // Agrupa por 'peligro' y devuelve pares [peligro, cantidad]
    @Query("SELECT r.peligro, COUNT(r) FROM Reporte r GROUP BY r.peligro")
    List<Object[]> obtenerDistribucionPorPeligro();

    // Obtener últimos 5 análisis por fecha de creación
    List<Reporte> findTop5ByOrderByCreatedAtDesc();
}
