package com.securelink.auth_service.config;

import com.securelink.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UserRepository userRepository;

    /**
     * Bean 1: UserDetailsService
     * Spring Security usa esto para saber CÓMO buscar a un usuario.
     * Le decimos que busque en nuestro UserRepository por email.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }

    /**
     * Bean 2: PasswordEncoder
     * Le dice a Spring que use BCrypt para encriptar las contraseñas.
     * El AuthService usará este bean para encriptar la contraseña al registrarse.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Bean 3: AuthenticationProvider
     * (Sintaxis alternativa para evitar los warnings del editor)
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        // --- CAMBIO AQUÍ ---
        // Pasamos el passwordEncoder() directamente al constructor
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(passwordEncoder());
        // Y luego solo configuramos el userDetailsService
        authProvider.setUserDetailsService(userDetailsService());
        // --- FIN DEL CAMBIO ---
        return authProvider;
    }

    /**
     * Bean 4: AuthenticationManager
     * Es el "gerente" que maneja la autenticación.
     * El AuthService lo usará para procesar la petición de login.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
}
