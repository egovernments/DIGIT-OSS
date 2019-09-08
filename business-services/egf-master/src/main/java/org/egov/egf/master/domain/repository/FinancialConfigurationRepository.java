package org.egov.egf.master.domain.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.FinancialConfiguration;
import org.egov.egf.master.domain.model.FinancialConfigurationSearch;
import org.egov.egf.master.domain.model.FinancialConfigurationValue;
import org.egov.egf.master.domain.model.FinancialConfigurationValueSearch;
import org.egov.egf.master.persistence.entity.FinancialConfigurationEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.FinancialConfigurationJdbcRepository;
import org.egov.egf.master.web.requests.FinancialConfigurationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FinancialConfigurationRepository {

    @Autowired
    private FinancialConfigurationJdbcRepository financialConfigurationJdbcRepository;

    @Autowired
    private FinancialConfigurationValueRepository financialConfigurationValueRepository;

    @Autowired
    private MastersQueueRepository financialConfigurationQueueRepository;

    public FinancialConfiguration findById(FinancialConfiguration financialConfiguration) {
        FinancialConfigurationEntity entity = financialConfigurationJdbcRepository
                .findById(new FinancialConfigurationEntity().toEntity(financialConfiguration));
        return entity.toDomain();

    }

    @Transactional
    public FinancialConfiguration save(FinancialConfiguration financialConfiguration) {
        FinancialConfigurationEntity entity = financialConfigurationJdbcRepository
                .create(new FinancialConfigurationEntity().toEntity(financialConfiguration));
        return entity.toDomain();
    }

    @Transactional
    public FinancialConfiguration update(FinancialConfiguration financialConfiguration) {
        FinancialConfigurationEntity entity = financialConfigurationJdbcRepository
                .update(new FinancialConfigurationEntity().toEntity(financialConfiguration));
        return entity.toDomain();
    }

    public void add(FinancialConfigurationRequest request) {
        Map<String, Object> message = new HashMap<>();

        if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
            message.put("financialconfiguration_create", request);
        } else {
            message.put("financialconfiguration_update", request);
        }
        financialConfigurationQueueRepository.add(message);
    }

    public Pagination<FinancialConfiguration> search(FinancialConfigurationSearch domain) {

        if (domain.getName() != null && domain.getModule() != null && !domain.getName().isEmpty()
                && !domain.getModule().isEmpty()) {
            List<FinancialConfiguration> finalList = new ArrayList<>();

            Pagination<FinancialConfiguration> response = financialConfigurationJdbcRepository.search(domain);
            FinancialConfigurationValueSearch valueSearchReq = new FinancialConfigurationValueSearch();

            for (FinancialConfiguration fc : response.getPagedData()) {

                FinancialConfiguration financialConfiguration = FinancialConfiguration.builder().id(fc.getId()).build();
                financialConfiguration.setTenantId(fc.getTenantId());
                valueSearchReq.setFinancialConfiguration(financialConfiguration);
                Pagination<FinancialConfigurationValue> valuesRes = financialConfigurationValueRepository.search(valueSearchReq);
                fc.setValues(valuesRes.getPagedData());
                finalList.add(fc);
            }

            response.setPagedData(finalList);

            return response;

        }

        return financialConfigurationJdbcRepository.search(domain);

    }

    public boolean uniqueCheck(String fieldName, FinancialConfiguration financialConfiguration) {
        return financialConfigurationJdbcRepository.uniqueCheck(fieldName, new FinancialConfigurationEntity().toEntity(financialConfiguration));
    }

}