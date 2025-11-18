package com.securelink.analysis_service.service;

// DTOs
import com.securelink.analysis_service.dto.AnalysisResponse;

// Excepciones
import com.securelink.analysis_service.exception.BadRequestException;
import com.securelink.analysis_service.exception.UrlNotFoundException;

// Clases de Spring
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

// Clases de Reactor
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

// Clases de Java
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64; // <-- ¡NUEVO IMPORTE!
import java.util.List; // <-- ¡NUEVO IMPORTE!
import java.util.Map; // <-- ¡NUEVO IMPORTE!
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AnalysisService {

    // (Regex, etc. se mantienen igual)
    private static final String URL_REGEX = "(?i)((?:https?://)?(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\\.[a-zA-Z]{2,6}\\b(?:[-a-zA-Z0-9@:%_+.~#?&//=]*))";

    private final WebClient webClient;
    private final BrandDetectionService brandDetectionService;
    private final com.securelink.analysis_service.service.ReportService reportService;
    private final com.securelink.analysis_service.util.JwtUtil jwtUtil;
    private final com.securelink.analysis_service.repository.UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(AnalysisService.class);

    @Value("${api.google.key}")
    private String googleApiKey;

    @Value("${api.virustotal.key}")
    private String virusTotalApiKey;

    // (El Constructor se mantiene igual)
    @Autowired
    public AnalysisService(WebClient webClient,
            BrandDetectionService brandDetectionService,
            com.securelink.analysis_service.service.ReportService reportService,
            com.securelink.analysis_service.util.JwtUtil jwtUtil,
            com.securelink.analysis_service.repository.UserRepository userRepository) {
        this.webClient = webClient;
        this.brandDetectionService = brandDetectionService;
        this.reportService = reportService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    // (analyzeText y analyzeFile se mantienen igual)
    public List<AnalysisResponse> analyzeText(String text, String authorizationHeader) {
        List<String> urls = extractAllUrls(text);
        if (urls.isEmpty()) {
            throw new UrlNotFoundException("No se encontró una URL válida en el texto.");
        }

        Long userId = resolveUserIdFromAuthHeader(authorizationHeader);

        List<AnalysisResponse> responses = Flux.fromIterable(urls)
                .flatMap(this::analyzeSingleUrl)
                .collectList()
                .block();

        // Si hay usuario, guardamos cada resultado como report
        if (userId != null && responses != null) {
            for (AnalysisResponse r : responses) {
                com.securelink.analysis_service.model.Report report = new com.securelink.analysis_service.model.Report();
                report.setUserId(userId);
                report.setUrl(r.linkReportado());
                report.setPeligro(r.peligro());
                report.setImitaA(r.imitaA());
                // Guardamos detalles como JSON simple
                report.setDetalles(r.detalles().toString());
                reportService.save(report);
            }
        }

        return responses;
    }

    public List<AnalysisResponse> analyzeFile(MultipartFile file, String authorizationHeader) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("El archivo está vacío o es nulo.");
        }
        String content = new String(file.getBytes());
        List<String> urls = extractAllUrls(content);
        if (urls.isEmpty()) {
            throw new UrlNotFoundException("No se encontraron URLs en el archivo.");
        }
        Long userId = resolveUserIdFromAuthHeader(authorizationHeader);

        List<AnalysisResponse> responses = Flux.fromIterable(urls)
                .flatMap(this::analyzeSingleUrl)
                .collectList()
                .block();

        if (userId != null && responses != null) {
            for (AnalysisResponse r : responses) {
                com.securelink.analysis_service.model.Report report = new com.securelink.analysis_service.model.Report();
                report.setUserId(userId);
                report.setUrl(r.linkReportado());
                report.setPeligro(r.peligro());
                report.setImitaA(r.imitaA());
                report.setDetalles(r.detalles().toString());
                reportService.save(report);
            }
        }

        return responses;
    }

    private Long resolveUserIdFromAuthHeader(String authorizationHeader) {
        if (authorizationHeader == null) return null;
        String email = jwtUtil.extractEmail(authorizationHeader);
        if (email == null) return null;
        return userRepository.findByEmail(email).map(u -> u.getId()).orElse(null);
    }

    private Mono<AnalysisResponse> analyzeSingleUrl(String originalUrl) {
        // Normaliza la URL para asegurar que tenga un esquema antes de analizarla
        String normalizedUrl = normalizeUrl(originalUrl);

        Mono<String> googleResult = callGoogleSafeBrowsing(normalizedUrl);
        Mono<String> virusTotalResult = callVirusTotal(normalizedUrl);
        String brandImpersonated = brandDetectionService.detectImpersonation(normalizedUrl);

        return Mono.zip(googleResult, virusTotalResult)
                .map(tuple -> {
                    Map<String, String> details = Map.of(
                            "GoogleSafeBrowsing", tuple.getT1(),
                            "VirusTotal", tuple.getT2());
                    // Devuelve la URL original en la respuesta para el usuario
                    return consolidateResults(originalUrl, details, brandImpersonated);
                });
    }

    /**
     * Normaliza una URL para asegurar que tenga un esquema (http/https).
     * Si no lo tiene, le añade "https://".
     */
    private String normalizeUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return url;
        }
        String trimmedUrl = url.trim();
        if (!trimmedUrl.toLowerCase().startsWith("http://") && !trimmedUrl.toLowerCase().startsWith("https://")) {
            return "https://" + trimmedUrl;
        }
        return trimmedUrl;
    }

    // --- ¡MÉTODOS ACTUALIZADOS! ---

    /**
     * (ACTUALIZADO) Llama a la API real de Google Safe Browsing.
     */
    private Mono<String> callGoogleSafeBrowsing(String url) {
        String apiUrl = "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=" + googleApiKey;

        // 1. Construir el cuerpo de la petición
        ClientInfo client = new ClientInfo("securelink-app", "1.0.0");
        ThreatEntry threatEntry = new ThreatEntry(url);
        ThreatInfo threatInfo = new ThreatInfo(
                List.of("MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"), // threatTypes (Se quitó "PHISHING")
                List.of("ANY_PLATFORM"), // platformTypes
                List.of("URL"), // ¡CAMBIO AQUÍ! threatEntryTypes
                List.of(threatEntry) // threatEntries
        );
        GoogleSafeBrowsingRequest requestBody = new GoogleSafeBrowsingRequest(client, threatInfo);

        logger.info("Enviando JSON a Google: {}", requestBody.toString());

        // 2. Hacer la llamada POST
        return webClient.post()
                .uri(apiUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(GoogleSafeBrowsingResponse.class)
                .map(response -> {
                    // Si la respuesta CONTIENE "matches", es peligrosa
                    if (response != null && response.matches() != null && !response.matches().isEmpty()) {
                        return response.matches().get(0).threatType(); // "SOCIAL_ENGINEERING", etc.
                    }
                    // Si no hay matches, es segura
                    return "SAFE";
                })
                .onErrorResume(e -> {
                    // ¡NUEVO! Logueamos el error real en la consola
                    logger.error("Error llamando a Google Safe Browsing: {}", e.getMessage(), e);
                    return Mono.just("API_ERROR");
                });
    }

    /**
     * (ACTUALIZADO) Llama a la API real de VirusTotal, manejando errores 404.
     */
    private Mono<String> callVirusTotal(String url) {
        String urlId = Base64.getUrlEncoder().withoutPadding().encodeToString(url.getBytes());
        String apiUrl = "https://www.virustotal.com/api/v3/urls/" + urlId;

        return webClient.get()
                .uri(apiUrl)
                .header("x-apikey", virusTotalApiKey)
                .retrieve()
                .bodyToMono(VirusTotalResponse.class)
                .map(response -> {
                    Map<String, Integer> stats = response.data().attributes().last_analysis_stats();
                    int malicious = stats.getOrDefault("malicious", 0);
                    int suspicious = stats.getOrDefault("suspicious", 0);

                    if (malicious > 0) {
                        return malicious + "/90 malicious";
                    }
                    if (suspicious > 0) {
                        return suspicious + "/90 suspicious";
                    }
                    return "0/90 malicious";
                })
                .onErrorResume(
                        org.springframework.web.reactive.function.client.WebClientResponseException.NotFound.class,
                        e -> {
                            // ¡NUEVO! Si da 404, significa que VT no conoce la URL. La tratamos como
                            // limpia.
                            return Mono.just("0/90 malicious (Not Found)");
                        })
                .onErrorResume(e -> {
                    // ¡NUEVO! Logueamos el error real en la consola
                    logger.error("Error llamando a VirusTotal: {}", e.getMessage(), e);
                    return Mono.just("API_ERROR");
                });
    }

    /**
     * (ACTUALIZADO CON LÓGICA FINAL)
     * Consolida los resultados. Nuestra detección de marca tiene la prioridad MÁS ALTA.
     */
    private AnalysisResponse consolidateResults(String url,
                                                Map<String, String> results,
                                                String brandImpersonated) {

        String googleVerdict = results.get("GoogleSafeBrowsing");
        String vtVerdict = results.get("VirusTotal");

        String finalVerdict = "Ninguno";
        String imitaA = brandImpersonated; // Usamos el resultado de nuestro servicio

        // --- LÓGICA CORREGIDA ---

        // 0. Manejo de URL inválida desde BrandDetectionService
        if ("Invalid URL format".equals(imitaA)) {
            return new AnalysisResponse(
                url,
                "invalido", // O "error", según lo que el frontend espere para URLs mal formadas
                "Formato de URL inválido",
                results
            );
        }

        // 1. NUESTRA LÓGICA DE MARCA TIENE LA MÁXIMA PRIORIDAD
        if (!imitaA.equals("N/A")) {
            // Si nuestro BrandDetectionService encontró una suplantación
            // (ej: "Banco de Chile"), forzamos el veredicto a "Phishing",
            // INCLUSO SI Google y VT dicen que es "SAFE".
            finalVerdict = "Phishing";
        
        } else {
            // 2. Si NO es suplantación, CONFIAMOS en las APIs externas.
            if ("SOCIAL_ENGINEERING".equals(googleVerdict)) {
                finalVerdict = "Phishing";
                imitaA = "Sitio Desconocido"; // Es phishing, pero no sabemos de quién
            } else if ("MALWARE".equals(googleVerdict) || "UNWANTED_SOFTWARE".equals(googleVerdict)) {
                finalVerdict = "Malware";
                imitaA = "Sitio Desconocido";
            } else if (vtVerdict != null && !vtVerdict.equals("API_ERROR") && !vtVerdict.startsWith("0/")) {
                // Si VT encontró algo (y no es un 404), lo marcamos como Scam/Sospechoso
                finalVerdict = "Scam"; 
                imitaA = "Sitio Desconocido";
            }
            // Si `finalVerdict` sigue siendo "Ninguno", `imitaA` se queda como "N/A" (correcto).
        }

        // Mapeo del veredicto final a los valores que el frontend espera
        String frontendVerdict;
        switch (finalVerdict) {
            case "Phishing":
            case "Malware":
                frontendVerdict = "bloqueadas";
                break;
            case "Scam":
                frontendVerdict = "sospechosos";
                break;
            default: // "Ninguno" y cualquier otro caso
                frontendVerdict = "seguros";
                break;
        }

        return new AnalysisResponse(
            url,             // linkReportado
            frontendVerdict, // peligro (¡AHORA TRADUCIDO!)
            imitaA,          // imitaA
            results          // detalles
        );
    }

    private String extractFirstUrl(String text) {
        Pattern pattern = Pattern.compile(URL_REGEX);
        Matcher matcher = pattern.matcher(text);
        return matcher.find() ? matcher.group(0) : null;
    }

    private List<String> extractAllUrls(String text) {
        List<String> urls = new ArrayList<>();
        Pattern pattern = Pattern.compile(URL_REGEX);
        Matcher matcher = pattern.matcher(text);

        while (matcher.find()) {
            urls.add(matcher.group(0));
        }
        return urls.stream().distinct().collect(Collectors.toList());
    }

    // --- DTOs (Records) privados para manejar las respuestas de APIs Externas ---
    // --- (Pega el bloque de DTOs de la sección 1 aquí abajo) ---

    /**
     * DTOs para Google Safe Browsing
     */
    private record GoogleSafeBrowsingRequest(ClientInfo client, ThreatInfo threatInfo) {
    }

    private record ClientInfo(String clientId, String clientVersion) {
    }

    private record ThreatInfo(List<String> threatTypes, List<String> platformTypes, List<String> threatEntryTypes,
            List<ThreatEntry> threatEntries) {
    }

    private record ThreatEntry(String url) {
    }

    /** Si se encuentra una amenaza, Google devuelve esto. */
    private record GoogleSafeBrowsingResponse(List<Match> matches) {
    }

    private record Match(String threatType, ThreatEntry threat) {
    }

    /**
     * DTOs para VirusTotal (Solo extraemos lo que nos importa)
     */
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
    private record VirusTotalResponse(Data data) {
    }

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
    private record Data(Attributes attributes) {
    }

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
    private record Attributes(String url, Map<String, Integer> last_analysis_stats) {
    }

}