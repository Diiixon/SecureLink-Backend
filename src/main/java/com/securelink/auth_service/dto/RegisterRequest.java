package com.securelink.auth_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "El nombre de usuario no puede estar vacío.")
    private String username;

    @NotBlank(message = "El correo electrónico no puede estar vacío.")
    @Email(message = "El formato del correo electrónico no es válido.")
    private String email;

    @NotBlank(message = "La contraseña no puede estar vacía.")
    private String password;
    // Nota: No incluimos "confirmarContraseña".
    // Esa verificación se hace en el frontend o en el controlador,
    // pero no necesitamos guardarla en la base de datos.

}

