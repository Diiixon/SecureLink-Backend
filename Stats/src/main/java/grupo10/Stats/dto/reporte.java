package grupo10.Stats.dto;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Data
@Entity
@Table(name = "reports")
public class Reporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "url", length = 2048)
    private String url;

    @Column(name = "peligro")
    private String peligro; // e.g. MALICIOSO / SEGURO

    @Column(name = "tipo_amenaza")
    private String tipoAmenaza;

    @Column(name = "imita_a")
    private String imitaA;

    @Column(name = "detalles", columnDefinition = "TEXT")
    private String detalles; // JSON string with analysis results

    @Column(name = "created_at")
    private Instant createdAt;

}
