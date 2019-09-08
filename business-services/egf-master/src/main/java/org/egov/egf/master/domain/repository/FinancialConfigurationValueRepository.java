package org.egov.egf.master.domain.repository;

import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.FinancialConfigurationValue;
import org.egov.egf.master.domain.model.FinancialConfigurationValueSearch;
import org.egov.egf.master.persistence.entity.FinancialConfigurationValueEntity;
import org.egov.egf.master.persistence.repository.FinancialConfigurationValueJdbcRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FinancialConfigurationValueRepository {

    @Autowired
    private FinancialConfigurationValueJdbcRepository financialConfigurationValueJdbcRepository;

    public FinancialConfigurationValue findById(FinancialConfigurationValue financialConfigurationValue) {
        FinancialConfigurationValueEntity entity = financialConfigurationValueJdbcRepository
                .findById(new FinancialConfigurationValueEntity().toEntity(financialConfigurationValue));
        return entity.toDomain();

    }

    @Transactional
    public FinancialConfigurationValue save(FinancialConfigurationValue financialConfigurationValue) {
        FinancialConfigurationValueEntity entity = financialConfigurationValueJdbcRepository
                .create(new FinancialConfigurationValueEntity().toEntity(financialConfigurationValue));
        return entity.toDomain();
    }

    @Transactional
    public FinancialConfigurationValue update(FinancialConfigurationValue financialConfigurationValue) {
        FinancialConfigurationValueEntity entity = financialConfigurationValueJdbcRepository
                .update(new FinancialConfigurationValueEntity().toEntity(financialConfigurationValue));
        return entity.toDomain();
    }

    /*
     * public void add(FinancialConfigurationValueRequest request) { Map<String, Object> message = new HashMap<>(); if
     * (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
     * message.put("financialconfigurationvalue_create", request); } else { message.put("financialconfigurationvalue_update",
     * request); } financialConfigurationValueQueueRepository.add(message); }
     */

    public Pagination<FinancialConfigurationValue> search(FinancialConfigurationValueSearch domain) {

        return financialConfigurationValueJdbcRepository.search(domain);

    }

}