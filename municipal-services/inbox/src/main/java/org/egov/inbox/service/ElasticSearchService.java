package org.egov.inbox.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHost;
import org.apache.tomcat.util.codec.binary.Base64;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.inbox.config.InboxConfiguration;
import org.egov.inbox.repository.RetryTemplate;
import org.egov.inbox.repository.ServiceRequestRepository;
import org.egov.inbox.web.model.elasticsearch.InboxElasticSearchCriteria;
import org.egov.inbox.web.model.elasticsearch.InboxElasticSearchRequest;
import org.egov.inbox.web.model.elasticsearch.UserDetailResponse;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import javax.annotation.PostConstruct;
import java.nio.charset.Charset;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static java.util.Objects.isNull;
import static javax.servlet.http.HttpServletRequest.BASIC_AUTH;
import static org.apache.commons.codec.CharEncoding.US_ASCII;
import static org.egov.inbox.util.DSSConstants.*;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Slf4j
@Service
public class ElasticSearchService {

    @Autowired
    private InboxConfiguration config;

    @Autowired
    private RetryTemplate retryTemplate;

    @Autowired
    private DSSInboxFilterService dssInboxFilterService;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private MultiStateInstanceUtil centralInstanceUtil;

    private String internalMicroserviceRoleUuid = null;


    @PostConstruct
    void initalizeSystemuser(){
        RequestInfo requestInfo = new RequestInfo();
        StringBuilder uri = new StringBuilder();
        uri.append(config.getUserHost()).append(config.getUserSearchEndpoint()); // URL for user search call
        Map<String, Object> userSearchRequest = new HashMap<>();
        userSearchRequest.put("RequestInfo", requestInfo);
        userSearchRequest.put("tenantId", config.getParentLevelTenantId());
        userSearchRequest.put("roleCodes", Collections.singletonList(INTERNALMICROSERVICEROLE_CODE));
        try {
            LinkedHashMap<String, Object> responseMap = (LinkedHashMap<String, Object>) serviceRequestRepository.fetchResult(uri, userSearchRequest);
            List<LinkedHashMap<String, Object>> users = (List<LinkedHashMap<String, Object>>) responseMap.get("user");
            if(users.size()==0)
                createInternalMicroserviceUser(requestInfo);
            internalMicroserviceRoleUuid = (String) users.get(0).get("uuid");
        }catch (Exception e) {
            throw new CustomException("EG_USER_SEARCH_ERROR", "Service returned null while fetching user");
        }

    }

    private void createInternalMicroserviceUser(RequestInfo requestInfo){
        Map<String, Object> userCreateRequest = new HashMap<>();
        //Creating role with INTERNAL_MICROSERVICE_ROLE
        Role role = Role.builder()
                .name(INTERNALMICROSERVICEROLE_NAME).code(INTERNALMICROSERVICEROLE_CODE)
                .tenantId(config.getParentLevelTenantId()).build();
        User user = User.builder().userName(INTERNALMICROSERVICEUSER_USERNAME)
                .name(INTERNALMICROSERVICEUSER_NAME).mobileNumber(INTERNALMICROSERVICEUSER_MOBILENO)
                .type(INTERNALMICROSERVICEUSER_TYPE).tenantId(config.getParentLevelTenantId())
                .roles(Collections.singletonList(role)).id(0L).build();

        userCreateRequest.put("RequestInfo", requestInfo);
        userCreateRequest.put("user", user);

        StringBuilder uri = new StringBuilder();
        uri.append(config.getUserHost()).append(config.getUserCreateEndpoint()); // URL for user create call

        try {
            LinkedHashMap<String, Object> responseMap = (LinkedHashMap<String, Object>) serviceRequestRepository.fetchResult(uri, userCreateRequest);
            List<LinkedHashMap<String, Object>> users = (List<LinkedHashMap<String, Object>>) responseMap.get("user");
            internalMicroserviceRoleUuid = (String) users.get(0).get("uuid");
        }catch (Exception e) {
            throw new CustomException("EG_USER_CRETE_ERROR", "Service returned throws error while creating user");
        }
    }


