package org.egov.url.shortening.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;


import javax.annotation.PostConstruct;

import lombok.extern.slf4j.Slf4j;
import org.egov.url.shortening.utils.HashIdConverter;
import org.json.JSONArray;
import org.json.JSONObject;
import org.egov.tracer.model.CustomException;
import org.egov.url.shortening.model.ShortenRequest;
import org.egov.url.shortening.producer.Producer;
import org.egov.url.shortening.repository.URLRepository;
import org.egov.url.shortening.utils.IDConvertor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.client.RestTemplate;
import org.egov.url.shortening.utils.HashIdConverter;


@Service
@Slf4j
@Configuration
public class URLConverterService {
    private static final Logger LOGGER = LoggerFactory.getLogger(URLConverterService.class);
    
    private List<URLRepository> urlRepositories;
    
    private URLRepository urlRepository;
//  private final UrlDBRepository urlDBRepository;
    
    @Value("${db.persistance.enabled}")
    private Boolean isDbPersitanceEnabled;
    
    @Value("#{${egov.ui.app.host.map}}")
    private Map<String, String> hostName;
    
    @Value("${server.contextPath}")
    private String serverContextPath;

    @Value("${state.level.tenant.id}")
    private String stateLevelTenantId;

    @Value("${egov.user.host}")
    private String userHost;

    @Value("${egov.user.search.path}")
    private String userSearchPath;

    @Value("${url.shorten.indexer.topic}")
    private String kafkaTopic;
    
    @Autowired
    private HashIdConverter hashIdConverter;
    
    private ObjectMapper objectMapper;

    private RestTemplate restTemplate;

    private Producer producer;

    @Autowired
    private HashIdConverter hashIdConverter;

    @Autowired
    public URLConverterService(List<URLRepository> urlRepositories, ObjectMapper objectMapper, RestTemplate restTemplate, Producer producer) {
    	System.out.println(urlRepositories);
    	this.urlRepositories = urlRepositories;   
    	this.objectMapper = objectMapper;
    	this.restTemplate = restTemplate;
    	this.producer = producer;
    }
    
    @PostConstruct
    public void initialize(){
    	if(isDbPersitanceEnabled)
    		urlRepository =  urlRepositories.get(0);
    	else
    		urlRepository = urlRepositories.get(1);
    }
    

    public String shortenURL(ShortenRequest shortenRequest, String tenantId) {
        LOGGER.info("Shortening {}", shortenRequest.getUrl());
        Long id = urlRepository.incrementID();
        String uniqueID = hashIdConverter.createHashStringForId(id);
        try {
			urlRepository.saveUrl("url:"+id, shortenRequest);
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        StringBuilder shortenedUrl = new StringBuilder();

        if(!hostName.containsKey(tenantId)){
            throw new CustomException("EG_TENANT_HOST_NOT_FOUND_ERR", "Hostname for provided state level tenant has not been configured for tenantId: " + tenantId);
        }

        String stateSpecificHostName = hostName.get(tenantId);
        
        if(stateSpecificHostName.endsWith("/"))
            stateSpecificHostName = stateSpecificHostName.substring(0, stateSpecificHostName.length() - 1);
        if(serverContextPath.startsWith("/"))
        	serverContextPath = serverContextPath.substring(1);
        shortenedUrl.append(stateSpecificHostName).append("/").append(serverContextPath);
        if(!serverContextPath.endsWith("/")) {
        	shortenedUrl.append("/");
        }
    	shortenedUrl.append(uniqueID);
    	
        return shortenedUrl.toString();
    }

    public String getLongURLFromID(String uniqueID) throws Exception {
        Long dictionaryKey = hashIdConverter.getIdForString(uniqueID);
        // To support previously generated dictionary keys
        if(dictionaryKey == null)
            dictionaryKey = IDConvertor.getDictionaryKeyFromUniqueID(uniqueID);
        String longUrl = urlRepository.getUrl(dictionaryKey);
        LOGGER.info("Converting shortened URL back to {}", longUrl);
        if(longUrl.isEmpty())
        	throw new CustomException("INVALID_REQUEST","Invalid Key");
        return longUrl;
    }


    public String getUserUUID(String mobileNumber){
        String uuid = null;
        HashMap <String,String> request = new HashMap<String, String>();
        Map<String, Object> response  = new HashMap<String, Object>();
        request.put("type", "CITIZEN");
        request.put("tenantId", stateLevelTenantId);
        request.put("userName", mobileNumber);

        StringBuilder url = new StringBuilder();
        url.append(userHost).append(userSearchPath);
        try {
            response = restTemplate.postForObject(url.toString(), request, Map.class);
            JSONObject result = new JSONObject(response);
            JSONArray user = result.getJSONArray("user");
            if(user.length()>0){
                uuid = user.getJSONObject(0).getString("uuid");
            }
        }catch(Exception e) {
            log.error("Exception while fetching user: ", e);
        }

        return  uuid;
    }



   /* private String formatLocalURLFromShortener(String localURL) {
        String[] addressComponents = localURL.split("/");
        // remove the endpoint (last index)
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < addressComponents.length - 1; ++i) {
            sb.append(addressComponents[i]);
        }
        sb.append('/');
        return sb.toString();
    }*/

}
