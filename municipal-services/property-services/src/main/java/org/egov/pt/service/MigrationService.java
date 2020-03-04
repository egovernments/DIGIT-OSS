package org.egov.pt.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.*;
import org.egov.pt.models.Address;
import org.egov.pt.models.UnitUsage;
import org.egov.pt.models.enums.*;
import org.egov.pt.models.oldProperty.*;
import org.egov.pt.producer.Producer;
import org.egov.pt.repository.AssessmentRepository;
import org.egov.pt.util.AssessmentUtils;
import org.egov.pt.util.ErrorConstants;
import org.egov.pt.util.PTConstants;
import org.egov.pt.validator.AssessmentValidator;
import org.egov.pt.validator.PropertyValidator;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.egov.pt.web.contracts.PropertyRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.*;


@Service
public class MigrationService {

    @Autowired
    private Producer producer;

    @Autowired
    private AssessmentValidator validator;

    @Autowired
    private PropertyConfiguration config;

    @Autowired
    private PropertyValidator propertyValidator;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private AssessmentUtils AssmtUtils;

    @Autowired
    private AssessmentRepository assessmentRepository;


    public List<Property> migrateProperty(RequestInfo requestInfo, List<OldProperty> oldProperties) {

        List<Property> properties = new ArrayList<>();
        for(OldProperty oldProperty : oldProperties){
            Property property = new Property();
            property.setId(UUID.randomUUID().toString());
            property.setPropertyId(oldProperty.getPropertyId());
            property.setTenantId(oldProperty.getTenantId());
            property.setAccountId(requestInfo.getUserInfo().getUuid());
            property.setOldPropertyId(oldProperty.getOldPropertyId());
            property.setStatus(Status.fromValue(oldProperty.getStatus().toString()));
            property.setAddress(migrateAddress(oldProperty.getAddress()));
            property.setAcknowldgementNumber(oldProperty.getAcknowldgementNumber());

            Collections.sort(oldProperty.getPropertyDetails(), new Comparator<PropertyDetail>() {
                @Override
                public int compare(PropertyDetail pd1, PropertyDetail pd2) {
                    return pd1.getAuditDetails().getCreatedTime().compareTo(pd2.getAuditDetails().getCreatedTime());
                }
            });

            for(int i=0;i< oldProperty.getPropertyDetails().size();i++){
                property.setPropertyType(oldProperty.getPropertyDetails().get(i).getPropertyType());
                property.setOwnershipCategory(migrateOwnwershipCategory(oldProperty.getPropertyDetails().get(i)));
                property.setOwners(migrateOwnerInfo(oldProperty.getPropertyDetails().get(i).getOwners()));

                if(oldProperty.getPropertyDetails().get(i).getInstitution() == null)
                    property.setInstitution(null);
                else
                    property.setInstitution(migrateInstitution(oldProperty.getPropertyDetails().get(i).getInstitution()));

                if(!StringUtils.isEmpty(oldProperty.getCreationReason()))
                    property.setCreationReason(CreationReason.fromValue(String.valueOf(oldProperty.getCreationReason())));

                property.setUsageCategory(migrateUsageCategory(oldProperty.getPropertyDetails().get(i)));
                property.setNoOfFloors(oldProperty.getPropertyDetails().get(i).getNoOfFloors());

                if(!StringUtils.isEmpty(oldProperty.getPropertyDetails().get(i).getBuildUpArea()))
                    property.setSuperBuiltUpArea(BigDecimal.valueOf(oldProperty.getPropertyDetails().get(i).getBuildUpArea()));

                if(!StringUtils.isEmpty(oldProperty.getPropertyDetails().get(i).getLandArea()))
                    property.setLandArea(Double.valueOf(oldProperty.getPropertyDetails().get(i).getLandArea()));

                if(!StringUtils.isEmpty(oldProperty.getPropertyDetails().get(i).getSource()))
                    property.setSource(Source.fromValue(String.valueOf(oldProperty.getPropertyDetails().get(i).getSource())));

                if(!StringUtils.isEmpty(oldProperty.getPropertyDetails().get(i).getChannel()))
                    property.setChannel(Channel.fromValue(String.valueOf(oldProperty.getPropertyDetails().get(i).getChannel())));

                if(oldProperty.getPropertyDetails().get(i).getDocuments() == null)
                    property.setDocuments(null);
                else
                    property.setDocuments(migrateDocument(oldProperty.getPropertyDetails().get(i).getDocuments()));

                if(oldProperty.getPropertyDetails().get(i).getUnits() == null)
                    property.setUnits(null);
                else
                    property.setUnits(migrateUnit(oldProperty.getPropertyDetails().get(i).getUnits()));

                if(oldProperty.getPropertyDetails().get(i).getAdditionalDetails() == null)
                    property.setAdditionalDetails(null);
                else{
                    JsonNode additionalDetails = mapper.convertValue(oldProperty.getPropertyDetails().get(i).getAdditionalDetails(),JsonNode.class);
                    property.setAdditionalDetails(additionalDetails);
                }


                if(oldProperty.getOldAuditDetails() == null)
                    property.setAuditDetails(null);
                else
                    property.setAuditDetails(migrateAuditDetails(oldProperty.getOldAuditDetails()));


                properties.add(property);
                PropertyRequest request = PropertyRequest.builder().requestInfo(requestInfo).property(property).build();
                propertyValidator.validateCreateRequest(request);
                if(i==0)
                    producer.push(config.getSavePropertyTopic(), request);
                else
                    producer.push(config.getUpdatePropertyTopic(), request);

                migrateAssesment(oldProperty.getPropertyDetails().get(i),property,requestInfo);



            }

        }

        return properties;
    }

