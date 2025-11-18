package com.securelink.analysis_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * Manejador global de excepciones para el servicio de análisis.
 * Centraliza el manejo de errores y proporciona respuestas consistentes al frontend.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Maneja excepciones de URL no encontrada.
     * Retorna un mensaje amigable al usuario cuando no se detecta una URL válida.
     */
    @ExceptionHandler(UrlNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUrlNotFoundException(UrlNotFoundException ex) {
        logger.warn("URL no encontrada: {}", ex.getMessage());

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Formato de URL inválido");
        response.put("mensaje", ex.getMessage());
        response.put("detalle", "No se ha ingresado ninguna URL con formato válido. Por favor, verifica el texto e intenta de nuevo.");
        response.put("status", HttpStatus.BAD_REQUEST.value());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Maneja excepciones de solicitud mal formada (BadRequest).
     */
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequestException(BadRequestException ex) {
        logger.warn("Solicitud mal formada: {}", ex.getMessage());

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Solicitud inválida");
        response.put("mensaje", ex.getMessage());
        response.put("detalle", ex.getMessage());
        response.put("status", HttpStatus.BAD_REQUEST.value());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Maneja cualquier otra excepción no prevista.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        logger.error("Error interno del servidor: {}", ex.getMessage(), ex);

        Map<String, Object> response = new HashMap<>();
        response.put("error", "Error interno del servidor");
        response.put("mensaje", "Ha ocurrido un error inesperado. Por favor, intenta más tarde.");
        response.put("detalle", ex.getMessage() != null ? ex.getMessage() : "Error desconocido");
        response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
