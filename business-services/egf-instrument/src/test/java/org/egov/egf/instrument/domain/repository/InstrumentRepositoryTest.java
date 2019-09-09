package org.egov.egf.instrument.domain.repository;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.instrument.domain.model.Instrument;
import org.egov.egf.instrument.domain.model.InstrumentSearch;
import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.domain.model.TransactionType;
import org.egov.egf.instrument.persistence.entity.InstrumentEntity;
import org.egov.egf.instrument.persistence.queue.repository.InstrumentQueueRepository;
import org.egov.egf.instrument.persistence.repository.InstrumentJdbcRepository;
import org.egov.egf.instrument.persistence.repository.InstrumentVoucherJdbcRepository;
import org.egov.egf.instrument.web.requests.InstrumentRequest;
import org.egov.egf.master.web.repository.FinancialConfigurationContractRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class InstrumentRepositoryTest {

    private InstrumentRepository instrumentRepositoryWithKafka;

    private InstrumentRepository instrumentRepositoryWithOutKafka;

    @Mock
    private InstrumentQueueRepository instrumentQueueRepository;

    @Mock
    private InstrumentJdbcRepository instrumentJdbcRepository;

    @Mock
    private InstrumentVoucherJdbcRepository instrumentVoucherJdbcRepository;

    @Mock
    private InstrumentESRepository instrumentESRepository;

    @Mock
    private FinancialConfigurationContractRepository financialConfigurationContractRepository;

    @Captor
    private ArgumentCaptor<InstrumentRequest> captor;

    private RequestInfo requestInfo = new RequestInfo();

    @Before
    public void setup() {
        instrumentRepositoryWithKafka = new InstrumentRepository(instrumentJdbcRepository, instrumentQueueRepository,
                "yes", instrumentESRepository, financialConfigurationContractRepository, instrumentVoucherJdbcRepository);

        instrumentRepositoryWithOutKafka = new InstrumentRepository(instrumentJdbcRepository, instrumentQueueRepository,
                "no", instrumentESRepository, financialConfigurationContractRepository, instrumentVoucherJdbcRepository);
    }

    @Test
    public void test_find_by_id() {
        InstrumentEntity entity = getInstrumentEntity();
        Instrument expectedResult = entity.toDomain();

        when(instrumentJdbcRepository.findById(any(InstrumentEntity.class))).thenReturn(entity);

        Instrument actualResult = instrumentRepositoryWithKafka.findById(getInstrumentDomin());

        assertEquals(expectedResult.getAmount(), actualResult.getAmount());
        assertEquals(expectedResult.getTransactionNumber(), actualResult.getTransactionNumber());
        assertEquals(expectedResult.getSerialNo(), actualResult.getSerialNo());
        assertEquals(expectedResult.getTransactionType(), actualResult.getTransactionType());
        assertEquals(expectedResult.getInstrumentType().getId(), actualResult.getInstrumentType().getId());
    }

    @Test
    public void test_find_by_id_return_null() {
        InstrumentEntity entity = getInstrumentEntity();

        when(instrumentJdbcRepository.findById(null)).thenReturn(entity);

        Instrument actualResult = instrumentRepositoryWithKafka.findById(getInstrumentDomin());

        assertEquals(null, actualResult);
    }

    @Test
    public void test_save_with_kafka() {

        List<Instrument> expectedResult = getInstruments();

        instrumentRepositoryWithKafka.save(expectedResult, requestInfo);

        verify(instrumentQueueRepository).addToQue(captor.capture());

        final InstrumentRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getAmount(), actualRequest.getInstruments().get(0).getAmount());
        assertEquals(expectedResult.get(0).getTransactionNumber(),
                actualRequest.getInstruments().get(0).getTransactionNumber());
        assertEquals(expectedResult.get(0).getSerialNo(), actualRequest.getInstruments().get(0).getSerialNo());
        assertEquals(expectedResult.get(0).getTransactionType().name(),
                actualRequest.getInstruments().get(0).getTransactionType().name());
        assertEquals(expectedResult.get(0).getInstrumentType().getId(),
                actualRequest.getInstruments().get(0).getInstrumentType().getId());

    }

    @Test
    public void test_save_with_out_kafka() {

        List<Instrument> expectedResult = getInstruments();

        InstrumentEntity entity = new InstrumentEntity().toEntity(expectedResult.get(0));

        when(instrumentJdbcRepository.create(any(InstrumentEntity.class))).thenReturn(entity);

        instrumentRepositoryWithOutKafka.save(expectedResult, requestInfo);

        verify(instrumentQueueRepository).addToSearchQue(captor.capture());

        final InstrumentRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getAmount(), actualRequest.getInstruments().get(0).getAmount());
        assertEquals(expectedResult.get(0).getTransactionNumber(),
                actualRequest.getInstruments().get(0).getTransactionNumber());
        assertEquals(expectedResult.get(0).getSerialNo(), actualRequest.getInstruments().get(0).getSerialNo());
        assertEquals(expectedResult.get(0).getTransactionType().name(),
                actualRequest.getInstruments().get(0).getTransactionType().name());
        assertEquals(expectedResult.get(0).getInstrumentType().getId(),
                actualRequest.getInstruments().get(0).getInstrumentType().getId());
    }

    @Test
    public void test_update_with_kafka() {

        List<Instrument> expectedResult = getInstruments();

        instrumentRepositoryWithKafka.update(expectedResult, requestInfo);

        verify(instrumentQueueRepository).addToQue(captor.capture());

        final InstrumentRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getAmount(), actualRequest.getInstruments().get(0).getAmount());
        assertEquals(expectedResult.get(0).getTransactionNumber(),
                actualRequest.getInstruments().get(0).getTransactionNumber());
        assertEquals(expectedResult.get(0).getSerialNo(), actualRequest.getInstruments().get(0).getSerialNo());
        assertEquals(expectedResult.get(0).getTransactionType().name(),
                actualRequest.getInstruments().get(0).getTransactionType().name());
        assertEquals(expectedResult.get(0).getInstrumentType().getId(),
                actualRequest.getInstruments().get(0).getInstrumentType().getId());
    }

    @Test
    public void test_delete_with_kafka() {

        List<Instrument> expectedResult = getInstruments();

        instrumentRepositoryWithKafka.delete(expectedResult, requestInfo);

        verify(instrumentQueueRepository).addToQue(captor.capture());

        final InstrumentRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getAmount(), actualRequest.getInstruments().get(0).getAmount());
        assertEquals(expectedResult.get(0).getTransactionNumber(),
                actualRequest.getInstruments().get(0).getTransactionNumber());
        assertEquals(expectedResult.get(0).getSerialNo(), actualRequest.getInstruments().get(0).getSerialNo());
        assertEquals(expectedResult.get(0).getTransactionType().name(),
                actualRequest.getInstruments().get(0).getTransactionType().name());
        assertEquals(expectedResult.get(0).getInstrumentType().getId(),
                actualRequest.getInstruments().get(0).getInstrumentType().getId());
    }

    @Test
    public void test_update_with_out_kafka() {

        List<Instrument> expectedResult = getInstruments();

        InstrumentEntity entity = new InstrumentEntity().toEntity(expectedResult.get(0));

        when(instrumentJdbcRepository.update(any(InstrumentEntity.class))).thenReturn(entity);

        instrumentRepositoryWithOutKafka.update(expectedResult, requestInfo);

        verify(instrumentQueueRepository).addToSearchQue(captor.capture());

        final InstrumentRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getAmount(), actualRequest.getInstruments().get(0).getAmount());
        assertEquals(expectedResult.get(0).getTransactionNumber(),
                actualRequest.getInstruments().get(0).getTransactionNumber());
        assertEquals(expectedResult.get(0).getSerialNo(), actualRequest.getInstruments().get(0).getSerialNo());
        assertEquals(expectedResult.get(0).getTransactionType().name(),
                actualRequest.getInstruments().get(0).getTransactionType().name());
        assertEquals(expectedResult.get(0).getInstrumentType().getId(),
                actualRequest.getInstruments().get(0).getInstrumentType().getId());
    }

    @Test
    public void test_delete_with_out_kafka() {

        List<Instrument> expectedResult = getInstruments();

        InstrumentEntity entity = new InstrumentEntity().toEntity(expectedResult.get(0));

        when(instrumentJdbcRepository.delete(any(InstrumentEntity.class))).thenReturn(entity);

        instrumentRepositoryWithOutKafka.delete(expectedResult, requestInfo);

        verify(instrumentQueueRepository).addToSearchQue(captor.capture());

        final InstrumentRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getAmount(), actualRequest.getInstruments().get(0).getAmount());
        assertEquals(expectedResult.get(0).getTransactionNumber(),
                actualRequest.getInstruments().get(0).getTransactionNumber());
        assertEquals(expectedResult.get(0).getSerialNo(), actualRequest.getInstruments().get(0).getSerialNo());
        assertEquals(expectedResult.get(0).getTransactionType().name(),
                actualRequest.getInstruments().get(0).getTransactionType().name());
        assertEquals(expectedResult.get(0).getInstrumentType().getId(),
                actualRequest.getInstruments().get(0).getInstrumentType().getId());
    }

    @Test
    public void test_save() {

        InstrumentEntity entity = getInstrumentEntity();
        Instrument expectedResult = entity.toDomain();

        when(instrumentJdbcRepository.create(any(InstrumentEntity.class))).thenReturn(entity);

        Instrument actualResult = instrumentRepositoryWithKafka.save(getInstrumentDomin());

        assertEquals(expectedResult.getAmount(), actualResult.getAmount());
        assertEquals(expectedResult.getTransactionNumber(), actualResult.getTransactionNumber());
        assertEquals(expectedResult.getSerialNo(), actualResult.getSerialNo());
        assertEquals(expectedResult.getTransactionType(), actualResult.getTransactionType());
        assertEquals(expectedResult.getInstrumentType().getId(), actualResult.getInstrumentType().getId());

    }

    @Test
    public void test_update() {

        InstrumentEntity entity = getInstrumentEntity();
        Instrument expectedResult = entity.toDomain();

        when(instrumentJdbcRepository.update(any(InstrumentEntity.class))).thenReturn(entity);

        Instrument actualResult = instrumentRepositoryWithKafka.update(getInstrumentDomin());

        assertEquals(expectedResult.getAmount(), actualResult.getAmount());
        assertEquals(expectedResult.getTransactionNumber(), actualResult.getTransactionNumber());
        assertEquals(expectedResult.getSerialNo(), actualResult.getSerialNo());
        assertEquals(expectedResult.getTransactionType(), actualResult.getTransactionType());
        assertEquals(expectedResult.getInstrumentType().getId(), actualResult.getInstrumentType().getId());
    }

    @Test
    public void test_search() {

        Pagination<Instrument> expectedResult = new Pagination<>();
        expectedResult.setPageSize(500);
        expectedResult.setOffset(0);

        when(financialConfigurationContractRepository.fetchDataFrom()).thenReturn("db");
        when(instrumentJdbcRepository.search(any(InstrumentSearch.class))).thenReturn(expectedResult);

        Pagination<Instrument> actualResult = instrumentRepositoryWithKafka.search(getInstrumentSearch());

        assertEquals(expectedResult, actualResult);

    }

    private Instrument getInstrumentDomin() {
        Instrument instrumentDetail = new Instrument();
        instrumentDetail.setAmount(BigDecimal.ONE);
        instrumentDetail.setTransactionNumber("transactionNumber");
        instrumentDetail.setSerialNo("serialNo");
        instrumentDetail.setTransactionType(TransactionType.Credit);
        instrumentDetail.setInstrumentType(InstrumentType.builder().id("instrumentTypeId").build());
        instrumentDetail.setTenantId("default");
        return instrumentDetail;
    }

    private InstrumentEntity getInstrumentEntity() {
        InstrumentEntity entity = new InstrumentEntity();
        entity.setAmount(BigDecimal.ONE);
        entity.setTransactionNumber("transactionNumber");
        entity.setSerialNo("serialNo");
        entity.setTransactionType(TransactionType.Credit.name());
        entity.setInstrumentTypeId("instrumentTypeId");
        entity.setTenantId("default");
        return entity;
    }

    private InstrumentSearch getInstrumentSearch() {
        InstrumentSearch instrumentSearch = new InstrumentSearch();
        instrumentSearch.setPageSize(500);
        instrumentSearch.setOffset(0);
        return instrumentSearch;

    }

    private List<Instrument> getInstruments() {
        List<Instrument> instruments = new ArrayList<Instrument>();
        Instrument instrument = Instrument.builder().transactionNumber("transactionNumber").amount(BigDecimal.ONE)
                .transactionType(TransactionType.Credit).serialNo("serialNo")
                .instrumentType(InstrumentType.builder().active(true).name("instrumenttype").build()).build();
        instrument.setTenantId("default");
        instruments.add(instrument);
        return instruments;
    }

}
