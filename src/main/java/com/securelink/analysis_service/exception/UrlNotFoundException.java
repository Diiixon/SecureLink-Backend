package com.securelink.analysis_service.exception;

/**
 * Excepción personalizada para cuando no se encuentra una URL en el texto.
 * Es manejada por el GlobalExceptionHandler que devuelve un error HTTP 400
 * con un mensaje amigable al usuario.
 */
public class UrlNotFoundException extends RuntimeException {
    
    public UrlNotFoundException(String message) {
        super(message);
    }
}