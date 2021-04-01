package org.egov.egf.instrument.domain.repository;

import org.egov.egf.instrument.domain.model.InstrumentTypeProperty;
import org.egov.egf.instrument.persistence.entity.InstrumentTypePropertyEntity;
import org.egov.egf.instrument.persistence.repository.InstrumentTypePropertyJdbcRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InstrumentTypePropertyRepository {

    @Autowired
    private InstrumentTypePropertyJdbcRepository instrumentTypePropertyJdbcRepository;

    public InstrumentTypeProperty findById(InstrumentTypeProperty instrumentTypeProperty) {
        InstrumentTypePropertyEntity entity = instrumentTypePropertyJdbcRepository
                .findById(new InstrumentTypePropertyEntity().toEntity(instrumentTypeProperty));
        if (entity != null)
            return entity.toDomain();

        return null;

    }

    @Transactional
    public InstrumentTypeProperty save(InstrumentTypeProperty instrumentTypeProperty) {
        InstrumentTypePropertyEntity entity = instrumentTypePropertyJdbcRepository
                .create(new InstrumentTypePropertyEntity().toEntity(instrumentTypeProperty));
        return entity.toDomain();
    }

    @Transactional
    public InstrumentTypeProperty update(InstrumentTypeProperty instrumentTypeProperty) {
        InstrumentTypePropertyEntity entity = instrumentTypePropertyJdbcRepository
                .update(new InstrumentTypePropertyEntity().toEntity(instrumentTypeProperty));
        return entity.toDomain();
    }

    /*
     * public Pagination<InstrumentTypeProperty> search(InstrumentTypePropertySearch domain) { return
     * instrumentTypePropertyJdbcRepository.search(domain); }
     */

}