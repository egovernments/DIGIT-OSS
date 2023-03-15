package org.egov.pt.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.jayway.jsonpath.JsonPath;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.*;
import org.egov.pt.models.Address;
import org.egov.pt.models.UnitUsage;
import org.egov.pt.models.enums.*;
import org.egov.pt.models.oldProperty.*;
//import org.egov.pt.models.oldProperty.PropertyCriteria;
import org.egov.pt.models.user.UserDetailResponse;
import org.egov.pt.models.user.UserSearchRequest;
import org.egov.pt.producer.PropertyProducer;
import org.egov.pt.repository.AssessmentRepository;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.repository.builder.OldPropertyQueryBuilder;
import org.egov.pt.repository.builder.PropertyQueryBuilder;
import org.egov.pt.repository.rowmapper.MigrationCountRowMapper;
import org.egov.pt.repository.rowmapper.OldPropertyRowMapper;
import org.egov.pt.repository.rowmapper.PropertyRowMapper;
import org.egov.pt.util.AssessmentUtils;
import org.egov.pt.util.ErrorConstants;
import org.egov.pt.util.PTConstants;
import org.egov.pt.validator.AssessmentValidator;
import org.egov.pt.validator.PropertyMigrationValidator;
import org.egov.pt.validator.PropertyValidator;
import org.egov.pt.web.contracts.*;
import org.egov.pt.web.contracts.RequestInfoWrapper;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
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
    private PropertyProducer producer;

    @Autowired
    private AssessmentValidator validator;

    @Autowired
    private PropertyConfiguration config;

    @Autowired
    private PropertyMigrationValidator propertyMigrationValidator;

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

    @Autowired
    private MigrationCountRowMapper migrationCountRowMapper;

    @Autowired
    private ServiceRequestRepository restRepo;



    @Value("${egov.user.host}")
    private String userHost;

    @Value("${egov.pt-services-v2.host}")
    private String ptHost;

    @Value("${egov.oldProperty.search}")
    private String oldPropertySearchEndpoint;

    @Value("${egov.user.search.path}")
    private String userSearchEndpoint;

    @Value("${egov.user.update.path}")
    private String userUpdateEndpoint;

    @Value("${egov.user.create.path}")
    private String userCreateEndpoint;

    @Value("${migration.batch.value}")
    private Integer batchSize;

    @Value("${migration.offset.value}")
    private Integer batchOffset;

    private Integer count2=0;

    public static final String COUNT_QUERY = "select count(*) from eg_pt_property_v2 where tenantid = '{}';";
    public static final String TENANT_QUERY = "select distinct tenantid from eg_pt_property_v2;";
    public static final String MIGARTION_COUNT_QUERY = "select count(*) from eg_pt_property_migration;";
    //public static final String MIGARTION_POINT_QUERY = "select offset from eg_pt_property_migration;";
    public static final String MIGARTION_POINT_QUERY ="select id,batch,batchsize,createdtime,tenantid,recordCount from eg_pt_property_migration as migration where tenantid = ? and createdtime = (select max(createdtime) from eg_pt_property_migration where tenantid = ?);";





    public long getTenantCount(String tenantid){
        String query = COUNT_QUERY.replace("{}",tenantid);
        long count = jdbcTemplate.queryForObject(query, Integer.class);
        return count;
    }
    public List<String> getTenantList(){
        List<String> tenantList =jdbcTemplate.queryForList(TENANT_QUERY,String.class);
        return tenantList;
    }
    public MigrationCount getMigrationCountForTenant(String tenantId){
        MigrationCount migrationCount = jdbcTemplate.query(MIGARTION_POINT_QUERY, new Object[] { tenantId, tenantId }, migrationCountRowMapper);
        return migrationCount;
    }

    public Map<String, String> initiateProcess(RequestInfoWrapper requestInfoWrapper,OldPropertyCriteria propertyCriteria,Map<String, String> errorMap){

        Map<String, String> resultMap = null;
        Map<String, List<String>> masters = getMDMSData(requestInfoWrapper.getRequestInfo(),config.getStateLevelTenantId());
        List<String> tenantList = getTenantList();

        if(StringUtils.isEmpty(propertyCriteria.getLimit()))
            propertyCriteria.setLimit(Long.valueOf(batchSize));

        if(StringUtils.isEmpty(propertyCriteria.getOffset()))
            propertyCriteria.setLimit(Long.valueOf(batchOffset));

        for(int i= 0;i<tenantList.size();i++){
            MigrationCount migrationCount = getMigrationCountForTenant(tenantList.get(i));
            System.out.println("\n\nMigration count--->"+migrationCount.toString()+"\n\n");
            if(ObjectUtils.isEmpty(migrationCount) || migrationCount.getId() == null){
                propertyCriteria.setTenantId(tenantList.get(i));
                resultMap = initiatemigration(requestInfoWrapper, propertyCriteria,masters,errorMap);
            }
            else{
                long count = getTenantCount(tenantList.get(i));

                System.out.println("\n\ntenant--->"+tenantList.get(i)+"\n\n");
                System.out.println("\n\ncount--->"+count+"\n\n");

                if(migrationCount.getRecordCount() >= count)
                    continue;
                else{
                    propertyCriteria.setTenantId(tenantList.get(i));
                    propertyCriteria.setOffset(migrationCount.getOffset()+migrationCount.getLimit());
                    resultMap = initiatemigration(requestInfoWrapper, propertyCriteria,masters,errorMap);
                }

            }
        }
        return resultMap;
    }

    public Map<String, String> initiatemigration(RequestInfoWrapper requestInfoWrapper,OldPropertyCriteria propertyCriteria,Map<String, List<String>> masters,Map<String, String> errorMap) {

        RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();
        List<Property> properties = new ArrayList<>();
        Map<String, String> responseMap = new HashMap<>();

        Integer startBatch = Math.toIntExact(propertyCriteria.getOffset());
        Integer batchSizeInput = Math.toIntExact(propertyCriteria.getLimit());


        long count = getTenantCount(propertyCriteria.getTenantId());
        log.info("Count: "+count);
        log.info("startbatch: "+startBatch);

        while(startBatch<count) {
            long startTime = System.nanoTime();
            List<OldProperty> oldProperties = searchOldPropertyFromURL(requestInfoWrapper,propertyCriteria) ;
            try {
                properties= migrateProperty(requestInfo,oldProperties,masters,errorMap);
            } catch (Exception e) {

                log.error("Migration failed at batch count of : " + startBatch);
                responseMap.put( "Migration failed at batch count : " + startBatch, e.getMessage());
                return responseMap;
            }
            addResponseToMap(properties,responseMap,"SUCCESS");
            log.info(" count completed for batch : " + startBatch);
            long endtime = System.nanoTime();
            long elapsetime = endtime - startTime;
            log.info("\n\nBatch elapsed time: "+elapsetime+"\n\n");

            MigrationCount migrationCount = new MigrationCount();
            migrationCount.setId(UUID.randomUUID().toString());
            migrationCount.setOffset(Long.valueOf(startBatch));
            migrationCount.setLimit(Long.valueOf(batchSizeInput));
            migrationCount.setCreatedTime(System.currentTimeMillis());
            migrationCount.setTenantid(propertyCriteria.getTenantId());
            migrationCount.setRecordCount(Long.valueOf(startBatch+batchSizeInput));
            PropertyMigrationCountRequest request = PropertyMigrationCountRequest.builder().requestInfo(requestInfo).migrationCount(migrationCount).build();
            producer.push(config.getMigartionBatchCountTopic(), request);

            startBatch = startBatch+batchSizeInput;
            propertyCriteria.setOffset(Long.valueOf(startBatch));
            System.out.println("Property Count which pushed into kafka topic:"+count2);
        }
        propertyCriteria.setOffset(Long.valueOf(batchOffset));
        return responseMap;

    }

    private void addResponseToMap(List<Property> properties, Map<String, String> responseMap, String message) {

        properties.forEach(property -> {

            responseMap.put(property.getPropertyId(), message);
            log.info("The property id : " + property.getPropertyId() + " message : " + message);
        });
    }





    /*public List<OldProperty> searchOldPropertyFromURL(org.egov.pt.web.contracts.RequestInfoWrapper requestInfoWrapper,String tenantId,int i,Integer batchSize){


        StringBuilder url = new StringBuilder(ptHost).append(oldPropertySearchEndpoint).append(URL_PARAMS_SEPARATER)
                .append(TENANT_ID_FIELD_FOR_SEARCH_URL).append(tenantId)
                .append(SEPARATER).append(OFFSET_FIELD_FOR_SEARCH_URL)
                .append(i).append(SEPARATER)
                .append(LIMIT_FIELD_FOR_SEARCH_URL).append(batchSize);
        OldPropertyResponse res = mapper.convertValue(fetchResult(url, requestInfoWrapper), OldPropertyResponse.class);


        return res.getProperties();
    }*/

    public List<OldProperty> searchOldPropertyFromURL(org.egov.pt.web.contracts.RequestInfoWrapper requestInfoWrapper,OldPropertyCriteria propertyCriteria){


        StringBuilder url = new StringBuilder(ptHost).append(oldPropertySearchEndpoint).append(URL_PARAMS_SEPARATER)
                .append(TENANT_ID_FIELD_FOR_SEARCH_URL).append(propertyCriteria.getTenantId())
                .append(SEPARATER).append(OFFSET_FIELD_FOR_SEARCH_URL).append(propertyCriteria.getOffset())
                .append(SEPARATER).append(LIMIT_FIELD_FOR_SEARCH_URL).append(propertyCriteria.getLimit());


        OldPropertyResponse res = mapper.convertValue(fetchResult(url, requestInfoWrapper), OldPropertyResponse.class);


        return res.getProperties();
    }




    public List<OldProperty> searchPropertyPlainSearch(OldPropertyCriteria criteria, RequestInfo requestInfo,long initialPoint) {
        List<OldProperty> properties = getPropertiesPlainSearch(criteria, requestInfo,initialPoint);
        //enrichmentService.enrichBoundary(new PropertyRequest(requestInfo, properties));
        return properties;
    }

    List<OldProperty> getPropertiesPlainSearch(OldPropertyCriteria criteria, RequestInfo requestInfo,long initialPoint) {
        List<OldProperty> properties = getPropertiesPlainSearch(criteria,initialPoint);
        //enrichPropertyCriteriaWithOwnerids(criteria, properties);
//        OldUserDetailResponse userDetailResponse = getUser(criteria, requestInfo);
//        enrichOwner(userDetailResponse, properties);
        return properties;
    }

    public List<OldProperty> getPropertiesPlainSearch(OldPropertyCriteria criteria,long initialPoint){
        List<Object> preparedStmtList = new ArrayList<>();
        String query = queryBuilder.getPropertyLikeQuery(criteria, preparedStmtList,initialPoint);
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
        userSearchRequest.setTenantId(criteria.getTenantId());
        userSearchRequest.setMobileNumber(criteria.getMobileNumber());
        userSearchRequest.setName(criteria.getName());
        userSearchRequest.setActive(true);
        userSearchRequest.setUserType("CITIZEN");
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

    public  List<Property> migrateProperty(RequestInfo requestInfo, List<OldProperty> oldProperties,Map<String, List<String>> masters,Map<String, String> errorMap) {
        List<Property> properties = new ArrayList<>();
        for(OldProperty oldProperty : oldProperties){

            String Id = UUID.randomUUID().toString();
            String propertyId = oldProperty.getPropertyId();
            String tenantId= oldProperty.getTenantId();
            String accountId = requestInfo.getUserInfo().getUuid();
            String oldPropertyId = oldProperty.getOldPropertyId();
            Status status = Status.fromValue(oldProperty.getStatus().toString());

            Collections.sort(oldProperty.getPropertyDetails(), new Comparator<PropertyDetail>() {
                @Override
                public int compare(PropertyDetail pd1, PropertyDetail pd2) {
                    return pd1.getAuditDetails().getCreatedTime().compareTo(pd2.getAuditDetails().getCreatedTime());
                }
            });

            for(int i=0;i< oldProperty.getPropertyDetails().size();i++){
                Property property = new Property();
                property.setId(Id);
                property.setPropertyId(propertyId);
                property.setTenantId(tenantId);
                property.setAccountId(accountId);
                property.setOldPropertyId(oldPropertyId);
                property.setStatus(status);

                if(oldProperty.getAddress()!=null)
                    property.setAddress(migrateAddress(oldProperty.getAddress()));
                else
                    property.setAddress(null);
                property.setAcknowldgementNumber(oldProperty.getAcknowldgementNumber());

                if(oldProperty.getPropertyDetails().get(i) != null){
                    property.setPropertyType(migratePropertyType(oldProperty.getPropertyDetails().get(i)));
                    property.setOwnershipCategory(migrateOwnwershipCategory(oldProperty.getPropertyDetails().get(i)));
                    property.setUsageCategory(migrateUsageCategory(oldProperty.getPropertyDetails().get(i)));
                }
                else{
                    property.setPropertyType(null);
                    property.setOwnershipCategory(null);
                    property.setUsageCategory(null);
                }


                if(oldProperty.getPropertyDetails().get(i).getInstitution() == null)
                    property.setInstitution(null);
                else
                    property.setInstitution(migrateInstitution(oldProperty.getPropertyDetails().get(i).getInstitution()));

                if(!StringUtils.isEmpty(oldProperty.getCreationReason()))
                    property.setCreationReason(CreationReason.fromValue(String.valueOf(oldProperty.getCreationReason())));


                property.setNoOfFloors(oldProperty.getPropertyDetails().get(i).getNoOfFloors());

                if(!StringUtils.isEmpty(oldProperty.getPropertyDetails().get(i).getBuildUpArea()))
                    property.setSuperBuiltUpArea(BigDecimal.valueOf(oldProperty.getPropertyDetails().get(i).getBuildUpArea()));

                if(!StringUtils.isEmpty(oldProperty.getPropertyDetails().get(i).getLandArea()))
                    property.setLandArea(Double.valueOf(oldProperty.getPropertyDetails().get(i).getLandArea()));

                if(!StringUtils.isEmpty(Source.fromValue(String.valueOf(oldProperty.getPropertyDetails().get(i).getSource()))))
                    property.setSource(Source.fromValue(String.valueOf(oldProperty.getPropertyDetails().get(i).getSource())));
                else
                    property.setSource(Source.fromValue("MUNICIPAL_RECORDS"));

                if(!StringUtils.isEmpty(Channel.fromValue(String.valueOf(oldProperty.getPropertyDetails().get(i).getChannel()))))
                    property.setChannel(Channel.fromValue(String.valueOf(oldProperty.getPropertyDetails().get(i).getChannel())));
                else
                    property.setChannel(Channel.fromValue("MIGRATION"));

                if(oldProperty.getPropertyDetails().get(i).getDocuments() == null)
                    property.setDocuments(null);
                else
                    property.setDocuments(migrateDocument(oldProperty.getPropertyDetails().get(i).getDocuments()));

                List<Unit> units = new ArrayList<>();
                if(oldProperty.getPropertyDetails().get(i).getUnits() == null)
                    property.setUnits(null);
                else{
                    units=migrateUnit(oldProperty.getPropertyDetails().get(i).getUnits());
                    property.setUnits(units);

                }


                if(oldProperty.getPropertyDetails().get(i).getAdditionalDetails() == null)
                    property.setAdditionalDetails(null);
                else{
                    JsonNode additionalDetails = mapper.convertValue(oldProperty.getPropertyDetails().get(i).getAdditionalDetails(),JsonNode.class);
                    property.setAdditionalDetails(additionalDetails);
                }


                if( oldProperty.getPropertyDetails().get(i).getAuditDetails() == null)
                    property.setAuditDetails(null);
                else
                    property.setAuditDetails(migrateAuditDetails(oldProperty.getPropertyDetails().get(i).getAuditDetails()));


                if(oldProperty.getPropertyDetails().get(i).getOwners()!=null){
                    List<OwnerInfo> ownerInfos = migrateOwnerInfo(oldProperty.getPropertyDetails().get(i).getOwners());
                    property.setOwners(ownerInfos);
                }
                else
                    property.setOwners(null);

                PropertyRequest request = PropertyRequest.builder().requestInfo(requestInfo).property(property).build();
                try{
                    propertyMigrationValidator.validatePropertyCreateRequest(request,masters,errorMap);
                } catch (Exception e) {
                    log.error("Error while migrating prperty data of " + property.getPropertyId(), e);
                }

                producer.push(config.getSavePropertyTopic(), request);
                properties.add(property);


                if(oldProperty.getPropertyDetails().get(i)!=null)
                    migrateAssesment(oldProperty.getPropertyDetails().get(i),property,requestInfo,errorMap,masters,units);

            }
            count2++;
        }

        return properties;
    }

    public Address migrateAddress(org.egov.pt.models.oldProperty.Address oldAddress){
        Address address = new Address();
        address.setTenantId(oldAddress.getTenantId());
        address.setDoorNo(oldAddress.getDoorNo());
        //address.setPlotNo();
        address.setId(UUID.randomUUID().toString());
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
        //address.setAdditionalDetails(oldAddress.getAdditionalDetails());
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
            //ownerInfo.setOwnerInfoUuid(UUID.randomUUID().toString());
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
        //newInstitution.setAdditionalDetails(oldInstitution.getAdditionalDetails());

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

    public String migratePropertyType(PropertyDetail propertyDetail){
        StringBuilder propertyType = new StringBuilder();
        if(StringUtils.isEmpty(propertyDetail.getPropertyType()))
            return null;
        else
            propertyType.append(propertyDetail.getPropertyType());

        if(!StringUtils.isEmpty(propertyDetail.getPropertySubType()))
            propertyType.append(".").append(propertyDetail.getPropertySubType());

        return propertyType.toString();
    }


    public List<Unit> migrateUnit(List<OldUnit> oldUnits){
        List<Unit> units = new ArrayList<>();
        for(OldUnit oldUnit : oldUnits){
            Unit unit = new Unit();
            unit.setId(UUID.randomUUID().toString());
            unit.setTenantId(oldUnit.getTenantId());
            unit.setFloorNo(Integer.valueOf(oldUnit.getFloorNo()));
            unit.setUnitType(oldUnit.getUnitType());
            unit.setUsageCategory(migrateUnitUsageCategory(oldUnit));
            unit.setOccupancyType(oldUnit.getOccupancyType());
            unit.setOccupancyDate(oldUnit.getOccupancyDate());
            if(oldUnit.getActive() == null)
                unit.setActive(Boolean.TRUE);
            else
                unit.setActive(oldUnit.getActive());
            unit.setConstructionDetail(migrateConstructionDetail(oldUnit));
            //unit.setAdditionalDetails(oldUnit.getAdditionalDetails());
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
            doc.setId(UUID.randomUUID().toString());
            doc.setDocumentType(oldDocument.getDocumentType());
            if(oldDocument.getFileStore() == null)
                doc.setFileStoreId(oldDocument.getId());
            else
                doc.setFileStoreId(oldDocument.getFileStore());
            if(oldDocument.getDocumentUid() == null)
                doc.setDocumentUid(oldDocument.getId());
            else
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


    public void migrateAssesment(PropertyDetail propertyDetail, Property property, RequestInfo requestInfo,Map<String,String> errorMap,Map<String, List<String>> masters, List<Unit> units){
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
            Set<Document> documentSet = new HashSet<>();
            for(Document document : documentList)
                documentSet.add(document);
            assessment.setDocuments(documentSet);
        }

        if(propertyDetail.getUnits() == null)
            assessment.setUnitUsageList(null);
        else
            assessment.setUnitUsageList(migrateUnitUsageList(propertyDetail,units));

        if(propertyDetail.getAdditionalDetails()!=null){
            try{
                Object propertyDetailAdditionalDetail = propertyDetail.getAdditionalDetails();
                Map<String,String> assessmentAdditionalDetail = mapper.convertValue(propertyDetailAdditionalDetail,Map.class);
                addAssessmentPenaltyandRebate(assessmentAdditionalDetail,propertyDetail);

                if(assessmentAdditionalDetail != null && assessmentAdditionalDetail.size() >0){
                    JsonNode additionalDetails = mapper.convertValue(assessmentAdditionalDetail,JsonNode.class);
                    assessment.setAdditionalDetails(additionalDetails);
                }
                else
                    assessment.setAdditionalDetails(null);

            } catch (IllegalArgumentException e) {
                throw new CustomException("PARSING_ERROR","Failed to parse additional details in translation");
            }
        }
        else{

            try{
                Map<String,String> assessmentAdditionalDetail = new HashMap<>();
                addAssessmentPenaltyandRebate(assessmentAdditionalDetail,propertyDetail);
                if(assessmentAdditionalDetail != null && assessmentAdditionalDetail.size() >0){
                    JsonNode additionalDetails = mapper.convertValue(assessmentAdditionalDetail,JsonNode.class);
                    assessment.setAdditionalDetails(additionalDetails);
                }
                else
                    assessment.setAdditionalDetails(null);

            } catch (IllegalArgumentException e) {
                throw new CustomException("PARSING_ERROR","Failed to parse additional details in translation");
            }


        }
        if(propertyDetail.getAuditDetails()!=null){
            AuditDetails audit = mapper.convertValue(propertyDetail.getAuditDetails(),AuditDetails.class);
            assessment.setAuditDetails(audit);
        }

        AssessmentRequest request = AssessmentRequest.builder().requestInfo(requestInfo).assessment(assessment).build();

        try{
            propertyMigrationValidator.ValidateAssessmentMigrationData(request,property,masters,errorMap);
        } catch (Exception e) {
            log.error("Error while migrating assessment data of " + assessment.getAssessmentNumber(), e);
            errorMap.put(assessment.getAssessmentNumber(), String.valueOf(e));
        }
        //assessmentRequestList.add(request);
        producer.push(config.getCreateAssessmentTopic(), request);
    }

    public Map<String,String> addAssessmentPenaltyandRebate(Map<String,String> assessmentAdditionalDetail,PropertyDetail propertyDetail){
        try{
            if(propertyDetail.getAdhocExemption() != null)
                assessmentAdditionalDetail.put("adhocExemption", String.valueOf(propertyDetail.getAdhocExemption()));
            if(!StringUtils.isEmpty(propertyDetail.getAdhocExemptionReason()))
                assessmentAdditionalDetail.put("adhocExemptionReason",propertyDetail.getAdhocExemptionReason());
            if(propertyDetail.getAdhocPenalty() != null)
                assessmentAdditionalDetail.put("adhocPenalty", String.valueOf(propertyDetail.getAdhocPenalty().doubleValue()));
            if(!StringUtils.isEmpty(propertyDetail.getAdhocPenaltyReason()))
                assessmentAdditionalDetail.put("adhocPenaltyReason",propertyDetail.getAdhocPenaltyReason());
        } catch (Exception e) {
            throw new CustomException("INVALID_PENALTY_REBATE",String.valueOf(e));
        }

        return assessmentAdditionalDetail;
    }

    public List<UnitUsage> migrateUnitUsageList(PropertyDetail propertyDetail, List<Unit> propertyUnits){
        List<UnitUsage> units = new ArrayList<>();
        for(Unit propertyUnit : propertyUnits){
            UnitUsage unit = new UnitUsage();
            unit.setId(String.valueOf(UUID.randomUUID()));
            unit.setUnitId(propertyUnit.getId());
            unit.setTenantId(propertyUnit.getTenantId());
            unit.setUsageCategory(propertyUnit.getUsageCategory());
            unit.setOccupancyType(propertyUnit.getOccupancyType());
            unit.setOccupancyDate(propertyUnit.getOccupancyDate());
            unit.setAuditDetails(migrateAuditDetails(propertyDetail.getAuditDetails()));
            units.add(unit);
        }

        return  units;
    }


    private Map<String, List<String>> fetchMaster(RequestInfo requestInfo, String tenantId) {

        String[] masterNames = {
                PTConstants.MDMS_PT_CONSTRUCTIONTYPE,
                PTConstants.MDMS_PT_OCCUPANCYTYPE,
                PTConstants.MDMS_PT_USAGEMAJOR,
                PTConstants.MDMS_PT_PROPERTYTYPE,
                PTConstants.MDMS_PT_OWNERSHIPCATEGORY,
                PTConstants.MDMS_PT_OWNERTYPE,
                PTConstants.MDMS_PT_USAGECATEGORY
        };

        Map<String, List<String>> codes = getAttributeValues(tenantId, PTConstants.MDMS_PT_MOD_NAME,
                new ArrayList<>(Arrays.asList(masterNames)), "$.*.code", PTConstants.JSONPATH_CODES, requestInfo);

        if (null != codes) {
            validateMDMSData(masterNames, codes);
            return codes;
        } else {
            throw new CustomException("MASTER_FETCH_FAILED", "Couldn't fetch master data for validation");
        }
    }

    /**
     *Fetches all the values of particular attribute as map of fieldname to list
     *
     * @param tenantId tenantId of properties in PropertyRequest
     * @param names List of String containing the names of all masterdata whose code has to be extracted
     * @param requestInfo RequestInfo of the received PropertyRequest
     * @return Map of MasterData name to the list of code in the MasterData
     *
     */
    public Map<String,List<String>> getAttributeValues(String tenantId, String moduleName, List<String> names, String filter,String jsonpath, RequestInfo requestInfo){

        StringBuilder uri = new StringBuilder(config.getMdmsHost()).append(config.getMdmsEndpoint());
        MdmsCriteriaReq criteriaReq = prepareMdMsRequest(tenantId,moduleName,names,filter,requestInfo);
        Optional<Object> response = restRepo.fetchResult(uri, criteriaReq);

        try {
            if(response.isPresent()) {
                return JsonPath.read(response.get(),jsonpath);
            }
        } catch (Exception e) {
            throw new CustomException(ErrorConstants.INVALID_TENANT_ID_MDMS_KEY,
                    ErrorConstants.INVALID_TENANT_ID_MDMS_MSG);
        }

        return null;
    }

    public MdmsCriteriaReq prepareMdMsRequest(String tenantId,String moduleName, List<String> names, String filter, RequestInfo requestInfo) {

        List<MasterDetail> masterDetails = new ArrayList<>();

        names.forEach(name -> {
            masterDetails.add(MasterDetail.builder().name(name).filter(filter).build());
        });

        ModuleDetail moduleDetail = ModuleDetail.builder()
                .moduleName(moduleName).masterDetails(masterDetails).build();
        List<ModuleDetail> moduleDetails = new ArrayList<>();
        moduleDetails.add(moduleDetail);
        MdmsCriteria mdmsCriteria = MdmsCriteria.builder().tenantId(tenantId).moduleDetails(moduleDetails).build();
        return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
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

    public Map<String, List<String>> getMDMSData(RequestInfo requestInfo, String tenantId) {
        Map<String, List<String>> masters = fetchMaster(requestInfo, tenantId);
        if(CollectionUtils.isEmpty(masters.keySet()))
            throw new CustomException("MASTER_FETCH_FAILED", "Couldn't fetch master data for validation");

        return masters;

    }

    /**
     * Validates if MasterData is properly fetched for the given MasterData names
     * @param masterNames
     * @param codes
     */
    private void validateMDMSData(String[] masterNames,Map<String,List<String>> codes){

        Map<String,String> errorMap = new HashMap<>();
        for(String masterName:masterNames){
            if(CollectionUtils.isEmpty(codes.get(masterName))){
                errorMap.put("MDMS DATA ERROR ","Unable to fetch "+masterName+" codes from MDMS");
            }
        }
        if (!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }

    public void sendDataToAssessmentCreateTopic(List<AssessmentRequest> assessmentRequestList){
        for(AssessmentRequest assessmentRequest: assessmentRequestList)
            producer.push(config.getCreateAssessmentTopic(), assessmentRequest);
    }

    public Object propertyfetchResult(StringBuilder uri, Object request) {
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        Object response = null;
        log.info("URI: "+uri.toString());
        try {
            log.info("Request: "+mapper.writeValueAsString(request));
            response = restTemplate.postForObject(uri.toString(), request, OldPropertyCriteria.class);
        }catch(HttpClientErrorException e) {
            log.error("External Service threw an Exception: ",e);
            throw new ServiceCallException(e.getResponseBodyAsString());
        }catch(Exception e) {
            log.error("Exception while fetching from external service: ",e);
        }

        return response;
    }

}
