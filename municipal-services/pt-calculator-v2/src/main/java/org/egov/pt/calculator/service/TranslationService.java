package org.egov.pt.calculator.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.calculator.repository.Repository;
import org.egov.pt.calculator.web.models.CalculationReq;
import org.egov.pt.calculator.web.models.property.RequestInfoWrapper;
import org.egov.pt.calculator.web.models.propertyV2.*;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.egov.pt.calculator.util.CalculatorConstants.*;

@Service
public class TranslationService {



    @Value("${egov.pt.registry.host}")
    String ptRegistryHost;

    @Value("${egov.pt.registry.search}")
    String ptSearchEndpoint;

    private ObjectMapper mapper;

    private Repository repository;


    @Autowired
    public TranslationService(ObjectMapper mapper, Repository repository) {
        this.mapper = mapper;
        this.repository = repository;
    }



    public CalculationReq translate(AssessmentRequestV2 assessmentRequestV2){

        RequestInfo requestInfo = assessmentRequestV2.getRequestInfo();
        AssessmentV2 assessment = assessmentRequestV2.getAssessment();

        PropertyV2 property = getProperty(assessmentRequestV2);

        if(!CollectionUtils.isEmpty(assessment.getUnitUsageList()))
            enrichPropertyFromAssessment(property, assessment);


        if(property==null)
            throw new CustomException("INVALID_PROPERTYID","No property found for the given assessment");

        Map<String, Object> propertyMap = new HashMap();
        Map<String, Object> propertyDetail = new HashMap<>();

        Map<String, Object> addressMap = new HashMap();
        Map<String, Object> localityMap = new HashMap();
        localityMap.put("area",property.getAddress().getLocality().getArea());
        localityMap.put("code",property.getAddress().getLocality().getCode());
        addressMap.put("locality",localityMap);

        propertyMap.put("address", addressMap);
        propertyMap.put("propertyId",property.getPropertyId());
        propertyMap.put("tenantId", property.getTenantId());
        propertyMap.put("acknowldgementNumber", property.getAcknowldgementNumber());
        propertyMap.put("oldPropertyId", property.getOldPropertyId());
        propertyMap.put("status", property.getStatus());
        propertyMap.put("creationReason", property.getCreationReason());
        propertyMap.put("occupancyDate", null);

        String[] propertyTypeMasterData = property.getPropertyType().split("\\.");
        String propertyType = null,propertySubType = null;
        propertyType = propertyTypeMasterData[0];
        if(propertyTypeMasterData.length > 1)
            propertySubType = propertyTypeMasterData[1];

        String[] usageCategoryMasterData = property.getUsageCategory().split("\\.");
        String usageCategoryMajor = null,usageCategoryMinor = null;
        usageCategoryMajor = usageCategoryMasterData[0];
        if(usageCategoryMasterData.length > 1)
            usageCategoryMinor = usageCategoryMasterData[1];

        String[] ownershipCategoryMasterData  = property.getOwnershipCategory().split("\\.");
        String ownershipCategory = null,subOwnershipCategory = null;
        ownershipCategory = ownershipCategoryMasterData[0];
        if(ownershipCategoryMasterData.length > 1)
            subOwnershipCategory = ownershipCategoryMasterData[1];


        propertyDetail.put("noOfFloors", property.getNoOfFloors());
        propertyDetail.put("landArea", property.getLandArea());
        propertyDetail.put("buildUpArea", property.getSuperBuiltUpArea());
        propertyDetail.put("financialYear", assessment.getFinancialYear());
        propertyDetail.put("propertyType", propertyType);
        propertyDetail.put("propertySubType", propertySubType);
        propertyDetail.put("assessmentNumber", assessment.getAssessmentNumber());
        propertyDetail.put("assessmentDate", assessment.getAssessmentDate());
        propertyDetail.put("usageCategoryMajor", usageCategoryMajor);
        propertyDetail.put("usageCategoryMinor", usageCategoryMinor);
        propertyDetail.put("ownershipCategory", ownershipCategory);
        propertyDetail.put("subOwnershipCategory", subOwnershipCategory);

        // propertyDetail.put("adhocExemption", );
        // propertyDetail.put("adhocPenalty",);

        List<Map<String, Object>> owners = new LinkedList<>();

        property.getOwners().forEach(ownerInfo -> {
            Map<String, Object> owner = mapper.convertValue(ownerInfo,  new TypeReference<Map<String, Object>>() {});
            owners.add(owner);
        });

        List<Map<String, Object>> units = new LinkedList<>();

        if(!CollectionUtils.isEmpty(property.getUnits()))
            property.getUnits().forEach(unit -> {
                Map<String, Object> unitMap = new HashMap<>();
                unitMap.put("id",unit.getId());
                unitMap.put("floorNo", unit.getFloorNo());
                unitMap.put("unitArea", unit.getConstructionDetail().getBuiltUpArea());
                unitMap.put("arv", unit.getArv());
                unitMap.put("occupancyType", unit.getOccupancyType());

                String[] masterData = unit.getUsageCategory().split("\\.");

                if(masterData.length >= 1)
                    unitMap.put("usageCategoryMajor", masterData[0]);

                if(masterData.length >= 2)
                    unitMap.put("usageCategoryMinor", masterData[1]);

                if(masterData.length >= 3)
                    unitMap.put("usageCategorySubMinor", masterData[2]);

                if(masterData.length >= 4)
                    unitMap.put("usageCategoryDetail",masterData[3]);

                unitMap.put("additionalDetails", unit.getAdditionalDetails());
                units.add(unitMap);

            });

        if(assessment.getAdditionalDetails()!=null){
            // propertyDetail.put("adhocPenalty",);
            try{
                if(assessment.getAdditionalDetails().get(ADHOC_REBATE_KEY)!=null && !assessment.getAdditionalDetails().get(ADHOC_REBATE_KEY).isNull()){
                    BigDecimal adhocExemption = new BigDecimal(assessment.getAdditionalDetails().get(ADHOC_REBATE_KEY).doubleValue());
                    propertyDetail.put("adhocExemption",adhocExemption);
                }

                if(assessment.getAdditionalDetails().get(ADHOC_REBATE_REASON_KEY)!=null)
                    propertyDetail.put("adhocExemptionReason",assessment.getAdditionalDetails().get(ADHOC_REBATE_REASON_KEY).asText());


                if(assessment.getAdditionalDetails().get(ADHOC_PENALTY_KEY)!=null && !assessment.getAdditionalDetails().get(ADHOC_PENALTY_KEY).isNull()){
                    BigDecimal adhocPenalty = new BigDecimal(assessment.getAdditionalDetails().get(ADHOC_PENALTY_KEY).doubleValue());
                    propertyDetail.put("adhocPenalty",adhocPenalty);
                }

                if(assessment.getAdditionalDetails().get(ADHOC_PENALTY_REASON_KEY)!=null)
                    propertyDetail.put("adhocPenaltyReason", assessment.getAdditionalDetails().get(ADHOC_PENALTY_REASON_KEY).asText());
            } catch (Exception e){
                throw new CustomException("PARSING_ERROR","Failed to parse additional details in translation");
            }

        }


        propertyDetail.put("owners", owners);
        propertyDetail.put("units", units);

        propertyMap.put("propertyDetails", Collections.singletonList(propertyDetail));

        Map<String, Object> calculationCriteria = new HashMap<>();
        calculationCriteria.put("property", propertyMap);
        calculationCriteria.put("tenantId", property.getTenantId());

        Map<String, Object> calculationReq = new HashMap<>();
        calculationReq.put("RequestInfo", requestInfo);
        calculationReq.put("CalculationCriteria", Collections.singletonList(calculationCriteria));

        return mapper.convertValue(calculationReq, CalculationReq.class);

    }


