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
    private static final String URL_REGEX = "(https?|ftp)://[\\-A-Za-z0-9+&@#/%?=~_|!:,.;]*[\\-A-Za-z0-9+&@#/%=~_|]";

    private final WebClient webClient;
    private final BrandDetectionService brandDetectionService;

    private static final Logger logger = LoggerFactory.getLogger(AnalysisService.class);

    @Value("${api.google.key}")
    private String googleApiKey;

    @Value("${api.virustotal.key}")
    private String virusTotalApiKey;

    // (El Constructor se mantiene igual)
    @Autowired
    public AnalysisService(WebClient webClient,
            BrandDetectionService brandDetectionService) {
        this.webClient = webClient;
        this.brandDetectionService = brandDetectionService;
    }

    // (analyzeText y analyzeFile se mantienen igual)
    public AnalysisResponse analyzeText(String text) {
        String url = extractFirstUrl(text);
        if (url == null) {
            throw new UrlNotFoundException("No se encontró una URL válida en el texto.");
        }
        return analyzeSingleUrl(url).block();
    }

    public List<AnalysisResponse> analyzeFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("El archivo está vacío o es nulo.");
        }
        String content = new String(file.getBytes());
        List<String> urls = extractAllUrls(content);
        if (urls.isEmpty()) {
            throw new UrlNotFoundException("No se encontraron URLs en el archivo.");
        }
        return Flux.fromIterable(urls)
                .flatMap(this::analyzeSingleUrl)
                .collectList()
                .block();
    }

    // (analyzeSingleUrl se mantiene igual)
    private Mono<AnalysisResponse> analyzeSingleUrl(String url) {
        Mono<String> googleResult = callGoogleSafeBrowsing(url);
        Mono<String> virusTotalResult = callVirusTotal(url);
        String brandImpersonated = brandDetectionService.detectImpersonation(url);

        return Mono.zip(googleResult, virusTotalResult)
                .map(tuple -> {
                    Map<String, String> details = Map.of(
                            "GoogleSafeBrowsing", tuple.getT1(),
                            "VirusTotal", tuple.getT2());
                    return consolidateResults(url, details, brandImpersonated);
                });
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

        return new AnalysisResponse(
            url,             // linkReportado
            finalVerdict,    // peligro
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