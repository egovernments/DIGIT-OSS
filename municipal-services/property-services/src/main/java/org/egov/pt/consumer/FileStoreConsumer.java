package org.egov.pt.consumer;


import static org.egov.pt.util.PTConstants.ASMT_MODULENAME;
import static org.egov.pt.util.PTConstants.KEY_PDF_DOCUMENTTYPE;
import static org.egov.pt.util.PTConstants.KEY_PDF_ENTITY_ID;
import static org.egov.pt.util.PTConstants.KEY_PDF_FILESTOREID;
import static org.egov.pt.util.PTConstants.KEY_PDF_JOBS;
import static org.egov.pt.util.PTConstants.KEY_PDF_MODULE_NAME;
import static org.egov.pt.util.PTConstants.KEY_PDF_TENANT_ID;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.AuditDetails;
import org.egov.pt.models.Document;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.models.enums.Status;
import org.egov.pt.producer.PropertyProducer;
import org.egov.pt.repository.PropertyRepository;
import org.egov.pt.util.PTConstants;
import org.egov.pt.web.contracts.PropertyRequest;
import org.egov.tracer.model.CustomException;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class FileStoreConsumer {


    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PropertyProducer producer;

    @Autowired
    private PropertyConfiguration config;

    @KafkaListener(topics = { "${kafka.topics.filestore}" })
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {

        List<Map<String,Object>> jobMaps = (List<Map<String,Object>>)record.get(KEY_PDF_JOBS);

        for(Map<String,Object> job : jobMaps)  {

            String moduleName = (String) job.get(KEY_PDF_MODULE_NAME);

            if(StringUtils.isEmpty(moduleName) || !moduleName.equalsIgnoreCase(ASMT_MODULENAME))
                continue;

            String id = (String) job.get(KEY_PDF_ENTITY_ID);
            String tenantId = (String) job.get(KEY_PDF_TENANT_ID);
            String documentType = (String) job.get(KEY_PDF_DOCUMENTTYPE);

            // Adding in MDC so that tracer can add it in header
            MDC.put(PTConstants.TENANTID_MDC_STRING, tenantId);

            if(StringUtils.isEmpty(documentType))
                throw new CustomException("INVALID_DOCUMENTTYPE","Document Type cannot be null or empty string");

            Property property = searchProperty(id,tenantId);
            AuditDetails auditDetails = AuditDetails.builder().createdBy(property.getAuditDetails().getLastModifiedBy())
                    .createdTime(System.currentTimeMillis()).build();

            Document document = new Document();
            document.setId(UUID.randomUUID().toString());
            document.setDocumentType(documentType);
            document.setFileStoreId(StringUtils.join((List<String>)job.get(KEY_PDF_FILESTOREID),','));
            document.setStatus(Status.ACTIVE);
            document.setAuditDetails(auditDetails);

            property.setDocuments(Collections.singletonList(document));

            RequestInfo requestInfo = new RequestInfo();
            PropertyRequest propertyRequest = PropertyRequest.builder().requestInfo(requestInfo).property(property).build();

            producer.push(tenantId, config.getUpdateDocumentTopic(),propertyRequest);

            log.info("Updating document for: "+id);
        }


    }

    private Property searchProperty(String id, String tenantId){

        PropertyCriteria criteria = PropertyCriteria.builder().tenantId(tenantId).uuids(Collections.singleton(id)).build();

        List<Property> properties = propertyRepository.getProperties(criteria, false, false);

        if(CollectionUtils.isEmpty(properties))
            throw new CustomException("INVALID_ENTITYID","The entity id: "+id+" is not found for tenantId: "+tenantId);

        return properties.get(0);
    }



}
