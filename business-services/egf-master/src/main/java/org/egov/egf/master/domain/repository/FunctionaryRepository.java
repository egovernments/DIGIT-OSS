package org.egov.egf.master.domain.repository;

import java.util.HashMap;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.Functionary;
import org.egov.egf.master.domain.model.FunctionarySearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.FunctionaryEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.FunctionaryJdbcRepository;
import org.egov.egf.master.web.contract.FunctionarySearchContract;
import org.egov.egf.master.web.requests.FunctionaryRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FunctionaryRepository {

    @Autowired
    private FunctionaryJdbcRepository functionaryJdbcRepository;

    @Autowired
    private MastersQueueRepository functionaryQueueRepository;

    @Autowired
    private FinancialConfigurationService financialConfigurationService;

    @Autowired
    private FunctionaryESRepository functionaryESRepository;

    public Functionary findById(Functionary functionary) {
        FunctionaryEntity entity = functionaryJdbcRepository.findById(new FunctionaryEntity().toEntity(functionary));
        return entity.toDomain();

    }
    
    public String getNextSequence(){
        return functionaryJdbcRepository.getSequence(FunctionaryEntity.SEQUENCE_NAME);
    }

    @Transactional
    public Functionary save(Functionary functionary) {
        FunctionaryEntity entity = functionaryJdbcRepository.create(new FunctionaryEntity().toEntity(functionary));
        return entity.toDomain();
    }

    @Transactional
    public Functionary update(Functionary functionary) {
        FunctionaryEntity entity = functionaryJdbcRepository.update(new FunctionaryEntity().toEntity(functionary));
        return entity.toDomain();
    }

    public void add(FunctionaryRequest request) {
        Map<String, Object> message = new HashMap<>();

        if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
            message.put("functionary_create", request);
        } else {
            message.put("functionary_update", request);
        }
        functionaryQueueRepository.add(message);
    }

    public Pagination<Functionary> search(FunctionarySearch domain) {

        if (!financialConfigurationService.fetchDataFrom().isEmpty()
                && financialConfigurationService.fetchDataFrom().equalsIgnoreCase("es")) {
            FunctionarySearchContract functionarySearchContract = new FunctionarySearchContract();
            ModelMapper mapper = new ModelMapper();
            mapper.map(domain, functionarySearchContract);
            return functionaryESRepository.search(functionarySearchContract);
        } else {
            return functionaryJdbcRepository.search(domain);
        }

    }

    public boolean uniqueCheck(String fieldName, Functionary functionary) {
        return functionaryJdbcRepository.uniqueCheck(fieldName, new FunctionaryEntity().toEntity(functionary));
    }

}