package com.securelink.auth_service.model;

import jakarta.persistence.*; // Importa las anotaciones de JPA
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails{

    @Id // Marca este campo como la Llave Primaria (ID)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Autoincremental
    private Long id;

    @Column(nullable = false, unique = true) // No puede ser nulo, debe ser único
    private String username;

    @Column(nullable = false, unique = true) // No puede ser nulo, debe ser único
    private String email;

    @Column(nullable = false) // No puede ser nulo
    private String password;

    // --- Métodos de Spring Security (UserDetails) ---
    // (Spring Security nos obliga a implementar estos métodos 
    // para saber cómo manejar al usuario)

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Para este proyecto simple, todos los usuarios tienen el rol "USER".
        // (Devolvemos una lista vacía para simplificar, 
        // pero aquí es donde se manejarían los roles "ADMIN", "USER", etc.)
        return List.of(); 
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email; // Usaremos el EMAIL como "username" principal para iniciar sesión
    }

    // Método adicional para obtener el nombre de usuario real (no el email)
    public String getRealUsername() {
        return this.username;
    }

    // Los siguientes métodos los dejamos en 'true' por ahora
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
    
}
