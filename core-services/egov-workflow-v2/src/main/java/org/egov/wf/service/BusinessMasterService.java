package org.egov.wf.service;

import org.egov.wf.config.WorkflowConfig;
import org.egov.wf.producer.Producer;
import org.egov.wf.repository.BusinessServiceRepository;
import org.egov.wf.web.models.BusinessService;
import org.egov.wf.web.models.BusinessServiceRequest;
import org.egov.wf.web.models.BusinessServiceSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusinessMasterService {

    private Producer producer;

    private WorkflowConfig config;

    private EnrichmentService enrichmentService;

    private BusinessServiceRepository repository;


    @Autowired
    public BusinessMasterService(Producer producer, WorkflowConfig config, EnrichmentService enrichmentService,
                                 BusinessServiceRepository repository) {
        this.producer = producer;
        this.config = config;
        this.enrichmentService = enrichmentService;
        this.repository = repository;
    }




    /**
     * Enriches and sends the request on kafka to persist
     * @param request The BusinessServiceRequest to be persisted
     * @return The enriched object which is persisted
     */
    public List<BusinessService> create(BusinessServiceRequest request){
       enrichmentService.enrichCreateBusinessService(request);
       producer.push(config.getSaveBusinessServiceTopic(),request);
       return request.getBusinessServices();
    }

    /**
     * Fetches business service object from db
     * @param criteria The search criteria
     * @return Data fetched from db
     */
    public List<BusinessService> search(BusinessServiceSearchCriteria criteria){
        String tenantId = criteria.getTenantIds().get(0);
        List<BusinessService> businessServices = repository.getBusinessServices(criteria);
        if(config.getIsStateLevel()){
            enrichmentService.enrichTenantIdForStateLevel(tenantId,businessServices);
        }
        return businessServices;
    }

    public List<BusinessService> update(BusinessServiceRequest request){
        enrichmentService.enrichUpdateBusinessService(request);
        producer.push(config.getUpdateBusinessServiceTopic(),request);
        return request.getBusinessServices();
    }



}
