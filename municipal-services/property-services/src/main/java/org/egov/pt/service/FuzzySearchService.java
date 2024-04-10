package org.egov.pt.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.repository.ElasticSearchRepository;
import org.egov.pt.repository.PropertyRepository;
import org.egov.pt.web.contracts.FuzzySearchCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.egov.pt.util.PTConstants.ES_DATA_PATH;


@Component
public class FuzzySearchService {

    private ElasticSearchRepository elasticSearchRepository;

    private ObjectMapper mapper;

    private PropertyRepository propertyRepository;

    private PropertyConfiguration config;

    @Autowired
    public FuzzySearchService(ElasticSearchRepository elasticSearchRepository, ObjectMapper mapper, PropertyRepository repository,PropertyConfiguration config) {
        this.elasticSearchRepository = elasticSearchRepository;
        this.mapper = mapper;
        this.propertyRepository = repository;
        this.config=config;
    }


    public List<Property> getProperties(RequestInfo requestInfo, PropertyCriteria criteria) {

        if(criteria.getTenantId() == null)
        {	criteria.setTenantId(config.getStateLevelTenantId()); }

        List<String> idsFromDB = propertyRepository.getPropertyIds(criteria);

        if(CollectionUtils.isEmpty(idsFromDB))
            return new LinkedList<>();

        validateFuzzySearchCriteria(criteria);

        Object esResponse = elasticSearchRepository.fuzzySearchProperties(criteria, idsFromDB);

        Map<String, Set<String>> tenantIdToPropertyId = getTenantIdToPropertyIdMap(esResponse);

        List<Property> properties = new LinkedList<>();

        for (Map.Entry<String, Set<String>> entry : tenantIdToPropertyId.entrySet()) {
            String tenantId = entry.getKey();
            Set<String> propertyIds = entry.getValue();

            PropertyCriteria propertyCriteria = PropertyCriteria.builder().tenantId(tenantId).propertyIds(propertyIds).build();

            properties.addAll(propertyRepository.getPropertiesWithOwnerInfo(propertyCriteria,requestInfo,false));

        }

        List<Property> orderedProperties = orderByESScore(properties, esResponse);

        return orderedProperties;
    }

    private List<Property> orderByESScore(List<Property> properties, Object esResponse){

        List<Property> orderedProperties = new LinkedList<>();

        if(!CollectionUtils.isEmpty(properties)){

            List<Map<String, Object>> data;
            Map<String, Property> idToPropertyMap = new LinkedHashMap<>();

            properties.forEach(property -> {
                idToPropertyMap.put(property.getPropertyId(),property);
            });


            try {
                data = JsonPath.read(esResponse, ES_DATA_PATH);


                if (!CollectionUtils.isEmpty(data)) {

                    for (Map<String, Object> map : data) {

                        String propertyId = JsonPath.read(map, "$.propertyId");

                        orderedProperties.add(idToPropertyMap.get(propertyId));
                    }

                }

            } catch (Exception e) {
                throw new CustomException("PARSING_ERROR", "Failed to extract propertyIds from es response");
            }

        }

        return orderedProperties;
    }


    /**
     * Creates a map of tenantId to propertyIds from es response
     *
     * @param esResponse
     * @return
     */
    private Map<String, Set<String>> getTenantIdToPropertyIdMap(Object esResponse) {

        List<Map<String, Object>> data;
        Map<String, Set<String>> tenantIdToPropertyIds = new LinkedHashMap<>();


        try {
            data = JsonPath.read(esResponse, ES_DATA_PATH);


            if (!CollectionUtils.isEmpty(data)) {

                for (Map<String, Object> map : data) {

                    String tenantId = JsonPath.read(map, "$.tenantData.code");
                    String propertyId = JsonPath.read(map, "$.propertyId");

                    if (tenantIdToPropertyIds.containsKey(tenantId))
                        tenantIdToPropertyIds.get(tenantId).add(propertyId);
                    else {
                        Set<String> propertyIds = new HashSet<>();
                        propertyIds.add(propertyId);
                        tenantIdToPropertyIds.put(tenantId, propertyIds);
                    }

                }

            }

        } catch (Exception e) {
            throw new CustomException("PARSING_ERROR", "Failed to extract propertyIds from es response");
        }

        return tenantIdToPropertyIds;
    }


    /**
     * Validates the search params
     * @param criteria
     */
    private void validateFuzzySearchCriteria(PropertyCriteria criteria){

        if(criteria.getOldPropertyId() == null && criteria.getName() == null && criteria.getDoorNo() == null)
            throw new CustomException("INVALID_SEARCH_CRITERIA","The search criteria is invalid");

    }


}
