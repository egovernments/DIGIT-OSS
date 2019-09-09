package org.egov.egf.instrument.web.repository;

import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import org.egov.egf.instrument.utils.RequestJsonReader;
import org.egov.egf.instrument.web.contract.InstrumentAccountCodeContract;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

@RunWith(MockitoJUnitRunner.class)
public class InstrumentAccountCodeContractRepositoryTest {

    private InstrumentAccountCodeContractRepository instrumentAccountCodeContractRepository;

    private static final String HOST = "http://host";

    private MockRestServiceServer server;

    private RequestJsonReader resources = new RequestJsonReader();

    @Before
    public void setup() {
        final RestTemplate restTemplate = new RestTemplate();
        instrumentAccountCodeContractRepository = new InstrumentAccountCodeContractRepository(HOST, restTemplate);
        server = MockRestServiceServer.bindTo(restTemplate).build();
    }

    @Test
    public void test_find_by_id() throws Exception {

        server.expect(once(),
                requestTo("http://host/egf-instrument/instrumentaccountcodes/_search?id=1&tenantId=default"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withSuccess(resources.getFileContents("instrumentaccountcode/search_by_id_response.json"),
                        MediaType.APPLICATION_JSON_UTF8));

        InstrumentAccountCodeContract instrumentAccountCodeContract = new InstrumentAccountCodeContract();

        instrumentAccountCodeContract.setId("1");
        instrumentAccountCodeContract.setTenantId("default");

        final InstrumentAccountCodeContract response = instrumentAccountCodeContractRepository
                .findById(instrumentAccountCodeContract);

        server.verify();

        assertEquals("1", response.getId());
        assertEquals("default", response.getTenantId());

    }

}
