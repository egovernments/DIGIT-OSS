package org.egov.boundary.web.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.boundary.TestConfiguration;
import org.egov.boundary.domain.service.MdmsService;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.tracer.model.ServiceCallException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(GeographicalController.class)
@Import(TestConfiguration.class)
public class GeographicalControllerTest {

    private ObjectMapper objectMapper = new ObjectMapper();
    private RequestInfo requestInfo = RequestInfo.builder().build();

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MdmsService mdmsService;

    @Test
    public void geographySearch() throws Exception {
        ResponseInfo responseInfo = ResponseInfo.builder().status(HttpStatus.OK.toString()).build();
        when(mdmsService.fetchGeography(any(String.class), any(String.class), any(RequestInfo.class))).thenReturn
                (Optional.of
                        (Collections.emptyList()));
        mockMvc.perform(post("/location/v11/geography/_search").param("tenantId", "ap").contentType(MediaType
                .APPLICATION_JSON_UTF8)
                .content(objectMapper.writeValueAsString(requestInfo))).andExpect(status().isOk());
    }

    @Test
    public void geographySearchInvalidTenant() throws Exception {
        RequestInfo requestInfo = RequestInfo.builder().build();
        ResponseInfo responseInfo = ResponseInfo.builder().status(HttpStatus.BAD_REQUEST.toString()).build();
        when(mdmsService.fetchGeography(any(String.class), any(String.class), any(RequestInfo.class))).thenThrow(new
                ServiceCallException("{\"ResponseInfo\":null,\"Errors\":[{\"code\":\"NotNull.mdmsCriteriaReq.requestInfo\",\"message\":\"may not be null\",\"description\":null,\"params\":null}]}\n"));
        mockMvc.perform(post("/location/v11/geography/_search").param("tenantId", "ap.xyz").contentType(MediaType
                .APPLICATION_JSON_UTF8)
                .content(objectMapper.writeValueAsString(requestInfo))).andExpect(status().isBadRequest());
    }


}
