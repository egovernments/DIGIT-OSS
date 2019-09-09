package org.egov.egf.instrument.domain.repository;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.instrument.domain.model.SurrenderReason;
import org.egov.egf.instrument.domain.model.SurrenderReasonSearch;
import org.egov.egf.instrument.persistence.entity.SurrenderReasonEntity;
import org.egov.egf.instrument.persistence.queue.repository.SurrenderReasonQueueRepository;
import org.egov.egf.instrument.persistence.repository.SurrenderReasonJdbcRepository;
import org.egov.egf.instrument.web.requests.SurrenderReasonRequest;
import org.egov.egf.master.web.repository.FinancialConfigurationContractRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class SurrenderReasonRepositoryTest {

    @Mock
    private SurrenderReasonJdbcRepository surrenderReasonJdbcRepository;

    private SurrenderReasonRepository surrenderReasonRepositoryWithKafka;

    private SurrenderReasonRepository surrenderReasonRepositoryWithOutKafka;

    @Mock
    private SurrenderReasonQueueRepository surrenderReasonQueueRepository;

    @Captor
    private ArgumentCaptor<SurrenderReasonRequest> captor;

    private RequestInfo requestInfo = new RequestInfo();

    @Mock
    private FinancialConfigurationContractRepository financialConfigurationContractRepository;

    @Mock
    private SurrenderReasonESRepository surrenderReasonESRepository;

    @Before
    public void setup() {
        surrenderReasonRepositoryWithKafka = new SurrenderReasonRepository(surrenderReasonJdbcRepository,
                surrenderReasonQueueRepository, "yes", financialConfigurationContractRepository, surrenderReasonESRepository);

        surrenderReasonRepositoryWithOutKafka = new SurrenderReasonRepository(surrenderReasonJdbcRepository,
                surrenderReasonQueueRepository, "no", financialConfigurationContractRepository, surrenderReasonESRepository);
    }

    @Test
    public void test_find_by_id() {
        SurrenderReasonEntity entity = getSurrenderReasonEntity();
        SurrenderReason expectedResult = entity.toDomain();

        when(surrenderReasonJdbcRepository.findById(any(SurrenderReasonEntity.class))).thenReturn(entity);

        SurrenderReason actualResult = surrenderReasonRepositoryWithKafka.findById(getSurrenderReasonDomin());

        assertEquals(expectedResult.getName(), actualResult.getName());
        assertEquals(expectedResult.getDescription(), actualResult.getDescription());
        assertEquals(expectedResult.getTenantId(), actualResult.getTenantId());
    }

    @Test
    public void test_find_by_id_return_null() {
        SurrenderReasonEntity entity = getSurrenderReasonEntity();

        when(surrenderReasonJdbcRepository.findById(null)).thenReturn(entity);

        SurrenderReason actualResult = surrenderReasonRepositoryWithKafka.findById(getSurrenderReasonDomin());

        assertEquals(null, actualResult);
    }

    @Test
    public void test_save_with_kafka() {

        List<SurrenderReason> expectedResult = getSurrenderReasons();

        surrenderReasonRepositoryWithKafka.save(expectedResult, requestInfo);

        verify(surrenderReasonQueueRepository).addToQue(captor.capture());

        final SurrenderReasonRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getName(), actualRequest.getSurrenderReasons().get(0).getName());
        assertEquals(expectedResult.get(0).getDescription(),
                actualRequest.getSurrenderReasons().get(0).getDescription());
        assertEquals(expectedResult.get(0).getTenantId(), actualRequest.getSurrenderReasons().get(0).getTenantId());

    }

    @Test
    public void test_save_with_out_kafka() {

        List<SurrenderReason> expectedResult = getSurrenderReasons();

        SurrenderReasonEntity entity = new SurrenderReasonEntity().toEntity(expectedResult.get(0));

        when(surrenderReasonJdbcRepository.create(any(SurrenderReasonEntity.class))).thenReturn(entity);

        surrenderReasonRepositoryWithOutKafka.save(expectedResult, requestInfo);

        verify(surrenderReasonQueueRepository).addToSearchQue(captor.capture());

        final SurrenderReasonRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getName(), actualRequest.getSurrenderReasons().get(0).getName());
        assertEquals(expectedResult.get(0).getDescription(),
                actualRequest.getSurrenderReasons().get(0).getDescription());
        assertEquals(expectedResult.get(0).getTenantId(), actualRequest.getSurrenderReasons().get(0).getTenantId());
    }

    @Test
    public void test_update_with_kafka() {

        List<SurrenderReason> expectedResult = getSurrenderReasons();

        surrenderReasonRepositoryWithKafka.update(expectedResult, requestInfo);

        verify(surrenderReasonQueueRepository).addToQue(captor.capture());

        final SurrenderReasonRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getName(), actualRequest.getSurrenderReasons().get(0).getName());
        assertEquals(expectedResult.get(0).getDescription(),
                actualRequest.getSurrenderReasons().get(0).getDescription());
        assertEquals(expectedResult.get(0).getTenantId(), actualRequest.getSurrenderReasons().get(0).getTenantId());
    }

    @Test
    public void test_delete_with_kafka() {

        List<SurrenderReason> expectedResult = getSurrenderReasons();

        surrenderReasonRepositoryWithKafka.delete(expectedResult, requestInfo);

        verify(surrenderReasonQueueRepository).addToQue(captor.capture());

        final SurrenderReasonRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getName(), actualRequest.getSurrenderReasons().get(0).getName());
        assertEquals(expectedResult.get(0).getDescription(),
                actualRequest.getSurrenderReasons().get(0).getDescription());
        assertEquals(expectedResult.get(0).getTenantId(), actualRequest.getSurrenderReasons().get(0).getTenantId());
    }

    @Test
    public void test_update_with_out_kafka() {

        List<SurrenderReason> expectedResult = getSurrenderReasons();

        SurrenderReasonEntity entity = new SurrenderReasonEntity().toEntity(expectedResult.get(0));

        when(surrenderReasonJdbcRepository.update(any(SurrenderReasonEntity.class))).thenReturn(entity);

        surrenderReasonRepositoryWithOutKafka.update(expectedResult, requestInfo);

        verify(surrenderReasonQueueRepository).addToSearchQue(captor.capture());

        final SurrenderReasonRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getName(), actualRequest.getSurrenderReasons().get(0).getName());
        assertEquals(expectedResult.get(0).getDescription(),
                actualRequest.getSurrenderReasons().get(0).getDescription());
        assertEquals(expectedResult.get(0).getTenantId(), actualRequest.getSurrenderReasons().get(0).getTenantId());
    }

    @Test
    public void test_delete_with_out_kafka() {

        List<SurrenderReason> expectedResult = getSurrenderReasons();

        SurrenderReasonEntity entity = new SurrenderReasonEntity().toEntity(expectedResult.get(0));

        when(surrenderReasonJdbcRepository.delete(any(SurrenderReasonEntity.class))).thenReturn(entity);

        surrenderReasonRepositoryWithOutKafka.delete(expectedResult, requestInfo);

        verify(surrenderReasonQueueRepository).addToSearchQue(captor.capture());

        final SurrenderReasonRequest actualRequest = captor.getValue();

        assertEquals(expectedResult.get(0).getName(), actualRequest.getSurrenderReasons().get(0).getName());
        assertEquals(expectedResult.get(0).getDescription(),
                actualRequest.getSurrenderReasons().get(0).getDescription());
        assertEquals(expectedResult.get(0).getTenantId(), actualRequest.getSurrenderReasons().get(0).getTenantId());
    }

    @Test
    public void test_save() {

        SurrenderReasonEntity entity = getSurrenderReasonEntity();
        SurrenderReason expectedResult = entity.toDomain();

        when(surrenderReasonJdbcRepository.create(any(SurrenderReasonEntity.class))).thenReturn(entity);

        SurrenderReason actualResult = surrenderReasonRepositoryWithKafka.save(getSurrenderReasonDomin());

        assertEquals(expectedResult.getName(), actualResult.getName());
        assertEquals(expectedResult.getDescription(), actualResult.getDescription());
        assertEquals(expectedResult.getTenantId(), actualResult.getTenantId());

    }

    @Test
    public void test_update() {

        SurrenderReasonEntity entity = getSurrenderReasonEntity();
        SurrenderReason expectedResult = entity.toDomain();

        when(surrenderReasonJdbcRepository.update(any(SurrenderReasonEntity.class))).thenReturn(entity);

        SurrenderReason actualResult = surrenderReasonRepositoryWithKafka.update(getSurrenderReasonDomin());

        assertEquals(expectedResult.getName(), actualResult.getName());
        assertEquals(expectedResult.getDescription(), actualResult.getDescription());
        assertEquals(expectedResult.getTenantId(), actualResult.getTenantId());
    }

    @Test
    public void test_search() {

        Pagination<SurrenderReason> expectedResult = new Pagination<>();
        expectedResult.setPageSize(500);
        expectedResult.setOffset(0);

        when(financialConfigurationContractRepository.fetchDataFrom()).thenReturn("db");
        when(surrenderReasonJdbcRepository.search(any(SurrenderReasonSearch.class))).thenReturn(expectedResult);

        Pagination<SurrenderReason> actualResult = surrenderReasonRepositoryWithKafka
                .search(getSurrenderReasonSearch());

        assertEquals(expectedResult, actualResult);

    }

    private SurrenderReason getSurrenderReasonDomin() {
        SurrenderReason surrenderReasonDetail = new SurrenderReason();
        surrenderReasonDetail.setName("name");
        surrenderReasonDetail.setDescription("description");
        surrenderReasonDetail.setTenantId("default");
        return surrenderReasonDetail;
    }

    private SurrenderReasonEntity getSurrenderReasonEntity() {
        SurrenderReasonEntity entity = new SurrenderReasonEntity();
        entity.setName("name");
        entity.setDescription("description");
        entity.setTenantId("default");
        return entity;
    }

    private SurrenderReasonSearch getSurrenderReasonSearch() {
        SurrenderReasonSearch surrenderReasonSearch = new SurrenderReasonSearch();
        surrenderReasonSearch.setPageSize(500);
        surrenderReasonSearch.setOffset(0);
        return surrenderReasonSearch;

    }

    private List<SurrenderReason> getSurrenderReasons() {
        List<SurrenderReason> surrenderReasons = new ArrayList<SurrenderReason>();
        SurrenderReason surrenderReason = SurrenderReason.builder().name("name").description("description").build();
        surrenderReason.setTenantId("default");
        surrenderReasons.add(surrenderReason);
        return surrenderReasons;
    }

}
