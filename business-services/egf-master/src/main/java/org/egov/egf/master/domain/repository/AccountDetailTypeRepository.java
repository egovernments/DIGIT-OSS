package org.egov.egf.master.domain.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.AccountDetailTypeSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.AccountDetailTypeEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.AccountDetailTypeJdbcRepository;
import org.egov.egf.master.web.contract.AccountDetailTypeContract;
import org.egov.egf.master.web.contract.AccountDetailTypeSearchContract;
import org.egov.egf.master.web.requests.AccountDetailTypeRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountDetailTypeRepository {

	@Autowired
	private AccountDetailTypeJdbcRepository accountDetailTypeJdbcRepository;
	@Autowired
	private MastersQueueRepository accountDetailTypeQueueRepository;

	@Autowired
	private FinancialConfigurationService financialConfigurationService;

	@Autowired
	private AccountDetailTypeESRepository accountDetailTypeESRepository;
	private String persistThroughKafka;

	@Autowired
	public AccountDetailTypeRepository(AccountDetailTypeJdbcRepository accountDetailTypeJdbcRepository,
			MastersQueueRepository accountDetailTypeQueueRepository,
			FinancialConfigurationService financialConfigurationService,
			AccountDetailTypeESRepository accountDetailTypeESRepository,
			@Value("${persist.through.kafka}") String persistThroughKafka) {
		this.accountDetailTypeJdbcRepository = accountDetailTypeJdbcRepository;
		this.accountDetailTypeQueueRepository = accountDetailTypeQueueRepository;
		this.financialConfigurationService = financialConfigurationService;
		this.accountDetailTypeESRepository = accountDetailTypeESRepository;
		this.persistThroughKafka = persistThroughKafka;

	}

	@Transactional
	public List<AccountDetailType> save(List<AccountDetailType> accountDetailTypes, RequestInfo requestInfo) {

		ModelMapper mapper = new ModelMapper();
		AccountDetailTypeContract contract;

		if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
				&& persistThroughKafka.equalsIgnoreCase("yes")) {

			AccountDetailTypeRequest request = new AccountDetailTypeRequest();
			request.setRequestInfo(requestInfo);
			request.setAccountDetailTypes(new ArrayList<>());

			for (AccountDetailType f : accountDetailTypes) {

				contract = new AccountDetailTypeContract();
				contract.setCreatedDate(new Date());
				mapper.map(f, contract);
				request.getAccountDetailTypes().add(contract);

			}

			addToQue(request);

			return accountDetailTypes;
		} else {

			List<AccountDetailType> resultList = new ArrayList<>();

			for (AccountDetailType f : accountDetailTypes) {

				resultList.add(save(f));
			}

			AccountDetailTypeRequest request = new AccountDetailTypeRequest();
			request.setRequestInfo(requestInfo);
			request.setAccountDetailTypes(new ArrayList<>());

			for (AccountDetailType f : resultList) {

				contract = new AccountDetailTypeContract();
				contract.setCreatedDate(new Date());
				mapper.map(f, contract);
				request.getAccountDetailTypes().add(contract);

			}

			addToSearchQueue(request);

			return resultList;
		}

	}

	@Transactional
	public List<AccountDetailType> update(List<AccountDetailType> accountDetailTypes, RequestInfo requestInfo) {

		ModelMapper mapper = new ModelMapper();
		AccountDetailTypeContract contract;

		if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
				&& persistThroughKafka.equalsIgnoreCase("yes")) {

			AccountDetailTypeRequest request = new AccountDetailTypeRequest();
			request.setRequestInfo(requestInfo);
			request.setAccountDetailTypes(new ArrayList<>());

			for (AccountDetailType f : accountDetailTypes) {

				contract = new AccountDetailTypeContract();
				contract.setCreatedDate(new Date());
				mapper.map(f, contract);
				request.getAccountDetailTypes().add(contract);

			}

			addToQue(request);

			return accountDetailTypes;
		} else {

			List<AccountDetailType> resultList = new ArrayList<AccountDetailType>();

			for (AccountDetailType f : accountDetailTypes) {

				resultList.add(update(f));
			}

			AccountDetailTypeRequest request = new AccountDetailTypeRequest();
			request.setRequestInfo(requestInfo);
			request.setAccountDetailTypes(new ArrayList<>());

			for (AccountDetailType f : resultList) {

				contract = new AccountDetailTypeContract();
				contract.setCreatedDate(new Date());
				mapper.map(f, contract);
				request.getAccountDetailTypes().add(contract);

			}

			addToSearchQueue(request);

			return resultList;
		}

	}

	public AccountDetailType findById(AccountDetailType accountDetailType) {
		AccountDetailTypeEntity entity = accountDetailTypeJdbcRepository
				.findById(new AccountDetailTypeEntity().toEntity(accountDetailType));
		return entity.toDomain();

	}

	public String getNextSequence() {
		return accountDetailTypeJdbcRepository.getSequence(AccountDetailTypeEntity.SEQUENCE_NAME);
	}

	@Transactional
	public AccountDetailType save(AccountDetailType accountDetailType) {
		AccountDetailTypeEntity entity = accountDetailTypeJdbcRepository
				.create(new AccountDetailTypeEntity().toEntity(accountDetailType));
		return entity.toDomain();
	}

	@Transactional
	public AccountDetailType update(AccountDetailType accountDetailType) {
		AccountDetailTypeEntity entity = accountDetailTypeJdbcRepository
				.update(new AccountDetailTypeEntity().toEntity(accountDetailType));
		return entity.toDomain();
	}

	public void add(AccountDetailTypeRequest request) {
		Map<String, Object> message = new HashMap<>();

		if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
			message.put("accountdetailtype_create", request);
		} else {
			message.put("accountdetailtype_update", request);
		}
		accountDetailTypeQueueRepository.add(message);
	}

	public Pagination<AccountDetailType> search(AccountDetailTypeSearch domain) {
		if (!financialConfigurationService.fetchDataFrom().isEmpty()
				&& financialConfigurationService.fetchDataFrom().equalsIgnoreCase("es")) {
			AccountDetailTypeSearchContract accountCodeTypeSearchContract = new AccountDetailTypeSearchContract();
			ModelMapper mapper = new ModelMapper();
			mapper.map(domain, accountCodeTypeSearchContract);
			return accountDetailTypeESRepository.search(accountCodeTypeSearchContract);
		} else {
			return accountDetailTypeJdbcRepository.search(domain);
		}

	}

	public void addToQue(AccountDetailTypeRequest request) {
		Map<String, Object> message = new HashMap<>();

		if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
			message.put("accountdetailtype_create", request);
		} else {
			message.put("accountdetailtype_update", request);
		}
		accountDetailTypeQueueRepository.add(message);
	}

	public void addToSearchQueue(AccountDetailTypeRequest request) {
		Map<String, Object> message = new HashMap<>();

		message.put("accountdetailtype_persisted", request);

		accountDetailTypeQueueRepository.addToSearch(message);
	}

	public boolean uniqueCheck(String fieldName, AccountDetailType accountDetailType) {
		return accountDetailTypeJdbcRepository.uniqueCheck(fieldName,
				new AccountDetailTypeEntity().toEntity(accountDetailType));
	}

}