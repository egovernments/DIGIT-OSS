package org.egov.egf.master.domain.repository;

import java.util.HashMap;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.Scheme;
import org.egov.egf.master.domain.model.SchemeSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.SchemeEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.SchemeJdbcRepository;
import org.egov.egf.master.web.contract.SchemeSearchContract;
import org.egov.egf.master.web.requests.SchemeRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SchemeRepository {

    @Autowired
    private SchemeJdbcRepository schemeJdbcRepository;

    @Autowired
    private MastersQueueRepository schemeQueueRepository;

    @Autowired
    private FinancialConfigurationService financialConfigurationService;

    @Autowired
    private SchemeESRepository schemeESRepository;

    public Scheme findById(Scheme scheme) {
        SchemeEntity entity = schemeJdbcRepository.findById(new SchemeEntity().toEntity(scheme));
        return entity.toDomain();

    }
    
    public String getNextSequence(){
        return schemeJdbcRepository.getSequence(SchemeEntity.SEQUENCE_NAME);
    }

    @Transactional
    public Scheme save(Scheme scheme) {
        SchemeEntity entity = schemeJdbcRepository.create(new SchemeEntity().toEntity(scheme));
        return entity.toDomain();
    }

    @Transactional
    public Scheme update(Scheme scheme) {
        SchemeEntity entity = schemeJdbcRepository.update(new SchemeEntity().toEntity(scheme));
        return entity.toDomain();
    }

    public void add(SchemeRequest request) {
        Map<String, Object> message = new HashMap<>();

        if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
            message.put("scheme_create", request);
        } else {
            message.put("scheme_update", request);
        }
        schemeQueueRepository.add(message);
    }

    public Pagination<Scheme> search(SchemeSearch domain) {

        if (!financialConfigurationService.fetchDataFrom().isEmpty()
                && financialConfigurationService.fetchDataFrom().equalsIgnoreCase("es")) {
            SchemeSearchContract schemeSearchContract = new SchemeSearchContract();
            ModelMapper mapper = new ModelMapper();
            mapper.map(domain, schemeSearchContract);
            return schemeESRepository.search(schemeSearchContract);
        } else {
            return schemeJdbcRepository.search(domain);
        }

    }

    public boolean uniqueCheck(String fieldName, Scheme scheme) {
        return schemeJdbcRepository.uniqueCheck(fieldName, new SchemeEntity().toEntity(scheme));
    }

}