package org.egov.egf.instrument.persistence.queue.repository;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.instrument.persistence.queue.FinancialInstrumentProducer;
import org.egov.egf.instrument.web.contract.InstrumentContract;
import org.egov.egf.instrument.web.contract.InstrumentTypeContract;
import org.egov.egf.instrument.web.contract.TransactionTypeContract;
import org.egov.egf.instrument.web.requests.InstrumentRequest;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class InstrumentQueueRepositoryTest {

    @Mock
    private InstrumentQueueRepository instrumentQueueRepository;

    @Mock
    private FinancialInstrumentProducer financialInstrumentProducer;

    private static final String TOPIC_NAME = "topic";

    private static final String KEY_NAME = "key";

    @Before
    public void setup() {
        instrumentQueueRepository = new InstrumentQueueRepository(financialInstrumentProducer, TOPIC_NAME, KEY_NAME,
                TOPIC_NAME, KEY_NAME);
    }

    @Test
    public void test_add_to_queue_while_create() {

        InstrumentRequest request = new InstrumentRequest();

        request.setInstruments(getInstruments());
        request.setRequestInfo(new RequestInfo());
        request.getRequestInfo().setAction("create");

        instrumentQueueRepository.addToQue(request);

        final ArgumentCaptor<HashMap> argumentCaptor = ArgumentCaptor.forClass(HashMap.class);

        verify(financialInstrumentProducer).sendMessage(any(String.class), any(String.class), argumentCaptor.capture());

        final HashMap<String, Object> actualRequest = argumentCaptor.getValue();

        assertEquals(request, actualRequest.get("instrument_create"));

    }

    @Test
    public void test_add_to_queue_while_update() {

        InstrumentRequest request = new InstrumentRequest();

        request.setInstruments(getInstruments());
        request.setRequestInfo(new RequestInfo());
        request.getRequestInfo().setAction("update");

        instrumentQueueRepository.addToQue(request);

        final ArgumentCaptor<HashMap> argumentCaptor = ArgumentCaptor.forClass(HashMap.class);

        verify(financialInstrumentProducer).sendMessage(any(String.class), any(String.class), argumentCaptor.capture());

        final HashMap<String, Object> actualRequest = argumentCaptor.getValue();

        assertEquals(request, actualRequest.get("instrument_update"));

    }

    @Test
    public void test_add_to_search_queue() {

        InstrumentRequest request = new InstrumentRequest();

        request.setInstruments(getInstruments());

        instrumentQueueRepository.addToSearchQue(request);

        final ArgumentCaptor<HashMap> argumentCaptor = ArgumentCaptor.forClass(HashMap.class);

        verify(financialInstrumentProducer).sendMessage(any(String.class), any(String.class), argumentCaptor.capture());

        final HashMap<String, Object> actualRequest = argumentCaptor.getValue();

        assertEquals(request, actualRequest.get("instrument_persisted"));

    }

    private List<InstrumentContract> getInstruments() {

        List<InstrumentContract> instruments = new ArrayList<InstrumentContract>();

        InstrumentContract instrument = InstrumentContract.builder().transactionNumber("transactionNumber")
                .amount(BigDecimal.ONE).transactionType(TransactionTypeContract.Credit).serialNo("serialNo")
                .instrumentType(InstrumentTypeContract.builder().active(true).name("instrumenttype").build()).build();
        instrument.setTenantId("default");
        instruments.add(instrument);

        return instruments;
    }

}
