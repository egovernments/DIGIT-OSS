package org.egov.egovnationaldashboardingest.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.egovnationaldashboardingest.config.ApplicationProperties;
import org.egov.egovnationaldashboardingest.repository.ElasticSearchRepository;
import org.egov.egovnationaldashboardingest.validators.IngestValidator;
import org.egov.egovnationaldashboardingest.web.models.IngestRequest;
import org.egov.egovnationaldashboardingest.web.models.MasterDataRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public void ingestData(IngestRequest ingestRequest) {

        // Validates that no cross state data is being ingested, i.e. employee of state X cannot insert data for state Y
        ingestValidator.verifyCrossStateRequest(ingestRequest);

        // Validates whether the fields configured for a given module are present in payload
        ingestValidator.verifyDataStructure(ingestRequest.getIngestData());

        // Validate if record for the day is already present
        ingestValidator.verifyIfDataAlreadyIngested(ingestRequest.getIngestData());

        String moduleCode = ingestRequest.getIngestData().getModule();

        // Flattens incoming ingest payload
        List<String> flattenedIndexPayload = customIndexRequestDecorator.createFlattenedIndexRequest(ingestRequest.getIngestData());

        // Repository layer call for performing bulk indexing
        repository.indexFlattenedDataToES(applicationProperties.getModuleIndexMapping().get(moduleCode), flattenedIndexPayload);

    }

    public void ingestMasterData(MasterDataRequest masterDataRequest) {

        ingestValidator.verifyCrossStateMasterDataRequest(masterDataRequest);

        // Validates whether the fields configured for a given module are present in payload
        ingestValidator.verifyMasterDataStructure(masterDataRequest.getMasterData());

        ingestValidator.verifyIfMasterDataAlreadyIngested(masterDataRequest.getMasterData());

        // Flattens incoming ingest payload
        List<String> flattenedIndexPayload = customIndexRequestDecorator.createFlattenedMasterDataRequest(masterDataRequest.getMasterData());

        // Repository layer call for performing bulk indexing
        repository.indexFlattenedDataToES(applicationProperties.getMasterDataIndex(), flattenedIndexPayload);

    }

}
