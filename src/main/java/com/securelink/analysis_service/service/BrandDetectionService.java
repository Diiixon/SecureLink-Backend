package com.securelink.analysis_service.service;

import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

@Service
public class BrandDetectionService {

    // --- Nuestra "Base de Datos" de Marcas Protegidas ---
    // Mapea la "palabra clave" que buscará con el "dominio real" y el "nombre oficial"
    private static final Map<String, BrandInfo> brandDatabase = new HashMap<>();

    // Bloque estático para inicializar la base de datos
    static {
        // Formato: (palabra clave, new BrandInfo("Nombre Oficial", "dominio.oficial.com"))
        
        // --- 1. Marcas Originales/Globales ---
        brandDatabase.put("bancochile", new BrandInfo("Banco de Chile", "bancochile.cl"));
        brandDatabase.put("banco-chile", new BrandInfo("Banco de Chile", "bancochile.cl"));
        brandDatabase.put("mercadolibre", new BrandInfo("Mercado Libre", "mercadolibre.cl"));
        brandDatabase.put("mercado-libre", new BrandInfo("Mercado Libre", "mercadolibre.cl"));
        brandDatabase.put("google", new BrandInfo("Google", "google.com"));
        brandDatabase.put("youtube", new BrandInfo("Youtube", "youtube.com"));

        // --- 2. Bancos Chilenos ---
        brandDatabase.put("bancoestado", new BrandInfo("Banco Estado", "bancoestado.cl"));
        brandDatabase.put("banco-estado", new BrandInfo("Banco Estado", "bancoestado.cl"));
        brandDatabase.put("santander", new BrandInfo("Santander", "santander.cl"));
        brandDatabase.put("bci", new BrandInfo("BCI", "bci.cl"));
        brandDatabase.put("scotiabank", new BrandInfo("Scotiabank", "scotiabank.cl"));
        brandDatabase.put("itau", new BrandInfo("Itaú", "itau.cl"));
        brandDatabase.put("bice", new BrandInfo("Banco BICE", "bice.cl"));

        // --- 3. Casas Comerciales (Retail) ---
        brandDatabase.put("falabella", new BrandInfo("Falabella", "falabella.com"));
        brandDatabase.put("ripley", new BrandInfo("Ripley", "ripley.cl"));
        brandDatabase.put("paris", new BrandInfo("Paris", "paris.cl"));
        brandDatabase.put("lapolar", new BrandInfo("La Polar", "lapolar.cl"));
        brandDatabase.put("hites", new BrandInfo("Hites", "hites.com"));
        brandDatabase.put("corona", new BrandInfo("Corona", "corona.cl"));

        // --- 4. Otros Comercios Populares (Supermercados/Mejoras) ---
        brandDatabase.put("sodimac", new BrandInfo("Sodimac", "sodimac.cl"));
        brandDatabase.put("lider", new BrandInfo("Lider", "lider.cl")); // (Walmart)
        brandDatabase.put("jumbo", new BrandInfo("Jumbo", "jumbo.cl"));
        brandDatabase.put("easy", new BrandInfo("Easy", "easy.cl"));
        brandDatabase.put("yapo", new BrandInfo("Yapo", "yapo.cl"));

        // --- 5. Universidades (Ejemplos) ---
        brandDatabase.put("uchile", new BrandInfo("Universidad de Chile", "uchile.cl"));
        brandDatabase.put("u-chile", new BrandInfo("Universidad de Chile", "uchile.cl"));
        brandDatabase.put("uc", new BrandInfo("Universidad Católica", "uc.cl"));
        brandDatabase.put("usach", new BrandInfo("USACH", "usach.cl"));
        brandDatabase.put("uai", new BrandInfo("U. Adolfo Ibáñez", "uai.cl"));
        brandDatabase.put("duoc", new BrandInfo("Duoc UC", "duoc.cl"));
        brandDatabase.put("inacap", new BrandInfo("INACAP", "inacap.cl"));
        brandDatabase.put("udp", new BrandInfo("U. Diego Portales", "udp.cl"));

        // --- 6. Estaciones de Servicio ---
        brandDatabase.put("copec", new BrandInfo("Copec", "copec.cl"));
        brandDatabase.put("shell", new BrandInfo("Shell", "shell.cl"));
        brandDatabase.put("petrobras", new BrandInfo("Petrobras", "petrobras.cl"));

        // --- 7. Telecomunicaciones (Telcos) ---
        brandDatabase.put("movistar", new BrandInfo("Movistar", "movistar.cl"));
        brandDatabase.put("entel", new BrandInfo("Entel", "entel.cl"));
        brandDatabase.put("claro", new BrandInfo("Claro", "claro.cl"));
        brandDatabase.put("wom", new BrandInfo("WOM", "wom.cl"));

        // --- 8. Servicios Básicos (Utilities) ---
        brandDatabase.put("enel", new BrandInfo("Enel", "enel.cl"));
        brandDatabase.put("cge", new BrandInfo("CGE", "cge.cl"));
        brandDatabase.put("aguasandinas", new BrandInfo("Aguas Andinas", "aguasandinas.cl"));

        // --- 9. Administradoras de Fondos (AFP) ---
        brandDatabase.put("afphabitat", new BrandInfo("AFP Habitat", "afphabitat.cl"));
        brandDatabase.put("provida", new BrandInfo("AFP Provida", "provida.cl"));
        brandDatabase.put("afpcapital", new BrandInfo("AFP Capital", "afpcapital.cl"));
        brandDatabase.put("cuprum", new BrandInfo("AFP Cuprum", "afpcuprum.cl"));
        brandDatabase.put("afpmodelo", new BrandInfo("AFP Modelo", "afpmodelo.cl"));

        // --- 10. Servicios Públicos y Gobierno ---
        brandDatabase.put("sii", new BrandInfo("SII", "sii.cl")); // Servicio Impuestos Internos
        brandDatabase.put("registrocivil", new BrandInfo("Registro Civil", "registrocivil.cl"));
        brandDatabase.put("chileatiende", new BrandInfo("ChileAtiende", "chileatiende.cl"));
        brandDatabase.put("ips", new BrandInfo("IPS", "ips.cl"));

        // --- 11. Transporte y Delivery ---
        brandDatabase.put("correosdechile", new BrandInfo("Correos de Chile", "correos.cl"));
        brandDatabase.put("correos", new BrandInfo("Correos de Chile", "correos.cl"));
        brandDatabase.put("chilexpress", new BrandInfo("Chilexpress", "chilexpress.cl"));
        brandDatabase.put("starken", new BrandInfo("Starken", "starken.cl"));

        // --- 12. Servicios Globales (Phishing común) ---
        brandDatabase.put("netflix", new BrandInfo("Netflix", "netflix.com"));
        brandDatabase.put("spotify", new BrandInfo("Spotify", "spotify.com"));
        brandDatabase.put("microsoft", new BrandInfo("Microsoft", "microsoft.com"));
        brandDatabase.put("apple", new BrandInfo("Apple", "apple.com"));
        brandDatabase.put("paypal", new BrandInfo("PayPal", "paypal.com"));
    }

