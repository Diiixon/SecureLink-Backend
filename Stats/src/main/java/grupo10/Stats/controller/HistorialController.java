package grupo10.Stats.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

import grupo10.Stats.service.StatsService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:5173") // ¡IMPORTANTE! Permite que React (Vite) consulte tu API
public class HistorialController {

    @Autowired
    private StatsService servicio;

    // GET http://localhost:8082/api/stats/resumen
    @GetMapping("/resumen")
    public Map<String, Object> getResumen() {
        return servicio.obtenerResumenGeneral();
    }

    // GET http://localhost:8082/api/stats/distribucion
    @GetMapping("/distribucion")
    public List<Map<String, Object>> getDistribucion() {
        return servicio.obtenerDistribucion();
    }
    
}
