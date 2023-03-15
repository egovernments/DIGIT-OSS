package org.egov.egf.master.web.controller;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.common.utils.RequestJsonReader;
import org.egov.egf.master.TestConfiguration;
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.AccountEntity;
import org.egov.egf.master.domain.model.AccountEntitySearch;
import org.egov.egf.master.domain.service.AccountEntityService;
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

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(AccountEntityController.class)
@Import(TestConfiguration.class)
public class AccountEntityControllerTest {

    @MockBean
    AccountEntityService accountEntityService;
    @Autowired
    private MockMvc mockMvc;
    @Captor
    private ArgumentCaptor<List<AccountEntity>> captor;

    private RequestJsonReader resources = new RequestJsonReader();

    @Test
    public void testCreate() throws IOException, Exception {
        when(accountEntityService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
                .thenReturn(getAccountEntities());
        mockMvc.perform(
                post("/accountentities/_create?tenantId=default").content(resources.readRequest("accountentity/accountentity_create_request.json"))
                        .contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().is(201)).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().json(resources.readResponse("accountentity/accountentity_create_response.json")));

        verify(accountEntityService).create(captor.capture(), any(BindingResult.class), any(RequestInfo.class));

        final List<AccountEntity> actualRequest = captor.getValue();
        assertEquals("name", actualRequest.get(0).getName());
        assertEquals("code", actualRequest.get(0).getCode());
        assertEquals("default", actualRequest.get(0).getTenantId());
    }

    @Test
    public void testCreate_Error() throws IOException, Exception {
        when(accountEntityService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
                .thenReturn(getAccountEntities());
        mockMvc.perform(post("/accountentities/_create?tenantId=default")
                .content(resources.readRequest("accountentity/accountentity_create_invalid_fieldvalue.json"))
                .contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is5xxServerError());

    }

    @Test
    public void testUpdate() throws IOException, Exception {
        when(accountEntityService.update(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
                .thenReturn(getUpdateAccountEntities());

        mockMvc.perform(
                post("/accountentities/_update?tenantId=default").content(resources.readRequest("accountentity/accountentity_update_request.json"))
                        .contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().is(201)).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().json(resources.readResponse("accountentity/accountentity_update_response.json")));

        verify(accountEntityService).update(captor.capture(), any(BindingResult.class), any(RequestInfo.class));

        final List<AccountEntity> actualRequest = captor.getValue();
        assertEquals("nameU", actualRequest.get(0).getName());
        assertEquals("codeU", actualRequest.get(0).getCode());
        assertEquals("default", actualRequest.get(0).getTenantId());
    }

    @Test
    public void test_search() throws IOException, Exception {

        Pagination<AccountEntity> page = new Pagination<>();
        page.setTotalPages(1);
        page.setTotalResults(1);
        page.setCurrentPage(0);
        page.setPagedData(getAccountEntities());
        page.getPagedData().get(0).setId("1");

        when(accountEntityService.search(any(AccountEntitySearch.class), any(BindingResult.class))).thenReturn(page);

        mockMvc.perform(post("/accountentities/_search?tenantId=default").content(resources.getRequestInfo())
                .contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(200))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().json(resources.readResponse("accountentity/accountentity_search_response.json")));

    }

    private List<AccountEntity> getAccountEntities() {
        List<AccountEntity> accountEntities = new ArrayList<AccountEntity>();
        AccountEntity accountEntity = AccountEntity.builder().id("1").name("name").code("code").active(true)
                .accountDetailType(getAccountDetaialType()).description("entity").build();
        accountEntity.setTenantId("default");
        accountEntities.add(accountEntity);
        return accountEntities;
    }

    private List<AccountEntity> getUpdateAccountEntities() {
        List<AccountEntity> accountEntities = new ArrayList<AccountEntity>();
        AccountEntity accountEntity = AccountEntity.builder().name("nameU").code("codeU").active(true)
                .accountDetailType(getAccountDetaialType()).id("1").description("entity").build();
        accountEntity.setTenantId("default");
        accountEntities.add(accountEntity);
        return accountEntities;
    }

    private AccountDetailType getAccountDetaialType() {

        AccountDetailType accountDetailType = AccountDetailType.builder().id("1").name("name").tableName("table")
                .fullyQualifiedName("abc/table").build();
        accountDetailType.setTenantId("default");
        return accountDetailType;
    }

}