    /**
     * Revisa una URL y la compara con nuestra base de datos de marcas.
     * Devuelve el nombre de la marca que intenta imitar.
     */
    public String detectImpersonation(String urlString) {
        try {
            URI uri = new URI(urlString);
            String host = uri.getHost(); // Ej: "www.bancodechile.com"

            if (host == null) {
                return "N/A";
            }
            
            // Normalizar el host (quitar "www.")
            String normalizedHost = host.startsWith("www.") ? host.substring(4) : host;

            // 1. Iterar sobre nuestra base de datos
            for (Map.Entry<String, BrandInfo> entry : brandDatabase.entrySet()) {
                String keyword = entry.getKey();
                BrandInfo brand = entry.getValue();

                // 2. ¿El host contiene la palabra clave?
                if (normalizedHost.contains(keyword)) {
                    
                    // 3. ¿El host NO es el dominio oficial?
                    //    (Ej: "bancodechile.com" NO termina en "bancochile.cl")
                    if (!normalizedHost.endsWith(brand.safeDomain())) {
                        // ¡Encontramos una suplantación!
                        return brand.officialName();
                    }
                }
            }

        } catch (URISyntaxException e) {
            // La URL estaba malformada
            return "N/A";
        }

        // Si no se encontró ninguna suplantación
        return "N/A";
    }

    // Un 'record' simple para guardar la info de la marca
    private record BrandInfo(String officialName, String safeDomain) {}
}