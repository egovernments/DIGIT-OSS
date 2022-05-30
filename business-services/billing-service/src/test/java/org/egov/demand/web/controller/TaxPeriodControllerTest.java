package org.egov.demand.web.controller;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.service.TaxPeriodService;
import org.egov.demand.web.contract.RequestInfoWrapper;
import org.egov.demand.web.contract.TaxPeriodResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ContextConfiguration(classes = {TaxPeriodController.class})
@ExtendWith(SpringExtension.class)
class TaxPeriodControllerTest {
    @Autowired
    private TaxPeriodController taxPeriodController;

    @MockBean
    private TaxPeriodService taxPeriodService;


    @Test
    void testSearch() throws Exception {
        when(this.taxPeriodService.searchTaxPeriods((org.egov.demand.web.contract.TaxPeriodCriteria) any(),
                (RequestInfo) any())).thenReturn(new TaxPeriodResponse());

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/taxperiods/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.taxPeriodController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content().string("{\"ResponseInfo\":null,\"TaxPeriods\":[]}"));
    }
}

