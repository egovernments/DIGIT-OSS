package org.egov.demand.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.demand.repository.BusinessServiceDetailRepository;
import org.egov.demand.web.contract.BusinessServiceDetailCriteria;
import org.egov.demand.web.contract.BusinessServiceDetailResponse;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {BusinessServDetailService.class, ResponseFactory.class})
@ExtendWith(SpringExtension.class)
class BusinessServDetailServiceTest {
    @Autowired
    private BusinessServDetailService businessServDetailService;

    @MockBean
    private BusinessServiceDetailRepository businessServiceDetailRepository;

    /**
     * Method under test: {@link BusinessServDetailService#searchBusinessServiceDetails(BusinessServiceDetailCriteria, RequestInfo)}
     */
    @Test
    void testSearchBusinessServiceDetails() {
        when(this.businessServiceDetailRepository.getBussinessServiceDetail((RequestInfo) any(),
                (BusinessServiceDetailCriteria) any())).thenReturn(new ArrayList<>());
        BusinessServiceDetailCriteria businessServiceDetailCriteria = new BusinessServiceDetailCriteria();
        BusinessServiceDetailResponse actualSearchBusinessServiceDetailsResult = this.businessServDetailService
                .searchBusinessServiceDetails(businessServiceDetailCriteria, new RequestInfo());
        assertTrue(actualSearchBusinessServiceDetailsResult.getBusinessServiceDetails().isEmpty());
        ResponseInfo responseInfo = actualSearchBusinessServiceDetailsResult.getResponseInfo();
        assertNull(responseInfo.getApiId());
        assertNull(responseInfo.getVer());
        assertNull(responseInfo.getTs());
        assertEquals("200 OK", responseInfo.getStatus());
        assertNull(responseInfo.getMsgId());
        verify(this.businessServiceDetailRepository).getBussinessServiceDetail((RequestInfo) any(),
                (BusinessServiceDetailCriteria) any());
    }

    /**
     * Method under test: {@link BusinessServDetailService#searchBusinessServiceDetails(BusinessServiceDetailCriteria, RequestInfo)}
     */
    @Test
    void testSearchBusinessServiceDetails2() {
        when(this.businessServiceDetailRepository.getBussinessServiceDetail((RequestInfo) any(),
                (BusinessServiceDetailCriteria) any())).thenReturn(new ArrayList<>());
        assertTrue(this.businessServDetailService.searchBusinessServiceDetails(new BusinessServiceDetailCriteria(), null)
                .getBusinessServiceDetails()
                .isEmpty());
        verify(this.businessServiceDetailRepository).getBussinessServiceDetail((RequestInfo) any(),
                (BusinessServiceDetailCriteria) any());
    }
}

