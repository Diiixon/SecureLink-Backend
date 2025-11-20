package grupo10.Stats.service;

import grupo10.Stats.dto.reporte;
import grupo10.Stats.repository.AnalisisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StatsService {

    @Autowired
    private AnalisisRepository repositorio;

    // Resumen general: total, maliciosos, seguros
    public Map<String, Object> obtenerResumenGeneral() {
        Map<String, Object> resumen = new HashMap<>();

        long total = repositorio.count();
        long maliciosos = repositorio.countByPeligro("MALICIOSO");
        long seguros = total - maliciosos;

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

    // Obtener los últimos N reportes (por defecto 5)
    public List<reporte> obtenerRecientes(int limit) {
        List<reporte> recientes = repositorio.findTop5ByOrderByCreatedAtDesc();
        if (limit <= 0 || limit >= recientes.size()) {
            return recientes;
        }
        return recientes.subList(0, limit);
    }

}