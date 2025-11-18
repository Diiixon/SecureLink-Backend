package com.securelink.analysis_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Clase de Configuración de Spring.
 * Spring escaneará esta clase al arrancar y ejecutará los métodos
 * marcados con @Bean para crear y gestionar objetos (Beans).
 */
@Configuration
public class WebClientConfig {

    /**
     * Este método crea un "Bean" de WebClient.
     * Ahora, cada vez que una clase (como AnalysisService) pida un WebClient
     * en su constructor, Spring le "inyectará" este objeto que creamos aquí.
     * Esto se llama Inyección de Dependencias.
     */
    @Bean
    public WebClient webClient() {
        // Simplemente creamos un WebClient con la configuración por defecto.
        // En un proyecto real, aquí podrías configurar Timeouts,
        // Headers globales, etc.
        return WebClient.builder().build();
    }
}