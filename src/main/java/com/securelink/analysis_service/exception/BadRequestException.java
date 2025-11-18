package com.securelink.analysis_service.exception;

/**
 * Excepción genérica para otras peticiones mal formadas.
 * (Por ejemplo, si el usuario sube un archivo vacío).
 * Es manejada por el GlobalExceptionHandler.
 */
public class BadRequestException extends RuntimeException {
    
    public BadRequestException(String message) {
        super(message);
    }
}