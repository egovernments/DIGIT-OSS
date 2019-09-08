package org.egov.egf.master.domain.repository;

import java.util.HashMap;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.SubScheme;
import org.egov.egf.master.domain.model.SubSchemeSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.SubSchemeEntity;
import org.egov.egf.master.persistence.entity.SupplierEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.SubSchemeJdbcRepository;
import org.egov.egf.master.web.contract.SubSchemeSearchContract;
import org.egov.egf.master.web.requests.SubSchemeRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SubSchemeRepository {

    @Autowired
    private SubSchemeJdbcRepository subSchemeJdbcRepository;

    @Autowired
    private MastersQueueRepository subSchemeQueueRepository;

    @Autowired
    private FinancialConfigurationService financialConfigurationService;

    @Autowired
    private SubSchemeESRepository subSchemeESRepository;

    public SubScheme findById(SubScheme subScheme) {
        SubSchemeEntity entity = subSchemeJdbcRepository.findById(new SubSchemeEntity().toEntity(subScheme));
        return entity.toDomain();

    }
    
    public String getNextSequence(){
        return subSchemeJdbcRepository.getSequence(SubSchemeEntity.SEQUENCE_NAME);
    }

    @Transactional
    public SubScheme save(SubScheme subScheme) {
        SubSchemeEntity entity = subSchemeJdbcRepository.create(new SubSchemeEntity().toEntity(subScheme));
        return entity.toDomain();
    }

    @Transactional
    public SubScheme update(SubScheme subScheme) {
        SubSchemeEntity entity = subSchemeJdbcRepository.update(new SubSchemeEntity().toEntity(subScheme));
        return entity.toDomain();
    }

    public void add(SubSchemeRequest request) {
        Map<String, Object> message = new HashMap<>();

        if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
            message.put("subscheme_create", request);
        } else {
            message.put("subscheme_update", request);
        }
        subSchemeQueueRepository.add(message);
    }

    public Pagination<SubScheme> search(SubSchemeSearch domain) {

        if (!financialConfigurationService.fetchDataFrom().isEmpty()
                && financialConfigurationService.fetchDataFrom().equalsIgnoreCase("es")) {
            SubSchemeSearchContract subSchemeSearchContract = new SubSchemeSearchContract();
            ModelMapper mapper = new ModelMapper();
            mapper.map(domain, subSchemeSearchContract);
            return subSchemeESRepository.search(subSchemeSearchContract);
        } else {
            return subSchemeJdbcRepository.search(domain);
        }

    }

    public boolean uniqueCheck(String fieldName, SubScheme subScheme) {
        return subSchemeJdbcRepository.uniqueCheck(fieldName, new SubSchemeEntity().toEntity(subScheme));
    }

}