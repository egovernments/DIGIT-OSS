package org.egov.egf.instrument.persistence.queue.repository;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.egf.instrument.persistence.queue.FinancialInstrumentProducer;
import org.egov.egf.instrument.web.contract.InstrumentAccountCodeContract;
import org.egov.egf.instrument.web.contract.InstrumentTypeContract;
import org.egov.egf.instrument.web.requests.InstrumentAccountCodeRequest;
import org.egov.egf.master.web.contract.ChartOfAccountContract;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class InstrumentAccountCodeQueueRepositoryTest {

    @Mock
    private InstrumentAccountCodeQueueRepository instrumentAccountCodeQueueRepository;

    @Mock
    private FinancialInstrumentProducer financialInstrumentProducer;

    private static final String TOPIC_NAME = "topic";

    private static final String KEY_NAME = "key";

    @Before
    public void setup() {
        instrumentAccountCodeQueueRepository = new InstrumentAccountCodeQueueRepository(financialInstrumentProducer,
                TOPIC_NAME, KEY_NAME, TOPIC_NAME, KEY_NAME);
    }

    @Test
    public void test_add_to_queue_while_create() {

        InstrumentAccountCodeRequest request = new InstrumentAccountCodeRequest();

        request.setInstrumentAccountCodes(getInstrumentAccountCodes());
        request.setRequestInfo(new RequestInfo());
        request.getRequestInfo().setAction("create");

        instrumentAccountCodeQueueRepository.addToQue(request);

        final ArgumentCaptor<HashMap> argumentCaptor = ArgumentCaptor.forClass(HashMap.class);

        verify(financialInstrumentProducer).sendMessage(any(String.class), any(String.class), argumentCaptor.capture());

        final HashMap<String, Object> actualRequest = argumentCaptor.getValue();

        assertEquals(request, actualRequest.get("instrumentaccountcode_create"));

    }

    @Test
    public void test_add_to_queue_while_update() {

        InstrumentAccountCodeRequest request = new InstrumentAccountCodeRequest();

        request.setInstrumentAccountCodes(getInstrumentAccountCodes());
        request.setRequestInfo(new RequestInfo());
        request.getRequestInfo().setAction("update");

        instrumentAccountCodeQueueRepository.addToQue(request);

        final ArgumentCaptor<HashMap> argumentCaptor = ArgumentCaptor.forClass(HashMap.class);

        verify(financialInstrumentProducer).sendMessage(any(String.class), any(String.class), argumentCaptor.capture());

        final HashMap<String, Object> actualRequest = argumentCaptor.getValue();

        assertEquals(request, actualRequest.get("instrumentaccountcode_update"));

    }

    @Test
    public void test_add_to_search_queue() {

        InstrumentAccountCodeRequest request = new InstrumentAccountCodeRequest();

        request.setInstrumentAccountCodes(getInstrumentAccountCodes());

        instrumentAccountCodeQueueRepository.addToSearchQue(request);

        final ArgumentCaptor<HashMap> argumentCaptor = ArgumentCaptor.forClass(HashMap.class);

        verify(financialInstrumentProducer).sendMessage(any(String.class), any(String.class), argumentCaptor.capture());

        final HashMap<String, Object> actualRequest = argumentCaptor.getValue();

        assertEquals(request, actualRequest.get("instrumentaccountcode_persisted"));

    }

    private List<InstrumentAccountCodeContract> getInstrumentAccountCodes() {

        List<InstrumentAccountCodeContract> instrumentAccountCodes = new ArrayList<InstrumentAccountCodeContract>();
        InstrumentAccountCodeContract instrumentAccountCode = InstrumentAccountCodeContract.builder()
                .instrumentType(InstrumentTypeContract.builder().active(true).name("instrumenttype").build())
                .accountCode(ChartOfAccountContract.builder().glcode("glcode").build()).build();
        instrumentAccountCode.setTenantId("default");
        instrumentAccountCodes.add(instrumentAccountCode);

        return instrumentAccountCodes;
    }

}
