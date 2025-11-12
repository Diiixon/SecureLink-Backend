package com.securelink.auth_service.repository;

import com.securelink.auth_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Spring Data JPA es lo suficientemente inteligente para entender
     * este nombre de método. Automáticamente creará una consulta SQL
     * que busque un usuario por su columna 'email'.
     * * La usaremos para el login y para verificar si un email ya existe.
     */
    Optional<User> findByEmail(String email);

    /**
     * También creamos un buscador por 'username' para verificar
     * si el nombre de usuario ya existe durante el registro.
     */
    Optional<User> findByUsername(String username);
    
}