    public Address migrateAddress(org.egov.pt.models.oldProperty.Address oldAddress){
        Address address = new Address();
        address.setTenantId(oldAddress.getTenantId());
        address.setDoorNo(oldAddress.getDoorNo());
        //address.setPlotNo();
        address.setId(oldAddress.getId());
        address.setLandmark(oldAddress.getLandmark());
        address.setCity(oldAddress.getCity());
        //address.setDistrict();
        //address.setRegion();
        //address.setState();
        //address.setCountry();
        address.setPincode(oldAddress.getPincode());
        address.setBuildingName(oldAddress.getBuildingName());
        address.setStreet(oldAddress.getStreet());
        address.setLocality(migrateLocality(oldAddress.getLocality()));
        address.setAdditionalDetails(oldAddress.getAdditionalDetails());
        address.setGeoLocation(migrateGeoLocation(oldAddress));


        return  address;
    }

    public Locality migrateLocality(Boundary oldLocality){
        Locality locality = new Locality();
        locality.setCode(oldLocality.getCode());
        locality.setName(oldLocality.getName());
        locality.setLabel(oldLocality.getLabel());
        locality.setLatitude(oldLocality.getLatitude());
        locality.setLongitude(oldLocality.getLongitude());
        locality.setArea(oldLocality.getArea());
        locality.setMaterializedPath(oldLocality.getMaterializedPath());
        locality.setChildren(setmigrateLocalityList(oldLocality.getChildren()));
        return  locality;
    }

    public List<Locality> setmigrateLocalityList(List<Boundary> oldchildrenList){
        List<Locality> childrenList = new ArrayList<>();
        for(Boundary oldChildren : oldchildrenList ){
            childrenList.add(migrateLocality(oldChildren));
        }
        return childrenList;
    }

    public GeoLocation migrateGeoLocation(org.egov.pt.models.oldProperty.Address oldAddress){
        GeoLocation geoLocation = new GeoLocation();
        if(oldAddress.getLatitude() == null)
            geoLocation.setLongitude(null);
        else
            geoLocation.setLatitude(Double.valueOf(oldAddress.getLatitude()));

        if(oldAddress.getLongitude() == null)
            geoLocation.setLongitude(null);
        else
            geoLocation.setLongitude(Double.valueOf(oldAddress.getLongitude()));
        return  geoLocation;
    }

