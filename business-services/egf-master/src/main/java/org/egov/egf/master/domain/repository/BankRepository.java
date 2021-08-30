package org.egov.egf.master.domain.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.Bank;
import org.egov.egf.master.domain.model.BankSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.BankEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.BankJdbcRepository;
import org.egov.egf.master.web.contract.BankContract;
import org.egov.egf.master.web.contract.BankSearchContract;
import org.egov.egf.master.web.requests.BankRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BankRepository {

	@Autowired
	private BankJdbcRepository bankJdbcRepository;
	@Autowired
	private MastersQueueRepository bankQueueRepository;

	@Autowired
	private FinancialConfigurationService financialConfigurationService;

	@Autowired
	private BankESRepository bankESRepository;

	private String persistThroughKafka;

	@Autowired
	public BankRepository(BankJdbcRepository bankJdbcRepository, MastersQueueRepository bankQueueRepository,
			FinancialConfigurationService financialConfigurationService, BankESRepository bankESRepository,
			@Value("${persist.through.kafka}") String persistThroughKafka) {
		this.bankJdbcRepository = bankJdbcRepository;
		this.bankQueueRepository = bankQueueRepository;
		this.financialConfigurationService = financialConfigurationService;
		this.bankESRepository = bankESRepository;
		this.persistThroughKafka = persistThroughKafka;

	}

	public Bank findById(Bank bank) {
		BankEntity entity = bankJdbcRepository.findById(new BankEntity().toEntity(bank));
		return entity.toDomain();

	}

	public String getNextSequence() {
		return bankJdbcRepository.getSequence(BankEntity.SEQUENCE_NAME);
	}

	@Transactional
	public Bank save(Bank bank) {
		BankEntity entity = bankJdbcRepository.create(new BankEntity().toEntity(bank));
		return entity.toDomain();
	}

	@Transactional
	public Bank update(Bank bank) {
		BankEntity entity = bankJdbcRepository.update(new BankEntity().toEntity(bank));
		return entity.toDomain();
	}

	public void add(BankRequest request) {
		Map<String, Object> message = new HashMap<>();

		if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
			message.put("bank_create", request);
		} else {
			message.put("bank_update", request);
		}
		bankQueueRepository.add(message);
	}

	public Pagination<Bank> search(BankSearch domain) {

		if (!financialConfigurationService.fetchDataFrom().isEmpty()
				&& financialConfigurationService.fetchDataFrom().equalsIgnoreCase("es")) {
			BankSearchContract bankSearchContract = new BankSearchContract();
			ModelMapper mapper = new ModelMapper();
			mapper.map(domain, bankSearchContract);
			return bankESRepository.search(bankSearchContract);
		} else {
			return bankJdbcRepository.search(domain);
		}
	}

	@Transactional
	public List<Bank> save(List<Bank> banks, RequestInfo requestInfo) {

		ModelMapper mapper = new ModelMapper();
		BankContract contract;

		if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
				&& "yes".equalsIgnoreCase(persistThroughKafka)) {

			BankRequest request = new BankRequest();
			request.setRequestInfo(requestInfo);
			request.setBanks(new ArrayList<>());

			for (Bank b : banks) {

				contract = new BankContract();
				contract.setCreatedDate(new Date());
				mapper.map(b, contract);
				request.getBanks().add(contract);

			}

			addToQue(request);

			return banks;
		} else {

			List<Bank> resultList = new ArrayList<>();

			for (Bank b : banks) {

				resultList.add(save(b));
			}

			BankRequest request = new BankRequest();
			request.setRequestInfo(requestInfo);
			request.setBanks(new ArrayList<>());

			for (Bank b : resultList) {

				contract = new BankContract();
				contract.setCreatedDate(new Date());
				mapper.map(b, contract);
				request.getBanks().add(contract);

			}

			addToSearchQueue(request);

			return resultList;
		}

	}

	@Transactional
	public List<Bank> update(List<Bank> banks, RequestInfo requestInfo) {

		ModelMapper mapper = new ModelMapper();
		BankContract contract;

		if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
				&& "yes".equalsIgnoreCase(persistThroughKafka)) {

			BankRequest request = new BankRequest();
			request.setRequestInfo(requestInfo);
			request.setBanks(new ArrayList<>());

			for (Bank b : banks) {

				contract = new BankContract();
				contract.setCreatedDate(new Date());
				mapper.map(b, contract);
				request.getBanks().add(contract);

			}

			addToQue(request);

			return banks;
		} else {

			List<Bank> resultList = new ArrayList<>();

			for (Bank b : banks) {

				resultList.add(update(b));
			}

			BankRequest request = new BankRequest();
			request.setRequestInfo(requestInfo);
			request.setBanks(new ArrayList<>());

			for (Bank b : resultList) {

				contract = new BankContract();
				contract.setCreatedDate(new Date());
				mapper.map(b, contract);
				request.getBanks().add(contract);

			}

			addToSearchQueue(request);

			return resultList;
		}

	}

	public void addToQue(BankRequest request) {
		Map<String, Object> message = new HashMap<>();

		if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
			message.put("bank_create", request);
		} else {
			message.put("bank_update", request);
		}
		bankQueueRepository.add(message);
	}

	public void addToSearchQueue(BankRequest request) {
		Map<String, Object> message = new HashMap<>();

		message.put("bank_persisted", request);

		bankQueueRepository.addToSearch(message);
	}

    public boolean uniqueCheck(String fieldName, Bank bank) {
        return bankJdbcRepository.uniqueCheck(fieldName, new BankEntity().toEntity(bank));
    }

}