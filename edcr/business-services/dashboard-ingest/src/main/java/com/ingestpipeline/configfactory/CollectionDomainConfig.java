package com.ingestpipeline.configfactory;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.ingestpipeline.config.DomainConfig;
import com.ingestpipeline.model.DomainIndexConfig;
import com.ingestpipeline.util.ConfigLoader;
import com.ingestpipeline.util.Constants;

//@JsonIgnoreProperties(ignoreUnknown=true)
@Component(Constants.DomainConfigurations.COLLECTION_DOMAIN_CONFIG)
public class CollectionDomainConfig implements DomainConfig {

    private static final Logger LOGGER = LoggerFactory.getLogger(CollectionDomainConfig.class);
    private static final String COLLECTION_DOMAIN_CONFIG = Constants.DomainConfigurations.COLLECTION_DOMAIN_CONFIG + ".json";


    @Autowired
    private ConfigLoader configLoader;
    /**
     * Holds domain name as key and it's index config detail as value.
     */
    private Map<String, DomainIndexConfig>  domainIndexConfigMap = new HashMap<>();

    public void putDomain(String domainName, DomainIndexConfig domainIndexConfig){
        domainIndexConfigMap.put(domainName, domainIndexConfig);
    }

    @Override
    public DomainIndexConfig getIndexConfig(String domainName){
        return domainIndexConfigMap.get(domainName);
    }


    /**
     * loads once on application start up.
     */
    @Override
    public void loadDomains(){
        String collectionConfigContent = configLoader.get(COLLECTION_DOMAIN_CONFIG);
        //LOGGER.info("collectionConfigContent json string = "+collectionConfigContent);

        try{

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = new ObjectMapper().readTree(collectionConfigContent);
            ArrayNode domainConfigArr = (ArrayNode) root.path(DOMAIN_CONFIG);

            Iterator<JsonNode> iterator = domainConfigArr.elements();
            while (iterator.hasNext()) {
                DomainIndexConfig domainIndexConfig = mapper.readValue(iterator.next().toString(), DomainIndexConfig.class);
                LOGGER.info("DomainIndexConfig id:: " + domainIndexConfig.getDomain());
                domainIndexConfigMap.put(domainIndexConfig.getDomain(), domainIndexConfig);

            }
            LOGGER.info("After loading, domainIndexConfigMap size  = "+ domainIndexConfigMap.size());

        } catch (Exception e){
            LOGGER.error("Error occurred on construction domain collection map: "+ e.getMessage());
        }

    }
}