    public List<OwnerInfo> migrateOwnerInfo(Set<OldOwnerInfo> oldOwnerInfosSet){
        List<OwnerInfo> ownerInfolist = new ArrayList<>();
        for(OldOwnerInfo oldOwnerInfo : oldOwnerInfosSet){
            OwnerInfo ownerInfo = new OwnerInfo();
            ownerInfo.setId(oldOwnerInfo.getId());
            ownerInfo.setUuid(oldOwnerInfo.getUuid());
            ownerInfo.setUserName(oldOwnerInfo.getUserName());
            ownerInfo.setPassword(oldOwnerInfo.getPassword());
            ownerInfo.setSalutation(oldOwnerInfo.getSalutation());
            ownerInfo.setName(oldOwnerInfo.getName());
            ownerInfo.setEmailId(oldOwnerInfo.getEmailId());
            ownerInfo.setAltContactNumber(oldOwnerInfo.getAltContactNumber());
            ownerInfo.setPan(oldOwnerInfo.getPan());
            ownerInfo.setAadhaarNumber(oldOwnerInfo.getAadhaarNumber());
            ownerInfo.setPermanentAddress(oldOwnerInfo.getPermanentAddress());
            ownerInfo.setPermanentCity(oldOwnerInfo.getPermanentCity());
            ownerInfo.setPermanentPincode(oldOwnerInfo.getPermanentPincode());
            ownerInfo.setCorrespondenceAddress(oldOwnerInfo.getCorrespondenceAddress());
            ownerInfo.setCorrespondenceCity(oldOwnerInfo.getCorrespondenceCity());
            ownerInfo.setCorrespondencePincode(oldOwnerInfo.getCorrespondencePincode());
            ownerInfo.setActive(oldOwnerInfo.getActive());
            ownerInfo.setDob(oldOwnerInfo.getDob());
            ownerInfo.setPwdExpiryDate(oldOwnerInfo.getPwdExpiryDate());
            ownerInfo.setLocale(oldOwnerInfo.getLocale());
            ownerInfo.setType(oldOwnerInfo.getType());
            ownerInfo.setSignature(oldOwnerInfo.getSignature());
            ownerInfo.setAccountLocked(oldOwnerInfo.getAccountLocked());
            ownerInfo.setRoles(oldOwnerInfo.getRoles());
            ownerInfo.setBloodGroup(oldOwnerInfo.getBloodGroup());
            ownerInfo.setIdentificationMark(oldOwnerInfo.getIdentificationMark());
            ownerInfo.setPhoto(oldOwnerInfo.getPhoto());
            ownerInfo.setCreatedBy(oldOwnerInfo.getCreatedBy());
            ownerInfo.setCreatedDate(oldOwnerInfo.getCreatedDate());
            ownerInfo.setLastModifiedBy(oldOwnerInfo.getLastModifiedBy());
            ownerInfo.setLastModifiedDate(oldOwnerInfo.getLastModifiedDate());
            ownerInfo.setTenantId(oldOwnerInfo.getTenantId());
            ownerInfo.setOwnerInfoUuid(UUID.randomUUID().toString());
            ownerInfo.setMobileNumber(oldOwnerInfo.getMobileNumber());
            ownerInfo.setGender(oldOwnerInfo.getGender());
            ownerInfo.setFatherOrHusbandName(oldOwnerInfo.getFatherOrHusbandName());
            ownerInfo.setCorrespondenceAddress(oldOwnerInfo.getCorrespondenceAddress());
            ownerInfo.setIsPrimaryOwner(oldOwnerInfo.getIsPrimaryOwner());
            ownerInfo.setOwnerShipPercentage(oldOwnerInfo.getOwnerShipPercentage());
            ownerInfo.setOwnerType(oldOwnerInfo.getOwnerType());
            ownerInfo.setInstitutionId(oldOwnerInfo.getInstitutionId());
            ownerInfo.setStatus(Status.ACTIVE);
            if(oldOwnerInfo.getOldDocuments() == null)
                ownerInfo.setDocuments(null);
            else
                ownerInfo.setDocuments(migrateDocument(oldOwnerInfo.getOldDocuments()));

            ownerInfo.setRelationship(Relationship.fromValue(String.valueOf(oldOwnerInfo.getRelationship())));

            ownerInfolist.add(ownerInfo);
        }
        return ownerInfolist;
    }

