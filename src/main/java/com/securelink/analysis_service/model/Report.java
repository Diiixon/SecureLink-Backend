package com.securelink.analysis_service.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "url", nullable = false, length = 2048)
    private String url;

    @Column(name = "peligro")
    private String peligro;

    @Column(name = "imita_a")
    private String imitaA;

    @Column(name = "detalles", columnDefinition = "TEXT")
    private String detalles; // JSON string

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getPeligro() { return peligro; }
    public void setPeligro(String peligro) { this.peligro = peligro; }

    public String getImitaA() { return imitaA; }
    public void setImitaA(String imitaA) { this.imitaA = imitaA; }

    public String getDetalles() { return detalles; }
    public void setDetalles(String detalles) { this.detalles = detalles; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
