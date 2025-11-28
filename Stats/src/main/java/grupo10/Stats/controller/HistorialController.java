package grupo10.Stats.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import grupo10.Stats.dto.Reporte;
import grupo10.Stats.service.StatsService;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST para proporcionar estadísticas de análisis de URLs
 * Endpoints utilizados para generar gráficos en el frontend
 */
@RestController
@RequestMapping("/api/stats")
public class HistorialController {

    @Autowired
    private StatsService servicio;

    /**
     * Obtiene un resumen general de los análisis
     * Para gráficos tipo Pie Chart o Cards de resumen
     * 
     * @return Map con total, maliciosos y seguros
     */
    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Object>> getResumen() {
        Map<String, Object> resumen = servicio.obtenerResumenGeneral();
        return ResponseEntity.ok(resumen);
    }

    /**
     * Obtiene la distribución de análisis por estado
     * Para gráficos tipo Bar Chart o Pie Chart
     * 
     * @return Lista de objetos con estado y cantidad
     */
    @GetMapping("/distribucion")
    public ResponseEntity<List<Map<String, Object>>> getDistribucion() {
        List<Map<String, Object>> distribucion = servicio.obtenerDistribucion();
        return ResponseEntity.ok(distribucion);
    }
    
    /**
     * Obtiene los análisis más recientes
     * Para tablas o listas de reportes recientes
     * 
     * @param limit Número máximo de reportes a retornar (por defecto 5, máximo 50)
     * @return Lista de reportes recientes
     */
    @GetMapping("/recientes")
    public ResponseEntity<List<Reporte>> getRecientes(
            @RequestParam(value = "limit", required = false, defaultValue = "5") int limit) {
        
        if (limit < 1 || limit > 50) {
            throw new IllegalArgumentException("El parámetro 'limit' debe estar entre 1 y 50");
        }
        
        List<Reporte> recientes = servicio.obtenerRecientes(limit);
        return ResponseEntity.ok(recientes);
    }
}
