package org.egov.egf.instrument.domain.repository;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.instrument.domain.model.InstrumentAccountCode;
import org.egov.egf.instrument.domain.model.InstrumentAccountCodeSearch;
import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.persistence.entity.InstrumentAccountCodeEntity;
import org.egov.egf.instrument.persistence.queue.repository.InstrumentAccountCodeQueueRepository;
import org.egov.egf.instrument.persistence.repository.InstrumentAccountCodeJdbcRepository;
import org.egov.egf.instrument.web.requests.InstrumentAccountCodeRequest;
import org.egov.egf.master.web.contract.ChartOfAccountContract;
import org.egov.egf.master.web.repository.FinancialConfigurationContractRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class InstrumentAccountCodeRepositoryTest {

    private InstrumentAccountCodeRepository instrumentAccountCodeRepositoryWithKafka;

    private InstrumentAccountCodeRepository instrumentAccountCodeRepositoryWithOutKafka;

    @Mock
    private InstrumentAccountCodeJdbcRepository instrumentAccountCodeJdbcRepository;

    @Mock
    private InstrumentAccountCodeQueueRepository instrumentAccountCodeQueueRepository;

    @Mock
    private FinancialConfigurationContractRepository financialConfigurationContractRepository;

    @Mock
    private InstrumentAccountCodeESRepository instrumentAccountCodeESRepository;

    @Captor
    private ArgumentCaptor<InstrumentAccountCodeRequest> captor;

    private RequestInfo requestInfo = new RequestInfo();

    @Before
    public void setup() {
        instrumentAccountCodeRepositoryWithKafka = new InstrumentAccountCodeRepository(
                instrumentAccountCodeJdbcRepository, instrumentAccountCodeQueueRepository, "yes",
                instrumentAccountCodeESRepository, financialConfigurationContractRepository);

        instrumentAccountCodeRepositoryWithOutKafka = new InstrumentAccountCodeRepository(
                instrumentAccountCodeJdbcRepository, instrumentAccountCodeQueueRepository, "no",
                instrumentAccountCodeESRepository, financialConfigurationContractRepository);
    }

    @Test
    public void test_find_by_id() {
        InstrumentAccountCodeEntity entity = getInstrumentAccountCodeEntity();
        InstrumentAccountCode expectedResult = entity.toDomain();

        when(instrumentAccountCodeJdbcRepository.findById(any(InstrumentAccountCodeEntity.class))).thenReturn(entity);

        InstrumentAccountCode actualResult = instrumentAccountCodeRepositoryWithKafka
                .findById(getInstrumentAccountCodeDomin());

        assertEquals(expectedResult.getAccountCode().getId(), actualResult.getAccountCode().getId());
        assertEquals(expectedResult.getInstrumentType().getId(), actualResult.getInstrumentType().getId());
    }

    @Test
    public void test_find_by_id_return_null() {
        InstrumentAccountCodeEntity entity = getInstrumentAccountCodeEntity();

        when(instrumentAccountCodeJdbcRepository.findById(null)).thenReturn(entity);

        InstrumentAccountCode actualResult = instrumentAccountCodeRepositoryWithKafka
                .findById(getInstrumentAccountCodeDomin());

        assertEquals(null, actualResult);
    }

    @Test
    public void test_save_with_kafka() {

        List<InstrumentAccountCode> expectedResult = getInstrumentAccountCodes();

        instrumentAccountCodeRepositoryWithKafka.save(expectedResult, requestInfo);

        verify(instrumentAccountCodeQueueRepository).addToQue(captor.capture());

        final InstrumentAccountCodeRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getInstrumentType().getName(),
                actualRequest.getInstrumentAccountCodes().get(0).getInstrumentType().getName());
        assertEquals(expectedResult.get(0).getAccountCode().getGlcode(),
                actualRequest.getInstrumentAccountCodes().get(0).getAccountCode().getGlcode());
        assertEquals(expectedResult.get(0).getTenantId(),
                actualRequest.getInstrumentAccountCodes().get(0).getTenantId());
    }

    @Test
    public void test_save_with_out_kafka() {

        List<InstrumentAccountCode> expectedResult = getInstrumentAccountCodes();

        InstrumentAccountCodeEntity entity = new InstrumentAccountCodeEntity().toEntity(expectedResult.get(0));

        when(instrumentAccountCodeJdbcRepository.create(any(InstrumentAccountCodeEntity.class))).thenReturn(entity);

        instrumentAccountCodeRepositoryWithOutKafka.save(expectedResult, requestInfo);

        verify(instrumentAccountCodeQueueRepository).addToSearchQue(captor.capture());

        final InstrumentAccountCodeRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getInstrumentType().getName(),
                actualRequest.getInstrumentAccountCodes().get(0).getInstrumentType().getName());
        assertEquals(expectedResult.get(0).getAccountCode().getGlcode(),
                actualRequest.getInstrumentAccountCodes().get(0).getAccountCode().getGlcode());
        assertEquals(expectedResult.get(0).getTenantId(),
                actualRequest.getInstrumentAccountCodes().get(0).getTenantId());
    }

    @Test
    public void test_update_with_kafka() {

        List<InstrumentAccountCode> expectedResult = getInstrumentAccountCodes();

        instrumentAccountCodeRepositoryWithKafka.update(expectedResult, requestInfo);

        verify(instrumentAccountCodeQueueRepository).addToQue(captor.capture());

        final InstrumentAccountCodeRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getInstrumentType().getName(),
                actualRequest.getInstrumentAccountCodes().get(0).getInstrumentType().getName());
        assertEquals(expectedResult.get(0).getAccountCode().getGlcode(),
                actualRequest.getInstrumentAccountCodes().get(0).getAccountCode().getGlcode());
        assertEquals(expectedResult.get(0).getTenantId(),
                actualRequest.getInstrumentAccountCodes().get(0).getTenantId());
    }

    @Test
    public void test_delete_with_kafka() {

        List<InstrumentAccountCode> expectedResult = getInstrumentAccountCodes();

        instrumentAccountCodeRepositoryWithKafka.delete(expectedResult, requestInfo);

        verify(instrumentAccountCodeQueueRepository).addToQue(captor.capture());

        final InstrumentAccountCodeRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getInstrumentType().getName(),
                actualRequest.getInstrumentAccountCodes().get(0).getInstrumentType().getName());
        assertEquals(expectedResult.get(0).getAccountCode().getGlcode(),
                actualRequest.getInstrumentAccountCodes().get(0).getAccountCode().getGlcode());
        assertEquals(expectedResult.get(0).getTenantId(),
                actualRequest.getInstrumentAccountCodes().get(0).getTenantId());
    }

    @Test
    public void test_update_with_out_kafka() {

        List<InstrumentAccountCode> expectedResult = getInstrumentAccountCodes();

        InstrumentAccountCodeEntity entity = new InstrumentAccountCodeEntity().toEntity(expectedResult.get(0));

        when(instrumentAccountCodeJdbcRepository.update(any(InstrumentAccountCodeEntity.class))).thenReturn(entity);

        instrumentAccountCodeRepositoryWithOutKafka.update(expectedResult, requestInfo);

        verify(instrumentAccountCodeQueueRepository).addToSearchQue(captor.capture());

        final InstrumentAccountCodeRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getInstrumentType().getName(),
                actualRequest.getInstrumentAccountCodes().get(0).getInstrumentType().getName());
        assertEquals(expectedResult.get(0).getAccountCode().getGlcode(),
                actualRequest.getInstrumentAccountCodes().get(0).getAccountCode().getGlcode());
        assertEquals(expectedResult.get(0).getTenantId(),
                actualRequest.getInstrumentAccountCodes().get(0).getTenantId());
    }

    @Test
    public void test_delete_with_out_kafka() {

        List<InstrumentAccountCode> expectedResult = getInstrumentAccountCodes();

        InstrumentAccountCodeEntity entity = new InstrumentAccountCodeEntity().toEntity(expectedResult.get(0));

        when(instrumentAccountCodeJdbcRepository.delete(any(InstrumentAccountCodeEntity.class))).thenReturn(entity);

        instrumentAccountCodeRepositoryWithOutKafka.delete(expectedResult, requestInfo);

        verify(instrumentAccountCodeQueueRepository).addToSearchQue(captor.capture());

        final InstrumentAccountCodeRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getInstrumentType().getName(),
                actualRequest.getInstrumentAccountCodes().get(0).getInstrumentType().getName());
        assertEquals(expectedResult.get(0).getAccountCode().getGlcode(),
                actualRequest.getInstrumentAccountCodes().get(0).getAccountCode().getGlcode());
        assertEquals(expectedResult.get(0).getTenantId(),
                actualRequest.getInstrumentAccountCodes().get(0).getTenantId());
    }

    @Test
    public void test_save() {

        InstrumentAccountCodeEntity entity = getInstrumentAccountCodeEntity();
        InstrumentAccountCode expectedResult = entity.toDomain();

        when(instrumentAccountCodeJdbcRepository.create(any(InstrumentAccountCodeEntity.class))).thenReturn(entity);

        InstrumentAccountCode actualResult = instrumentAccountCodeRepositoryWithKafka
                .save(getInstrumentAccountCodeDomin());

        assertEquals(expectedResult.getAccountCode().getId(), actualResult.getAccountCode().getId());
        assertEquals(expectedResult.getInstrumentType().getId(), actualResult.getInstrumentType().getId());

    }

    @Test
    public void test_update() {

        InstrumentAccountCodeEntity entity = getInstrumentAccountCodeEntity();
        InstrumentAccountCode expectedResult = entity.toDomain();

        when(instrumentAccountCodeJdbcRepository.update(any(InstrumentAccountCodeEntity.class))).thenReturn(entity);

        InstrumentAccountCode actualResult = instrumentAccountCodeRepositoryWithKafka
                .update(getInstrumentAccountCodeDomin());

        assertEquals(expectedResult.getAccountCode().getId(), actualResult.getAccountCode().getId());
        assertEquals(expectedResult.getInstrumentType().getId(), actualResult.getInstrumentType().getId());
    }

    @Test
    public void test_search() {

        Pagination<InstrumentAccountCode> expectedResult = new Pagination<>();
        expectedResult.setPageSize(500);
        expectedResult.setOffset(0);

        when(financialConfigurationContractRepository.fetchDataFrom()).thenReturn("db");
        when(instrumentAccountCodeJdbcRepository.search(any(InstrumentAccountCodeSearch.class)))
                .thenReturn(expectedResult);

        Pagination<InstrumentAccountCode> actualResult = instrumentAccountCodeRepositoryWithKafka
                .search(getInstrumentAccountCodeSearch());

        assertEquals(expectedResult, actualResult);

    }

    private InstrumentAccountCode getInstrumentAccountCodeDomin() {
        InstrumentAccountCode instrumentAccountCodeDetail = new InstrumentAccountCode();
        instrumentAccountCodeDetail.setAccountCode(ChartOfAccountContract.builder().id("accountCodeId").build());
        instrumentAccountCodeDetail.setInstrumentType(InstrumentType.builder().id("instrumentTypeId").build());
        instrumentAccountCodeDetail.setTenantId("default");
        return instrumentAccountCodeDetail;
    }

    private InstrumentAccountCodeEntity getInstrumentAccountCodeEntity() {
        InstrumentAccountCodeEntity entity = new InstrumentAccountCodeEntity();
        entity.setAccountCodeId("accountCodeId");
        entity.setInstrumentTypeId("instrumentTypeId");
        entity.setTenantId("default");
        return entity;
    }

    private InstrumentAccountCodeSearch getInstrumentAccountCodeSearch() {
        InstrumentAccountCodeSearch instrumentAccountCodeSearch = new InstrumentAccountCodeSearch();
        instrumentAccountCodeSearch.setPageSize(500);
        instrumentAccountCodeSearch.setOffset(0);
        return instrumentAccountCodeSearch;

    }

    private List<InstrumentAccountCode> getInstrumentAccountCodes() {
        List<InstrumentAccountCode> instrumentAccountCodes = new ArrayList<InstrumentAccountCode>();
        InstrumentAccountCode instrumentAccountCode = InstrumentAccountCode.builder()
                .instrumentType(InstrumentType.builder().active(true).id("instrumenttypeid").build())
                .accountCode(ChartOfAccountContract.builder().id("accountcodeid").build()).build();
        instrumentAccountCode.setTenantId("default");
        instrumentAccountCodes.add(instrumentAccountCode);
        return instrumentAccountCodes;
    }

}
