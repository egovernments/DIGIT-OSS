package org.egov.egf.master.web.controller;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.common.utils.RequestJsonReader;
import org.egov.egf.master.TestConfiguration;
import org.egov.egf.master.domain.model.Fund;
import org.egov.egf.master.domain.model.FundSearch;
import org.egov.egf.master.domain.service.FundService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.validation.BindingResult;

@RunWith(SpringRunner.class)
@WebMvcTest(FundController.class)
@Import(TestConfiguration.class)
public class FundControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    FundService fundService;

    @Captor
    private ArgumentCaptor<List<Fund>> captor;

    private RequestJsonReader resources = new RequestJsonReader();

    @Test
    public void testCreate() throws IOException, Exception {
        when(fundService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
                .thenReturn(getFunds());
        mockMvc.perform(post("/funds/_create?tenantId=default")
                .content(resources.readRequest("fund/fund_create_valid_request.json"))
                .contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(content().json(resources
                        .readResponse("fund/fund_create_valid_response.json")));

        verify(fundService).create(captor.capture(), any(BindingResult.class), any(RequestInfo.class));

        final List<Fund> actualRequest = captor.getValue();
        assertEquals("name", actualRequest.get(0).getName());
        assertEquals("code", actualRequest.get(0).getCode());
        assertEquals(Character.valueOf('I'), actualRequest.get(0).getIdentifier());
        assertEquals("default", actualRequest.get(0).getTenantId());
    }

    @Test
    public void testCreate_Error() throws IOException, Exception {
        when(fundService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
                .thenReturn(getFunds());
        mockMvc.perform(
                post("/funds/_create").content(resources.readRequest("fund/fund_create_invalid_field_value.json"))
                        .contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().is5xxServerError());

    }

    @Test
    public void testUpdate() throws IOException, Exception {
        when(fundService.update(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
                .thenReturn(getUpdateFunds());

        mockMvc.perform(post("/funds/_update?tenantId=default")
                .content(resources.readRequest("fund/fund_update_valid_request.json"))
                .contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(content().json(resources
                        .readResponse("fund/fund_update_valid_response.json")));

        verify(fundService).update(captor.capture(), any(BindingResult.class), any(RequestInfo.class));

        final List<Fund> actualRequest = captor.getValue();
        assertEquals("nameupdate", actualRequest.get(0).getName());
        assertEquals("code", actualRequest.get(0).getCode());
        assertEquals(Character.valueOf('U'), actualRequest.get(0).getIdentifier());
        assertEquals("default", actualRequest.get(0).getTenantId());
    }

    @Test
    public void test_search() throws IOException, Exception {

        Pagination<Fund> page = new Pagination<>();
        page.setTotalPages(1);
        page.setTotalResults(1);
        page.setCurrentPage(0);
        page.setPagedData(getFunds());
        page.getPagedData().get(0).setId("1");

        when(fundService.search(any(FundSearch.class), any(BindingResult.class))).thenReturn(page);

        mockMvc.perform(
                post("/funds/_search?tenantId=default").content(resources.getRequestInfo()).contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().is(200)).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().json(resources.readResponse("fund/fund_search_valid_response.json")));

    }

    private List<Fund> getFunds() {
        List<Fund> funds = new ArrayList<Fund>();
        Fund fund = Fund.builder().name("name").code("code").identifier('I').level(1234l).active(true).build();
        fund.setTenantId("default");
        funds.add(fund);
        return funds;
    }

    private List<Fund> getUpdateFunds() {
        List<Fund> funds = new ArrayList<Fund>();
        Fund fund = Fund.builder().name("nameupdate").code("code").identifier('U').active(true).id("1").level(1234l).build();
        fund.setTenantId("default");
        funds.add(fund);
        return funds;
    }
}
