package org.egov.egf.instrument.web.controller;

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
import org.egov.egf.instrument.TestConfiguration;
import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.domain.model.InstrumentTypeSearch;
import org.egov.egf.instrument.domain.service.InstrumentTypeService;
import org.egov.egf.instrument.utils.RequestJsonReader;
import org.egov.egf.instrument.web.requests.InstrumentTypeRequest;
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
@WebMvcTest(InstrumentTypeController.class)
@Import(TestConfiguration.class)
public class InstrumentTypeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InstrumentTypeService instrumentTypeService;

    @Captor
    private ArgumentCaptor<InstrumentTypeRequest> captor;

    private RequestJsonReader resources = new RequestJsonReader();

    @Test
    public void test_create() throws IOException, Exception {

        when(instrumentTypeService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
                .thenReturn(getInstrumentTypes());

        mockMvc.perform(post("/instrumenttypes/_create")
                .content(resources.readRequest("instrumenttype/instrumenttype_create_valid_request.json"))
                .contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(content()
                        .json(resources.readResponse("instrumenttype/instrumenttype_create_valid_response.json")));
    }

    @Test
    public void test_create_error() throws IOException, Exception {

        when(instrumentTypeService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
                .thenReturn(getInstrumentTypes());

        mockMvc.perform(post("/instrumenttypes/_create")
                .content(resources.readRequest("instrumenttype/instrumenttype_create_invalid_field_value.json"))
                .contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is5xxServerError());

    }

    @Test
    public void test_update() throws IOException, Exception {

        List<InstrumentType> instrumentTypes = getInstrumentTypes();
        instrumentTypes.get(0).setId("1");

        when(instrumentTypeService.update(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
                .thenReturn(instrumentTypes);

        mockMvc.perform(post("/instrumenttypes/_update")
                .content(resources.readRequest("instrumenttype/instrumenttype_update_valid_request.json"))
                .contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(content()
                        .json(resources.readResponse("instrumenttype/instrumenttype_update_valid_response.json")));

    }

    @Test
    public void test_delete() throws IOException, Exception {

        List<InstrumentType> instrumentTypes = getInstrumentTypes();
        instrumentTypes.get(0).setId("1");

        when(instrumentTypeService.delete(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
                .thenReturn(instrumentTypes);

        mockMvc.perform(post("/instrumenttypes/_delete")
                .content(resources.readRequest("instrumenttype/instrumenttype_delete_valid_request.json"))
                .contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(content()
                        .json(resources.readResponse("instrumenttype/instrumenttype_delete_valid_response.json")));

    }

    @Test
    public void test_update_error() throws IOException, Exception {

        when(instrumentTypeService.update(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
                .thenReturn(getInstrumentTypes());

        mockMvc.perform(post("/instrumenttypes/_update")
                .content(resources.readRequest("instrumenttype/instrumenttype_create_invalid_field_value.json"))
                .contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is5xxServerError());

    }

    @Test
    public void test_delete_error() throws IOException, Exception {

        when(instrumentTypeService.delete(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
                .thenReturn(getInstrumentTypes());

        mockMvc.perform(post("/instrumenttypes/_delete")
                .content(resources.readRequest("instrumenttype/instrumenttype_delete_invalid_field_value.json"))
                .contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is5xxServerError());

    }

    @Test
    public void test_search() throws IOException, Exception {

        Pagination<InstrumentType> page = new Pagination<>();
        page.setTotalPages(1);
        page.setTotalResults(1);
        page.setCurrentPage(0);
        page.setPagedData(getInstrumentTypes());
        page.getPagedData().get(0).setId("1");

        when(instrumentTypeService.search(any(InstrumentTypeSearch.class))).thenReturn(page);

        mockMvc.perform(post("/instrumenttypes/_search").content(resources.getRequestInfo())
                .contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(200))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(content()
                        .json(resources.readResponse("instrumenttype/instrumenttype_search_valid_response.json")));

    }

    private List<InstrumentType> getInstrumentTypes() {
        List<InstrumentType> instrumentTypes = new ArrayList<InstrumentType>();
        InstrumentType instrumentType = InstrumentType.builder().name("name").description("description").active(true)
                .build();
        instrumentType.setTenantId("default");
        instrumentTypes.add(instrumentType);
        return instrumentTypes;
    }

}