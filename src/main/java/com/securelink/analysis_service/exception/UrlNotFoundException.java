package com.securelink.analysis_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Excepción personalizada para cuando no se encuentra una URL en el texto.
 * La anotación @ResponseStatus le dice a Spring Boot que, cuando esta
 * excepción ocurra, debe devolver automáticamente un error HTTP 400 (Bad Request)
 * al frontend, junto con el mensaje.
 */
@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class UrlNotFoundException extends RuntimeException {
    
    public UrlNotFoundException(String message) {
        super(message);
    }
}