    public Institution migrateInstitution(OldInstitution oldInstitution){
        Institution newInstitution = new Institution();
        newInstitution.setId(oldInstitution.getId());
        newInstitution.setTenantId(oldInstitution.getTenantId());
        newInstitution.setName(oldInstitution.getName());
        newInstitution.setType(oldInstitution.getType());
        newInstitution.setDesignation(oldInstitution.getDesignation());
        //newInstitution.setNameOfAuthorizedPerson();
        newInstitution.setAdditionalDetails(oldInstitution.getAdditionalDetails());

        return newInstitution;

    }

    public String migrateUsageCategory(PropertyDetail propertyDetail){
        StringBuilder usageCategory = new StringBuilder();

        if(StringUtils.isEmpty(propertyDetail.getUsageCategoryMajor()))
            return null;
        else
            usageCategory.append(propertyDetail.getUsageCategoryMajor());

        if(!StringUtils.isEmpty(propertyDetail.getUsageCategoryMinor()))
            usageCategory.append(".").append(propertyDetail.getUsageCategoryMinor());

        return usageCategory.toString();
    }

    public String migrateOwnwershipCategory(PropertyDetail propertyDetail){
        StringBuilder ownershipCategory = new StringBuilder();
        if(StringUtils.isEmpty(propertyDetail.getOwnershipCategory()))
            return null;
        else
            ownershipCategory.append(propertyDetail.getOwnershipCategory());

        if(!StringUtils.isEmpty(propertyDetail.getSubOwnershipCategory()))
            ownershipCategory.append(".").append(propertyDetail.getSubOwnershipCategory());

        return ownershipCategory.toString();
    }

    public List<Unit> migrateUnit(List<OldUnit> oldUnits){
        List<Unit> units = new ArrayList<>();
        for(OldUnit oldUnit : oldUnits){
            Unit unit = new Unit();
            unit.setId(oldUnit.getId());
            unit.setTenantId(oldUnit.getTenantId());
            unit.setFloorNo(Integer.valueOf(oldUnit.getFloorNo()));
            unit.setUnitType(oldUnit.getUnitType());
            unit.setUsageCategory(migrateUnitUsageCategory(oldUnit));
            unit.setOccupancyType(oldUnit.getOccupancyType());
            unit.setOccupancyDate(oldUnit.getOccupancyDate());
            unit.setActive(oldUnit.getActive());
            unit.setConstructionDetail(migrateConstructionDetail(oldUnit));
            unit.setAdditionalDetails(oldUnit.getAdditionalDetails());
            //unit.setAuditDetails();
            unit.setArv(oldUnit.getArv());
            units.add(unit);
        }

        return  units;
    }

    public String migrateUnitUsageCategory(OldUnit oldUnit){
        StringBuilder usageCategory = new StringBuilder();
        if(StringUtils.isEmpty(oldUnit.getUsageCategoryMajor()))
            return null;
        else
            usageCategory.append(oldUnit.getUsageCategoryMajor());
        if(!StringUtils.isEmpty(oldUnit.getUsageCategoryMinor()))
            usageCategory.append(".").append(oldUnit.getUsageCategoryMinor());
        if(!StringUtils.isEmpty(oldUnit.getUsageCategorySubMinor()))
            usageCategory.append(".").append(oldUnit.getUsageCategorySubMinor());
        if(!StringUtils.isEmpty(oldUnit.getUsageCategoryDetail()))
            usageCategory.append(".").append(oldUnit.getUsageCategoryDetail());

        return usageCategory.toString();
    }

