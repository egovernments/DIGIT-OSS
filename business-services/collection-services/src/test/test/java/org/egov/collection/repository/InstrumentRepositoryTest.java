package org.egov.collection.repository;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.node.MissingNode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashSet;

import org.egov.collection.config.ApplicationProperties;

import org.egov.collection.model.Instrument;
import org.egov.collection.model.InstrumentType;
import org.egov.collection.model.InstrumentVoucher;
import org.egov.collection.model.SurrenderReason;
import org.egov.collection.model.TransactionType;
import org.egov.collection.model.enums.InstrumentStatusEnum;
import org.egov.collection.model.v1.AuditDetails_v1;
import org.egov.collection.web.contract.BankAccountContract;
import org.egov.collection.web.contract.BankContract;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.client.RestTemplate;

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

