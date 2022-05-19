package org.egov.id.api;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;

import org.egov.id.model.IdGenerationRequest;
import org.egov.id.model.RequestInfo;
import org.egov.id.service.IdGenerationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

/*@AutoConfigureDataMongo
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ExtendWith(SpringExtension.class)
@WebMvcTest(testGenerateIdResponse.class)*/

@ContextConfiguration(classes = {IdGenerationController.class})
@ExtendWith(SpringExtension.class)
class IdGenerationControllerTest {
    @Autowired
    private IdGenerationController idGenerationController;

    @MockBean
    private IdGenerationService idGenerationService;

    /**
     * Method under test: {@link IdGenerationController#generateIdResponse(IdGenerationRequest)}
     */
    @Test
    void testGenerateIdResponse() throws Exception {
        IdGenerationRequest idGenerationRequest = new IdGenerationRequest();
        idGenerationRequest.setIdRequests(new ArrayList<>());
        idGenerationRequest.setRequestInfo(new RequestInfo());
        String content = (new ObjectMapper()).writeValueAsString(idGenerationRequest);
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.post("/_generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(content);
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(this.idGenerationController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().isNotFound());
    }

/*@Test
    public void testGenerateIdResponsePost() throws Exception {
        mockMvc.perform(post("/_generate")
                        .accept(MediaType.APPLICATION_JSON_UTF8).content("")
                        .contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isNotFound());
    }*/
}

