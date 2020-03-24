package org.egov.pt.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.*;
import org.egov.pt.models.Address;
import org.egov.pt.models.UnitUsage;
import org.egov.pt.models.enums.*;
import org.egov.pt.models.oldProperty.*;
//import org.egov.pt.models.oldProperty.PropertyCriteria;
import org.egov.pt.models.user.UserDetailResponse;
import org.egov.pt.models.user.UserSearchRequest;
import org.egov.pt.producer.Producer;
import org.egov.pt.repository.AssessmentRepository;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.repository.builder.OldPropertyQueryBuilder;
import org.egov.pt.repository.builder.PropertyQueryBuilder;
import org.egov.pt.repository.rowmapper.OldPropertyRowMapper;
import org.egov.pt.repository.rowmapper.PropertyRowMapper;
import org.egov.pt.util.AssessmentUtils;
import org.egov.pt.util.ErrorConstants;
import org.egov.pt.util.PTConstants;
import org.egov.pt.validator.AssessmentValidator;
import org.egov.pt.validator.PropertyValidator;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.egov.pt.web.contracts.PropertyRequest;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.egov.pt.util.PTConstants.*;


@Service
@Slf4j
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

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private OldPropertyQueryBuilder queryBuilder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private OldPropertyRowMapper rowMapper;



    @Value("${egov.user.host}")
    private String userHost;

    @Value("${egov.oldProperty.search}")
    private String oldPropertySearchEndpoint;

    @Value("${egov.user.search.path}")
    private String userSearchEndpoint;

    @Value("${egov.user.update.path}")
    private String userUpdateEndpoint;

    @Value("${egov.user.create.path}")
    private String userCreateEndpoint;





    public List<OldProperty> searchOldPropertyFromURL(org.egov.pt.web.contracts.RequestInfoWrapper requestInfoWrapper, OldPropertyCriteria propertyCriteria){


        StringBuilder url = new StringBuilder(userHost).append(oldPropertySearchEndpoint).append(URL_PARAMS_SEPARATER)
                .append(TENANT_ID_FIELD_FOR_SEARCH_URL).append(propertyCriteria.getTenantId())
                .append(SEPARATER).append(OFFSET_FIELD_FOR_SEARCH_URL)
                .append(propertyCriteria.getOffset()).append(SEPARATER)
                .append(LIMIT_FIELD_FOR_SEARCH_URL).append(propertyCriteria.getLimit());
        OldPropertyResponse res = mapper.convertValue(fetchResult(url, requestInfoWrapper), OldPropertyResponse.class);


        return res.getProperties();
    }

   public List<OldProperty> searchOldProperty(org.egov.pt.web.contracts.RequestInfoWrapper requestInfoWrapper, OldPropertyCriteria propertyCriteria){
       Map<String, String> errorMap = new HashMap<>();
        List<OldProperty> properties = getPropertiesPlainSearch(propertyCriteria);
        /*
        try{
            enrichPropertyCriteriaWithOwnerids(propertyCriteria, properties);
        } catch (Exception e) {
            errorMap.put("EnrichPropertyCriteriaWithOwneridsError", String.valueOf(e));
        }

       OldUserDetailResponse userDetailResponse = getUser(propertyCriteria, requestInfoWrapper.getRequestInfo());
        try{
            enrichOwner(userDetailResponse, properties);
        } catch (Exception e) {
            errorMap.put("EnrichOwnerError", String.valueOf(e));
        }
        System.out.println("Error--->"+errorMap);
        */
       return properties;
    }

    public List<OldProperty> getPropertiesPlainSearch(OldPropertyCriteria criteria){
        List<Object> preparedStmtList = new ArrayList<>();
        String query = queryBuilder.getPropertyLikeQuery(criteria, preparedStmtList);
        log.info("Query: "+query);
        log.info("PS: "+preparedStmtList);
        return jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
    }

    /**
     * Overloaded function which populates ownerids in criteria from list of property
     * @param criteria PropertyCriteria whose ownerids are to be populated
     * @param properties List of property whose owner's uuids are to added in propertyCriteria
     */
    public void enrichPropertyCriteriaWithOwnerids(OldPropertyCriteria criteria, List<OldProperty> properties){
        Set<String> ownerids = new HashSet<>();
        properties.forEach(property -> {
            property.getPropertyDetails().forEach(propertyDetail -> propertyDetail.getOwners().forEach(owner -> ownerids.add(owner.getUuid())));
        });
        properties.forEach(property -> {
            property.getPropertyDetails().forEach(propertyDetail -> {
                ownerids.add(propertyDetail.getCitizenInfo().getUuid());
            });
        });
        criteria.setOwnerids(ownerids);
    }

    /**
     * Returns user using user search based on propertyCriteria(owner name,mobileNumber,userName)
     * @param criteria
     * @param requestInfo
     * @return serDetailResponse containing the user if present and the responseInfo
     */
    public OldUserDetailResponse getUser(OldPropertyCriteria criteria,RequestInfo requestInfo){
        UserSearchRequest userSearchRequest = getUserSearchRequest(criteria,requestInfo);
        StringBuilder uri = new StringBuilder(userHost).append(userSearchEndpoint);
        OldUserDetailResponse userDetailResponse = userCall(userSearchRequest,uri);
        return userDetailResponse;
    }

    /**
     * Creates and Returns UserSearchRequest from the propertyCriteria(Creates UserSearchRequest from values related to owner(i.e mobileNumber and name) from propertyCriteria )
     * @param criteria PropertyCriteria from which UserSearchRequest is to be created
     * @param requestInfo RequestInfo of the propertyRequest
     * @return UserSearchRequest created from propertyCriteria
     */
    private UserSearchRequest getUserSearchRequest(OldPropertyCriteria criteria,RequestInfo requestInfo){
        UserSearchRequest userSearchRequest = new UserSearchRequest();
        Set<String> userIds = criteria.getOwnerids();
        if(!CollectionUtils.isEmpty(userIds))
            userSearchRequest.setUuid(userIds);
        userSearchRequest.setRequestInfo(requestInfo);
        userSearchRequest.setTenantId(requestInfo.getUserInfo().getTenantId());
        userSearchRequest.setMobileNumber(requestInfo.getUserInfo().getMobileNumber());
        userSearchRequest.setName(requestInfo.getUserInfo().getName());
        userSearchRequest.setActive(true);
        userSearchRequest.setUserType(requestInfo.getUserInfo().getType());
        return userSearchRequest;
    }

    /**
     * Returns UserDetailResponse by calling user service with given uri and object
     * @param userRequest Request object for user service
     * @param uri The address of the endpoint
     * @return Response from user service as parsed as userDetailResponse
     */
    private OldUserDetailResponse userCall(Object userRequest, StringBuilder uri) {
        String dobFormat = null;
        if(uri.toString().contains(userSearchEndpoint) || uri.toString().contains(userUpdateEndpoint))
            dobFormat="yyyy-MM-dd";
        else if(uri.toString().contains(userCreateEndpoint))
            dobFormat = "dd/MM/yyyy";
        try{
            LinkedHashMap responseMap = (LinkedHashMap)fetchResult(uri, userRequest);
            parseResponse(responseMap,dobFormat);
            OldUserDetailResponse userDetailResponse = mapper.convertValue(responseMap,OldUserDetailResponse.class);
            return userDetailResponse;
        }
        // Which Exception to throw?
        catch(IllegalArgumentException  e)
        {
            throw new CustomException("IllegalArgumentException","ObjectMapper not able to convertValue in userCall");
        }
    }

    /**
     * Parses date formats to long for all users in responseMap
     * @param responeMap LinkedHashMap got from user api response
     * @param dobFormat dob format (required because dob is returned in different format's in search and create response in user service)
     */
    private void parseResponse(LinkedHashMap responeMap,String dobFormat){
        List<LinkedHashMap> users = (List<LinkedHashMap>)responeMap.get("user");
        String format1 = "dd-MM-yyyy HH:mm:ss";
        if(users!=null){
            users.forEach( map -> {
                        map.put("createdDate",dateTolong((String)map.get("createdDate"),format1));
                        if((String)map.get("lastModifiedDate")!=null)
                            map.put("lastModifiedDate",dateTolong((String)map.get("lastModifiedDate"),format1));
                        if((String)map.get("dob")!=null)
                            map.put("dob",dateTolong((String)map.get("dob"),dobFormat));
                        if((String)map.get("pwdExpiryDate")!=null)
                            map.put("pwdExpiryDate",dateTolong((String)map.get("pwdExpiryDate"),format1));
                    }
            );
        }
    }

    /**
     * Converts date to long
     * @param date date to be parsed
     * @param format Format of the date
     * @return Long value of date
     */
    private Long dateTolong(String date,String format){
        SimpleDateFormat f = new SimpleDateFormat(format);
        Date d = null;
        try {
            d = f.parse(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return  d.getTime();
    }


    /**
     * Populates the owner fields inside of property objects from the response got from calling user api
     * @param userDetailResponse response from user api which contains list of user which are used to populate owners in properties
     * @param properties List of property whose owner's are to be populated from userDetailResponse
     */
    public void enrichOwner(OldUserDetailResponse userDetailResponse, List<OldProperty> properties){
        List<OldOwnerInfo> users = userDetailResponse.getUser();
        Map<String,OldOwnerInfo> userIdToOwnerMap = new HashMap<>();
        users.forEach(user -> userIdToOwnerMap.put(user.getUuid(),user));
        properties.forEach(property -> {
            property.getPropertyDetails().forEach(propertyDetail ->
            {
                propertyDetail.getOwners().forEach(owner -> {
                    if(userIdToOwnerMap.get(owner.getUuid())==null)
                        throw new CustomException("OWNER SEARCH ERROR","The owner of the propertyDetail "+propertyDetail.getAssessmentNumber()+" is not coming in user search");
                    else
                        owner.addUserDetail(userIdToOwnerMap.get(owner.getUuid()));

                });
                if(userIdToOwnerMap.get(propertyDetail.getCitizenInfo().getUuid())!=null)
                    propertyDetail.getCitizenInfo().addCitizenDetail(userIdToOwnerMap.get(propertyDetail.getCitizenInfo().getUuid()));
                else
                    throw new CustomException("CITIZENINFO ERROR","The citizenInfo of property with id: "+property.getPropertyId()+" cannot be found");
            });
        });
    }


    public List<Property> migrateProperty(RequestInfo requestInfo, List<OldProperty> oldProperties) {
        Map<String, String> errorMap = new HashMap<>();
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
                else
                    property.setSource(Source.fromValue("MUNICIPAL_RECORDS"));

                if(!StringUtils.isEmpty(oldProperty.getPropertyDetails().get(i).getChannel()))
                    property.setChannel(Channel.fromValue(String.valueOf(oldProperty.getPropertyDetails().get(i).getChannel())));
                else
                    property.setChannel(Channel.fromValue("MIGRATION"));

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

                List<OwnerInfo> ownerInfos = migrateOwnerInfo(oldProperty.getPropertyDetails().get(i).getOwners());
                property.setOwners(ownerInfos);



                PropertyRequest request = PropertyRequest.builder().requestInfo(requestInfo).property(property).build();
                try{
                    propertyValidator.validateCreateRequest(request);
                } catch (Exception e) {
                    errorMap.put(property.getPropertyId(), String.valueOf(e));
                }
                if(i==0)
                    producer.push(config.getSavePropertyTopic(), request);
                else
                    producer.push(config.getUpdatePropertyTopic(), request);

                migrateAssesment(oldProperty.getPropertyDetails().get(i),property,requestInfo,errorMap);
            }
            properties.add(property);
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
        if(oldLocality.getChildren() != null)
            locality.setChildren(setmigrateLocalityList(oldLocality.getChildren()));
        else
            locality.setChildren(null);
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
            if(StringUtils.isEmpty(oldDocument.getFileStore()))
                continue;
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


    public void migrateAssesment(PropertyDetail propertyDetail, Property property, RequestInfo requestInfo,Map<String,String> errorMap){
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
            try{
                Object propertyDetailAdditionalDetail = propertyDetail.getAdditionalDetails();
                Map<String,Object> assessmentAdditionalDetail = mapper.convertValue(propertyDetailAdditionalDetail,Map.class);
                addAssessmentPenaltyandRebate(assessmentAdditionalDetail,propertyDetail);

                if(assessmentAdditionalDetail != null && assessmentAdditionalDetail.size() >0){
                    JsonNode additionalDetails = mapper.convertValue(assessmentAdditionalDetail,JsonNode.class);
                    assessment.setAdditionalDetails(additionalDetails);
                }
                else
                    assessment.setAdditionalDetails(null);

            } catch (IllegalArgumentException e) {
                e.printStackTrace();
                throw new CustomException("PARSING_ERROR","Failed to parse additional details in translation");
            }
        }
        else{

            try{
                Map<String,Object> assessmentAdditionalDetail = new HashMap<>();
                addAssessmentPenaltyandRebate(assessmentAdditionalDetail,propertyDetail);
                if(assessmentAdditionalDetail != null && assessmentAdditionalDetail.size() >0){
                    JsonNode additionalDetails = mapper.convertValue(assessmentAdditionalDetail,JsonNode.class);
                    assessment.setAdditionalDetails(additionalDetails);
                }
                else
                    assessment.setAdditionalDetails(null);

            } catch (IllegalArgumentException e) {
                e.printStackTrace();
                throw new CustomException("PARSING_ERROR","Failed to parse additional details in translation");
            }


        }
        if(propertyDetail.getAuditDetails()!=null){
            AuditDetails audit = mapper.convertValue(propertyDetail.getAuditDetails(),AuditDetails.class);
            assessment.setAuditDetails(audit);
        }

        AssessmentRequest request = AssessmentRequest.builder().requestInfo(requestInfo).assessment(assessment).build();
        try{
            ValidateMigrationData(request,property);
        } catch (Exception e) {
            errorMap.put(assessment.getAssessmentNumber(), String.valueOf(e));
        }
        
        producer.push(config.getCreateAssessmentTopic(), request);
    }

    public Map<String,Object> addAssessmentPenaltyandRebate(Map<String,Object> assessmentAdditionalDetail,PropertyDetail propertyDetail){
        if(propertyDetail.getAdhocExemption() != null)
            assessmentAdditionalDetail.put("adhocExemption",propertyDetail.getAdhocExemption().doubleValue());
        if(!StringUtils.isEmpty(propertyDetail.getAdhocExemptionReason()))
            assessmentAdditionalDetail.put("adhocExemptionReason",propertyDetail.getAdhocExemptionReason());
        if(propertyDetail.getAdhocPenalty() != null)
            assessmentAdditionalDetail.put("adhocPenalty",propertyDetail.getAdhocPenalty().doubleValue());
        if(!StringUtils.isEmpty(propertyDetail.getAdhocPenaltyReason()))
            assessmentAdditionalDetail.put("adhocPenaltyReason",propertyDetail.getAdhocPenaltyReason());

        return assessmentAdditionalDetail;
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

    /**
     * Fetches results from external services through rest call.
     *
     * @param request
     * @param uri
     * @return Object
     */
    public Object fetchResult(StringBuilder uri, Object request) {
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        Object response = null;
        log.info("URI: "+uri.toString());
        try {
            log.info("Request: "+mapper.writeValueAsString(request));
            response = restTemplate.postForObject(uri.toString(), request, Map.class);
        }catch(HttpClientErrorException e) {
            log.error("External Service threw an Exception: ",e);
            throw new ServiceCallException(e.getResponseBodyAsString());
        }catch(Exception e) {
            log.error("Exception while fetching from external service: ",e);
        }

        return response;
    }



}