    public Map<String, Object> search(InboxElasticSearchRequest request) {
        Map<String, Object> query = new HashMap<>();
        try{
            String tenantId = centralInstanceUtil.getStateLevelTenant(request.getInboxElasticSearchCriteria().getTenantId());
            Object mdmsData = dssInboxFilterService.mdmsCall(tenantId, ELASTIC_SEARCH_MASTER);
            String jsonPath = MDMS_ELASTIC_SEARCH_PATH.replace("{{indexKey}}",request.getInboxElasticSearchCriteria().getIndexKey());
            List<Map> object  = JsonPath.read(mdmsData, jsonPath);
            query = mapper.convertValue(object.get(0),Map.class);
        }catch (Exception e) {
            throw new CustomException("MDMS_DATA_EXTRACTION_ERROR", "Error in fetching mdms data. Check whether index key present in mdms file or not");
        }

        String searchQuery = (String) query.get("query");
        String indexName = (String) query.get("indexName");
        List<String> placeHolderList = (List<String>) query.get("placeHolders");
        searchQuery = enrichSearchQuery(request.getRequestInfo(),request.getInboxElasticSearchCriteria(),searchQuery, placeHolderList);
        String url =( config.getIndexServiceHost() ) + indexName + config.getIndexServiceHostSearchEndpoint();
        HttpHeaders headers = getHttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        log.info("Searching ES for Query: " + searchQuery);
        HttpEntity<String> requestEntity = new HttpEntity<>(searchQuery, headers);
        String reqBody = requestEntity.getBody();
        JsonNode responseNode = null;
        Map<String, Object> finalResult = new HashMap<>();

        try {
            ResponseEntity<Object> response = retryTemplate.postForEntity(url, requestEntity);
            responseNode = new ObjectMapper().convertValue(response.getBody(), JsonNode.class);
            Object total = responseNode.get(ELASTICSEARCH_HIT_KEY).get(ELASTICSEARCH_TOTAL_KEY);
            JsonNode output = responseNode.get(ELASTICSEARCH_HIT_KEY).get(ELASTICSEARCH_HIT_KEY);
            if(output.size()==0){
                throw new CustomException("NO_DATA", "No logs data for the given user with the provided search criteria");
            }
            List<Map<String,Object>> result = new ArrayList<>();
            List<String> userIds = new ArrayList<>();
            Map<String,Object> totalHits = new HashMap<>();
            totalHits.put(ELASTICSEARCH_TOTAL_KEY,total);
            result.add(totalHits);
            if (!isNull(output) && output.isArray()) {
                for(JsonNode objectnode : output){
                    Map<String,Object> data = new HashMap<>();
                    data.put(ELASTICSEARCH_TIMESTAMP_KEY,objectnode.get(ELASTICSEARCH_SOURCE_KEY).get(ELASTICSEARCH_DATA_KEY).get(ELASTICSEARCH_TIMESTAMP_KEY));
                    data.put(ELASTICSEARCH_DATAVIEW_KEY,objectnode.get(ELASTICSEARCH_SOURCE_KEY).get(ELASTICSEARCH_DATA_KEY).get(ELASTICSEARCH_PALINACCESSREQUEST_KEY).get(ELASTICSEARCH_PALINACCESSREQUESTFIELD_KEY));
                    data.put(ELASTICSEARCH_USERID_KEY,objectnode.get(ELASTICSEARCH_SOURCE_KEY).get(ELASTICSEARCH_DATA_KEY).get(ELASTICSEARCH_USERID_KEY).textValue());
                    if(!(userIds.contains((String) data.get(ELASTICSEARCH_USERID_KEY))))
                        userIds.add((String) data.get(ELASTICSEARCH_USERID_KEY));
                    result.add(data);
                }
            }
            Map<String, Object> mapping = getPlainOwnerDetails(request.getRequestInfo(), userIds, request.getInboxElasticSearchCriteria().getTenantId());
            if(mapping.size() != userIds.size())
                getremainingCitizenUserDetails(request.getRequestInfo(),userIds,request.getInboxElasticSearchCriteria().getTenantId(), mapping);

            for(int i=0;i<result.size();i++){
                String uuid = (String) result.get(i).get(ELASTICSEARCH_USERID_KEY);
                Map<String,Object> userData = (Map<String, Object>) mapping.get(uuid);
                if(userData!= null){
                    result.get(i).put(ELASTICSEARCH_DATAVIEWEDBY_KEY,userData.get("name"));
                    result.get(i).put(ELASTICSEARCH_ROLES_KEY,userData.get("roles"));
                }
                else
                    result.get(i).put("user",null);
            }
            finalResult.put("ResponseInfo",null);
            finalResult.put("ElasticSearchData",result);

        } catch (HttpClientErrorException e) {
            log.error("client error while searching ES : " + e.getMessage());
            throw new CustomException("ELASTICSEARCH_ERROR", "client error while searching ES : \" + e.getMessage()");
        }
        return finalResult;
    }

