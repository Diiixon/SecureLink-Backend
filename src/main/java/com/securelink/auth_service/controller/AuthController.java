package com.securelink.auth_service.controller;

import com.securelink.auth_service.dto.AuthResponse;
import com.securelink.auth_service.dto.LoginRequest;
import com.securelink.auth_service.dto.RegisterRequest;
import com.securelink.auth_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth") // Ruta base para todos los endpoints en esta clase
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * ENDPOINT 1: Crear una Cuenta (Registro)
     * Basado en tu imagen "Crea tu Cuenta"
     * URL: POST /api/v1/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        // Llama al servicio de registro y devuelve el token
        return ResponseEntity.ok(authService.register(request));
    }

    /**
     * ENDPOINT 2: Iniciar Sesión
     * URL: POST /api/v1/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request
    ) {
        // Llama al servicio de login y devuelve el token
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * ENDPOINT 3: Recuperar Contraseña (Platzhalter)
     * Basado en tu imagen "Recupera tu Contraseña"
     * URL: POST /api/v1/auth/forgot-password
     *
     * NOTA: La lógica real para enviar emails es compleja.
     * Por ahora, este endpoint solo simula una respuesta exitosa.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        
        // --- LÓGICA DE ENVÍO DE EMAIL (Simulada) ---
        // Aquí iría la lógica para:
        // 1. Generar un token de reseteo con tiempo límite.
        // 2. Guardar el token en la base de datos (asociado al usuario).
        // 3. Usar un servicio de email (como Mailgun o SendGrid) para enviar 
        //    el enlace de recuperación al 'email' del usuario.
        
        System.out.println("Solicitud de recuperación de contraseña recibida para: " + email);
        System.out.println("(Simulado) Email de recuperación enviado.");
        // --- Fin de la simulación ---

        // Devolvemos una respuesta genérica para no dar pistas
        // (nunca digas "email no encontrado" en un reseteo de contraseña).
        return ResponseEntity.ok(Map.of("message", "Si el correo está registrado, recibirás un enlace de recuperación."));
    }
    
}
