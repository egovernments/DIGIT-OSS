package org.egov.pt.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.producer.Producer;
import org.egov.pt.repository.PropertyRepository;
import org.egov.pt.validator.PropertyValidator;
import org.egov.pt.web.models.*;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;

@Service
public class PropertyService {

    @Autowired
    private Producer producer;

    @Autowired
    private PropertyConfiguration config;

    @Autowired
    private PropertyRepository repository;

    @Autowired
    private EnrichmentService enrichmentService;

    @Autowired
    private PropertyValidator propertyValidator;

    @Autowired
    private UserService userService;

    @Autowired
    private CalculationService calculationService;


    /**
     * Assign ids through enrichment and pushes to kafka
     *
     * @param request PropertyRequest containing list of properties to be created
     * @return List of properties successfully created
     */
    public List<Property> createProperty(PropertyRequest request) {
        propertyValidator.validateCreateRequest(request);
        enrichmentService.enrichCreateRequest(request, false);
        userService.createUser(request);
        userService.createCitizen(request);
        calculationService.calculateTax(request);
        producer.push(config.getSavePropertyTopic(), request);
        return request.getProperties();
    }


    /**
     * Search property with given PropertyCriteria
     *
     * @param criteria PropertyCriteria containing fields on which search is based
     * @return list of properties satisfying the containing fields in criteria
     */
    public List<Property> searchProperty(PropertyCriteria criteria, RequestInfo requestInfo) {
        List<Property> properties;
        propertyValidator.validatePropertyCriteria(criteria, requestInfo);
        if (criteria.getMobileNumber() != null || criteria.getName() != null) {
            UserDetailResponse userDetailResponse = userService.getUser(criteria, requestInfo);
            // If user not found with given user fields return empty list
            if (userDetailResponse.getUser().size() == 0) {
                return Collections.emptyList();
            }
            // Add the user uuid to search property
            enrichmentService.enrichPropertyCriteriaWithOwnerids(criteria, userDetailResponse);
            properties = repository.getProperties(criteria);
            // If property not found with given propertyId or oldPropertyId or address fields return empty list
            if (properties.size() == 0) {
                return Collections.emptyList();
            }
            // Add propertyIds of all properties owned by the user
            criteria = enrichmentService.getPropertyCriteriaFromPropertyIds(properties);
            //Get all properties with ownerInfo enriched from user service
            properties = getPropertiesWithOwnerInfo(criteria, requestInfo);
        } else {
            properties = getPropertiesWithOwnerInfo(criteria, requestInfo);
        }
        enrichmentService.enrichBoundary(new PropertyRequest(requestInfo, properties));
        return properties;
    }

    public List<Property> searchPropertyPlainSearch(PropertyCriteria criteria, RequestInfo requestInfo) {
        List<Property> properties = getPropertiesPlainSearch(criteria, requestInfo);
        enrichmentService.enrichBoundary(new PropertyRequest(requestInfo, properties));
        return properties;
    }

    /**
     * Returns list of properties based on the given propertyCriteria with owner fields populated from user service
     *
     * @param criteria    PropertyCriteria on which to search properties
     * @param requestInfo RequestInfo object of the request
     * @return properties with owner information added from user service
     */
    List<Property> getPropertiesWithOwnerInfo(PropertyCriteria criteria, RequestInfo requestInfo) {
        List<Property> properties = repository.getProperties(criteria);
        if (CollectionUtils.isEmpty(properties))
            return Collections.emptyList();
        enrichmentService.enrichPropertyCriteriaWithOwnerids(criteria, properties);
        UserDetailResponse userDetailResponse = userService.getUser(criteria, requestInfo);
        enrichmentService.enrichOwner(userDetailResponse, properties);
        return properties;
    }

    List<Property> getPropertiesPlainSearch(PropertyCriteria criteria, RequestInfo requestInfo) {
        List<Property> properties = repository.getPropertiesPlainSearch(criteria);
        enrichmentService.enrichPropertyCriteriaWithOwnerids(criteria, properties);
        UserDetailResponse userDetailResponse = userService.getUser(criteria, requestInfo);
        enrichmentService.enrichOwner(userDetailResponse, properties);
        return properties;
    }

    /**
     * Updates the property
     *
     * @param request PropertyRequest containing list of properties to be update
     * @return List of updated properties
     */
    public List<Property> updateProperty(PropertyRequest request) {
        userService.createCitizen(request);
        propertyValidator.validateUpdateRequest(request);
        enrichmentService.enrichCreateRequest(request, true);
        userService.createUser(request);
        calculationService.calculateTax(request);
        producer.push(config.getUpdatePropertyTopic(), request);
        return request.getProperties();
    }


    public List<Property> cancelProperty(PropertyCancelCriteria propertyCancelCriteria, RequestInfo requestInfo) {
        PropertyCriteria searchCriteria = PropertyCriteria.builder()
                .ids(new HashSet<>(Arrays.asList(propertyCancelCriteria.getPropertyId())))
                .tenantId(propertyCancelCriteria.getTenantId())
                .statuses(Arrays.asList(PropertyInfo.StatusEnum.values()))
                .build();

        List<Property> properties = getPropertiesWithOwnerInfo(searchCriteria, requestInfo);;

        if (properties.size() > 0 && properties.get(0).getPropertyDetails().size() > 0) {
            // inactivate/cancel the property
            if (propertyCancelCriteria.getAction().equals(PropertyCancelCriteria.PropertyCancelAction.CANCEL_PROPERTY)) {
                properties.get(0).setStatus(PropertyInfo.StatusEnum.fromValue(propertyCancelCriteria.getStatus().toString()));
                producer.push(config.getCancelPropertyTopic(), new HashMap<String, Object>() {{
                    put("Properties", properties);
                }});
            } else {
                // Cancel the assessments
                properties.get(0).getPropertyDetails().stream().forEach(
                        pd -> {
                            if (propertyCancelCriteria.getAssessmentNumbers().contains(pd.getAssessmentNumber())) {
                                pd.setStatus(PropertyDetail.StatusEnum.fromValue(propertyCancelCriteria.getStatus()));
                            }
                        });
                Boolean hasActiveProperty = properties.get(0).getPropertyDetails().stream().anyMatch(pd -> pd.getStatus().equals(PropertyDetail.StatusEnum.ACTIVE));

                if (!hasActiveProperty) {
                    throw  new CustomException("CANT_DEACTIVATE_ALL", "At least one assessments needs to be kept active for the property");
                }
                producer.push(config.getCancelPropertyAssessmentTopic(), new HashMap<String, Object>() {{
                    put("Properties", properties);
                }});
            }
        }

        return properties;
    }
}