    /**
     * Fetches the property corresponding to given assessment
     * @param assessmentRequestV2 The assessment request for which property has to be fetched
     * @return
     */
    private PropertyV2 getProperty(AssessmentRequestV2 assessmentRequestV2){

        RequestInfo requestInfo = assessmentRequestV2.getRequestInfo();
        RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();

        AssessmentV2 assessmentV2 = assessmentRequestV2.getAssessment();

        StringBuilder url = new StringBuilder(ptRegistryHost);
        url.append(ptSearchEndpoint);
        url.append("?tenantId=");
        url.append(assessmentV2.getTenantId());
        url.append("&");
        url.append("propertyIds=");
        url.append(assessmentV2.getPropertyId());

        PropertyResponseV2 propertyResponseV2 = mapper.convertValue(repository.fetchResult(url, requestInfoWrapper), PropertyResponseV2.class);

        if(CollectionUtils.isEmpty(propertyResponseV2.getProperties()))
            throw new CustomException("INVALID_REQUEST", "The propertyId: "+assessmentRequestV2.getAssessment().getPropertyId()+" is not found in the system");

        return propertyResponseV2.getProperties().get(0);

    }


    /**
     * Enriches Units from unitUsages from assessment
     * @param property Property for which assessment is done
     * @param assessment
     */
    private void enrichPropertyFromAssessment(PropertyV2 property, AssessmentV2 assessment){

        Map<String, UnitUsage> unitIdToUnitUsage = assessment.getUnitUsageList().stream().collect(Collectors.toMap(UnitUsage::getUnitId, Function.identity()));

        List<UnitV2> units  = property.getUnits();

        for(UnitV2 unit : units){

            if(unitIdToUnitUsage.containsKey(unit.getId())){
                UnitUsage unitUsage = unitIdToUnitUsage.get(unit.getId());
                if(unitUsage.getOccupancyDate()!=null)
                    unit.setOccupancyDate(unitUsage.getOccupancyDate());

                if(unitUsage.getOccupancyType()!=null)
                    unit.setOccupancyType(unitUsage.getOccupancyType());

                if(unitUsage.getUsageCategory()!=null)
                    unit.setUsageCategory(unitUsage.getUsageCategory());
            }
        }

    }



}