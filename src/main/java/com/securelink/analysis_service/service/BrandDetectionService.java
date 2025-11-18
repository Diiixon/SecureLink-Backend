package com.securelink.analysis_service.service;

import org.apache.commons.text.similarity.LevenshteinDistance;
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
    private static final LevenshteinDistance levenshtein = new LevenshteinDistance();

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
        brandDatabase.put("bancoripley", new BrandInfo("Banco Ripley", "bancoripley.cl"));
        brandDatabase.put("banco-ripley", new BrandInfo("Banco Ripley", "bancoripley.cl"));
        brandDatabase.put("bancofalabella", new BrandInfo("Banco Falabella", "bancofalabella.cl"));
        brandDatabase.put("banco-falabella", new BrandInfo("Banco Falabella", "bancofalabella.cl"));
        brandDatabase.put("consorcio", new BrandInfo("Consorcio", "consorcio.cl"));
        brandDatabase.put("bancosecurity", new BrandInfo("Banco Security", "security.cl"));
        brandDatabase.put("banco-security", new BrandInfo("Banco Security", "security.cl"));
        brandDatabase.put("bancointernacional", new BrandInfo("Banco Internacional", "bancointernacional.cl"));
        brandDatabase.put("fintual", new BrandInfo("Fintual", "fintual.com"));
        brandDatabase.put("mach", new BrandInfo("MACH", "somosmach.com"));

        // --- 3. Casas Comerciales (Retail) ---
        brandDatabase.put("falabella", new BrandInfo("Falabella", "falabella.com"));
        brandDatabase.put("ripley", new BrandInfo("Ripley", "ripley.cl"));
        brandDatabase.put("paris", new BrandInfo("Paris", "paris.cl"));
        brandDatabase.put("lapolar", new BrandInfo("La Polar", "lapolar.cl"));
        brandDatabase.put("hites", new BrandInfo("Hites", "hites.com"));
        brandDatabase.put("corona", new BrandInfo("Corona", "corona.cl"));
        brandDatabase.put("johnson", new BrandInfo("Johnson", "johnson.cl"));
        brandDatabase.put("abcdin", new BrandInfo("Abcdin", "abcdin.cl"));
        brandDatabase.put("tricot", new BrandInfo("Tricot", "tricot.cl"));

        // --- 4. Otros Comercios Populares (Supermercados/Mejoras) ---
        brandDatabase.put("sodimac", new BrandInfo("Sodimac", "sodimac.cl"));
        brandDatabase.put("lider", new BrandInfo("Lider", "lider.cl")); // (Walmart)
        brandDatabase.put("jumbo", new BrandInfo("Jumbo", "jumbo.cl"));
        brandDatabase.put("easy", new BrandInfo("Easy", "easy.cl"));
        brandDatabase.put("yapo", new BrandInfo("Yapo", "yapo.cl"));
        brandDatabase.put("tottus", new BrandInfo("Tottus", "tottus.cl"));
        brandDatabase.put("santaisabel", new BrandInfo("Santa Isabel", "santaisabel.cl"));
        brandDatabase.put("unimarc", new BrandInfo("Unimarc", "unimarc.cl"));
        brandDatabase.put("construmart", new BrandInfo("Construmart", "construmart.cl"));
        brandDatabase.put("lacaserita", new BrandInfo("La Caserita", "lacaserita.cl"));


        // --- 5. Universidades (Ejemplos) ---
        brandDatabase.put("uchile", new BrandInfo("Universidad de Chile", "uchile.cl"));
        brandDatabase.put("u-chile", new BrandInfo("Universidad de Chile", "uchile.cl"));
        brandDatabase.put("uc", new BrandInfo("Universidad Católica", "uc.cl"));
        brandDatabase.put("usach", new BrandInfo("USACH", "usach.cl"));
        brandDatabase.put("uai", new BrandInfo("U. Adolfo Ibáñez", "uai.cl"));
        brandDatabase.put("duoc", new BrandInfo("Duoc UC", "duoc.cl"));
        brandDatabase.put("inacap", new BrandInfo("INACAP", "inacap.cl"));
        brandDatabase.put("udp", new BrandInfo("U. Diego Portales", "udp.cl"));
        brandDatabase.put("uandes", new BrandInfo("U. de los Andes", "uandes.cl"));
        brandDatabase.put("unab", new BrandInfo("U. Andrés Bello", "unab.cl"));
        brandDatabase.put("usm", new BrandInfo("U. Técnica Federico Santa María", "usm.cl"));
        brandDatabase.put("aiep", new BrandInfo("AIEP", "aiep.cl"));
        brandDatabase.put("santotomas", new BrandInfo("Santo Tomás", "santotomas.cl"));
        brandDatabase.put("udec", new BrandInfo("Universidad de Concepción", "udec.cl"));
        brandDatabase.put("uv", new BrandInfo("Universidad de Valparaíso", "uv.cl"));
        brandDatabase.put("uach", new BrandInfo("Universidad Austral de Chile", "uach.cl"));


        // --- 6. Estaciones de Servicio ---
        brandDatabase.put("copec", new BrandInfo("Copec", "copec.cl"));
        brandDatabase.put("shell", new BrandInfo("Shell", "shell.cl"));
        brandDatabase.put("petrobras", new BrandInfo("Petrobras", "petrobras.cl"));

        // --- 7. Telecomunicaciones (Telcos) ---
        brandDatabase.put("movistar", new BrandInfo("Movistar", "movistar.cl"));
        brandDatabase.put("entel", new BrandInfo("Entel", "entel.cl"));
        brandDatabase.put("claro", new BrandInfo("Claro", "claro.cl"));
        brandDatabase.put("wom", new BrandInfo("WOM", "wom.cl"));
        brandDatabase.put("vtr", new BrandInfo("VTR", "vtr.com"));
        brandDatabase.put("mundopacifico", new BrandInfo("Mundo Pacífico", "mundopacifico.cl"));
        brandDatabase.put("gtd", new BrandInfo("GTD", "gtd.cl"));

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
        brandDatabase.put("gob", new BrandInfo("Gobierno de Chile", "gob.cl"));
        brandDatabase.put("mineduc", new BrandInfo("Ministerio de Educación", "mineduc.cl"));
        brandDatabase.put("webpay", new BrandInfo("Webpay", "webpay.cl"));
        brandDatabase.put("mercadopublico", new BrandInfo("Mercado Público", "mercadopublico.cl"));
        brandDatabase.put("servel", new BrandInfo("SERVEL", "servel.cl"));
        brandDatabase.put("poderjudicial", new BrandInfo("Poder Judicial", "poderjudicial.cl"));
        brandDatabase.put("dipres", new BrandInfo("Dirección de Presupuestos", "dipres.gob.cl"));
        brandDatabase.put("tesoreria", new BrandInfo("Tesorería General de la República", "tesoreria.cl"));
        brandDatabase.put("comisariavirtual", new BrandInfo("Comisaría Virtual", "comisariavirtual.cl"));
        brandDatabase.put("fonasa", new BrandInfo("Fonasa", "fonasa.cl"));
        brandDatabase.put("compin", new BrandInfo("Compin", "compin.cl"));


        // --- 11. Transporte y Delivery ---
        brandDatabase.put("latam", new BrandInfo("LATAM Airlines", "latamairlines.com"));
        brandDatabase.put("latamairlines", new BrandInfo("LATAM Airlines", "latamairlines.com"));
        brandDatabase.put("correosdechile", new BrandInfo("Correos de Chile", "correos.cl"));
        brandDatabase.put("correos", new BrandInfo("Correos de Chile", "correos.cl"));
        brandDatabase.put("chilexpress", new BrandInfo("Chilexpress", "chilexpress.cl"));
        brandDatabase.put("starken", new BrandInfo("Starken", "starken.cl"));
        brandDatabase.put("skyairline", new BrandInfo("Sky Airline", "skyairline.com"));
        brandDatabase.put("jetsmart", new BrandInfo("JetSMART", "jetsmart.com"));
        brandDatabase.put("turbus", new BrandInfo("Turbus", "turbus.cl"));
        brandDatabase.put("pullmanbus", new BrandInfo("Pullman Bus", "pullmanbus.cl"));
        brandDatabase.put("efe", new BrandInfo("EFE", "efe.cl"));
        brandDatabase.put("pedidosya", new BrandInfo("PedidosYa", "pedidosya.cl"));
        brandDatabase.put("rappi", new BrandInfo("Rappi", "rappi.cl"));
        brandDatabase.put("ubereats", new BrandInfo("Uber Eats", "ubereats.com"));

        // --- 12. Servicios Globales (Phishing común) ---
        brandDatabase.put("netflix", new BrandInfo("Netflix", "netflix.com"));
        brandDatabase.put("spotify", new BrandInfo("Spotify", "spotify.com"));
        brandDatabase.put("microsoft", new BrandInfo("Microsoft", "microsoft.com"));
        brandDatabase.put("apple", new BrandInfo("Apple", "apple.com"));
        brandDatabase.put("paypal", new BrandInfo("PayPal", "paypal.com"));
        brandDatabase.put("linkedin", new BrandInfo("LinkedIn", "linkedin.com"));
        brandDatabase.put("twitter", new BrandInfo("Twitter / X", "twitter.com"));
        brandDatabase.put("x", new BrandInfo("Twitter / X", "x.com"));
        brandDatabase.put("facebook", new BrandInfo("Facebook", "facebook.com"));
        brandDatabase.put("instagram", new BrandInfo("Instagram", "instagram.com"));
        brandDatabase.put("tiktok", new BrandInfo("TikTok", "tiktok.com"));
        brandDatabase.put("whatsapp", new BrandInfo("WhatsApp", "whatsapp.com"));
        brandDatabase.put("telegram", new BrandInfo("Telegram", "telegram.org"));
        brandDatabase.put("aliexpress", new BrandInfo("AliExpress", "aliexpress.com"));
        brandDatabase.put("amazon", new BrandInfo("Amazon", "amazon.com"));
        brandDatabase.put("ebay", new BrandInfo("eBay", "ebay.com"));
        brandDatabase.put("booking", new BrandInfo("Booking.com", "booking.com"));
        brandDatabase.put("airbnb", new BrandInfo("Airbnb", "airbnb.com"));
        brandDatabase.put("uber", new BrandInfo("Uber", "uber.com"));
        brandDatabase.put("didi", new BrandInfo("DiDi", "didi-global.com"));
        brandDatabase.put("cabify", new BrandInfo("Cabify", "cabify.com"));


        // --- 13. Medios de Comunicación ---
        brandDatabase.put("emol", new BrandInfo("El Mercurio", "emol.com"));
        brandDatabase.put("biobiochile", new BrandInfo("Radio Bío-Bío", "biobiochile.cl"));
        brandDatabase.put("lun", new BrandInfo("Las Últimas Noticias", "lun.com"));
        brandDatabase.put("latercera", new BrandInfo("La Tercera", "latercera.com"));
        brandDatabase.put("elmostrador", new BrandInfo("El Mostrador", "elmostrador.cl"));
        brandDatabase.put("df", new BrandInfo("Diario Financiero", "df.cl"));
        brandDatabase.put("soychile", new BrandInfo("SoyChile", "soychile.cl"));
        brandDatabase.put("adnradio", new BrandInfo("ADN Radio", "adnradio.cl"));
        brandDatabase.put("cooperativa", new BrandInfo("Radio Cooperativa", "cooperativa.cl"));
        brandDatabase.put("t13", new BrandInfo("Tele13", "t13.cl"));
        brandDatabase.put("meganoticias", new BrandInfo("MegaNoticias", "meganoticias.cl"));
        brandDatabase.put("chvnoticias", new BrandInfo("CHV Noticias", "chvnoticias.cl"));
        brandDatabase.put("publimetro", new BrandInfo("Publimetro", "publimetro.cl"));
        brandDatabase.put("lacuarta", new BrandInfo("La Cuarta", "lacuarta.com"));
        brandDatabase.put("theclinic", new BrandInfo("The Clinic", "theclinic.cl"));
        brandDatabase.put("cnnchile", new BrandInfo("CNN Chile", "cnnchile.com"));
        brandDatabase.put("24horas", new BrandInfo("24 Horas", "24horas.cl"));


        // --- 14. Salud (ISAPRES y Clínicas) ---
        brandDatabase.put("cruzverde", new BrandInfo("Farmacias Cruz Verde", "cruzverde.cl"));
        brandDatabase.put("farmaciasahumada", new BrandInfo("Farmacias Ahumada", "farmaciasahumada.cl"));
        brandDatabase.put("salcobrand", new BrandInfo("Salcobrand", "salcobrand.cl"));
        brandDatabase.put("integramedica", new BrandInfo("Integramédica", "integramedica.cl"));
        brandDatabase.put("redsalud", new BrandInfo("RedSalud", "redsalud.cl"));
        brandDatabase.put("ucchristus", new BrandInfo("Red de Salud UC Christus", "ucchristus.cl"));
        brandDatabase.put("alemana", new BrandInfo("Clínica Alemana", "alemana.cl"));
        brandDatabase.put("clinicacondell", new BrandInfo("Clínica Dávila", "clinicadavila.cl"));
        brandDatabase.put("colmena", new BrandInfo("Colmena", "colmena.cl"));
        brandDatabase.put("consalud", new BrandInfo("Consalud", "consalud.cl"));
        brandDatabase.put("cruzblanca", new BrandInfo("CruzBlanca", "cruzblanca.cl"));
        brandDatabase.put("banmedica", new BrandInfo("Banmédica", "banmedica.cl"));
        brandDatabase.put("vidatres", new BrandInfo("Vida Tres", "vidatres.cl"));
        brandDatabase.put("clinicalascondes", new BrandInfo("Clínica Las Condes", "clinicalascondes.cl"));
        brandDatabase.put("clinicasantamaria", new BrandInfo("Clínica Santa María", "clinicasantamaria.cl"));


        // --- 15. Entretención y Cultura ---
        brandDatabase.put("cinemark", new BrandInfo("Cinemark", "cinemark.cl"));
        brandDatabase.put("cinehoyts", new BrandInfo("Cinépolis (CineHoyts)", "cinehoyts.cl"));
        brandDatabase.put("puntoticket", new BrandInfo("PuntoTicket", "puntoticket.com"));
        brandDatabase.put("ticketmaster", new BrandInfo("Ticketmaster", "ticketmaster.cl"));
        brandDatabase.put("scielo", new BrandInfo("SciELO", "scielo.cl"));
        brandDatabase.put("bncatalogo", new BrandInfo("Biblioteca Nacional de Chile", "bncatalogo.cl"));
        brandDatabase.put("fantasilandia", new BrandInfo("Fantasilandia", "fantasilandia.cl"));
        brandDatabase.put("buinzoo", new BrandInfo("Buin Zoo", "buinzoo.cl"));
        brandDatabase.put("kidzania", new BrandInfo("Kidzania", "kidzania.cl"));

        // --- 16. Cajas de Compensación ---
        brandDatabase.put("cajalosandes", new BrandInfo("Caja Los Andes", "cajalosandes.cl"));
        brandDatabase.put("cajalaaraucana", new BrandInfo("Caja La Araucana", "laaraucana.cl"));
        brandDatabase.put("caja18", new BrandInfo("Caja 18", "caja18.cl"));

        // --- 17. Seguros ---
        brandDatabase.put("sura", new BrandInfo("Sura", "sura.cl"));
        brandDatabase.put("chilenaconsolidada", new BrandInfo("Chilena Consolidada", "chilenaconsolidada.cl"));
        brandDatabase.put("bciseguros", new BrandInfo("BCI Seguros", "bciseguros.cl"));
        brandDatabase.put("magallanes", new BrandInfo("Seguros Magallanes", "magallanes.cl"));

        // --- 18. Automotriz ---
        brandDatabase.put("chileautos", new BrandInfo("Chileautos", "chileautos.cl"));
        brandDatabase.put("autocosmos", new BrandInfo("Autocosmos", "autocosmos.cl"));
        brandDatabase.put("autofact", new BrandInfo("Autofact", "autofact.cl"));

        // --- 19. Otros Sitios Populares ---
        brandDatabase.put("groupon", new BrandInfo("Groupon", "groupon.cl"));
        brandDatabase.put("buscalibre", new BrandInfo("Buscalibre", "buscalibre.cl"));
        brandDatabase.put("despegar", new BrandInfo("Despegar", "despegar.cl"));
        brandDatabase.put("notino", new BrandInfo("Notino", "notino.cl"));
        brandDatabase.put("knasta", new BrandInfo("Knasta", "knasta.cl"));
        brandDatabase.put("zolkan", new BrandInfo("Zolkan", "zolkan.cl"));
        brandDatabase.put("pcfactory", new BrandInfo("PC Factory", "pcfactory.cl"));
        brandDatabase.put("spdigital", new BrandInfo("SP Digital", "spdigital.cl"));
        brandDatabase.put("mercadoreplay", new BrandInfo("Mercado Ripley", "mercadoreplay.cl"));
    }

    /**
     * (ACTUALIZADO) Revisa si una URL se parece a una marca protegida usando Levenshtein.
     */
    public String detectImpersonation(String urlString) {
        try {
            URI uri = new URI(urlString);
            String host = uri.getHost();

            if (host == null) {
                return "N/A";
            }

            String normalizedHost = host.startsWith("www.") ? host.substring(4) : host;
            String cleanDomainPart = normalizedHost.split("\\.")[0].replace("-", "");

            for (Map.Entry<String, BrandInfo> entry : brandDatabase.entrySet()) {
                String keyword = entry.getKey().replace("-", "");
                BrandInfo brand = entry.getValue();

                // Calculate Levenshtein distance for typo detection
                int distance = levenshtein.apply(cleanDomainPart, keyword);

                // Set a dynamic threshold: 1 for short keywords, 2 for longer ones.
                int threshold = (keyword.length() < 5) ? 1 : 2;

                // Check for impersonation if it's a close typo OR a super-domain
                if (distance <= threshold || cleanDomainPart.contains(keyword)) {
                    // Now, we must ensure it's not the legitimate domain
                    if (!normalizedHost.endsWith(brand.safeDomain())) {
                        // It's similar or contains the keyword, but is NOT the official domain.
                        // This is a strong signal for impersonation.
                        return brand.officialName();
                    }
                }
            }

        } catch (URISyntaxException e) {
            return "Invalid URL format";
        }

        return "N/A";
    }

    // Un 'record' simple para guardar la info de la marca
    private record BrandInfo(String officialName, String safeDomain) {}
}