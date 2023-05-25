package org.egov.egf.master.domain.repository;

import java.util.HashMap;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.FinancialStatus;
import org.egov.egf.master.domain.model.FinancialStatusSearch;
import org.egov.egf.master.persistence.entity.FinancialStatusEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.FinancialStatusJdbcRepository;
import org.egov.egf.master.web.requests.FinancialStatusRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FinancialStatusRepository {

	@Autowired
	private FinancialStatusJdbcRepository financialStatusJdbcRepository;
	@Autowired
	private MastersQueueRepository financialStatusQueueRepository;

	public FinancialStatus findById(FinancialStatus financialStatus) {
		FinancialStatusEntity entity = financialStatusJdbcRepository
				.findById(new FinancialStatusEntity().toEntity(financialStatus));
		return entity.toDomain();

	}

	@Transactional
	public FinancialStatus save(FinancialStatus financialStatus) {
		FinancialStatusEntity entity = financialStatusJdbcRepository
				.create(new FinancialStatusEntity().toEntity(financialStatus));
		return entity.toDomain();
	}

	@Transactional
	public FinancialStatus update(FinancialStatus financialStatus) {
		FinancialStatusEntity entity = financialStatusJdbcRepository
				.update(new FinancialStatusEntity().toEntity(financialStatus));
		return entity.toDomain();
	}

	public void add(FinancialStatusRequest request) {
		Map<String, Object> message = new HashMap<>();

		if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
			message.put("financialstatus_create", request);
		} else {
			message.put("financialstatus_update", request);
		}
		financialStatusQueueRepository.add(message);
	}

	public Pagination<FinancialStatus> search(FinancialStatusSearch domain) {

		return financialStatusJdbcRepository.search(domain);

	}

    public boolean uniqueCheck(String fieldName, FinancialStatus financialStatus) {
        return financialStatusJdbcRepository.uniqueCheck(fieldName, new FinancialStatusEntity().toEntity(financialStatus));
    }

}