    /**
     * Gets plain data of citizen user details
     * @param requestInfo requestinfo
     * @param uuids List of user uuids
     * @param tenantId tenantid
     * @param mapping map of uuid and employee user
     */
    private void getremainingCitizenUserDetails(RequestInfo requestInfo, List<String> uuids, String tenantId, Map<String,Object> mapping){
        Map<String,Object> citizenUser = new HashMap<>();
        List<String> citizenUuids = new ArrayList<>();

        // Getting the citizen user uuid from the collatted uuid list
        for(String uuid : uuids){
            if(!mapping.containsKey(uuid))
                citizenUuids.add(uuid);
        }
        citizenUser = getPlainOwnerDetails(requestInfo, uuids, centralInstanceUtil.getStateLevelTenant(tenantId));
        mapping.putAll(citizenUser);
    }


    /**
     * Enrich elastic search query
     * @param requestInfo requestinfo
     * @param criteria inbox search criteria
     * @param searchQuery elastic search query
     * @param placeHolderList list of placeholder to replace
     */
    public String enrichSearchQuery(RequestInfo requestInfo, InboxElasticSearchCriteria criteria, String searchQuery, List<String> placeHolderList){
       String elasticSearchQuery = searchQuery;
        Long limit = config.getDefaultLimit();
        Long offset = config.getDefaultOffset();
        String sortOrder = config.getDefaultSortOrder();

        if(criteria.getLimit() != null && criteria.getLimit() <= config.getMaxSearchLimit())
            limit = Long.valueOf(criteria.getLimit());

        if(criteria.getLimit() != null && criteria.getLimit() > config.getMaxSearchLimit())
            limit = Long.valueOf(config.getMaxSearchLimit());

        if(criteria.getOffset() != null)
            offset = Long.valueOf(criteria.getOffset());

        if(criteria.getSortOrder() != null)
            sortOrder = criteria.getSortOrder();

        for(String placeholder:placeHolderList){

            if(placeholder.equalsIgnoreCase(PLACEHOLDER_FROMDATE_KEY)){
                String fromDate = "0";
                if(criteria.getFromDate()!=0)
                    fromDate = String.valueOf(criteria.getFromDate());
                elasticSearchQuery = elasticSearchQuery.replace(PLACEHOLDER_FROMDATE_KEY,fromDate);

            }

            if(placeholder.equalsIgnoreCase(PLACEHOLDER_TODATE_KEY)){
                String toDate = String.valueOf(System.currentTimeMillis());
                if(criteria.getToDate()!=0)
                    toDate = String.valueOf(criteria.getToDate());
                elasticSearchQuery = elasticSearchQuery.replace(PLACEHOLDER_TODATE_KEY,toDate);

            }

            if(placeholder.equalsIgnoreCase(PLACEHOLDER_OFFSET_KEY))
                elasticSearchQuery = elasticSearchQuery.replace(PLACEHOLDER_OFFSET_KEY,String.valueOf(offset));

            if(placeholder.equalsIgnoreCase(PLACEHOLDER_LIMIT_KEY))
                elasticSearchQuery = elasticSearchQuery.replace(PLACEHOLDER_LIMIT_KEY,String.valueOf(limit));

            if(placeholder.equalsIgnoreCase(PLACEHOLDER_SORT_ORDER_KEY))
                elasticSearchQuery = elasticSearchQuery.replace(PLACEHOLDER_SORT_ORDER_KEY,sortOrder);


            if(placeholder.equalsIgnoreCase(PLACEHOLDER_UUID_KEY)){
                String mobileNumber = requestInfo.getUserInfo().getMobileNumber();
                String tenantId = centralInstanceUtil.getStateLevelTenant(criteria.getTenantId());
                List<String> usersUuid = getUsersUuid(requestInfo,mobileNumber,tenantId);
                String multiMatchQuery = String.join(" OR ",usersUuid);
                elasticSearchQuery = elasticSearchQuery.replace(PLACEHOLDER_UUID_KEY,multiMatchQuery);
            }
        }
        return elasticSearchQuery;
    }

    /**
     * Searches the citizen user based on mobileNumber and returns the list of their UUIDS
     * @param requestInfo RequestInfo
     * @param mobileNumber Citizen mobile number
     * @param tenantId tenantId for citizen search
     * @return List of citizen user uuids
     */
    private List<String> getUsersUuid(RequestInfo requestInfo, String mobileNumber, String tenantId ){
        List<String> usersUuid = new ArrayList<>();
        StringBuilder uri = new StringBuilder();
        uri.append(config.getUserHost()).append(config.getUserSearchEndpoint()); // URL for user search call
        Map<String, Object> userSearchRequest = new HashMap<>();

        // Setting user search criteria
        userSearchRequest.put("RequestInfo", requestInfo);
        userSearchRequest.put("tenantId", tenantId);
        userSearchRequest.put("mobileNumber",mobileNumber);
        userSearchRequest.put("type","CITIZEN");
        UserDetailResponse userDetailResponse = null;

        try {
            LinkedHashMap<String, Object> responseMap = (LinkedHashMap<String, Object>) serviceRequestRepository.fetchResult(uri, userSearchRequest);
            List<LinkedHashMap<String, Object>> users = (List<LinkedHashMap<String, Object>>) responseMap.get("user");
            if(null != users) {
                users.forEach( user -> {
                    usersUuid.add((String)user.get("uuid"));
                });
            }
        } catch (Exception e) {
            throw new CustomException("EG_USER_SEARCH_ERROR", "Service returned null while fetching user : "+e.getMessage());
        }

        return usersUuid;
    }

