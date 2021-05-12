package org.egov.commons.consumers;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.commons.model.Department;
import org.egov.commons.service.DepartmentService;
import org.egov.tracer.model.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
public class DepartmentConsumer {

    public static final Logger LOGGER = LoggerFactory.getLogger(DepartmentConsumer.class);
    @Autowired
    DepartmentService departmentService;
    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = {"egov-common-department-create", "egov-common-department-update"})
    public void processMessage(Map<String, Object> consumerRecord, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        log.info("key:" + topic + ":" + "value:" + consumerRecord);
        try {
            consumerRecord.values();
            Department department = objectMapper.convertValue(consumerRecord.get("Department"), Department.class);
            RequestInfo requestInfo = objectMapper.convertValue(consumerRecord.get("RequestInfo"), RequestInfo.class);

            Long userid = requestInfo.getUserInfo().getId();
            if (topic.equals("egov-common-department-create")) {

                departmentService.createDepartment(department, userid);

            } else if (topic.equals("egov-common-department-update")) {

                departmentService.updateDepartment(department, userid);
            }
        } catch (Exception exception) {
            log.debug("DepartmentConsumer:processMessage:" + exception);
            throw new CustomException("ERROR_PROCESSING_RECORD", exception.getMessage());
        }
    }

}