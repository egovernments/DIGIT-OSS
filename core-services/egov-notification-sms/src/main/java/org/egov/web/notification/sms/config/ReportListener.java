package org.egov.web.notification.sms.config;

import java.util.HashMap;

import lombok.extern.slf4j.Slf4j;
import org.egov.web.notification.sms.models.Report;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@Slf4j
public class ReportListener {


    private Report report;

    private ObjectMapper objectMapper;

    @Autowired
    public ReportListener(Report report, ObjectMapper objectMapper) {
        this.report = report;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "${kafka.topics.sms.bounce}")
    public void listen(final HashMap<String, Object> record) {
        Report report = objectMapper.convertValue(record, Report.class);
        log.info(report.toString());
    }



}
