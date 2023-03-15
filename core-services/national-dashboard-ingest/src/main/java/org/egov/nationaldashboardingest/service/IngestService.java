package org.egov.nationaldashboardingest.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.nationaldashboardingest.config.ApplicationProperties;
import org.egov.nationaldashboardingest.producer.Producer;
import org.egov.nationaldashboardingest.repository.ElasticSearchRepository;
import org.egov.nationaldashboardingest.validators.IngestValidator;
import org.egov.nationaldashboardingest.web.models.AuditDetails;
import org.egov.nationaldashboardingest.web.models.IngestAckData;
import org.egov.nationaldashboardingest.web.models.IngestRequest;
import org.egov.nationaldashboardingest.web.models.MasterDataRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class IngestService {

    @Autowired
    CustomIndexRequestDecorator customIndexRequestDecorator;

    @Autowired
    ElasticSearchRepository repository;

    @Autowired
    ApplicationProperties applicationProperties;

    @Autowired
    IngestValidator ingestValidator;

    @Autowired
    AsyncHandler asyncHandler;

    @Autowired
    private Producer producer;

    public List<Integer> ingestData(IngestRequest ingestRequest) {

        ingestValidator.validateMaxDataListSize(ingestRequest);

        List<Integer> responseHash = new ArrayList<>();

        Map<String, List<JsonNode>> indexNameVsDocumentsToBeIndexed = new HashMap<>();


        // Validate if record for the day is already present
        IngestAckData dataToDb = ingestValidator.verifyIfDataAlreadyIngested(ingestRequest.getIngestData());

        ingestRequest.getIngestData().forEach(data -> {

            // Validates that no cross state data is being ingested, i.e. employee of state X cannot insert data for state Y
            ingestValidator.verifyCrossStateRequest(data, ingestRequest.getRequestInfo());

            // Validates whether the fields configured for a given module are present in payload
            ingestValidator.verifyDataStructure(data);

            String moduleCode = data.getModule();

            // Enrich audit details
            enrichAuditDetails(ingestRequest);

            // Flattens incoming ingest payload
            List<JsonNode> flattenedIndexPayload = customIndexRequestDecorator.createFlattenedIndexRequest(data);

            // Repository layer call for performing bulk indexing
            if(indexNameVsDocumentsToBeIndexed.containsKey(applicationProperties.getModuleIndexMapping().get(moduleCode)))
                indexNameVsDocumentsToBeIndexed.get(applicationProperties.getModuleIndexMapping().get(moduleCode)).addAll(flattenedIndexPayload);
            else
                indexNameVsDocumentsToBeIndexed.put(applicationProperties.getModuleIndexMapping().get(moduleCode), flattenedIndexPayload);

            responseHash.add(data.hashCode());

        });
        //repository.indexFlattenedDataToES(indexNameVsDocumentsToBeIndexed);

        repository.pushDataToKafkaConnector(indexNameVsDocumentsToBeIndexed);

        producer.push(applicationProperties.getKeyDataTopic(), dataToDb);

        // Added async handler to push data to kafka connectors asynchronously.
        //asyncHandler.pushDataToKafkaConnector(indexNameVsDocumentsToBeIndexed);

        return responseHash;

    }

    private void enrichAuditDetails(IngestRequest ingestRequest) {
        AuditDetails auditDetails = AuditDetails.builder().createdBy(ingestRequest.getRequestInfo().getUserInfo().getUuid())
                                                          .lastModifiedBy(ingestRequest.getRequestInfo().getUserInfo().getUuid())
                                                          .lastModifiedTime(System.currentTimeMillis())
                                                          .createdTime(System.currentTimeMillis())
                                                          .build();
        ingestRequest.getIngestData().forEach(data -> {
            data.setAuditDetails(auditDetails);
        });
    }

    public void ingestMasterData(MasterDataRequest masterDataRequest) {

        ingestValidator.verifyCrossStateMasterDataRequest(masterDataRequest);

        // Validates whether the fields configured for a given module are present in payload
        ingestValidator.verifyMasterDataStructure(masterDataRequest.getMasterData());

        ingestValidator.verifyIfMasterDataAlreadyIngested(masterDataRequest.getMasterData());

        Map<String, List<String>> indexNameVsDocumentsToBeIndexed = new HashMap<>();

        // Flattens incoming ingest payload
        List<String> flattenedIndexPayload = customIndexRequestDecorator.createFlattenedMasterDataRequest(masterDataRequest.getMasterData());

        // Repository layer call for performing bulk indexing
        indexNameVsDocumentsToBeIndexed.put(applicationProperties.getMasterDataIndex(), flattenedIndexPayload);
        repository.indexFlattenedDataToES(indexNameVsDocumentsToBeIndexed);

    }

}
