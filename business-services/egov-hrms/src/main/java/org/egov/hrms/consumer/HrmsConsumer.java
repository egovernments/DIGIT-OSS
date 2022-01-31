package org.egov.hrms.consumer;

import java.util.HashMap;

import org.egov.hrms.config.PropertiesManager;
import org.egov.hrms.producer.HRMSProducer;
import org.egov.hrms.service.NotificationService;
import org.egov.hrms.web.contract.EmployeeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class HrmsConsumer {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private HRMSProducer hrmsProducer;

    @Autowired
    private PropertiesManager propertiesManager;

    @KafkaListener(topics = {"${kafka.topics.hrms.updateData}"})
    public void listenUpdateEmployeeData(final HashMap<String, Object> record,@Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        try {
            EmployeeRequest employeeRequest = mapper.convertValue(record, EmployeeRequest.class);
            String tenantId = employeeRequest.getEmployees().get(0).getTenantId();
            hrmsProducer.push(tenantId, propertiesManager.getUpdateEmployeeTopic(), employeeRequest);
            notificationService.sendReactivationNotification(employeeRequest);
        } catch (final Exception e) {

            log.error("Error while listening to value: " + record + " on topic: " + topic + ": ", e);
        }
    }

}
