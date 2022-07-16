package org.egov.wf.util;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;

import org.egov.tracer.model.CustomException;
import org.egov.wf.repository.BusinessServiceRepository;
import org.egov.wf.web.models.BusinessService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {BusinessUtil.class})
@ExtendWith(SpringExtension.class)
class BusinessUtilTest {
    @MockBean
    private BusinessServiceRepository businessServiceRepository;

    @Autowired
    private BusinessUtil businessUtil;


    @Test
    void testGetBusinessService() {
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(new ArrayList<>());
        assertThrows(CustomException.class, () -> this.businessUtil.getBusinessService("42", "Business Service"));
        verify(this.businessServiceRepository)
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
    }

    @Test
    void TestGetBusinessService() {
        ArrayList<BusinessService> businessServiceList = new ArrayList<>();
        BusinessService businessService = new BusinessService();
        businessServiceList.add(businessService);
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenReturn(businessServiceList);
        assertSame(businessService, this.businessUtil.getBusinessService("42", "Business Service"));
        verify(this.businessServiceRepository)
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
    }


    @Test
    void testGetBusinessServiceWithInvalidRequest() {
        when(this.businessServiceRepository
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any()))
                .thenThrow(new CustomException("INVALID REQUEST", "An error occurred"));
        assertThrows(CustomException.class, () -> this.businessUtil.getBusinessService("42", "Business Service"));
        verify(this.businessServiceRepository)
                .getBusinessServices((org.egov.wf.web.models.BusinessServiceSearchCriteria) any());
    }
}

