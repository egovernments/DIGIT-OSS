package org.egov.url.shortening.service;

import java.util.List;

import javax.annotation.PostConstruct;

import org.egov.tracer.model.CustomException;
import org.egov.url.shortening.model.ShortenRequest;
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


@Service
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
    
    private ObjectMapper objectMapper;

    @Autowired
    public URLConverterService(List<URLRepository> urlRepositories, ObjectMapper objectMapper) {
    	System.out.println(urlRepositories);
    	this.urlRepositories = urlRepositories;   
    	this.objectMapper = objectMapper;
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
        String uniqueID = IDConvertor.createUniqueID(id);
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
        Long dictionaryKey = IDConvertor.getDictionaryKeyFromUniqueID(uniqueID);
        String longUrl = urlRepository.getUrl(dictionaryKey);
        LOGGER.info("Converting shortened URL back to {}", longUrl);
        if(longUrl.isEmpty())
        	throw new CustomException("INVALID_REQUEST","Invalid Key");
        return longUrl;
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
