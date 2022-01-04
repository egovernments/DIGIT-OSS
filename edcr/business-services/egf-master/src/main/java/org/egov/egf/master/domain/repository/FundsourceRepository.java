package org.egov.egf.master.domain.repository;

import java.util.HashMap;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.Fundsource;
import org.egov.egf.master.domain.model.FundsourceSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.FundsourceEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.FundsourceJdbcRepository;
import org.egov.egf.master.web.contract.FundsourceSearchContract;
import org.egov.egf.master.web.requests.FundsourceRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FundsourceRepository {

    @Autowired
    private FundsourceJdbcRepository fundsourceJdbcRepository;
    @Autowired
    private MastersQueueRepository fundsourceQueueRepository;

    @Autowired
    private FinancialConfigurationService financialConfigurationService;
    
    @Autowired
    private FundsourceESRepository fundsourceESRepository;

    public Fundsource findById(Fundsource fundsource) {
        FundsourceEntity entity = fundsourceJdbcRepository.findById(new FundsourceEntity().toEntity(fundsource));
        return entity.toDomain();

    }
    
    public String getNextSequence(){
        return fundsourceJdbcRepository.getSequence(FundsourceEntity.SEQUENCE_NAME);
    }

    @Transactional
    public Fundsource save(Fundsource fundsource) {
        FundsourceEntity entity = fundsourceJdbcRepository.create(new FundsourceEntity().toEntity(fundsource));
        return entity.toDomain();
    }

    @Transactional
    public Fundsource update(Fundsource fundsource) {
        FundsourceEntity entity = fundsourceJdbcRepository.update(new FundsourceEntity().toEntity(fundsource));
        return entity.toDomain();
    }

    public void add(FundsourceRequest request) {
        Map<String, Object> message = new HashMap<>();

        if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
            message.put("fundsource_create", request);
        } else {
            message.put("fundsource_update", request);
        }
        fundsourceQueueRepository.add(message);
    }

    public Pagination<Fundsource> search(FundsourceSearch domain) {

        if (!financialConfigurationService.fetchDataFrom().isEmpty()
                && financialConfigurationService.fetchDataFrom().equalsIgnoreCase("es")) {
            FundsourceSearchContract fundsourceSearchContract = new FundsourceSearchContract();
            ModelMapper mapper = new ModelMapper();
            mapper.map(domain, fundsourceSearchContract);
            return fundsourceESRepository.search(fundsourceSearchContract);
        } else {
            return fundsourceJdbcRepository.search(domain);
        }

    }

    public boolean uniqueCheck(String fieldName, Fundsource fundsource) {
        return fundsourceJdbcRepository.uniqueCheck(fieldName, new FundsourceEntity().toEntity(fundsource));
    }

}