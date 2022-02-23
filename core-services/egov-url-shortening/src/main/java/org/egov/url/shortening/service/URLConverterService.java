package org.egov.url.shortening.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.annotation.PostConstruct;

import lombok.extern.slf4j.Slf4j;
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
    
    @Value("${host.name}")
    private String hostName;
    
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
    

    public String shortenURL(ShortenRequest shortenRequest) {
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
        
        if(hostName.endsWith("/"))
        	hostName = hostName.substring(0, hostName.length() - 1);
        if(serverContextPath.startsWith("/"))
        	serverContextPath = serverContextPath.substring(1);
        shortenedUrl.append(hostName).append("/").append(serverContextPath);
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
        else{
            String[] queryString = longUrl.split("\\?");
            if(queryString.length > 1)
                indexData(longUrl,uniqueID);
        }
        return longUrl;
    }

    public void indexData(String longUrl, String uniqueID){
        String query = longUrl.split("\\?")[1];
        HashMap <String,String> params = new HashMap<String, String>();
        String[] strParams = query.split("&");
        for (String param : strParams)
        {
            String name = param.split("=")[0];
            String value = param.split("=")[1];
            params.put(name, value);
        }
        String channel = params.get("channel");
        if(channel !=null && (channel.equalsIgnoreCase("whatsapp") || channel.equalsIgnoreCase("sms"))){
            HashMap <String,Object> data = new HashMap<String, Object>();
            StringBuilder shortenedUrl = new StringBuilder();

            if(hostName.endsWith("/"))
                hostName = hostName.substring(0, hostName.length() - 1);
            if(serverContextPath.startsWith("/"))
                serverContextPath = serverContextPath.substring(1);
            shortenedUrl.append(hostName).append("/").append(serverContextPath);
            if(!serverContextPath.endsWith("/")) {
                shortenedUrl.append("/");
            }
            shortenedUrl.append(uniqueID);
            data.put("id", UUID.randomUUID());
            data.put("timestamp",System.currentTimeMillis());
            data.put("shortenUrl",shortenedUrl.toString());
            data.put("actualUrl", longUrl);

            String mobileNumber = params.get("mobileNumber");
            if(mobileNumber == null)
                mobileNumber = params.get("mobileNo");
            
            if(mobileNumber != null){
                String uuid = getUserUUID(mobileNumber);
                if(uuid != null)
                    data.put("user",uuid);
            }
            String  tag = params.get("tag");
            if(tag.equalsIgnoreCase("billPayment")){
                String businessService = params.get("businessService");
                if(businessService.equalsIgnoreCase("PT"))
                    data.put("tag", "Property Bill Payment");
                if(businessService.equalsIgnoreCase("WS"))
                    data.put("tag", "Water and Sewerage Bill Payment");
            }
            else if(tag.equalsIgnoreCase("complaintTrack")){
                data.put("tag", "Compliant tracking");
            }
            else if(tag.equalsIgnoreCase("propertyOpenSearch")){
                data.put("tag", "Property Open Search");
            }
            else if(tag.equalsIgnoreCase("wnsOpenSearch")){
                data.put("tag", "Water and Sewerage Open Search");
            }
            else if(tag.equalsIgnoreCase("smsOnboarding")){
                data.put("tag", "SMS Onboarding");
            }
            else{
                data.put("tag", "Unidentified link");
            }

            producer.push(kafkaTopic,data);

        }

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
