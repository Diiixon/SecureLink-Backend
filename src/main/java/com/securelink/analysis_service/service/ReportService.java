package com.securelink.analysis_service.service;

import com.securelink.analysis_service.model.Report;
import com.securelink.analysis_service.repository.ReportRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    public Report save(Report report) {
        return reportRepository.save(report);
    }

    public List<Report> findByUserId(Long userId) {
        return reportRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
