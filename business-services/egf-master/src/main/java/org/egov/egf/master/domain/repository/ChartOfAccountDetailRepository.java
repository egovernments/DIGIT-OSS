package org.egov.egf.master.domain.repository;

import java.util.HashMap;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.ChartOfAccountDetail;
import org.egov.egf.master.domain.model.ChartOfAccountDetailSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.ChartOfAccountDetailEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.ChartOfAccountDetailJdbcRepository;
import org.egov.egf.master.web.contract.ChartOfAccountDetailSearchContract;
import org.egov.egf.master.web.requests.ChartOfAccountDetailRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChartOfAccountDetailRepository {

    @Autowired
    private ChartOfAccountDetailJdbcRepository chartOfAccountDetailJdbcRepository;

    @Autowired
    private MastersQueueRepository chartOfAccountDetailQueueRepository;

    @Autowired
    private FinancialConfigurationService financialConfigurationService;

    @Autowired
    private ChartOfAccountDetailESRepository chartOfAccountDetailESRepository;

    public ChartOfAccountDetail findById(ChartOfAccountDetail chartOfAccountDetail) {
        ChartOfAccountDetailEntity entity = chartOfAccountDetailJdbcRepository
                .findById(new ChartOfAccountDetailEntity().toEntity(chartOfAccountDetail));
        return entity.toDomain();

    }
    
    public String getNextSequence(){
        return chartOfAccountDetailJdbcRepository.getSequence(ChartOfAccountDetailEntity.SEQUENCE_NAME);
    }

    @Transactional
    public ChartOfAccountDetail save(ChartOfAccountDetail chartOfAccountDetail) {
        ChartOfAccountDetailEntity entity = chartOfAccountDetailJdbcRepository
                .create(new ChartOfAccountDetailEntity().toEntity(chartOfAccountDetail));
        return entity.toDomain();
    }

    @Transactional
    public ChartOfAccountDetail update(ChartOfAccountDetail chartOfAccountDetail) {
        ChartOfAccountDetailEntity entity = chartOfAccountDetailJdbcRepository
                .update(new ChartOfAccountDetailEntity().toEntity(chartOfAccountDetail));
        return entity.toDomain();
    }

    public void add(ChartOfAccountDetailRequest request) {
        Map<String, Object> message = new HashMap<>();

        if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
            message.put("chartofaccountdetail_create", request);
        } else {
            message.put("chartofaccountdetail_update", request);
        }
        chartOfAccountDetailQueueRepository.add(message);
    }

    public Pagination<ChartOfAccountDetail> search(ChartOfAccountDetailSearch domain) {

        if (!financialConfigurationService.fetchDataFrom().isEmpty()
                && financialConfigurationService.fetchDataFrom().equalsIgnoreCase("es")) {
            ChartOfAccountDetailSearchContract chartOfAccountDetailSearchContract = new ChartOfAccountDetailSearchContract();
            ModelMapper mapper = new ModelMapper();
            mapper.map(domain, chartOfAccountDetailSearchContract);
            return chartOfAccountDetailESRepository.search(chartOfAccountDetailSearchContract);
        } else {
            return chartOfAccountDetailJdbcRepository.search(domain);
        }

    }

    public boolean uniqueCheck(String fieldName, ChartOfAccountDetail chartOfAccountDetail) {
        return chartOfAccountDetailJdbcRepository.uniqueCheck(fieldName, new ChartOfAccountDetailEntity().toEntity(chartOfAccountDetail));
    }

}