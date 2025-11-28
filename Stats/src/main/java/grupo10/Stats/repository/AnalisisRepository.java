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
    
    // ========== Métodos para filtrar por usuario ==========
    
    // Cuenta total de análisis de un usuario específico
    long countByUserId(Long userId);
    
    // Cuenta análisis de un usuario con un valor de 'peligro' específico
    long countByUserIdAndPeligro(Long userId, String peligro);
    
    // Agrupa por 'peligro' y cuenta solo para un usuario específico
    @Query("SELECT r.peligro, COUNT(r) FROM Reporte r WHERE r.userId = :userId GROUP BY r.peligro")
    List<Object[]> obtenerDistribucionPorPeligroYUsuario(Long userId);
}
