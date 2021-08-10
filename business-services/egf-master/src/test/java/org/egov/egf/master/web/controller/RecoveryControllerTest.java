package org.egov.egf.master.web.controller;

import static org.mockito.Matchers.any;
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
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.Recovery;
import org.egov.egf.master.domain.model.RecoverySearch;
import org.egov.egf.master.domain.service.RecoveryService;
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
@WebMvcTest(RecoveryController.class)
@Import(TestConfiguration.class)
public class RecoveryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    RecoveryService recoveryService;

    @Captor
    private ArgumentCaptor<List<Recovery>> captor;

    private RequestJsonReader resources = new RequestJsonReader();

    @Test
    public void testCreate() throws IOException, Exception {
        when(recoveryService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
                .thenReturn(getRecoverys());
        mockMvc.perform(post("/recoverys/_create?tenantId=default")
                .content(resources.readRequest("recovery/recovery_create_valid_request.json"))
                .contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(content().json(resources
                .readResponse("recovery/recovery_create_valid_response.json")));
    }

    @Test
    public void testCreate_Error() throws IOException, Exception {
        when(recoveryService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
                .thenReturn(getRecoverys());
        mockMvc.perform(
                post("/recoverys/_create").content(resources.readRequest("recovery/recovery_create_invalid_field_value.json"))
                        .contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().is5xxServerError());

    }

    @Test
    public void testUpdate() throws IOException, Exception {
        when(recoveryService.update(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
                .thenReturn(getUpdateRecoverys());

        mockMvc.perform(post("/recoverys/_update?tenantId=default")
                .content(resources.readRequest("recovery/recovery_update_valid_request.json"))
                .contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(content().json(resources
                .readResponse("recovery/recovery_update_valid_response.json")));
    }

    @Test
    public void test_search() throws IOException, Exception {

        Pagination<Recovery> page = new Pagination<>();
        page.setTotalPages(1);
        page.setTotalResults(1);
        page.setCurrentPage(0);
        page.setPagedData(getRecoverys());
        page.getPagedData().get(0).setId("1");

        when(recoveryService.search(any(RecoverySearch.class), any(BindingResult.class))).thenReturn(page);

        mockMvc.perform(
                post("/recoverys/_search?tenantId=default").content(resources.getRequestInfo()).contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().is(200)).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().json(resources.readResponse("recovery/recovery_search_valid_response.json")));

    }

    private List<Recovery> getRecoverys() {
        List<Recovery> recoverys = new ArrayList<Recovery>();
        Recovery recovery = Recovery.builder().name("name").code("code").type("M").mode('M').remittanceMode('M').active(true).build();
        recovery.setTenantId("default");
        recovery.setChartOfAccount(getCOAccount());
        recovery.setRemitted("S");
        recovery.setIfscCode("SBIN0005532");
        recovery.setAccountNumber("3049223457");
        recovery.setId("1");
        recoverys.add(recovery);
        return recoverys;
    }

    private ChartOfAccount getCOAccount() {
        ChartOfAccount chartOfAccount = new ChartOfAccount();
        chartOfAccount.setGlcode("341");
        chartOfAccount.setTenantId("default");
        return chartOfAccount;
    }

    private List<Recovery> getUpdateRecoverys() {
        List<Recovery> recoverys = new ArrayList<Recovery>();
        Recovery recovery = Recovery.builder().name("nameU").code("codeU").type("M").mode('M').remittanceMode('M').active(true).build();
        recovery.setTenantId("default");
        recovery.setChartOfAccount(getCOAccount());
        recovery.setRemitted("S");
        recovery.setIfscCode("SBIN0005532");
        recovery.setAccountNumber("3049223457");
        recovery.setId("1");
        recoverys.add(recovery);
        return recoverys;
    }

}
