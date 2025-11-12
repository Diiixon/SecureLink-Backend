package com.securelink.auth_service.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    /**
     * Este es el "muro" principal. Aquí definimos las reglas de seguridad.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Deshabilitamos CSRF (no es necesario para APIs REST stateless)
                .csrf(AbstractHttpConfigurer::disable)

                // Habilitamos CORS (permite que React llame a esta API)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Definimos las reglas de autorización
                .authorizeHttpRequests(auth -> auth
                        // Permitimos que CUALQUIERA acceda a los endpoints de autenticación
                        .requestMatchers("/api/v1/auth/**").permitAll() 
                        
                        // Todas las OTRAS peticiones deben estar autenticadas
                        .anyRequest().authenticated() 
                )

                // Le decimos a Spring que no cree Sesiones (usamos JWT)
                .sessionManagement(session -> 
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Le decimos a Spring que use nuestro AuthenticationProvider (de ApplicationConfig)
                .authenticationProvider(authenticationProvider)

                // Le decimos a Spring que use nuestro Filtro JWT (el "guardia")
                // ANTES del filtro estándar de usuario y contraseña.
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * (¡Importante!) Configuración de CORS
     * Esto permite que tu frontend de React (ej: en localhost:5173)
     * pueda hacer llamadas a tu backend (ej: en localhost:8080)
     * sin ser bloqueado por el navegador.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permite que React (en cualquier origen) llame a la API
        configuration.setAllowedOrigins(List.of("*")); 
        // Permite todos los métodos (GET, POST, PUT, DELETE)
        configuration.setAllowedMethods(List.of("*")); 
        // Permite todos los encabezados (incluyendo "Authorization" para el JWT)
        configuration.setAllowedHeaders(List.of("*")); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Aplica a todas las rutas
        return source;
    }
    
}
