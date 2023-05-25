package org.egov.egf.master.domain.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.Recovery;
import org.egov.egf.master.domain.model.RecoverySearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.RecoveryEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.RecoveryJdbcRepository;
import org.egov.egf.master.web.contract.RecoveryContract;
import org.egov.egf.master.web.contract.RecoverySearchContract;
import org.egov.egf.master.web.requests.RecoveryRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class RecoveryRepository {

    private MastersQueueRepository recoveryQueueRepository;

    private FinancialConfigurationService financialConfigurationService;

    private String persistThroughKafka;

    private RecoveryJdbcRepository recoveryJdbcRepository;

    private RecoveryESRepository recoveryESRepository;

    @Autowired
    public RecoveryRepository(MastersQueueRepository recoveryQueueRepository, FinancialConfigurationService financialConfigurationService,
                              @Value("${persist.through.kafka}") String persistThroughKafka,
                              RecoveryJdbcRepository recoveryJdbcRepository,
                              RecoveryESRepository recoveryESRepository) {
        this.recoveryQueueRepository = recoveryQueueRepository;
        this.financialConfigurationService = financialConfigurationService;
        this.persistThroughKafka = persistThroughKafka;
        this.recoveryJdbcRepository = recoveryJdbcRepository;
        this.recoveryESRepository = recoveryESRepository;

    }

    @Transactional
    public List<Recovery> save(List<Recovery> recoveries,
                               RequestInfo requestInfo) {

        ModelMapper mapper = new ModelMapper();
        RecoveryContract contract;

        if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
                && persistThroughKafka.equalsIgnoreCase("yes")) {

            RecoveryRequest request = new RecoveryRequest();
            request.setRequestInfo(requestInfo);
            request.setRecoverys(new ArrayList<>());

            for (Recovery f : recoveries) {

                contract = new RecoveryContract();
                contract.setCreatedDate(new Date());
                mapper.map(f, contract);
                request.getRecoverys().add(contract);

            }

            addToQue(request);

            return recoveries;
        } else {

            List<Recovery> resultList = new ArrayList<Recovery>();

            for (Recovery f : recoveries) {

                resultList.add(save(f));
            }

            RecoveryRequest request = new RecoveryRequest();
            request.setRequestInfo(requestInfo);
            request.setRecoverys(new ArrayList<>());

            for (Recovery f : resultList) {

                contract = new RecoveryContract();
                contract.setCreatedDate(new Date());
                mapper.map(f, contract);
                request.getRecoverys().add(contract);

            }

            addToSearchQueue(request);

            return resultList;
        }

    }

    @Transactional
    public List<Recovery> update(List<Recovery> recoveries,
                                 RequestInfo requestInfo) {

        ModelMapper mapper = new ModelMapper();
        RecoveryContract contract;

        if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
                && persistThroughKafka.equalsIgnoreCase("yes")) {

            RecoveryRequest request = new RecoveryRequest();
            request.setRequestInfo(requestInfo);
            request.setRecoverys(new ArrayList<>());

            for (Recovery f : recoveries) {

                contract = new RecoveryContract();
                contract.setCreatedDate(new Date());
                mapper.map(f, contract);
                request.getRecoverys().add(contract);

            }

            addToQue(request);

            return recoveries;
        } else {

            List<Recovery> resultList = new ArrayList<Recovery>();

            for (Recovery f : recoveries) {

                resultList.add(update(f));
            }

            RecoveryRequest request = new RecoveryRequest();
            request.setRequestInfo(requestInfo);
            request.setRecoverys(new ArrayList<>());

            for (Recovery f : resultList) {

                contract = new RecoveryContract();
                contract.setCreatedDate(new Date());
                mapper.map(f, contract);
                request.getRecoverys().add(contract);

            }

            addToSearchQueue(request);

            return resultList;
        }

    }

    public String getNextSequence() {
        return recoveryJdbcRepository.getSequence(RecoveryEntity.SEQUENCE_NAME);
    }

    public Recovery findById(Recovery recovery) {
        RecoveryEntity entity = recoveryJdbcRepository.findById(new RecoveryEntity().toEntity(recovery));
        return entity.toDomain();

    }

    @Transactional
    public Recovery save(Recovery recovery) {
        RecoveryEntity entity = recoveryJdbcRepository.create(new RecoveryEntity().toEntity(recovery));
        return entity.toDomain();
    }

    @Transactional
    public Recovery update(Recovery recovery) {
        RecoveryEntity entity = recoveryJdbcRepository.update(new RecoveryEntity().toEntity(recovery));
        return entity.toDomain();
    }

    public void addToQue(RecoveryRequest request) {
        Map<String, Object> message = new HashMap<>();

        if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
            message.put("recovery_create", request);
        } else {
            message.put("recovery_update", request);
        }
        recoveryQueueRepository.add(message);
    }

    public void addToSearchQueue(RecoveryRequest request) {
        Map<String, Object> message = new HashMap<>();

        message.put("recovery_persisted", request);

        recoveryQueueRepository.addToSearch(message);
    }

    public Pagination<Recovery> search(RecoverySearch domain) {
        if (!financialConfigurationService.fetchDataFrom().isEmpty()
                && financialConfigurationService.fetchDataFrom().equalsIgnoreCase("es")) {
            RecoverySearchContract recoverySearchContract = new RecoverySearchContract();
            ModelMapper mapper = new ModelMapper();
            mapper.map(domain, recoverySearchContract);
            return recoveryESRepository.search(recoverySearchContract);
        } else {
            return recoveryJdbcRepository.search(domain);
        }

    }

    public boolean uniqueCheck(String fieldName, Recovery recovery) {
        return recoveryJdbcRepository.uniqueCheck(fieldName, new RecoveryEntity().toEntity(recovery));
    }

}
