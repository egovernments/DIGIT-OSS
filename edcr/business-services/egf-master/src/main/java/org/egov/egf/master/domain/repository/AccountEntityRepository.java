package org.egov.egf.master.domain.repository;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.AccountEntity;
import org.egov.egf.master.domain.model.AccountEntitySearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.AccountEntityEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.AccountEntityJdbcRepository;
import org.egov.egf.master.web.contract.AccountEntityContract;
import org.egov.egf.master.web.contract.AccountEntitySearchContract;
import org.egov.egf.master.web.requests.AccountEntityRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AccountEntityRepository {

    @Autowired
    private AccountEntityJdbcRepository accountEntityJdbcRepository;

    @Autowired
    private MastersQueueRepository accountEntityQueueRepository;

    @Autowired
    private FinancialConfigurationService financialConfigurationService;

    @Autowired
    private AccountEntityESRepository accountEntityESRepository;

    private String persistThroughKafka;

    @Autowired
    public AccountEntityRepository(AccountEntityJdbcRepository accountEntityJdbcRepository,
                                   MastersQueueRepository accountEntityQueueRepository, FinancialConfigurationService financialConfigurationService,
                                   AccountEntityESRepository accountEntityESRepository, @Value("${persist.through.kafka}") String persistThroughKafka) {
        this.accountEntityJdbcRepository = accountEntityJdbcRepository;
        this.accountEntityQueueRepository = accountEntityQueueRepository;
        this.financialConfigurationService = financialConfigurationService;
        this.accountEntityESRepository = accountEntityESRepository;
        this.persistThroughKafka = persistThroughKafka;

    }

    @Transactional
    public List<AccountEntity> save(List<AccountEntity> accountEntities, RequestInfo requestInfo) {

        ModelMapper mapper = new ModelMapper();
        AccountEntityContract contract;

        if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
                && persistThroughKafka.equalsIgnoreCase("yes")) {

            AccountEntityRequest request = new AccountEntityRequest();
            request.setRequestInfo(requestInfo);
            request.setAccountEntities(new ArrayList<>());

            for (AccountEntity f : accountEntities) {

                contract = new AccountEntityContract();
                contract.setCreatedDate(new Date());
                mapper.map(f, contract);
                request.getAccountEntities().add(contract);

            }

            addToQue(request);

            return accountEntities;
        } else {

            List<AccountEntity> resultList = new ArrayList<AccountEntity>();

            for (AccountEntity f : accountEntities) {

                resultList.add(save(f));
            }

            AccountEntityRequest request = new AccountEntityRequest();
            request.setRequestInfo(requestInfo);
            request.setAccountEntities(new ArrayList<>());

            for (AccountEntity f : resultList) {

                contract = new AccountEntityContract();
                contract.setCreatedDate(new Date());
                mapper.map(f, contract);
                request.getAccountEntities().add(contract);

            }

            addToSearchQueue(request);

            return resultList;
        }

    }

    @Transactional
    public List<AccountEntity> update(List<AccountEntity> accountEntities, RequestInfo requestInfo) {

        ModelMapper mapper = new ModelMapper();
        AccountEntityContract contract;

        if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
                && persistThroughKafka.equalsIgnoreCase("yes")) {

            AccountEntityRequest request = new AccountEntityRequest();
            request.setRequestInfo(requestInfo);
            request.setAccountEntities(new ArrayList<>());

            for (AccountEntity f : accountEntities) {

                contract = new AccountEntityContract();
                contract.setCreatedDate(new Date());
                mapper.map(f, contract);
                request.getAccountEntities().add(contract);

            }

            addToQue(request);

            return accountEntities;
        } else {

            List<AccountEntity> resultList = new ArrayList<AccountEntity>();

            for (AccountEntity f : accountEntities) {

                resultList.add(update(f));
            }

            AccountEntityRequest request = new AccountEntityRequest();
            request.setRequestInfo(requestInfo);
            request.setAccountEntities(new ArrayList<>());

            for (AccountEntity f : resultList) {

                contract = new AccountEntityContract();
                contract.setCreatedDate(new Date());
                mapper.map(f, contract);
                request.getAccountEntities().add(contract);

            }

            addToSearchQueue(request);

            return resultList;
        }

    }


    public void addToQue(AccountEntityRequest request) {
        Map<String, Object> message = new HashMap<>();

        if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
            message.put("accountentity_create", request);
        } else {
            message.put("accountentity_update", request);
        }
        accountEntityQueueRepository.add(message);
    }

    public void addToSearchQueue(AccountEntityRequest request) {
        Map<String, Object> message = new HashMap<>();

        message.put("accountentity_persisted", request);

        accountEntityQueueRepository.addToSearch(message);
    }

    public AccountEntity findById(AccountEntity accountEntity) {
        AccountEntityEntity entity = accountEntityJdbcRepository
                .findById(new AccountEntityEntity().toEntity(accountEntity));
        return entity.toDomain();

    }

    public String getNextSequence() {
        return accountEntityJdbcRepository.getSequence(AccountEntityEntity.SEQUENCE_NAME);
    }

    @Transactional
    public AccountEntity save(AccountEntity accountEntity) {
        AccountEntityEntity entity = accountEntityJdbcRepository
                .create(new AccountEntityEntity().toEntity(accountEntity));
        return entity.toDomain();
    }

    @Transactional
    public AccountEntity update(AccountEntity accountEntity) {
        AccountEntityEntity entity = accountEntityJdbcRepository
                .update(new AccountEntityEntity().toEntity(accountEntity));
        return entity.toDomain();
    }

    public void add(AccountEntityRequest request) {
        Map<String, Object> message = new HashMap<>();

        if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
            message.put("accountentity_create", request);
        } else {
            message.put("accountentity_update", request);
        }
        accountEntityQueueRepository.add(message);
    }

    public Pagination<AccountEntity> search(AccountEntitySearch domain) {

        if (!financialConfigurationService.fetchDataFrom().isEmpty()
                && financialConfigurationService.fetchDataFrom().equalsIgnoreCase("es")) {
            AccountEntitySearchContract accountEntitySearchContract = new AccountEntitySearchContract();
            ModelMapper mapper = new ModelMapper();
            mapper.map(domain, accountEntitySearchContract);
            return accountEntityESRepository.search(accountEntitySearchContract);
        } else {
            return accountEntityJdbcRepository.search(domain);
        }

    }

    public boolean uniqueCheck(String fieldName, AccountEntity accountEntity) {
        return accountEntityJdbcRepository.uniqueCheck(fieldName, new AccountEntityEntity().toEntity(accountEntity));
    }

}