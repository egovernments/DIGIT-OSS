package org.egov.egf.master.domain.repository;

import java.util.HashMap;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.FiscalPeriod;
import org.egov.egf.master.domain.model.FiscalPeriodSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.FiscalPeriodEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.FiscalPeriodJdbcRepository;
import org.egov.egf.master.web.contract.FiscalPeriodSearchContract;
import org.egov.egf.master.web.requests.FiscalPeriodRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FiscalPeriodRepository {

    @Autowired
    private FiscalPeriodJdbcRepository fiscalPeriodJdbcRepository;

    @Autowired
    private MastersQueueRepository fiscalPeriodQueueRepository;

    @Autowired
    private FinancialConfigurationService financialConfigurationService;

    @Autowired
    private FiscalPeriodESRepository fiscalPeriodESRepository;

    public FiscalPeriod findById(FiscalPeriod fiscalPeriod) {
        FiscalPeriodEntity entity = fiscalPeriodJdbcRepository
                .findById(new FiscalPeriodEntity().toEntity(fiscalPeriod));
        return entity.toDomain();

    }
    
    public String getNextSequence(){
        return fiscalPeriodJdbcRepository.getSequence(FiscalPeriodEntity.SEQUENCE_NAME);
    }

    @Transactional
    public FiscalPeriod save(FiscalPeriod fiscalPeriod) {
        FiscalPeriodEntity entity = fiscalPeriodJdbcRepository.create(new FiscalPeriodEntity().toEntity(fiscalPeriod));
        return entity.toDomain();
    }

    @Transactional
    public FiscalPeriod update(FiscalPeriod fiscalPeriod) {
        FiscalPeriodEntity entity = fiscalPeriodJdbcRepository.update(new FiscalPeriodEntity().toEntity(fiscalPeriod));
        return entity.toDomain();
    }

    public void add(FiscalPeriodRequest request) {
        Map<String, Object> message = new HashMap<>();

        if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
            message.put("fiscalperiod_create", request);
        } else {
            message.put("fiscalperiod_update", request);
        }
        fiscalPeriodQueueRepository.add(message);
    }

    public Pagination<FiscalPeriod> search(FiscalPeriodSearch domain) {

        if (!financialConfigurationService.fetchDataFrom().isEmpty()
                && financialConfigurationService.fetchDataFrom().equalsIgnoreCase("es")) {
            FiscalPeriodSearchContract fiscalPeriodSearchContract = new FiscalPeriodSearchContract();
            ModelMapper mapper = new ModelMapper();
            mapper.map(domain, fiscalPeriodSearchContract);
            return fiscalPeriodESRepository.search(fiscalPeriodSearchContract);
        } else {
            return fiscalPeriodJdbcRepository.search(domain);
        }

    }

    public boolean uniqueCheck(String fieldName, FiscalPeriod fiscalPeriod) {
        return fiscalPeriodJdbcRepository.uniqueCheck(fieldName, new FiscalPeriodEntity().toEntity(fiscalPeriod));
    }
}