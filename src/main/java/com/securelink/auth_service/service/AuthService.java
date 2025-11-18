package com.securelink.auth_service.service;

import com.securelink.auth_service.dto.AuthResponse;
import com.securelink.auth_service.dto.LoginRequest;
import com.securelink.auth_service.dto.RegisterRequest;
import com.securelink.auth_service.exception.UserAlreadyExistsException;
import com.securelink.auth_service.model.User;
import com.securelink.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    // Dependencias (Spring las inyectará automáticamente)
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * Lógica para registrar un nuevo usuario (Crea tu Cuenta)
     */
    public AuthResponse register(RegisterRequest request) {
        // 1. Verificar si el email o username ya existen
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("El correo electrónico ya está en uso.");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("El nombre de usuario ya está en uso.");
        }

        // 2. Crear el nuevo usuario
        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                // ¡Importante! Encriptamos la contraseña antes de guardarla
                .password(passwordEncoder.encode(request.getPassword())) 
                .build();

        // 3. Guardar el usuario en la base de datos
        userRepository.save(user);

        // 4. Generar y devolver un token de autenticación
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }

    /**
     * Lógica para iniciar sesión
     */
    public AuthResponse login(LoginRequest request) {
        // 1. Spring Security se encarga de validar el email y la contraseña
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        // Si la autenticación falla, Spring Security lanza una excepción automáticamente.

        // 2. Si la autenticación fue exitosa, buscamos al usuario
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("Usuario no encontrado después de autenticación."));

        // 3. Generar y devolver un token
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }
    
}
