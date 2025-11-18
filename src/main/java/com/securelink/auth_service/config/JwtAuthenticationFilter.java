package com.securelink.auth_service.config;

import com.securelink.auth_service.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Component 
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Usamos getRequestURI() que es más confiable
        final String requestURI = request.getRequestURI();

        logger.info("Filtrando petición URI: {}", requestURI);

        // Si la URL es de autenticación, la ignoramos y pasamos al siguiente filtro.
        if (requestURI.startsWith("/api/v1/auth/")) {

            logger.info("Ruta de autenticación detectada, saltando filtro JWT.");
            filterChain.doFilter(request, response);
            return;
        }

        // 1. Obtener el encabezado "Authorization"
        final String authHeader = request.getHeader("Authorization");

        // 2. Si no hay encabezado o no empieza con "Bearer ", pasamos al siguiente filtro.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extraer el token (quitando "Bearer ")
        final String jwt = authHeader.substring(7); // 7 es la longitud de "Bearer "
        
        // 4. Extraer el email (username) del token
        final String userEmail = jwtService.extractUsername(jwt);

        // 5. Si tenemos email y el usuario AÚN NO está autenticado en el contexto actual...
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // 6. Cargar los detalles del usuario desde la Base de Datos
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 7. Si el token es válido...
            if (jwtService.isTokenValid(jwt, userDetails)) {
                // Creamos un token de autenticación de Spring Security
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // No usamos credenciales (password) aquí
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                
                // 8. "Autenticamos" al usuario para esta petición
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // 9. Pasamos al siguiente filtro en la cadena
        filterChain.doFilter(request, response);
    }
    
}
