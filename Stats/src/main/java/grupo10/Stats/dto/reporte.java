package grupo10.Stats.dto;



import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import java.util.Date;
import java.util.Map;


@Data
@Entity
public class reporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private String url;
    private Map<String, Object> results;
    private Date FechaEscan;

}