    private HttpHeaders getHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add(AUTHORIZATION, getBase64Value(config.getEsUserName(), config.getEsPassword()));
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setContentType(MediaType.APPLICATION_JSON);

        List<MediaType> mediaTypes = new ArrayList<>();
        mediaTypes.add(MediaType.APPLICATION_JSON);
        headers.setAccept(mediaTypes);
        return headers;
    }

    private String getBase64Value(String userName, String password) {
        String authString = String.format("%s:%s", userName, password);
        byte[] encodedAuthString = Base64.encodeBase64(authString.getBytes(Charset.forName(US_ASCII)));
        return String.format(BASIC_AUTH, new String(encodedAuthString));
    }

    /**
     * Gets plain data of user details
     * @param requestInfo requestinfo
     * @param uuids List of user uuids
     * @param tenantId tenantid
     */
    private Map<String,Object> getPlainOwnerDetails(RequestInfo requestInfo, List<String> uuids, String tenantId){
        Map<String,Object> mapping = new HashMap<>();
        User userInfoCopy = requestInfo.getUserInfo();
        StringBuilder uri = new StringBuilder();
        uri.append(config.getUserHost()).append(config.getUserSearchEndpoint()); // URL for user search call
        Map<String, Object> userSearchRequest = new HashMap<>();

        //Creating role with INTERNAL_MICROSERVICE_ROLE
        Role role = Role.builder()
                .name(INTERNALMICROSERVICEROLE_NAME).code(INTERNALMICROSERVICEROLE_CODE)
                .tenantId(centralInstanceUtil.getStateLevelTenant(tenantId)).build();

        //Creating userinfo with uuid and role of internal micro service role
        User userInfo = User.builder()
                .uuid(internalMicroserviceRoleUuid)
                .type(INTERNALMICROSERVICEUSER_TYPE)
                .roles(Collections.singletonList(role)).id(0L).build();

        requestInfo.setUserInfo(userInfo);

        // Setting user search criteria
        userSearchRequest.put("RequestInfo", requestInfo);
        userSearchRequest.put("tenantId", tenantId);
        userSearchRequest.put("uuid",uuids);
        UserDetailResponse userDetailResponse = null;
        try {
            LinkedHashMap<String, Object> responseMap = (LinkedHashMap<String, Object>) serviceRequestRepository.fetchResult(uri, userSearchRequest);

            List<LinkedHashMap<String, Object>> users = (List<LinkedHashMap<String, Object>>) responseMap.get("user");
            String dobFormat = "yyyy-MM-dd";

            // parsing the user response
            parseResponse(responseMap,dobFormat,mapping);

            /*for(User user: userDetailResponse.getUser())
                mapping.put(user.getUuid(),user);*/

        } catch (Exception e) {
            throw new CustomException("EG_USER_SEARCH_ERROR", "Service returned null while fetching user");
        }
        requestInfo.setUserInfo(userInfoCopy);
        return mapping;
    }


    /**
     * Converts date to required date format
     * @param responseMap date to be parsed
     * @param dobFormat Format of the date
     */
    private void parseResponse(LinkedHashMap<String, Object> responseMap,String dobFormat, Map<String,Object> mapping) {

        List<LinkedHashMap<String, Object>> users = (List<LinkedHashMap<String, Object>>)responseMap.get("user");
        String format1 = "dd-MM-yyyy HH:mm:ss";

        if(null != users) {

            users.forEach( map -> {

                        map.put("createdDate",dateTolong((String)map.get("createdDate"),format1));
                        if((String)map.get("lastModifiedDate")!=null)
                            map.put("lastModifiedDate",dateTolong((String)map.get("lastModifiedDate"),format1));
                        if((String)map.get("dob")!=null)
                            map.put("dob",dateTolong((String)map.get("dob"),dobFormat));
                        if((String)map.get("pwdExpiryDate")!=null)
                            map.put("pwdExpiryDate",dateTolong((String)map.get("pwdExpiryDate"),format1));

                        mapping.put((String)map.get("uuid"),map);
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
            log.error("Error while parsing the date");
        }
        return  d.getTime();
    }

}