    public ConstructionDetail migrateConstructionDetail(OldUnit oldUnit){
        ConstructionDetail constructionDetail = new ConstructionDetail();
        constructionDetail.setBuiltUpArea(BigDecimal.valueOf(oldUnit.getUnitArea()));

        if (oldUnit.getConstructionType() == null){
            constructionDetail.setConstructionType(null);
            return constructionDetail;
        }

        StringBuilder constructionType = new StringBuilder(oldUnit.getConstructionType());
        if(oldUnit.getConstructionSubType() != null)
            constructionType.append(".").append(oldUnit.getConstructionSubType());
        constructionDetail.setConstructionType(constructionType.toString());

        return constructionDetail;
    }

    public List<Document> migrateDocument(Set<OldDocument> oldDocumentList){
        List<Document> documentList = new ArrayList<>();
        for(OldDocument oldDocument: oldDocumentList){
            Document doc = new Document();
            doc.setId(oldDocument.getId());
            doc.setDocumentType(oldDocument.getDocumentType());
            doc.setFileStoreId(oldDocument.getFileStore());
            doc.setDocumentUid(oldDocument.getDocumentUid());
            documentList.add(doc);
        }
        return  documentList;
    }

    public AuditDetails migrateAuditDetails(OldAuditDetails oldAuditDetails){
        AuditDetails details = new AuditDetails();
        details.setCreatedBy(oldAuditDetails.getCreatedBy());
        details.setCreatedTime(oldAuditDetails.getCreatedTime());
        details.setLastModifiedBy(oldAuditDetails.getLastModifiedBy());
        details.setLastModifiedTime(oldAuditDetails.getLastModifiedTime());
        return  details;
    }


    public void migrateAssesment(PropertyDetail propertyDetail, Property property, RequestInfo requestInfo){
        Assessment assessment = new Assessment();
        assessment.setId(String.valueOf(UUID.randomUUID()));
        assessment.setTenantId(propertyDetail.getTenantId());
        assessment.setAssessmentNumber(propertyDetail.getAssessmentNumber());
        assessment.setPropertyId(property.getPropertyId());
        assessment.setFinancialYear(propertyDetail.getFinancialYear());
        assessment.setAssessmentDate(propertyDetail.getAssessmentDate());
        if(!StringUtils.isEmpty(propertyDetail.getSource()))
            assessment.setSource(Assessment.Source.fromValue(String.valueOf(propertyDetail.getSource())));
        if(!StringUtils.isEmpty(propertyDetail.getChannel()))
            assessment.setChannel(Channel.fromValue(String.valueOf(propertyDetail.getChannel())));
        if(!StringUtils.isEmpty(propertyDetail.getStatus()))
            assessment.setStatus(Status.fromValue(String.valueOf(propertyDetail.getStatus())));

        if(propertyDetail.getDocuments() == null)
            assessment.setDocuments(null);
        else{
            List<Document> documentList = migrateDocument(propertyDetail.getDocuments());
            Set<Document> documentSet = null;
            for(Document document : documentList)
                documentSet.add(document);
            assessment.setDocuments(documentSet);
        }

        if(propertyDetail.getUnits() == null)
            assessment.setUnitUsageList(null);
        else
            assessment.setUnitUsageList(migrateUnitUsageList(propertyDetail));

        if(propertyDetail.getAdditionalDetails()!=null){
            JsonNode additionalDetails = mapper.convertValue(propertyDetail.getAdditionalDetails(),JsonNode.class);
            assessment.setAdditionalDetails(additionalDetails);
        }
        if(propertyDetail.getAuditDetails()!=null){
            AuditDetails audit = mapper.convertValue(propertyDetail.getAuditDetails(),AuditDetails.class);
            assessment.setAuditDetails(audit);
        }

        AssessmentRequest request = AssessmentRequest.builder().requestInfo(requestInfo).assessment(assessment).build();
        ValidateMigrationData(request,property);
        producer.push(config.getCreateAssessmentTopic(), request);
    }

