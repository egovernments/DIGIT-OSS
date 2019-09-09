package org.egov.egf.master.domain.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.Function;
import org.egov.egf.master.domain.model.FunctionSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.FunctionEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.FunctionJdbcRepository;
import org.egov.egf.master.web.contract.FunctionContract;
import org.egov.egf.master.web.contract.FunctionSearchContract;
import org.egov.egf.master.web.requests.FunctionRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FunctionRepository {

	private FunctionJdbcRepository functionJdbcRepository;

	private MastersQueueRepository functionQueueRepository;

	private FinancialConfigurationService financialConfigurationService;

	private FunctionESRepository functionESRepository;

	private String persistThroughKafka;

	@Autowired
	public FunctionRepository(FunctionJdbcRepository functionJdbcRepository,
			MastersQueueRepository functionQueueRepository, FinancialConfigurationService financialConfigurationService,
			FunctionESRepository functionESRepository, @Value("${persist.through.kafka}") String persistThroughKafka) {
		this.functionJdbcRepository = functionJdbcRepository;
		this.functionQueueRepository = functionQueueRepository;
		this.financialConfigurationService = financialConfigurationService;
		this.functionESRepository = functionESRepository;
		this.persistThroughKafka = persistThroughKafka;

	}

	@Transactional
	public List<Function> save(List<Function> functions, RequestInfo requestInfo) {

		ModelMapper mapper = new ModelMapper();
		FunctionContract contract;

		if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
				&& persistThroughKafka.equalsIgnoreCase("yes")) {

			FunctionRequest request = new FunctionRequest();
			request.setRequestInfo(requestInfo);
			request.setFunctions(new ArrayList<>());

			for (Function f : functions) {

				contract = new FunctionContract();
				contract.setCreatedDate(new Date());
				mapper.map(f, contract);
				request.getFunctions().add(contract);

			}

			addToQue(request);

			return functions;
		} else {

			List<Function> resultList = new ArrayList<Function>();

			for (Function f : functions) {

				resultList.add(save(f));
			}

			FunctionRequest request = new FunctionRequest();
			request.setRequestInfo(requestInfo);
			request.setFunctions(new ArrayList<>());

			for (Function f : resultList) {

				contract = new FunctionContract();
				contract.setCreatedDate(new Date());
				mapper.map(f, contract);
				request.getFunctions().add(contract);

			}

			addToSearchQueue(request);

			return resultList;
		}

	}

	@Transactional
	public List<Function> update(List<Function> functions, RequestInfo requestInfo) {

		ModelMapper mapper = new ModelMapper();
		FunctionContract contract;

		if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
				&& persistThroughKafka.equalsIgnoreCase("yes")) {

			FunctionRequest request = new FunctionRequest();
			request.setRequestInfo(requestInfo);
			request.setFunctions(new ArrayList<>());

			for (Function f : functions) {

				contract = new FunctionContract();
				contract.setCreatedDate(new Date());
				mapper.map(f, contract);
				request.getFunctions().add(contract);

			}

			addToQue(request);

			return functions;
		} else {

			List<Function> resultList = new ArrayList<Function>();

			for (Function f : functions) {

				resultList.add(update(f));
			}

			FunctionRequest request = new FunctionRequest();
			request.setRequestInfo(requestInfo);
			request.setFunctions(new ArrayList<>());

			for (Function f : resultList) {

				contract = new FunctionContract();
				contract.setCreatedDate(new Date());
				mapper.map(f, contract);
				request.getFunctions().add(contract);

			}

			addToSearchQueue(request);

			return resultList;
		}

	}

	public String getNextSequence() {
		return functionJdbcRepository.getSequence(FunctionEntity.SEQUENCE_NAME);
	}

	public Function findById(Function function) {
		FunctionEntity entity = functionJdbcRepository.findById(new FunctionEntity().toEntity(function));
		return entity.toDomain();

	}

	@Transactional
	public Function save(Function function) {
		FunctionEntity entity = functionJdbcRepository.create(new FunctionEntity().toEntity(function));
		return entity.toDomain();
	}

	@Transactional
	public Function update(Function function) {
		FunctionEntity entity = functionJdbcRepository.update(new FunctionEntity().toEntity(function));
		return entity.toDomain();
	}

	public void addToQue(FunctionRequest request) {
		Map<String, Object> message = new HashMap<>();

		if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
			message.put("function_create", request);
		} else {
			message.put("function_update", request);
		}
		functionQueueRepository.add(message);
	}

	public void addToSearchQueue(FunctionRequest request) {
		Map<String, Object> message = new HashMap<>();

		message.put("function_persisted", request);

		functionQueueRepository.addToSearch(message);
	}

	public Pagination<Function> search(FunctionSearch domain) {
		if (!financialConfigurationService.fetchDataFrom().isEmpty()
				&& financialConfigurationService.fetchDataFrom().equalsIgnoreCase("es")) {
			FunctionSearchContract functionSearchContract = new FunctionSearchContract();
			ModelMapper mapper = new ModelMapper();
			mapper.map(domain, functionSearchContract);
			return functionESRepository.search(functionSearchContract);
		} else {
			return functionJdbcRepository.search(domain);
		}

	}

    public boolean uniqueCheck(String fieldName, Function function) {
        return functionJdbcRepository.uniqueCheck(fieldName, new FunctionEntity().toEntity(function));
    }

}
