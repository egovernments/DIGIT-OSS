package org.egov.egf.instrument.domain.repository;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

import org.egov.egf.instrument.domain.model.Instrument;
import org.egov.egf.instrument.domain.model.InstrumentVoucher;
import org.egov.egf.instrument.persistence.entity.InstrumentVoucherEntity;
import org.egov.egf.instrument.persistence.repository.InstrumentVoucherJdbcRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class InstrumentVoucherRepositoryTest {

    @InjectMocks
    private InstrumentVoucherRepository instrumentVoucherRepository;

    @Mock
    private InstrumentVoucherJdbcRepository instrumentVoucherJdbcRepository;

    @Test
    public void test_find_by_id() {
        InstrumentVoucherEntity entity = getInstrumentVoucherEntity();
        InstrumentVoucher expectedResult = entity.toDomain();

        when(instrumentVoucherJdbcRepository.findById(any(InstrumentVoucherEntity.class))).thenReturn(entity);

        InstrumentVoucher actualResult = instrumentVoucherRepository.findById(getInstrumentVoucherDomin());

        assertEquals(expectedResult.getVoucherHeaderId(), actualResult.getVoucherHeaderId());
        assertEquals(expectedResult.getInstrument().getId(), actualResult.getInstrument().getId());
    }

    @Test
    public void test_find_by_id_return_null() {
        InstrumentVoucherEntity entity = getInstrumentVoucherEntity();

        when(instrumentVoucherJdbcRepository.findById(null)).thenReturn(entity);

        InstrumentVoucher actualResult = instrumentVoucherRepository.findById(getInstrumentVoucherDomin());

        assertEquals(null, actualResult);
    }

    @Test
    public void test_save() {

        InstrumentVoucherEntity entity = getInstrumentVoucherEntity();
        InstrumentVoucher expectedResult = entity.toDomain();

        when(instrumentVoucherJdbcRepository.create(any(InstrumentVoucherEntity.class))).thenReturn(entity);

        InstrumentVoucher actualResult = instrumentVoucherRepository.save(getInstrumentVoucherDomin());

        assertEquals(expectedResult.getVoucherHeaderId(), actualResult.getVoucherHeaderId());
        assertEquals(expectedResult.getInstrument().getId(), actualResult.getInstrument().getId());

    }

    @Test
    public void test_update() {

        InstrumentVoucherEntity entity = getInstrumentVoucherEntity();
        InstrumentVoucher expectedResult = entity.toDomain();

        when(instrumentVoucherJdbcRepository.update(any(InstrumentVoucherEntity.class))).thenReturn(entity);

        InstrumentVoucher actualResult = instrumentVoucherRepository.update(getInstrumentVoucherDomin());

        assertEquals(expectedResult.getVoucherHeaderId(), actualResult.getVoucherHeaderId());
        assertEquals(expectedResult.getInstrument().getId(), actualResult.getInstrument().getId());
    }

    private InstrumentVoucher getInstrumentVoucherDomin() {
        InstrumentVoucher instrumentVoucherDetail = new InstrumentVoucher();
        instrumentVoucherDetail.setVoucherHeaderId("voucherHeaderId");
        instrumentVoucherDetail.setInstrument(Instrument.builder().id("instrumentId").build());
        instrumentVoucherDetail.setTenantId("default");
        return instrumentVoucherDetail;
    }

    private InstrumentVoucherEntity getInstrumentVoucherEntity() {
        InstrumentVoucherEntity entity = new InstrumentVoucherEntity();
        entity.setVoucherHeaderId("voucherHeaderId");
        entity.setInstrumentId("instrumentId");
        entity.setTenantId("default");
        return entity;
    }

}
