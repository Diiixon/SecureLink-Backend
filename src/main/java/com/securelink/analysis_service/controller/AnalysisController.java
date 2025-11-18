package com.securelink.analysis_service.controller;

// DTOs
import com.securelink.analysis_service.dto.AnalysisRequest;
import com.securelink.analysis_service.dto.AnalysisResponse;

// El servicio que contiene la lógica
import com.securelink.analysis_service.service.AnalysisService;

// Clases de Spring
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

// Clases de Java
import java.io.IOException;
import java.util.List;

/**
 * Controlador REST que expone los endpoints para el análisis de URLs.
 * Esta es la única puerta de entrada para el frontend.
 */
@RestController
@RequestMapping("/api/v1/analysis") // Ruta base para todos los endpoints en esta clase
@CrossOrigin(origins = "*")
public class AnalysisController {

    // Inyectamos el servicio que tiene la lógica de negocio
    private final AnalysisService analysisService;

    @Autowired
    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    /**
     * ENDPOINT 1: Analiza texto simple (enviado como JSON).
     * URL: POST /api/v1/analysis/scan-text
     * Body: { "textoAnalizar": "..." }
     */
    @PostMapping("/scan-text")
    public ResponseEntity<List<AnalysisResponse>> analyzeText(
            @RequestBody AnalysisRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorization) {

        // Delega todo el trabajo al servicio, pasando el token si existe
        List<AnalysisResponse> response = analysisService.analyzeText(request.textoAnalizar(), authorization);
        return ResponseEntity.ok(response);
    }

    /**
     * ENDPOINT 2: Analiza un archivo de texto (.txt, .log, etc.).
     * URL: POST /api/v1/analysis/scan-file
     * Body: FormData con un campo "file"
     */
    @PostMapping(value = "/scan-file", consumes = "multipart/form-data")
    public ResponseEntity<List<AnalysisResponse>> analyzeFile(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "Authorization", required = false) String authorization) { // Recibe el archivo
        
        try {
            // Delega el trabajo al servicio, pasando el token si existe
            List<AnalysisResponse> results = analysisService.analyzeFile(file, authorization);
            return ResponseEntity.ok(results);
            
        } catch (IOException e) {
            // Manejo de error si no se puede leer el archivo
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); 
        }
    }
}