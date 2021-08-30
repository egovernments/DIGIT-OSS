package org.egov.egf.instrument.domain.repository;

import org.egov.egf.instrument.domain.model.InstrumentVoucher;
import org.egov.egf.instrument.persistence.entity.InstrumentVoucherEntity;
import org.egov.egf.instrument.persistence.repository.InstrumentVoucherJdbcRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InstrumentVoucherRepository {

    @Autowired
    private InstrumentVoucherJdbcRepository instrumentVoucherJdbcRepository;

    public InstrumentVoucher findById(InstrumentVoucher instrumentVoucher) {
        InstrumentVoucherEntity entity = instrumentVoucherJdbcRepository
                .findById(new InstrumentVoucherEntity().toEntity(instrumentVoucher));
        if (entity != null)
            return entity.toDomain();

        return null;

    }

    @Transactional
    public InstrumentVoucher save(InstrumentVoucher instrumentVoucher) {
        InstrumentVoucherEntity entity = instrumentVoucherJdbcRepository
                .create(new InstrumentVoucherEntity().toEntity(instrumentVoucher));
        return entity.toDomain();
    }

    @Transactional
    public InstrumentVoucher update(InstrumentVoucher instrumentVoucher) {
        InstrumentVoucherEntity entity = instrumentVoucherJdbcRepository
                .update(new InstrumentVoucherEntity().toEntity(instrumentVoucher));
        return entity.toDomain();
    }

    /*
     * public void add(CommonRequest<InstrumentVoucherContract> request) { instrumentVoucherQueueRepository.add(request); }
     */

    /*
     * public Pagination<InstrumentVoucher> search(InstrumentVoucherSearch domain) { return
     * instrumentVoucherJdbcRepository.search(domain); }
     */

}