package org.egov.egf.instrument.persistence.queue.repository;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.instrument.persistence.queue.FinancialInstrumentProducer;
import org.egov.egf.instrument.web.contract.InstrumentTypeContract;
import org.egov.egf.instrument.web.requests.InstrumentTypeRequest;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class InstrumentTypeQueueRepositoryTest {

    @Mock
    private InstrumentTypeQueueRepository instrumentTypeQueueRepository;

    @Mock
    private FinancialInstrumentProducer financialInstrumentProducer;

    private static final String TOPIC_NAME = "topic";

    private static final String KEY_NAME = "key";

    @Before
    public void setup() {
        instrumentTypeQueueRepository = new InstrumentTypeQueueRepository(financialInstrumentProducer, TOPIC_NAME,
                KEY_NAME, TOPIC_NAME, KEY_NAME);
    }

    @Test
    public void test_add_to_queue_while_create() {

        InstrumentTypeRequest request = new InstrumentTypeRequest();

        request.setInstrumentTypes(getInstrumentTypes());
        request.setRequestInfo(new RequestInfo());
        request.getRequestInfo().setAction("create");

        instrumentTypeQueueRepository.addToQue(request);

        final ArgumentCaptor<HashMap> argumentCaptor = ArgumentCaptor.forClass(HashMap.class);

        verify(financialInstrumentProducer).sendMessage(any(String.class), any(String.class), argumentCaptor.capture());

        final HashMap<String, Object> actualRequest = argumentCaptor.getValue();

        assertEquals(request, actualRequest.get("instrumenttype_create"));

    }

    @Test
    public void test_add_to_queue_while_update() {

        InstrumentTypeRequest request = new InstrumentTypeRequest();

        request.setInstrumentTypes(getInstrumentTypes());
        request.setRequestInfo(new RequestInfo());
        request.getRequestInfo().setAction("update");

        instrumentTypeQueueRepository.addToQue(request);

        final ArgumentCaptor<HashMap> argumentCaptor = ArgumentCaptor.forClass(HashMap.class);

        verify(financialInstrumentProducer).sendMessage(any(String.class), any(String.class), argumentCaptor.capture());

        final HashMap<String, Object> actualRequest = argumentCaptor.getValue();

        assertEquals(request, actualRequest.get("instrumenttype_update"));

    }

    @Test
    public void test_add_to_search_queue() {

        InstrumentTypeRequest request = new InstrumentTypeRequest();

        request.setInstrumentTypes(getInstrumentTypes());

        instrumentTypeQueueRepository.addToSearchQue(request);

        final ArgumentCaptor<HashMap> argumentCaptor = ArgumentCaptor.forClass(HashMap.class);

        verify(financialInstrumentProducer).sendMessage(any(String.class), any(String.class), argumentCaptor.capture());

        final HashMap<String, Object> actualRequest = argumentCaptor.getValue();

        assertEquals(request, actualRequest.get("instrumenttype_persisted"));

    }

    private List<InstrumentTypeContract> getInstrumentTypes() {

        List<InstrumentTypeContract> instrumentTypes = new ArrayList<InstrumentTypeContract>();

        InstrumentTypeContract instrumentType = InstrumentTypeContract.builder().name("name").description("description")
                .active(true).build();
        instrumentType.setTenantId("default");
        instrumentTypes.add(instrumentType);
        return instrumentTypes;
    }

}
