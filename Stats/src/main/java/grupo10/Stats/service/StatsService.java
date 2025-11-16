package grupo10.Stats.service;

// import grupo10.Stats.repository.StatRepository; // <--- COMENTAR ESTO
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatsService {

    // @Autowired
    // private StatRepository repositorio; // <--- COMENTAR ESTO PARA QUE NO FALLE

    public Map<String, Object> obtenerResumenGeneral() {
        // SIMULACIÓN DE DATOS (MOCK)
        Map<String, Object> resumen = new HashMap<>();
        resumen.put("total", 1500);      // Datos inventados
        resumen.put("maliciosos", 50);   // Datos inventados
        resumen.put("seguros", 1450);    // Datos inventados
        
        return resumen;
    }

    public List<Map<String, Object>> obtenerDistribucion() {
        // SIMULACIÓN DE DATOS (MOCK)
        List<Map<String, Object>> lista = new ArrayList<>();
        
        Map<String, Object> item1 = new HashMap<>();
        item1.put("estado", "malicious");
        item1.put("cantidad", 50);
        
        Map<String, Object> item2 = new HashMap<>();
        item2.put("estado", "clean");
        item2.put("cantidad", 1450);
        
        lista.add(item1);
        lista.add(item2);
        
        return lista;
    }
}