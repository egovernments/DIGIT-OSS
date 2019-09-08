package org.egov.egf.instrument.domain.repository;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

import org.egov.egf.instrument.domain.model.InstrumentTypeProperty;
import org.egov.egf.instrument.domain.model.TransactionType;
import org.egov.egf.instrument.persistence.entity.InstrumentTypePropertyEntity;
import org.egov.egf.instrument.persistence.repository.InstrumentTypePropertyJdbcRepository;
import org.egov.egf.master.web.contract.FinancialStatusContract;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class InstrumentTypePropertyRepositoryTest {

    @InjectMocks
    private InstrumentTypePropertyRepository instrumentTypePropertyRepository;

    @Mock
    private InstrumentTypePropertyJdbcRepository instrumentTypePropertyJdbcRepository;

    @Test
    public void test_find_by_id() {
        InstrumentTypePropertyEntity entity = getInstrumentTypePropertyEntity();
        InstrumentTypeProperty expectedResult = entity.toDomain();

        when(instrumentTypePropertyJdbcRepository.findById(any(InstrumentTypePropertyEntity.class))).thenReturn(entity);

        InstrumentTypeProperty actualResult = instrumentTypePropertyRepository
                .findById(getInstrumentTypePropertyDomin());

        assertEquals(expectedResult.getTransactionType(), actualResult.getTransactionType());
        assertEquals(expectedResult.getReconciledOncreate(), actualResult.getReconciledOncreate());
        assertEquals(expectedResult.getStatusOnCreate().getId(), actualResult.getStatusOnCreate().getId());
        assertEquals(expectedResult.getStatusOnReconcile().getId(), actualResult.getStatusOnReconcile().getId());
        assertEquals(expectedResult.getStatusOnUpdate().getId(), actualResult.getStatusOnUpdate().getId());

    }

    @Test
    public void test_find_by_id_return_null() {
        InstrumentTypePropertyEntity entity = getInstrumentTypePropertyEntity();

        when(instrumentTypePropertyJdbcRepository.findById(null)).thenReturn(entity);

        InstrumentTypeProperty actualResult = instrumentTypePropertyRepository
                .findById(getInstrumentTypePropertyDomin());

        assertEquals(null, actualResult);
    }

    @Test
    public void test_save() {

        InstrumentTypePropertyEntity entity = getInstrumentTypePropertyEntity();
        InstrumentTypeProperty expectedResult = entity.toDomain();

        when(instrumentTypePropertyJdbcRepository.create(any(InstrumentTypePropertyEntity.class))).thenReturn(entity);

        InstrumentTypeProperty actualResult = instrumentTypePropertyRepository.save(getInstrumentTypePropertyDomin());

        assertEquals(expectedResult.getTransactionType(), actualResult.getTransactionType());
        assertEquals(expectedResult.getReconciledOncreate(), actualResult.getReconciledOncreate());
        assertEquals(expectedResult.getStatusOnCreate().getId(), actualResult.getStatusOnCreate().getId());
        assertEquals(expectedResult.getStatusOnReconcile().getId(), actualResult.getStatusOnReconcile().getId());
        assertEquals(expectedResult.getStatusOnUpdate().getId(), actualResult.getStatusOnUpdate().getId());

    }

    @Test
    public void test_update() {

        InstrumentTypePropertyEntity entity = getInstrumentTypePropertyEntity();
        InstrumentTypeProperty expectedResult = entity.toDomain();

        when(instrumentTypePropertyJdbcRepository.update(any(InstrumentTypePropertyEntity.class))).thenReturn(entity);

        InstrumentTypeProperty actualResult = instrumentTypePropertyRepository.update(getInstrumentTypePropertyDomin());

        assertEquals(expectedResult.getTransactionType(), actualResult.getTransactionType());
        assertEquals(expectedResult.getReconciledOncreate(), actualResult.getReconciledOncreate());
        assertEquals(expectedResult.getStatusOnCreate().getId(), actualResult.getStatusOnCreate().getId());
        assertEquals(expectedResult.getStatusOnReconcile().getId(), actualResult.getStatusOnReconcile().getId());
        assertEquals(expectedResult.getStatusOnUpdate().getId(), actualResult.getStatusOnUpdate().getId());
    }

    private InstrumentTypeProperty getInstrumentTypePropertyDomin() {
        InstrumentTypeProperty instrumentTypePropertyDetail = new InstrumentTypeProperty();
        instrumentTypePropertyDetail.setTransactionType(TransactionType.Credit);
        instrumentTypePropertyDetail.setReconciledOncreate(true);
        instrumentTypePropertyDetail.setStatusOnCreate(FinancialStatusContract.builder().id("statusId").build());
        instrumentTypePropertyDetail.setStatusOnReconcile(FinancialStatusContract.builder().id("statusId").build());
        instrumentTypePropertyDetail.setStatusOnUpdate(FinancialStatusContract.builder().id("statusId").build());
        instrumentTypePropertyDetail.setTenantId("default");
        return instrumentTypePropertyDetail;
    }

    private InstrumentTypePropertyEntity getInstrumentTypePropertyEntity() {
        InstrumentTypePropertyEntity entity = new InstrumentTypePropertyEntity();
        entity.setTransactionType(TransactionType.Credit.name());
        entity.setReconciledOncreate(true);
        entity.setStatusOnCreateId("statusId");
        entity.setStatusOnReconcileId("statusId");
        entity.setStatusOnUpdateId("statusId");
        entity.setTenantId("default");
        return entity;
    }

}
