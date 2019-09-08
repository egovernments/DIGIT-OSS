package org.egov.egf.instrument.persistence.queue;

import static org.mockito.Mockito.verify;

import java.util.HashMap;
import java.util.Map;

import org.egov.egf.instrument.web.requests.InstrumentRequest;
import org.egov.tracer.kafka.LogAwareKafkaTemplate;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class FinancialInstrumentProducerTest {

    private static final String TOPIC_NAME = "topic";

    private static final String KEY_NAME = "key";

    @Mock
    private LogAwareKafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private FinancialInstrumentProducer financialInstrumentProducer;

    @Before
    public void setup() {
        financialInstrumentProducer = new FinancialInstrumentProducer(kafkaTemplate);
    }

    @Test
    public void test_send_message() {

        InstrumentRequest request = new InstrumentRequest();

        Map<String, Object> message = new HashMap<>();
        message.put("instrument_create", request);

        financialInstrumentProducer.sendMessage(TOPIC_NAME, KEY_NAME, message);

        verify(kafkaTemplate).send(TOPIC_NAME, KEY_NAME, message);

    }

}
