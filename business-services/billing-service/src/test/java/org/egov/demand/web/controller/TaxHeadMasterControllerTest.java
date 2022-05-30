package org.egov.demand.web.controller;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.service.TaxHeadMasterService;
import org.egov.demand.web.contract.RequestInfoWrapper;
import org.egov.demand.web.contract.TaxHeadMasterResponse;
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

@ContextConfiguration(classes = {TaxHeadMasterController.class})
@ExtendWith(SpringExtension.class)
class TaxHeadMasterControllerTest {
    @Autowired
    private TaxHeadMasterController taxHeadMasterController;

    @MockBean
    private TaxHeadMasterService taxHeadMasterService;


    @Test
    void testSearch() throws Exception {
        when(
                this.taxHeadMasterService.getTaxHeads((org.egov.demand.model.TaxHeadMasterCriteria) any(), (RequestInfo) any()))
                .thenReturn(new TaxHeadMasterResponse());

        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(requestInfoWrapper);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/taxheads/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        MockMvcBuilders.standaloneSetup(this.taxHeadMasterController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content().string("{\"ResponseInfo\":null,\"TaxHeadMasters\":[]}"));
    }
}