    public List<UnitUsage> migrateUnitUsageList(PropertyDetail propertyDetail){
        List<OldUnit> oldUnits = propertyDetail.getUnits();
        List<UnitUsage> units = new ArrayList<>();
        for(OldUnit oldUnit : oldUnits){
            UnitUsage unit = new UnitUsage();
            unit.setId(String.valueOf(UUID.randomUUID()));
            unit.setUnitId(oldUnit.getId());
            unit.setTenantId(oldUnit.getTenantId());
            unit.setUsageCategory(migrateUnitUsageCategory(oldUnit));
            unit.setOccupancyType(oldUnit.getOccupancyType());
            unit.setOccupancyDate(oldUnit.getOccupancyDate());
            unit.setAuditDetails(migrateAuditDetails(propertyDetail.getAuditDetails()));
            units.add(unit);
        }

        return  units;
    }

    public void ValidateMigrationData(AssessmentRequest assessmentRequest, Property property) {
        Map<String, String> errorMap = new HashMap<>();
        validateRI(assessmentRequest.getRequestInfo(), errorMap);
        validateUnitIds(assessmentRequest.getAssessment(),property);
        validateCreateRequest(assessmentRequest.getAssessment(),property);
        commonValidations(assessmentRequest, errorMap, false);
        validateMDMSData(assessmentRequest.getRequestInfo(), assessmentRequest.getAssessment(), errorMap);
        if(config.getIsAssessmentWorkflowEnabled())
            validateWorkflowOfOtherAssessments(assessmentRequest.getAssessment());
    }

    public void validateRI(RequestInfo requestInfo, Map<String, String> errorMap) {
        if (requestInfo != null) {
            if (requestInfo.getUserInfo() != null) {
                if ((org.apache.commons.lang3.StringUtils.isEmpty(requestInfo.getUserInfo().getUuid()))
                        || (CollectionUtils.isEmpty(requestInfo.getUserInfo().getRoles()))
                        || (org.apache.commons.lang3.StringUtils.isEmpty(requestInfo.getUserInfo().getTenantId()))) {
                    errorMap.put(ErrorConstants.MISSING_ROLE_USERID_CODE, ErrorConstants.MISSING_ROLE_USERID_MSG);
                }
            } else {
                errorMap.put(ErrorConstants.MISSING_USR_INFO_CODE, ErrorConstants.MISSING_USR_INFO_MSG);
            }

        } else {
            errorMap.put(ErrorConstants.MISSING_REQ_INFO_CODE, ErrorConstants.MISSING_REQ_INFO_MSG);
        }
        if (!CollectionUtils.isEmpty(errorMap.keySet())) {
            throw new CustomException(errorMap);
        }

    }

    private void validateUnitIds(Assessment assessment, Property property){

        List<String> activeUnitIdsInAssessment = new LinkedList<>();
        List<String> activeUnitIdsInProperty = new LinkedList<>();

        if(!CollectionUtils.isEmpty(assessment.getUnitUsageList())){
            assessment.getUnitUsageList().forEach(unitUsage -> {
                activeUnitIdsInAssessment.add(unitUsage.getUnitId());
            });
        }

        if(!CollectionUtils.isEmpty(property.getUnits())){
            property.getUnits().forEach(unit -> {
                if(unit.getActive())
                    activeUnitIdsInProperty.add(unit.getId());
            });
        }

        if(!CollectionUtils.isEmpty(assessment.getUnitUsageList()) && !listEqualsIgnoreOrder(activeUnitIdsInAssessment, activeUnitIdsInProperty))
            throw new CustomException("INVALID_UNITIDS","The unitIds are not matching in property and assessment");


    }

    /**
     * Compares if two list contains same elements
     * @param list1
     * @param list2
     * @param <T>
     * @return Boolean true if both list contains the same elements irrespective of order
     */
    private static <T> boolean listEqualsIgnoreOrder(List<T> list1, List<T> list2) {
        return new HashSet<>(list1).equals(new HashSet<>(list2));
    }

