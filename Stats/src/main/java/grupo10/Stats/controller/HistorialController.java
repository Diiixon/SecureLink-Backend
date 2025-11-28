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

    // ========== Endpoints para estadísticas por usuario ==========

    /**
     * Obtiene resumen de análisis de un usuario específico
     * Para gráfico de torta del usuario (solo sus URLs analizadas)
     * 
     * @param userId ID del usuario
     * @return Map con total, maliciosos y seguros del usuario
     */
    @GetMapping("/usuario/{userId}/resumen")
    public ResponseEntity<Map<String, Object>> getResumenUsuario(@PathVariable Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("El userId debe ser un número positivo válido");
        }
        
        Map<String, Object> resumen = servicio.obtenerResumenPorUsuario(userId);
        return ResponseEntity.ok(resumen);
    }

    /**
     * Obtiene distribución detallada de análisis de un usuario
     * Para gráfico de torta detallado del usuario
     * 
     * @param userId ID del usuario
     * @return Lista con estado y cantidad de URLs por estado
     */
    @GetMapping("/usuario/{userId}/distribucion")
    public ResponseEntity<List<Map<String, Object>>> getDistribucionUsuario(@PathVariable Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("El userId debe ser un número positivo válido");
        }
        
        List<Map<String, Object>> distribucion = servicio.obtenerDistribucionPorUsuario(userId);
        return ResponseEntity.ok(distribucion);
    }

    /**
     * Obtiene comparación entre el usuario y el total global
     * Para gráfico de barras comparativo (usuario vs global)
     * 
     * @param userId ID del usuario
     * @return Map con datos del usuario y datos globales
     */
    @GetMapping("/usuario/{userId}/comparativa")
    public ResponseEntity<Map<String, Object>> getComparativaUsuarioVsGlobal(@PathVariable Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("El userId debe ser un número positivo válido");
        }
        
        Map<String, Object> comparativa = servicio.obtenerComparativaUsuarioVsGlobal(userId);
        return ResponseEntity.ok(comparativa);
    }
}
