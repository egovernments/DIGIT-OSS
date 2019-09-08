package org.egov.egf.master.domain.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.BankAccount;
import org.egov.egf.master.domain.model.BankAccountSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.BankAccountEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.BankAccountJdbcRepository;
import org.egov.egf.master.web.contract.BankAccountContract;
import org.egov.egf.master.web.contract.BankAccountSearchContract;
import org.egov.egf.master.web.requests.BankAccountRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BankAccountRepository {

	@Autowired
	private BankAccountJdbcRepository bankAccountJdbcRepository;

	@Autowired
	private MastersQueueRepository bankAccountQueueRepository;

	@Autowired
	private FinancialConfigurationService financialConfigurationService;

	@Autowired
	private BankAccountESRepository bankAccountESRepository;

	private String persistThroughKafka;

	@Autowired
	public BankAccountRepository(BankAccountJdbcRepository bankAccountJdbcRepository,
			MastersQueueRepository bankAccountQueueRepository,
			FinancialConfigurationService financialConfigurationService,
			BankAccountESRepository bankAccountESRepository,
			@Value("${persist.through.kafka}") String persistThroughKafka) {
		this.bankAccountJdbcRepository = bankAccountJdbcRepository;
		this.bankAccountQueueRepository = bankAccountQueueRepository;
		this.financialConfigurationService = financialConfigurationService;
		this.bankAccountESRepository = bankAccountESRepository;
		this.persistThroughKafka = persistThroughKafka;

	}

	public BankAccount findById(BankAccount bankAccount) {
		BankAccountEntity entity = bankAccountJdbcRepository.findById(new BankAccountEntity().toEntity(bankAccount));
		return entity.toDomain();

	}

	public String getNextSequence() {
		return bankAccountJdbcRepository.getSequence(BankAccountEntity.SEQUENCE_NAME);
	}

	@Transactional
	public BankAccount save(BankAccount bankAccount) {
		BankAccountEntity entity = bankAccountJdbcRepository.create(new BankAccountEntity().toEntity(bankAccount));
		return entity.toDomain();
	}

	@Transactional
	public BankAccount update(BankAccount bankAccount) {
		BankAccountEntity entity = bankAccountJdbcRepository.update(new BankAccountEntity().toEntity(bankAccount));
		return entity.toDomain();
	}

	public boolean uniqueCheck(String fieldName, BankAccount bankAccount) {
		return bankAccountJdbcRepository.uniqueCheck(fieldName, new BankAccountEntity().toEntity(bankAccount));
	}

	public void add(BankAccountRequest request) {
		Map<String, Object> message = new HashMap<>();
		if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
			message.put("bankaccount_create", request);
		} else {
			message.put("bankaccount_update", request);
		}
		bankAccountQueueRepository.add(message);
	}

	public Pagination<BankAccount> search(BankAccountSearch domain) {

		if (!financialConfigurationService.fetchDataFrom().isEmpty()
				&& financialConfigurationService.fetchDataFrom().equalsIgnoreCase("es")) {
			BankAccountSearchContract bankAccountSearchContract = new BankAccountSearchContract();
			ModelMapper mapper = new ModelMapper();
			mapper.map(domain, bankAccountSearchContract);
			return bankAccountESRepository.search(bankAccountSearchContract);
		} else {
			return bankAccountJdbcRepository.search(domain);
		}

	}

	@Transactional
	public List<BankAccount> save(List<BankAccount> bankAccounts, RequestInfo requestInfo) {

		ModelMapper mapper = new ModelMapper();
		BankAccountContract contract;

		if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
				&& "yes".equalsIgnoreCase(persistThroughKafka)) {

			BankAccountRequest request = new BankAccountRequest();
			request.setRequestInfo(requestInfo);
			request.setBankAccounts(new ArrayList<>());

			for (BankAccount b : bankAccounts) {

				contract = new BankAccountContract();
				contract.setCreatedDate(new Date());
				mapper.map(b, contract);
				request.getBankAccounts().add(contract);

			}

			addToQue(request);

			return bankAccounts;
		} else {

			List<BankAccount> resultList = new ArrayList<>();

			for (BankAccount b : bankAccounts) {

				resultList.add(save(b));
			}

			BankAccountRequest request = new BankAccountRequest();
			request.setRequestInfo(requestInfo);
			request.setBankAccounts(new ArrayList<>());

			for (BankAccount b : resultList) {

				contract = new BankAccountContract();
				contract.setCreatedDate(new Date());
				mapper.map(b, contract);
				request.getBankAccounts().add(contract);

			}

			addToSearchQueue(request);

			return resultList;
		}

	}

	@Transactional
	public List<BankAccount> update(List<BankAccount> bankAccounts, RequestInfo requestInfo) {

		ModelMapper mapper = new ModelMapper();
		BankAccountContract contract;

		if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
				&& "yes".equalsIgnoreCase(persistThroughKafka)) {

			BankAccountRequest request = new BankAccountRequest();
			request.setRequestInfo(requestInfo);
			request.setBankAccounts(new ArrayList<>());

			for (BankAccount b : bankAccounts) {

				contract = new BankAccountContract();
				contract.setCreatedDate(new Date());
				mapper.map(b, contract);
				request.getBankAccounts().add(contract);

			}

			addToQue(request);

			return bankAccounts;
		} else {

			List<BankAccount> resultList = new ArrayList<>();

			for (BankAccount b : bankAccounts) {

				resultList.add(update(b));
			}

			BankAccountRequest request = new BankAccountRequest();
			request.setRequestInfo(requestInfo);
			request.setBankAccounts(new ArrayList<>());

			for (BankAccount b : resultList) {

				contract = new BankAccountContract();
				contract.setCreatedDate(new Date());
				mapper.map(b, contract);
				request.getBankAccounts().add(contract);

			}

			addToSearchQueue(request);

			return resultList;
		}

	}

	public void addToQue(BankAccountRequest request) {
		Map<String, Object> message = new HashMap<>();

		if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
			message.put("bankaccount_create", request);
		} else {
			message.put("bankaccount_update", request);
		}
		bankAccountQueueRepository.add(message);
	}

	public void addToSearchQueue(BankAccountRequest request) {
		Map<String, Object> message = new HashMap<>();

		message.put("bankaccount_persisted", request);

		bankAccountQueueRepository.addToSearch(message);
	}
}