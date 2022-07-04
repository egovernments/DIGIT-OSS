package org.egov.wf.service;

import org.egov.wf.config.WorkflowConfig;
import org.egov.wf.producer.Producer;
import org.egov.wf.repository.BusinessServiceRepository;
import org.egov.wf.web.models.BusinessService;
import org.egov.wf.web.models.BusinessServiceRequest;
import org.egov.wf.web.models.BusinessServiceSearchCriteria;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ContextConfiguration(classes = {BusinessMasterService.class})
@ExtendWith(SpringExtension.class)
class BusinessMasterServiceTest {
    @Autowired
    private BusinessMasterService businessMasterService;

    @MockBean
    private BusinessServiceRepository businessServiceRepository;

    @MockBean
    private CacheManager cacheManager;

    @MockBean
    private EnrichmentService enrichmentService;

    @MockBean
    private MDMSService mDMSService;

    @MockBean
    private Producer producer;

    @MockBean
    private WorkflowConfig workflowConfig;


    @Test
    void testCreate() {
        when(this.workflowConfig.getSaveBusinessServiceTopic()).thenReturn("Save Business Service Topic");
        doNothing().when(this.producer).push((String) any(), (Object) any());
        doNothing().when(this.enrichmentService).enrichCreateBusinessService((BusinessServiceRequest) any());
        when(this.cacheManager.getCache((String) any())).thenReturn(new ConcurrentMapCache("Name"));
        assertNull(this.businessMasterService.create(new BusinessServiceRequest()));
        verify(this.workflowConfig).getSaveBusinessServiceTopic();
        verify(this.producer).push((String) any(), (Object) any());
        verify(this.enrichmentService).enrichCreateBusinessService((BusinessServiceRequest) any());
        verify(this.cacheManager, atLeast(1)).getCache((String) any());
    }


    @Test
    void testCreateWithNull() {
        when(this.workflowConfig.getSaveBusinessServiceTopic()).thenReturn("Save Business Service Topic");
        doNothing().when(this.producer).push((String) any(), (Object) any());
        doNothing().when(this.enrichmentService).enrichCreateBusinessService((BusinessServiceRequest) any());
        when(this.cacheManager.getCache((String) any())).thenReturn(null);

    }


    @Test
    void testCreateWithString() {
        when(this.workflowConfig.getSaveBusinessServiceTopic()).thenReturn("Save Business Service Topic");
        doNothing().when(this.producer).push((String) any(), (Object) any());
        doNothing().when(this.enrichmentService).enrichCreateBusinessService((BusinessServiceRequest) any());
        when(this.cacheManager.getCache((String) any())).thenReturn(new ConcurrentMapCache("Name"));

    }


    @Test
    void testSearch() {
        doNothing().when(this.enrichmentService).enrichTenantIdForStateLevel((String) any(), (List<BusinessService>) any());
        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        when(this.businessServiceRepository.getBusinessServices((BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);
        List<BusinessService> actualSearchResult = this.businessMasterService.search(new BusinessServiceSearchCriteria());
        assertSame(businessServiceList, actualSearchResult);
        assertTrue(actualSearchResult.isEmpty());
        verify(this.enrichmentService).enrichTenantIdForStateLevel((String) any(), (List<BusinessService>) any());
        verify(this.businessServiceRepository).getBusinessServices((BusinessServiceSearchCriteria) any());
    }

    @Test
    void testSearchNull() {
        doNothing().when(this.enrichmentService).enrichTenantIdForStateLevel((String) any(), (List<BusinessService>) any());
        when(this.businessServiceRepository.getBusinessServices((BusinessServiceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());

    }


    @Test
    void testUpdate() {
        when(this.workflowConfig.getUpdateBusinessServiceTopic()).thenReturn("2020-03-01");
        doNothing().when(this.producer).push((String) any(), (Object) any());
        doNothing().when(this.enrichmentService).enrichUpdateBusinessService((BusinessServiceRequest) any());
        when(this.cacheManager.getCache((String) any())).thenReturn(new ConcurrentMapCache("Name"));
        assertNull(this.businessMasterService.update(new BusinessServiceRequest()));
        verify(this.workflowConfig).getUpdateBusinessServiceTopic();
        verify(this.producer).push((String) any(), (Object) any());
        verify(this.enrichmentService).enrichUpdateBusinessService((BusinessServiceRequest) any());
        verify(this.cacheManager, atLeast(1)).getCache((String) any());
    }


    @Test
    void testUpdateWithNull() {
        when(this.workflowConfig.getUpdateBusinessServiceTopic()).thenReturn("2020-03-01");
        doNothing().when(this.producer).push((String) any(), (Object) any());
        doNothing().when(this.enrichmentService).enrichUpdateBusinessService((BusinessServiceRequest) any());
        when(this.cacheManager.getCache((String) any())).thenReturn(null);

    }


    @Test
    void testUpdateWithStirng() {

        when(this.workflowConfig.getUpdateBusinessServiceTopic()).thenReturn("2020-03-01");
        doNothing().when(this.producer).push((String) any(), (Object) any());
        doNothing().when(this.enrichmentService).enrichUpdateBusinessService((BusinessServiceRequest) any());
        when(this.cacheManager.getCache((String) any())).thenReturn(new ConcurrentMapCache("Name"));

    }
}

