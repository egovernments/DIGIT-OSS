package org.egov.egf.master.domain.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.annotation.Unique;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.AccountCodePurpose;
import org.egov.egf.master.domain.model.AccountCodePurposeSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.AccountCodePurposeEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.AccountCodePurposeJdbcRepository;
import org.egov.egf.master.web.contract.AccountCodePurposeContract;
import org.egov.egf.master.web.contract.AccountCodePurposeSearchContract;
import org.egov.egf.master.web.requests.AccountCodePurposeRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountCodePurposeRepository {

	@Autowired
	private AccountCodePurposeJdbcRepository accountCodePurposeJdbcRepository;
	@Autowired
	private MastersQueueRepository accountCodePurposeQueueRepository;

	@Autowired
	private FinancialConfigurationService financialConfigurationService;

	@Autowired
	private AccountCodePurposeESRepository accountCodePurposeESRepository;

	private String persistThroughKafka;

	@Autowired
	public AccountCodePurposeRepository(AccountCodePurposeJdbcRepository accountCodePurposeJdbcRepository,
			MastersQueueRepository accountCodePurposeQueueRepository,
			FinancialConfigurationService financialConfigurationService,
			AccountCodePurposeESRepository accountCodePurposeESRepository,
			@Value("${persist.through.kafka}") String persistThroughKafka) {
		this.accountCodePurposeJdbcRepository = accountCodePurposeJdbcRepository;
		this.accountCodePurposeQueueRepository = accountCodePurposeQueueRepository;
		this.financialConfigurationService = financialConfigurationService;
		this.accountCodePurposeESRepository = accountCodePurposeESRepository;
		this.persistThroughKafka = persistThroughKafka;

	}

	public AccountCodePurpose findById(AccountCodePurpose accountCodePurpose) {
		AccountCodePurposeEntity entity = accountCodePurposeJdbcRepository
				.findById(new AccountCodePurposeEntity().toEntity(accountCodePurpose));
		return entity.toDomain();

	}

	public String getNextSequence() {
		return accountCodePurposeJdbcRepository.getSequence(AccountCodePurposeEntity.SEQUENCE_NAME);
	}

	@Transactional
	public AccountCodePurpose save(AccountCodePurpose accountCodePurpose) {
		AccountCodePurposeEntity entity = accountCodePurposeJdbcRepository
				.create(new AccountCodePurposeEntity().toEntity(accountCodePurpose));
		return entity.toDomain();
	}

	@Transactional
	public AccountCodePurpose update(AccountCodePurpose accountCodePurpose) {
		AccountCodePurposeEntity entity = accountCodePurposeJdbcRepository
				.update(new AccountCodePurposeEntity().toEntity(accountCodePurpose));
		return entity.toDomain();
	}

	@Transactional
	public List<AccountCodePurpose> save(List<AccountCodePurpose> accountCodePurposes, RequestInfo requestInfo) {

		ModelMapper mapper = new ModelMapper();
		AccountCodePurposeContract contract;

		if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
				&& persistThroughKafka.equalsIgnoreCase("yes")) {

			AccountCodePurposeRequest request = new AccountCodePurposeRequest();
			request.setRequestInfo(requestInfo);
			request.setAccountCodePurposes(new ArrayList<>());

			for (AccountCodePurpose account : accountCodePurposes) {

				contract = new AccountCodePurposeContract();
				contract.setCreatedDate(new Date());
				mapper.map(account, contract);
				request.getAccountCodePurposes().add(contract);

			}

			addToQue(request);

			return accountCodePurposes;
		} else {

			List<AccountCodePurpose> resultList = new ArrayList<>();

			for (AccountCodePurpose account : accountCodePurposes) {

				resultList.add(save(account));
			}

			AccountCodePurposeRequest request = new AccountCodePurposeRequest();
			request.setRequestInfo(requestInfo);
			request.setAccountCodePurposes(new ArrayList<>());

			for (AccountCodePurpose account : resultList) {

				contract = new AccountCodePurposeContract();
				contract.setCreatedDate(new Date());
				mapper.map(account, contract);
				request.getAccountCodePurposes().add(contract);

			}

			addToSearchQueue(request);

			return resultList;
		}

	}

	@Transactional
	public List<AccountCodePurpose> update(List<AccountCodePurpose> accountCodePurposes, RequestInfo requestInfo) {

		ModelMapper mapper = new ModelMapper();
		AccountCodePurposeContract contract;

		if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
				&& persistThroughKafka.equalsIgnoreCase("yes")) {

			AccountCodePurposeRequest request = new AccountCodePurposeRequest();
			request.setRequestInfo(requestInfo);
			request.setAccountCodePurposes(new ArrayList<>());

			for (AccountCodePurpose account : accountCodePurposes) {

				contract = new AccountCodePurposeContract();
				contract.setCreatedDate(new Date());
				mapper.map(account, contract);
				request.getAccountCodePurposes().add(contract);

			}

			addToQue(request);

			return accountCodePurposes;
		} else {

			List<AccountCodePurpose> resultList = new ArrayList<AccountCodePurpose>();

			for (AccountCodePurpose account : accountCodePurposes) {

				resultList.add(update(account));
			}

			AccountCodePurposeRequest request = new AccountCodePurposeRequest();
			request.setRequestInfo(requestInfo);
			request.setAccountCodePurposes(new ArrayList<>());

			for (AccountCodePurpose account : resultList) {

				contract = new AccountCodePurposeContract();
				contract.setCreatedDate(new Date());
				mapper.map(account, contract);
				request.getAccountCodePurposes().add(contract);

			}

			addToSearchQueue(request);

			return resultList;
		}

	}

	public void add(AccountCodePurposeRequest request) {
		Map<String, Object> message = new HashMap<>();

		if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
			message.put("accountcodepurpose_create", request);
		} else {
			message.put("accountcodepurpose_update", request);
		}
		accountCodePurposeQueueRepository.add(message);
	}

	public Pagination<AccountCodePurpose> search(AccountCodePurposeSearch domain) {
		if (!financialConfigurationService.fetchDataFrom().isEmpty()
				&& financialConfigurationService.fetchDataFrom().equalsIgnoreCase("es")) {
			AccountCodePurposeSearchContract accountCodePurposeSearchContract = new AccountCodePurposeSearchContract();
			ModelMapper mapper = new ModelMapper();
			mapper.map(domain, accountCodePurposeSearchContract);
			return accountCodePurposeESRepository.search(accountCodePurposeSearchContract);
		} else {
			return accountCodePurposeJdbcRepository.search(domain);
		}

	}

	public void uniqueCheck(AccountCodePurpose accountCodePurpose) {
		if (accountCodePurpose.getClass().isAnnotationPresent(Unique.class) == true) {
		}
	}

	public Boolean uniqueCheck(String fieldName, AccountCodePurpose accountCodePurpose) {
		return accountCodePurposeJdbcRepository.uniqueCheck(fieldName,
				new AccountCodePurposeEntity().toEntity(accountCodePurpose));
	}

	public void addToQue(AccountCodePurposeRequest request) {
		Map<String, Object> message = new HashMap<>();

		if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
			message.put("accountcodepurpose_create", request);
		} else {
			message.put("accountcodepurpose_update", request);
		}
		accountCodePurposeQueueRepository.add(message);
	}

	public void addToSearchQueue(AccountCodePurposeRequest request) {
		Map<String, Object> message = new HashMap<>();

		message.put("accountcodepurpose_persisted", request);

		accountCodePurposeQueueRepository.addToSearch(message);
	}
}