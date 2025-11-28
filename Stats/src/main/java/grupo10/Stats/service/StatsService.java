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

    // ========== Métodos para estadísticas por usuario ==========

    /**
     * Resumen de análisis de un usuario específico
     * Para gráfico de torta con datos del usuario
     * 
     * @param userId ID del usuario
     * @return Map con total, maliciosos y seguros del usuario
     */
    public Map<String, Object> obtenerResumenPorUsuario(Long userId) {
        Map<String, Object> resumen = new HashMap<>();

        long total = repositorio.countByUserId(userId);
        long seguros = repositorio.countByUserIdAndPeligro(userId, "seguros");
        long maliciosos = total - seguros; // bloqueadas + sospechosos del usuario

        resumen.put("total", total);
        resumen.put("maliciosos", maliciosos);
        resumen.put("seguros", seguros);

        return resumen;
    }

    /**
     * Distribución de análisis por estado para un usuario específico
     * Para gráfico de torta detallado del usuario
     * 
     * @param userId ID del usuario
     * @return Lista de objetos con estado y cantidad del usuario
     */
    public List<Map<String, Object>> obtenerDistribucionPorUsuario(Long userId) {
        List<Map<String, Object>> lista = new ArrayList<>();

        List<Object[]> rows = repositorio.obtenerDistribucionPorPeligroYUsuario(userId);
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
     * Comparación entre estadísticas del usuario y totales globales
     * Para gráfico de barras comparativo
     * 
     * @param userId ID del usuario
     * @return Map con datos del usuario y totales globales
     */
    public Map<String, Object> obtenerComparativaUsuarioVsGlobal(Long userId) {
        Map<String, Object> comparativa = new HashMap<>();

        // Datos del usuario
        Map<String, Object> datosUsuario = obtenerResumenPorUsuario(userId);
        
        // Datos globales
        Map<String, Object> datosGlobales = obtenerResumenGeneral();

        comparativa.put("usuario", datosUsuario);
        comparativa.put("global", datosGlobales);

        return comparativa;
    }
}