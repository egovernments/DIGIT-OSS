package org.egov.egf.master.domain.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.BankBranch;
import org.egov.egf.master.domain.model.BankBranchSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.BankBranchEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.BankBranchJdbcRepository;
import org.egov.egf.master.web.contract.BankBranchContract;
import org.egov.egf.master.web.contract.BankBranchSearchContract;
import org.egov.egf.master.web.requests.BankBranchRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BankBranchRepository {

	@Autowired
	private BankBranchJdbcRepository bankBranchJdbcRepository;

	@Autowired
	private MastersQueueRepository bankBranchQueueRepository;

	@Autowired
	private FinancialConfigurationService financialConfigurationService;

	@Autowired
	private BankBranchESRepository bankBranchESRepository;

	@Autowired
	public BankBranchRepository(BankBranchJdbcRepository bankBranchJdbcRepository,
			MastersQueueRepository bankBranchQueueRepository,
			FinancialConfigurationService financialConfigurationService, BankBranchESRepository bankBranchESRepository,
			@Value("${persist.through.kafka}") String persistThroughKafka) {
		this.bankBranchJdbcRepository = bankBranchJdbcRepository;
		this.bankBranchQueueRepository = bankBranchQueueRepository;
		this.financialConfigurationService = financialConfigurationService;
		this.bankBranchESRepository = bankBranchESRepository;
		this.persistThroughKafka = persistThroughKafka;

	}

	private String persistThroughKafka;

	public BankBranch findById(BankBranch bankBranch) {
		BankBranchEntity entity = bankBranchJdbcRepository.findById(new BankBranchEntity().toEntity(bankBranch));
		return entity.toDomain();

	}

	public String getNextSequence() {
		return bankBranchJdbcRepository.getSequence(BankBranchEntity.SEQUENCE_NAME);
	}

	@Transactional
	public List<BankBranch> save(List<BankBranch> bankBranches, RequestInfo requestInfo) {

		ModelMapper mapper = new ModelMapper();
		BankBranchContract contract;

		if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
				&& "yes".equalsIgnoreCase(persistThroughKafka)) {

			BankBranchRequest request = new BankBranchRequest();
			request.setRequestInfo(requestInfo);
			request.setBankBranches(new ArrayList<>());

			for (BankBranch b : bankBranches) {

				contract = new BankBranchContract();
				contract.setCreatedDate(new Date());
				mapper.map(b, contract);
				request.getBankBranches().add(contract);

			}

			addToQue(request);

			return bankBranches;
		} else {

			List<BankBranch> resultList = new ArrayList<>();

			for (BankBranch b : bankBranches) {

				resultList.add(save(b));
			}

			BankBranchRequest request = new BankBranchRequest();
			request.setRequestInfo(requestInfo);
			request.setBankBranches(new ArrayList<>());

			for (BankBranch b : resultList) {

				contract = new BankBranchContract();
				contract.setCreatedDate(new Date());
				mapper.map(b, contract);
				request.getBankBranches().add(contract);

			}

			addToSearchQueue(request);

			return resultList;
		}

	}

	@Transactional
	public List<BankBranch> update(List<BankBranch> bankBranches, RequestInfo requestInfo) {

		ModelMapper mapper = new ModelMapper();
		BankBranchContract contract;

		if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
				&& "yes".equalsIgnoreCase(persistThroughKafka)) {

			BankBranchRequest request = new BankBranchRequest();
			request.setRequestInfo(requestInfo);
			request.setBankBranches(new ArrayList<>());

			for (BankBranch b : bankBranches) {

				contract = new BankBranchContract();
				contract.setCreatedDate(new Date());
				mapper.map(b, contract);
				request.getBankBranches().add(contract);

			}

			addToQue(request);

			return bankBranches;
		} else {

			List<BankBranch> resultList = new ArrayList<>();

			for (BankBranch b : bankBranches) {

				resultList.add(update(b));
			}

			BankBranchRequest request = new BankBranchRequest();
			request.setRequestInfo(requestInfo);
			request.setBankBranches(new ArrayList<>());

			for (BankBranch b : resultList) {

				contract = new BankBranchContract();
				contract.setCreatedDate(new Date());
				mapper.map(b, contract);
				request.getBankBranches().add(contract);

			}

			addToSearchQueue(request);

			return resultList;
		}

	}

	@Transactional
	public BankBranch save(BankBranch bankBranch) {
		BankBranchEntity entity = bankBranchJdbcRepository.create(new BankBranchEntity().toEntity(bankBranch));
		return entity.toDomain();
	}

	@Transactional
	public BankBranch update(BankBranch bankBranch) {
		BankBranchEntity entity = bankBranchJdbcRepository.update(new BankBranchEntity().toEntity(bankBranch));
		return entity.toDomain();
	}

	public void add(BankBranchRequest request) {
		Map<String, Object> message = new HashMap<>();

		if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
			message.put("bankbranch_create", request);
		} else {
			message.put("bankbranch_update", request);
		}
		bankBranchQueueRepository.add(message);
	}

	public Pagination<BankBranch> search(BankBranchSearch domain) {

		if (!financialConfigurationService.fetchDataFrom().isEmpty()
				&& financialConfigurationService.fetchDataFrom().equalsIgnoreCase("es")) {
			BankBranchSearchContract bankBranchSearchContract = new BankBranchSearchContract();
			ModelMapper mapper = new ModelMapper();
			mapper.map(domain, bankBranchSearchContract);
			return bankBranchESRepository.search(bankBranchSearchContract);
		} else {
			return bankBranchJdbcRepository.search(domain);
		}

	}

	public void addToQue(BankBranchRequest request) {
		Map<String, Object> message = new HashMap<>();

		if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
			message.put("bankbranch_create", request);
		} else {
			message.put("bankbranch_update", request);
		}
		bankBranchQueueRepository.add(message);
	}

	public void addToSearchQueue(BankBranchRequest request) {
		Map<String, Object> message = new HashMap<>();

		message.put("bankbranch_persisted", request);

		bankBranchQueueRepository.addToSearch(message);
	}

    public boolean uniqueCheck(String fieldName, BankBranch bankBranch) {
        return bankBranchJdbcRepository.uniqueCheck(fieldName, new BankBranchEntity().toEntity(bankBranch));
    }

}