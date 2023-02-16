package org.egov.inbox.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.inbox.config.InboxConfiguration;
import org.egov.inbox.web.model.InboxSearchCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component
public class ElasticSearchRepository {

    private InboxConfiguration config;

    private ElasticSearchQueryBuilder queryBuilder;

    private RestTemplate restTemplate;

    private ObjectMapper mapper;

    @Autowired
    public ElasticSearchRepository(InboxConfiguration config, ElasticSearchQueryBuilder queryBuilder, RestTemplate restTemplate, ObjectMapper mapper) {
        this.config = config;
        this.queryBuilder = queryBuilder;
        this.restTemplate = restTemplate;
        this.mapper = mapper;
    }


    /**
     * Searches records from elasticsearch based on the fuzzy search criteria
     *
     * @param criteria
     * @return
     */
    public Object elasticSearchApplications(InboxSearchCriteria criteria, List<String> uuids) {


        String url = getESURL(criteria);

        String searchQuery = queryBuilder.getSearchQuery(criteria, uuids);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> requestEntity = new HttpEntity<>(searchQuery, headers);
        ResponseEntity response = null;
        try {
            response = restTemplate.postForEntity(url, requestEntity, Object.class);

        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("WNS_ES_SEARCH_ERROR", "Failed to fetch data from ES for W&S");
        }

        return response.getBody();

    }


    /**
     * Generates elasticsearch search url from application properties
     *
     * @return
     */
    private String getESURL(InboxSearchCriteria criteria) {

        StringBuilder builder = new StringBuilder(config.getIndexServiceHost());
        if (criteria.getProcessSearchCriteria().getModuleName().equals("ws-services"))
            builder.append(config.getEsWSIndex());
        else if (criteria.getProcessSearchCriteria().getModuleName().equals("sw-services")) {
            builder.append(config.getEsSWIndex());
        }
        builder.append(config.getIndexServiceHostSearchEndpoint());

        return builder.toString();
    }

}