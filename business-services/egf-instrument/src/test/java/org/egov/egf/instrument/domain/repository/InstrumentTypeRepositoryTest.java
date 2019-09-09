package org.egov.egf.instrument.domain.repository;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.domain.model.InstrumentTypeSearch;
import org.egov.egf.instrument.persistence.entity.InstrumentTypeEntity;
import org.egov.egf.instrument.persistence.queue.repository.InstrumentTypeQueueRepository;
import org.egov.egf.instrument.persistence.repository.InstrumentTypeJdbcRepository;
import org.egov.egf.instrument.web.requests.InstrumentTypeRequest;
import org.egov.egf.master.web.repository.FinancialConfigurationContractRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class InstrumentTypeRepositoryTest {

    @Mock
    private InstrumentTypeJdbcRepository instrumentTypeJdbcRepository;

    private InstrumentTypeRepository instrumentTypeRepositoryWithKafka;

    private InstrumentTypeRepository instrumentTypeRepositoryWithOutKafka;

    @Mock
    private InstrumentTypeQueueRepository instrumentTypeQueueRepository;

    @Mock
    private FinancialConfigurationContractRepository financialConfigurationContractRepository;

    @Captor
    private ArgumentCaptor<InstrumentTypeRequest> captor;

    private RequestInfo requestInfo = new RequestInfo();

    @Mock
    private InstrumentTypeESRepository instrumentTypeESRepository;

    @Before
    public void setup() {
        instrumentTypeRepositoryWithKafka = new InstrumentTypeRepository(instrumentTypeJdbcRepository,
                instrumentTypeQueueRepository, "yes", financialConfigurationContractRepository, instrumentTypeESRepository);

        instrumentTypeRepositoryWithOutKafka = new InstrumentTypeRepository(instrumentTypeJdbcRepository,
                instrumentTypeQueueRepository, "no", financialConfigurationContractRepository, instrumentTypeESRepository);
    }

    @Test
    public void test_find_by_id() {
        InstrumentTypeEntity entity = getInstrumentTypeEntity();
        InstrumentType expectedResult = entity.toDomain();

        when(instrumentTypeJdbcRepository.findById(any(InstrumentTypeEntity.class))).thenReturn(entity);

        InstrumentType actualResult = instrumentTypeRepositoryWithKafka.findById(getInstrumentTypeDomin());

        assertEquals(expectedResult.getActive(), actualResult.getActive());
        assertEquals(expectedResult.getName(), actualResult.getName());
        assertEquals(expectedResult.getDescription(), actualResult.getDescription());
        assertEquals(expectedResult.getTenantId(), actualResult.getTenantId());
    }

    @Test
    public void test_find_by_id_return_null() {
        InstrumentTypeEntity entity = getInstrumentTypeEntity();

        when(instrumentTypeJdbcRepository.findById(null)).thenReturn(entity);

        InstrumentType actualResult = instrumentTypeRepositoryWithKafka.findById(getInstrumentTypeDomin());

        assertEquals(null, actualResult);
    }

    @Test
    public void test_save_with_kafka() {

        List<InstrumentType> expectedResult = getInstrumentTypes();

        instrumentTypeRepositoryWithKafka.save(expectedResult, requestInfo);

        verify(instrumentTypeQueueRepository).addToQue(captor.capture());

        final InstrumentTypeRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getActive(), actualRequest.getInstrumentTypes().get(0).getActive());
        assertEquals(expectedResult.get(0).getName(), actualRequest.getInstrumentTypes().get(0).getName());
        assertEquals(expectedResult.get(0).getDescription(),
                actualRequest.getInstrumentTypes().get(0).getDescription());
        assertEquals(expectedResult.get(0).getTenantId(), actualRequest.getInstrumentTypes().get(0).getTenantId());

    }

    @Test
    public void test_save_with_out_kafka() {

        List<InstrumentType> expectedResult = getInstrumentTypes();

        InstrumentTypeEntity entity = new InstrumentTypeEntity().toEntity(expectedResult.get(0));

        when(instrumentTypeJdbcRepository.create(any(InstrumentTypeEntity.class))).thenReturn(entity);

        instrumentTypeRepositoryWithOutKafka.save(expectedResult, requestInfo);

        verify(instrumentTypeQueueRepository).addToSearchQue(captor.capture());

        final InstrumentTypeRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getActive(), actualRequest.getInstrumentTypes().get(0).getActive());
        assertEquals(expectedResult.get(0).getName(), actualRequest.getInstrumentTypes().get(0).getName());
        assertEquals(expectedResult.get(0).getDescription(),
                actualRequest.getInstrumentTypes().get(0).getDescription());
        assertEquals(expectedResult.get(0).getTenantId(), actualRequest.getInstrumentTypes().get(0).getTenantId());
    }

    @Test
    public void test_update_with_kafka() {

        List<InstrumentType> expectedResult = getInstrumentTypes();

        instrumentTypeRepositoryWithKafka.update(expectedResult, requestInfo);

        verify(instrumentTypeQueueRepository).addToQue(captor.capture());

        final InstrumentTypeRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getActive(), actualRequest.getInstrumentTypes().get(0).getActive());
        assertEquals(expectedResult.get(0).getName(), actualRequest.getInstrumentTypes().get(0).getName());
        assertEquals(expectedResult.get(0).getDescription(),
                actualRequest.getInstrumentTypes().get(0).getDescription());
        assertEquals(expectedResult.get(0).getTenantId(), actualRequest.getInstrumentTypes().get(0).getTenantId());
    }

    @Test
    public void test_delete_with_kafka() {

        List<InstrumentType> expectedResult = getInstrumentTypes();

        instrumentTypeRepositoryWithKafka.delete(expectedResult, requestInfo);

        verify(instrumentTypeQueueRepository).addToQue(captor.capture());

        final InstrumentTypeRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getActive(), actualRequest.getInstrumentTypes().get(0).getActive());
        assertEquals(expectedResult.get(0).getName(), actualRequest.getInstrumentTypes().get(0).getName());
        assertEquals(expectedResult.get(0).getDescription(),
                actualRequest.getInstrumentTypes().get(0).getDescription());
        assertEquals(expectedResult.get(0).getTenantId(), actualRequest.getInstrumentTypes().get(0).getTenantId());
    }

    @Test
    public void test_update_with_out_kafka() {

        List<InstrumentType> expectedResult = getInstrumentTypes();

        InstrumentTypeEntity entity = new InstrumentTypeEntity().toEntity(expectedResult.get(0));

        when(instrumentTypeJdbcRepository.update(any(InstrumentTypeEntity.class))).thenReturn(entity);

        instrumentTypeRepositoryWithOutKafka.update(expectedResult, requestInfo);

        verify(instrumentTypeQueueRepository).addToSearchQue(captor.capture());

        final InstrumentTypeRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getActive(), actualRequest.getInstrumentTypes().get(0).getActive());
        assertEquals(expectedResult.get(0).getName(), actualRequest.getInstrumentTypes().get(0).getName());
        assertEquals(expectedResult.get(0).getDescription(),
                actualRequest.getInstrumentTypes().get(0).getDescription());
        assertEquals(expectedResult.get(0).getTenantId(), actualRequest.getInstrumentTypes().get(0).getTenantId());
    }

    @Test
    public void test_delete_with_out_kafka() {

        List<InstrumentType> expectedResult = getInstrumentTypes();

        InstrumentTypeEntity entity = new InstrumentTypeEntity().toEntity(expectedResult.get(0));

        when(instrumentTypeJdbcRepository.delete(any(InstrumentTypeEntity.class))).thenReturn(entity);

        instrumentTypeRepositoryWithOutKafka.delete(expectedResult, requestInfo);

        verify(instrumentTypeQueueRepository).addToSearchQue(captor.capture());

        final InstrumentTypeRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getActive(), actualRequest.getInstrumentTypes().get(0).getActive());
        assertEquals(expectedResult.get(0).getName(), actualRequest.getInstrumentTypes().get(0).getName());
        assertEquals(expectedResult.get(0).getDescription(),
                actualRequest.getInstrumentTypes().get(0).getDescription());
        assertEquals(expectedResult.get(0).getTenantId(), actualRequest.getInstrumentTypes().get(0).getTenantId());
    }

    @Test
    public void test_save() {

        InstrumentTypeEntity entity = getInstrumentTypeEntity();
        InstrumentType expectedResult = entity.toDomain();

        when(instrumentTypeJdbcRepository.create(any(InstrumentTypeEntity.class))).thenReturn(entity);

        InstrumentType actualResult = instrumentTypeRepositoryWithKafka.save(getInstrumentTypeDomin());

        assertEquals(expectedResult.getActive(), actualResult.getActive());
        assertEquals(expectedResult.getName(), actualResult.getName());
        assertEquals(expectedResult.getDescription(), actualResult.getDescription());
        assertEquals(expectedResult.getTenantId(), actualResult.getTenantId());

    }

    @Test
    public void test_update() {

        InstrumentTypeEntity entity = getInstrumentTypeEntity();
        InstrumentType expectedResult = entity.toDomain();

        when(instrumentTypeJdbcRepository.update(any(InstrumentTypeEntity.class))).thenReturn(entity);

        InstrumentType actualResult = instrumentTypeRepositoryWithKafka.update(getInstrumentTypeDomin());

        assertEquals(expectedResult.getActive(), actualResult.getActive());
        assertEquals(expectedResult.getName(), actualResult.getName());
        assertEquals(expectedResult.getDescription(), actualResult.getDescription());
        assertEquals(expectedResult.getTenantId(), actualResult.getTenantId());
    }

    @Test
    public void test_search() {

        Pagination<InstrumentType> expectedResult = new Pagination<>();
        expectedResult.setPageSize(500);
        expectedResult.setOffset(0);

        when(financialConfigurationContractRepository.fetchDataFrom()).thenReturn("db");
        when(instrumentTypeJdbcRepository.search(any(InstrumentTypeSearch.class))).thenReturn(expectedResult);

        Pagination<InstrumentType> actualResult = instrumentTypeRepositoryWithKafka.search(getInstrumentTypeSearch());

        assertEquals(expectedResult, actualResult);

    }

    private InstrumentType getInstrumentTypeDomin() {
        InstrumentType instrumentTypeDetail = new InstrumentType();
        instrumentTypeDetail.setActive(true);
        instrumentTypeDetail.setName("name");
        instrumentTypeDetail.setDescription("description");
        instrumentTypeDetail.setTenantId("default");
        return instrumentTypeDetail;
    }

    private InstrumentTypeEntity getInstrumentTypeEntity() {
        InstrumentTypeEntity entity = new InstrumentTypeEntity();
        entity.setActive(true);
        entity.setName("name");
        entity.setDescription("description");
        entity.setTenantId("default");
        return entity;
    }

    private InstrumentTypeSearch getInstrumentTypeSearch() {
        InstrumentTypeSearch instrumentTypeSearch = new InstrumentTypeSearch();
        instrumentTypeSearch.setPageSize(500);
        instrumentTypeSearch.setOffset(0);
        return instrumentTypeSearch;

    }

    private List<InstrumentType> getInstrumentTypes() {
        List<InstrumentType> instrumentTypes = new ArrayList<InstrumentType>();
        InstrumentType instrumentType = InstrumentType.builder().name("name").description("description").active(true)
                .build();
        instrumentType.setTenantId("default");
        instrumentTypes.add(instrumentType);
        return instrumentTypes;
    }
}
