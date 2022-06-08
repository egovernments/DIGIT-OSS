package org.egov.collection.repository;

import org.egov.collection.model.Instrument;
import org.egov.collection.web.contract.BankContract;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class InstrumentRepositoryTest {
    @MockBean
    private boolean aBoolean;

    @Autowired
    private InstrumentRepository instrumentRepository;

    @MockBean
    private RestTemplate restTemplate;


    @Test
    void testCreateInstrument5() {

        InstrumentRepository instrumentRepository = new InstrumentRepository();
        RequestInfo requestinfo = new RequestInfo();
        Instrument instrument = mock(Instrument.class);
        when(instrument.getTenantId()).thenThrow(new CustomException("Code", "An error occurred"));
        when(instrument.getBank()).thenReturn(new BankContract("42"));
        assertThrows(CustomException.class, () -> instrumentRepository.createInstrument(requestinfo, instrument));
        verify(instrument).getTenantId();
        verify(instrument, atLeast(1)).getBank();
    }

}

