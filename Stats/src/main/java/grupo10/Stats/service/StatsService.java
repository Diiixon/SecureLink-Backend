package grupo10.Stats.service;

import grupo10.Stats.dto.Reporte;
import grupo10.Stats.repository.AnalisisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StatsService {

    @Autowired
    private AnalisisRepository repositorio;

    /**
     * Resumen general: total, maliciosos (bloqueadas + sospechosos), seguros
     * La BD usa valores en minúsculas: "seguros", "bloqueadas", "sospechosos"
     */
    public Map<String, Object> obtenerResumenGeneral() {
        Map<String, Object> resumen = new HashMap<>();

        long total = repositorio.count();
        long seguros = repositorio.countByPeligro("seguros");
        long maliciosos = total - seguros; // bloqueadas + sospechosos + cualquier otro no-seguro

        resumen.put("total", total);
        resumen.put("maliciosos", maliciosos);
        resumen.put("seguros", seguros);

        return resumen;
    }

    // Distribución por 'peligro' (devuelve lista de {estado, cantidad})
    public List<Map<String, Object>> obtenerDistribucion() {
        List<Map<String, Object>> lista = new ArrayList<>();

        List<Object[]> rows = repositorio.obtenerDistribucionPorPeligro();
        for (Object[] row : rows) {
            String estado = (row[0] == null) ? "UNKNOWN" : row[0].toString();
            Number cantidad = (Number) row[1];
            Map<String, Object> item = new HashMap<>();
            item.put("estado", estado);
            item.put("cantidad", cantidad.longValue());
            lista.add(item);
        }

        return lista;
    }

    /**
     * Obtiene los últimos N reportes ordenados por fecha de creación
     * 
     * @param limit Número de reportes a obtener
     * @return Lista de reportes recientes
     */
    public List<Reporte> obtenerRecientes(int limit) {
        List<Reporte> recientes = repositorio.findTop5ByOrderByCreatedAtDesc();
        
        // Si hay menos reportes que el límite o el límite es inválido, retornar todos
        if (recientes.isEmpty() || limit <= 0 || limit >= recientes.size()) {
            return recientes;
        }
        
        return recientes.subList(0, limit);
    }
}