package org.egov.egf.master.domain.repository;

import java.util.HashMap;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.FinancialYear;
import org.egov.egf.master.domain.model.FinancialYearSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.FinancialYearEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.FinancialYearJdbcRepository;
import org.egov.egf.master.web.contract.FinancialYearSearchContract;
import org.egov.egf.master.web.requests.FinancialYearRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FinancialYearRepository {

    @Autowired
    private FinancialYearJdbcRepository financialYearJdbcRepository;

    @Autowired
    private MastersQueueRepository financialYearQueueRepository;

    @Autowired
    private FinancialConfigurationService financialConfigurationService;

    @Autowired
    private FinancialYearESRepository financialYearESRepository;

    public FinancialYear findById(FinancialYear financialYear) {
        return financialYearJdbcRepository.findById(new FinancialYearEntity().toEntity(financialYear)).toDomain();

    }

    public FinancialYear save(FinancialYear financialYear) {
        return financialYearJdbcRepository.create(new FinancialYearEntity().toEntity(financialYear)).toDomain();
    }

    public FinancialYear update(FinancialYear entity) {
        return financialYearJdbcRepository.update(new FinancialYearEntity().toEntity(entity)).toDomain();
    }

    public void add(FinancialYearRequest request) {

        Map<String, Object> message = new HashMap<>();

        if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
            message.put("financialyear_create", request);
        } else {
            message.put("financialyear_update", request);
        }
        financialYearQueueRepository.add(message);
    }
    
    public String getNextSequence(){
        return financialYearJdbcRepository.getSequence(FinancialYearEntity.SEQUENCE_NAME);
    }

    public Pagination<FinancialYear> search(FinancialYearSearch domain) {

        if (!financialConfigurationService.fetchDataFrom().isEmpty()
                && financialConfigurationService.fetchDataFrom().equalsIgnoreCase("es")) {
            FinancialYearSearchContract financialYearSearchContract = new FinancialYearSearchContract();
            ModelMapper mapper = new ModelMapper();
            mapper.map(domain, financialYearSearchContract);
            return financialYearESRepository.search(financialYearSearchContract);
        } else {
            return financialYearJdbcRepository.search(domain);
        }

    }

    public boolean uniqueCheck(String fieldName, FinancialYear financialYear) {
        return financialYearJdbcRepository.uniqueCheck(fieldName, new FinancialYearEntity().toEntity(financialYear));
    }

}