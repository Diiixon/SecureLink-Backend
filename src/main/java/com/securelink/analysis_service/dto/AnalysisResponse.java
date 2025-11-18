package com.securelink.analysis_service.dto;

import java.util.Map;

public record AnalysisResponse(

    String linkReportado,
    String peligro,
    String imitaA,
    Map<String, String> detalles) {


}