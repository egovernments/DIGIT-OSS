package org.egov.egovnationaldashboardingest.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.egovnationaldashboardingest.web.models.Data;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ChooseCustomDecorator {
    /*
    private final Map<String, CustomIndexRequestDecorator> servicesByModuleCode;

    @Autowired
    public ChooseCustomDecorator(List<CustomIndexRequestDecorator> customIndexRequestDecorators){
        this.servicesByModuleCode = customIndexRequestDecorators.stream().collect(Collectors.toMap(CustomIndexRequestDecorator::getModuleCode, Function.identity()));
    }

    public List<String> selectDecoratorAndCreateFlattenedIndexPayload(String moduleCode, Data ingestData){
        if(!servicesByModuleCode.containsKey(moduleCode)){
            throw new CustomException("EG_INGEST_ERR", "Custom decorator is not present for module: " + moduleCode);
        }
        // Selects the decorator to flatten data according to the module code present in the request
        CustomIndexRequestDecorator requestDecoratorService = servicesByModuleCode.get(moduleCode);

        // Creates the flattened ES Index Request
        List<String> flattenedPayload = requestDecoratorService.createFlattenedIndexRequest(ingestData);
        log.info(flattenedPayload.toString());

        return flattenedPayload;
    }

     */
}
