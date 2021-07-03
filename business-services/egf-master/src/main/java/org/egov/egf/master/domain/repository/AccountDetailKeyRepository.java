package org.egov.egf.master.domain.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.AccountDetailKey;
import org.egov.egf.master.domain.model.AccountDetailKeySearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.AccountDetailKeyEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.AccountDetailKeyJdbcRepository;
import org.egov.egf.master.web.contract.AccountDetailKeyContract;
import org.egov.egf.master.web.contract.AccountDetailKeySearchContract;
import org.egov.egf.master.web.requests.AccountDetailKeyRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountDetailKeyRepository {

	@Autowired
	private AccountDetailKeyJdbcRepository accountDetailKeyJdbcRepository;
	@Autowired
	private MastersQueueRepository accountDetailKeyQueueRepository;

	@Autowired
	private FinancialConfigurationService financialConfigurationService;

	@Autowired
	private AccountDetailKeyESRepository accountDetailKeyESRepository;

	private String persistThroughKafka;

	@Autowired
	public AccountDetailKeyRepository(AccountDetailKeyJdbcRepository accountDetailKeyJdbcRepository,
			MastersQueueRepository accountDetailKeyQueueRepository,
			FinancialConfigurationService financialConfigurationService,
			AccountDetailKeyESRepository accountDetailKeyESRepository,
			@Value("${persist.through.kafka}") String persistThroughKafka) {
		this.accountDetailKeyJdbcRepository = accountDetailKeyJdbcRepository;
		this.accountDetailKeyQueueRepository = accountDetailKeyQueueRepository;
		this.financialConfigurationService = financialConfigurationService;
		this.accountDetailKeyESRepository = accountDetailKeyESRepository;
		this.persistThroughKafka = persistThroughKafka;

	}

	@Transactional
	public List<AccountDetailKey> save(List<AccountDetailKey> accountDetailKies, RequestInfo requestInfo) {

		ModelMapper mapper = new ModelMapper();
		AccountDetailKeyContract contract;

		if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
				&& persistThroughKafka.equalsIgnoreCase("yes")) {

			AccountDetailKeyRequest request = new AccountDetailKeyRequest();
			request.setRequestInfo(requestInfo);
			request.setAccountDetailKeys(new ArrayList<>());

			for (AccountDetailKey f : accountDetailKies) {

				contract = new AccountDetailKeyContract();
				contract.setCreatedDate(new Date());
				mapper.map(f, contract);
				request.getAccountDetailKeys().add(contract);

			}

			addToQue(request);

			return accountDetailKies;
		} else {

			List<AccountDetailKey> resultList = new ArrayList<>();

			for (AccountDetailKey f : accountDetailKies) {

				resultList.add(save(f));
			}

			AccountDetailKeyRequest request = new AccountDetailKeyRequest();
			request.setRequestInfo(requestInfo);
			request.setAccountDetailKeys(new ArrayList<>());

			for (AccountDetailKey f : resultList) {

				contract = new AccountDetailKeyContract();
				contract.setCreatedDate(new Date());
				mapper.map(f, contract);
				request.getAccountDetailKeys().add(contract);

			}

			addToSearchQueue(request);

			return resultList;
		}

	}

	@Transactional
	public List<AccountDetailKey> update(List<AccountDetailKey> accountDetailKies, RequestInfo requestInfo) {

		ModelMapper mapper = new ModelMapper();
		AccountDetailKeyContract contract;

		if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
				&& persistThroughKafka.equalsIgnoreCase("yes")) {

			AccountDetailKeyRequest request = new AccountDetailKeyRequest();
			request.setRequestInfo(requestInfo);
			request.setAccountDetailKeys(new ArrayList<>());

			for (AccountDetailKey f : accountDetailKies) {

				contract = new AccountDetailKeyContract();
				contract.setCreatedDate(new Date());
				mapper.map(f, contract);
				request.getAccountDetailKeys().add(contract);

			}

			addToQue(request);

			return accountDetailKies;
		} else {

			List<AccountDetailKey> resultList = new ArrayList<>();

			for (AccountDetailKey f : accountDetailKies) {

				resultList.add(update(f));
			}

			AccountDetailKeyRequest request = new AccountDetailKeyRequest();
			request.setRequestInfo(requestInfo);
			request.setAccountDetailKeys(new ArrayList<>());

			for (AccountDetailKey f : resultList) {

				contract = new AccountDetailKeyContract();
				contract.setCreatedDate(new Date());
				mapper.map(f, contract);
				request.getAccountDetailKeys().add(contract);

			}

			addToSearchQueue(request);

			return resultList;
		}

	}

	public void addToQue(AccountDetailKeyRequest request) {
		Map<String, Object> message = new HashMap<>();

		if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
			message.put("accountdetailkey_create", request);
		} else {
			message.put("accountdetailkey_update", request);
		}
		accountDetailKeyQueueRepository.add(message);
	}

	public void addToSearchQueue(AccountDetailKeyRequest request) {
		Map<String, Object> message = new HashMap<>();

		message.put("accountdetailkey_persisted", request);

		accountDetailKeyQueueRepository.addToSearch(message);
	}

	public AccountDetailKey findById(AccountDetailKey accountDetailKey) {
		AccountDetailKeyEntity entity = accountDetailKeyJdbcRepository
				.findById(new AccountDetailKeyEntity().toEntity(accountDetailKey));
		return entity.toDomain();

	}

	public String getNextSequence() {
		return accountDetailKeyJdbcRepository.getSequence(AccountDetailKeyEntity.SEQUENCE_NAME);
	}

	@Transactional
	public AccountDetailKey save(AccountDetailKey accountDetailKey) {
		AccountDetailKeyEntity entity = accountDetailKeyJdbcRepository
				.create(new AccountDetailKeyEntity().toEntity(accountDetailKey));
		return entity.toDomain();
	}

	@Transactional
	public AccountDetailKey update(AccountDetailKey accountDetailKey) {
		AccountDetailKeyEntity entity = accountDetailKeyJdbcRepository
				.update(new AccountDetailKeyEntity().toEntity(accountDetailKey));
		return entity.toDomain();
	}

	public void add(AccountDetailKeyRequest request) {
		Map<String, Object> message = new HashMap<>();

		if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
			message.put("accountdetailkey_create", request);
		} else {
			message.put("accountdetailkey_update", request);
		}
		accountDetailKeyQueueRepository.add(message);
	}

	public Pagination<AccountDetailKey> search(final AccountDetailKeySearch domain) {

		if (!financialConfigurationService.fetchDataFrom().isEmpty()
				&& financialConfigurationService.fetchDataFrom().equalsIgnoreCase("es")) {
			final AccountDetailKeySearchContract accountDetailKeySearchContract = new AccountDetailKeySearchContract();
			final ModelMapper mapper = new ModelMapper();
			mapper.map(domain, accountDetailKeySearchContract);
			return accountDetailKeyESRepository.search(accountDetailKeySearchContract);
		} else
			return accountDetailKeyJdbcRepository.search(domain);

	}

	public boolean uniqueCheck(String fieldName, AccountDetailKey accountDetailKey) {
		return accountDetailKeyJdbcRepository.uniqueCheck(fieldName,
				new AccountDetailKeyEntity().toEntity(accountDetailKey));
	}

}