    private void validateCreateRequest(Assessment assessment, Property property){

        if(!property.getStatus().equals(Status.ACTIVE))
            throw new CustomException("INVALID_REQUEST","Assessment cannot be done on inactive or property in workflow");

    }

    private void commonValidations(AssessmentRequest assessmentReq, Map<String, String> errorMap, boolean isUpdate) {
        Assessment assessment = assessmentReq.getAssessment();
        if (assessment.getAssessmentDate() > new Date().getTime()) {
            errorMap.put(ErrorConstants.ASSMENT_DATE_FUTURE_ERROR_CODE, ErrorConstants.ASSMENT_DATE_FUTURE_ERROR_MSG);
        }

        if (isUpdate) {
            if (null == assessment.getStatus()) {
                errorMap.put("ASSMNT_STATUS_EMPTY", "Assessment Status cannot be empty");
            }
        }

        else {

        }

        if (!CollectionUtils.isEmpty(errorMap.keySet())) {
            throw new CustomException(errorMap);
        }

    }

    private void validateMDMSData(RequestInfo requestInfo, Assessment assessment, Map<String, String> errorMap) {
        Map<String, List<String>> masters = fetchMaster(requestInfo, assessment.getTenantId());
        if(CollectionUtils.isEmpty(masters.keySet()))
            throw new CustomException("MASTER_FETCH_FAILED", "Couldn't fetch master data for validation");

        if(!CollectionUtils.isEmpty(assessment.getUnitUsageList())) {
            for (UnitUsage unitUsage : assessment.getUnitUsageList()) {

                if (!CollectionUtils.isEmpty(masters.get(PTConstants.MDMS_PT_USAGECATEGORY))) {
                    if (!masters.get(PTConstants.MDMS_PT_USAGECATEGORY).contains(unitUsage.getUsageCategory()))
                        errorMap.put("USAGE_CATEGORY_INVALID", "The usage category provided is invalid");
                }

                if (CollectionUtils.isEmpty(masters.get(PTConstants.MDMS_PT_OCCUPANCYTYPE))) {
                    if (!masters.get(PTConstants.MDMS_PT_OCCUPANCYTYPE).contains(unitUsage.getOccupancyType().toString()))
                        errorMap.put("OCCUPANCY_TYPE_INVALID", "The occupancy type provided is invalid");
                }
            }
        }
        if (!CollectionUtils.isEmpty(errorMap.keySet())) {
            throw new CustomException(errorMap);
        }

    }

    private Map<String, List<String>> fetchMaster(RequestInfo requestInfo, String tenantId) {

        String[] masterNames = {
                PTConstants.MDMS_PT_CONSTRUCTIONTYPE,
                PTConstants.MDMS_PT_OCCUPANCYTYPE,
                PTConstants.MDMS_PT_USAGEMAJOR
        };

        Map<String, List<String>> codes = AssmtUtils.getAttributeValues(tenantId, PTConstants.MDMS_PT_MOD_NAME,
                new ArrayList<>(Arrays.asList(masterNames)), "$.*.code", PTConstants.JSONPATH_CODES, requestInfo);

        if (null != codes) {
            return codes;
        } else {
            throw new CustomException("MASTER_FETCH_FAILED", "Couldn't fetch master data for validation");
        }
    }

    /**
     * Validates if any other assessments are in workflow for the given property
     * @param assessment
     */
    private void validateWorkflowOfOtherAssessments(Assessment assessment){

        AssessmentSearchCriteria criteria = AssessmentSearchCriteria.builder()
                .tenantId(assessment.getTenantId())
                .status(Status.INWORKFLOW)
                .propertyIds(Collections.singleton(assessment.getPropertyId()))
                .build();

        List<Assessment> assessments = assessmentRepository.getAssessments(criteria);

        if(!CollectionUtils.isEmpty(assessments))
            throw new CustomException("INVALID_REQUEST","The property has other assessment in workflow");

    }



}
