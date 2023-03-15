package org.egov.egf.instrument.persistence.queue.repository;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.instrument.persistence.queue.FinancialInstrumentProducer;
import org.egov.egf.instrument.web.contract.SurrenderReasonContract;
import org.egov.egf.instrument.web.requests.SurrenderReasonRequest;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class SurrenderReasonQueueRepositoryTest {

    @Mock
    private SurrenderReasonQueueRepository surrenderReasonQueueRepository;

    @Mock
    private FinancialInstrumentProducer financialInstrumentProducer;

    private static final String TOPIC_NAME = "topic";

    private static final String KEY_NAME = "key";

    @Before
    public void setup() {
        surrenderReasonQueueRepository = new SurrenderReasonQueueRepository(financialInstrumentProducer, TOPIC_NAME,
                KEY_NAME, TOPIC_NAME, KEY_NAME);
    }

    @Test
    public void test_add_to_queue_while_create() {

        SurrenderReasonRequest request = new SurrenderReasonRequest();

        request.setSurrenderReasons(getSurrenderReasons());
        request.setRequestInfo(new RequestInfo());
        request.getRequestInfo().setAction("create");

        surrenderReasonQueueRepository.addToQue(request);

        final ArgumentCaptor<HashMap> argumentCaptor = ArgumentCaptor.forClass(HashMap.class);

        verify(financialInstrumentProducer).sendMessage(any(String.class), any(String.class), argumentCaptor.capture());

        final HashMap<String, Object> actualRequest = argumentCaptor.getValue();

        assertEquals(request, actualRequest.get("surrenderreason_create"));

    }

    @Test
    public void test_add_to_queue_while_update() {

        SurrenderReasonRequest request = new SurrenderReasonRequest();

        request.setSurrenderReasons(getSurrenderReasons());
        request.setRequestInfo(new RequestInfo());
        request.getRequestInfo().setAction("update");

        surrenderReasonQueueRepository.addToQue(request);

        final ArgumentCaptor<HashMap> argumentCaptor = ArgumentCaptor.forClass(HashMap.class);

        verify(financialInstrumentProducer).sendMessage(any(String.class), any(String.class), argumentCaptor.capture());

        final HashMap<String, Object> actualRequest = argumentCaptor.getValue();

        assertEquals(request, actualRequest.get("surrenderreason_update"));

    }

    @Test
    public void test_add_to_search_queue() {

        SurrenderReasonRequest request = new SurrenderReasonRequest();

        request.setSurrenderReasons(getSurrenderReasons());

        surrenderReasonQueueRepository.addToSearchQue(request);

        final ArgumentCaptor<HashMap> argumentCaptor = ArgumentCaptor.forClass(HashMap.class);

        verify(financialInstrumentProducer).sendMessage(any(String.class), any(String.class), argumentCaptor.capture());

        final HashMap<String, Object> actualRequest = argumentCaptor.getValue();

        assertEquals(request, actualRequest.get("surrenderreason_persisted"));

    }

    private List<SurrenderReasonContract> getSurrenderReasons() {

        List<SurrenderReasonContract> surrenderReasons = new ArrayList<SurrenderReasonContract>();
        SurrenderReasonContract surrenderReason = SurrenderReasonContract.builder().name("name")
                .description("description").build();
        surrenderReason.setTenantId("default");
        surrenderReasons.add(surrenderReason);

        return surrenderReasons;
    }

}
