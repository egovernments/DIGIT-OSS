package org.egov.egf.master.domain.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.egov.common.constants.Constants;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.ChartOfAccountSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.ChartOfAccountEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.ChartOfAccountJdbcRepository;
import org.egov.egf.master.web.contract.ChartOfAccountSearchContract;
import org.egov.egf.master.web.requests.ChartOfAccountRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChartOfAccountRepository {

	@Autowired
	private ChartOfAccountJdbcRepository chartOfAccountJdbcRepository;
	
	@Autowired
	private MastersQueueRepository chartOfAccountQueueRepository;
	
	@Autowired
	private FinancialConfigurationService financialConfigurationService;
	
	@Autowired
	private ChartOfAccountESRepository chartOfAccountESRepository;

	public ChartOfAccount findById(ChartOfAccount chartOfAccount) {
		ChartOfAccountEntity entity = chartOfAccountJdbcRepository
				.findById(new ChartOfAccountEntity().toEntity(chartOfAccount));
		return entity.toDomain();

	}
	
	    public String getNextSequence(){
	        return chartOfAccountJdbcRepository.getSequence(ChartOfAccountEntity.SEQUENCE_NAME);
	    }

	@Transactional
	public ChartOfAccount save(ChartOfAccount chartOfAccount) {
		ChartOfAccountEntity entity = chartOfAccountJdbcRepository
				.create(new ChartOfAccountEntity().toEntity(chartOfAccount));
		return entity.toDomain();
	}

	@Transactional
	public ChartOfAccount update(ChartOfAccount chartOfAccount) {
		ChartOfAccountEntity entity = chartOfAccountJdbcRepository
				.update(new ChartOfAccountEntity().toEntity(chartOfAccount));
		return entity.toDomain();
	}

	public void add(ChartOfAccountRequest request) {
		Map<String, Object> message = new HashMap<>();

		if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
			message.put("chartofaccount_create", request);
		} else {
			message.put("chartofaccount_update", request);
		}
		chartOfAccountQueueRepository.add(message);
	}

	public Pagination<ChartOfAccount> search(ChartOfAccountSearch domain) {

		Set<ChartOfAccount> chartOfAccountSet = new HashSet<ChartOfAccount>();
		Pagination<ChartOfAccount> finalResult = new Pagination<>();
		Pagination<ChartOfAccount> result = new Pagination<>();
		
		if (!financialConfigurationService.fetchDataFrom().isEmpty()
	                && financialConfigurationService.fetchDataFrom().equalsIgnoreCase("es")) {
		    ChartOfAccountSearchContract chartOfAccountSearchContract = new ChartOfAccountSearchContract();
	            ModelMapper mapper = new ModelMapper();
	            mapper.map(domain, chartOfAccountSearchContract);
	            result = chartOfAccountESRepository.search(chartOfAccountSearchContract);
	        } else {
	            
	             result = chartOfAccountJdbcRepository.search(domain);
	        }

		if (domain != null && domain.getAccountCodePurpose() != null
				&& domain.getAccountCodePurpose().getId() != null) {

			domain.setAccountCodePurpose(null);

			for (ChartOfAccount coa : result.getPagedData()) {
				chartOfAccountSet.add(coa);
				domain.setGlcode(coa.getGlcode() + "%");
				Pagination<ChartOfAccount> result1 = chartOfAccountJdbcRepository.search(domain);
				for (ChartOfAccount temp : result1.getPagedData()) {
					chartOfAccountSet.add(temp);
				}
				finalResult = result1;
			}
			finalResult.setTotalResults(chartOfAccountSet.size());
			finalResult.setPagedData(new ArrayList<>(chartOfAccountSet));

			return finalResult;

		} else

			return result;

	}

    public boolean uniqueCheck(String fieldName, ChartOfAccount chartOfAccount) {
        return chartOfAccountJdbcRepository.uniqueCheck(fieldName, new ChartOfAccountEntity().toEntity(chartOfAccount));
    }

}