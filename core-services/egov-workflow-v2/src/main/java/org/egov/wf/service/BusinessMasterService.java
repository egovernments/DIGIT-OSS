package org.egov.wf.service;

import com.jayway.jsonpath.JsonPath;
import org.egov.wf.config.WorkflowConfig;
import org.egov.wf.producer.Producer;
import org.egov.wf.repository.BusinessServiceRepository;
import org.egov.wf.web.models.BusinessService;
import org.egov.wf.web.models.BusinessServiceRequest;
import org.egov.wf.web.models.BusinessServiceSearchCriteria;
import org.egov.wf.web.models.ProcessInstanceSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.egov.wf.util.WorkflowConstants.JSONPATH_BUSINESSSERVICE_STATELEVEL;

@Service
public class BusinessMasterService {

    private Producer producer;

    private WorkflowConfig config;

    private EnrichmentService enrichmentService;

    private BusinessServiceRepository repository;

    private MDMSService mdmsService;

    private CacheManager cacheManager;

    @Autowired
    public BusinessMasterService(Producer producer, WorkflowConfig config, EnrichmentService enrichmentService,
                                 BusinessServiceRepository repository, MDMSService mdmsService, CacheManager cacheManager) {
        this.producer = producer;
        this.config = config;
        this.enrichmentService = enrichmentService;
        this.repository = repository;
        this.mdmsService = mdmsService;
        this.cacheManager = cacheManager;
    }




    /**
     * Enriches and sends the request on kafka to persist
     * @param request The BusinessServiceRequest to be persisted
     * @return The enriched object which is persisted
     */
    public List<BusinessService> create(BusinessServiceRequest request){
        evictAllCacheValues("businessService");
        evictAllCacheValues("roleTenantAndStatusesMapping");
        enrichmentService.enrichCreateBusinessService(request);
        producer.push(config.getSaveBusinessServiceTopic(),request);
        return request.getBusinessServices();
    }

    /**
     * Fetches business service object from db
     * @param criteria The search criteria
     * @return Data fetched from db
     */
    @Cacheable(value = "businessService")
    public List<BusinessService> search(BusinessServiceSearchCriteria criteria){
        String tenantId = criteria.getTenantId();
        List<BusinessService> businessServices = repository.getBusinessServices(criteria);
        enrichmentService.enrichTenantIdForStateLevel(tenantId,businessServices);

        return businessServices;
    }



    public List<BusinessService> update(BusinessServiceRequest request){
        evictAllCacheValues("businessService");
        evictAllCacheValues("roleTenantAndStatusesMapping");
        enrichmentService.enrichUpdateBusinessService(request);
        producer.push(config.getUpdateBusinessServiceTopic(),request);
        return request.getBusinessServices();
    }


    private void evictAllCacheValues(String cacheName) {
        cacheManager.getCache(cacheName).clear();
    }
    
    public Long getMaxBusinessServiceSla(ProcessInstanceSearchCriteria criteria) {
        BusinessServiceSearchCriteria searchCriteria = new BusinessServiceSearchCriteria();
        String tenantId = criteria.getTenantId();
        searchCriteria.setTenantId(tenantId);
        searchCriteria.setBusinessServices(Collections.singletonList(criteria.getBusinessService()));
        List<BusinessService> businessServices = repository.getBusinessServices(searchCriteria);
        enrichmentService.enrichTenantIdForStateLevel(tenantId,businessServices);

        Long maxSla = businessServices.get(0).getBusinessServiceSla();
        return maxSla;
    }



}
