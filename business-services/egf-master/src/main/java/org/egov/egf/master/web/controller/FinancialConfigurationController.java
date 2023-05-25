package org.egov.egf.master.web.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.web.contract.PaginationContract;
import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.egf.master.domain.model.FinancialConfiguration;
import org.egov.egf.master.domain.model.FinancialConfigurationSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.web.contract.FinancialConfigurationContract;
import org.egov.egf.master.web.contract.FinancialConfigurationSearchContract;
import org.egov.egf.master.web.requests.FinancialConfigurationRequest;
import org.egov.egf.master.web.requests.FinancialConfigurationResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/financialconfigurations")
public class FinancialConfigurationController {

	@Autowired
	private FinancialConfigurationService financialConfigurationService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public FinancialConfigurationResponse create(
			@RequestBody FinancialConfigurationRequest financialConfigurationRequest, BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		FinancialConfigurationResponse financialConfigurationResponse = new FinancialConfigurationResponse();
		financialConfigurationResponse.setResponseInfo(getResponseInfo(financialConfigurationRequest.getRequestInfo()));
		List<FinancialConfiguration> financialconfigurations = new ArrayList<>();
		FinancialConfiguration financialConfiguration;
		List<FinancialConfigurationContract> financialConfigurationContracts = new ArrayList<>();
		FinancialConfigurationContract contract;

		financialConfigurationRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (FinancialConfigurationContract financialConfigurationContract : financialConfigurationRequest
				.getFinancialConfigurations()) {
			financialConfiguration = new FinancialConfiguration();
			model.map(financialConfigurationContract, financialConfiguration);
			financialConfiguration.setCreatedDate(new Date());
			financialConfiguration.setCreatedBy(financialConfigurationRequest.getRequestInfo().getUserInfo());
			financialConfiguration.setLastModifiedBy(financialConfigurationRequest.getRequestInfo().getUserInfo());
			financialconfigurations.add(financialConfiguration);
		}

		financialconfigurations = financialConfigurationService.add(financialconfigurations, errors);

		for (FinancialConfiguration f : financialconfigurations) {
			contract = new FinancialConfigurationContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			financialConfigurationContracts.add(contract);
		}

		financialConfigurationRequest.setFinancialConfigurations(financialConfigurationContracts);
		financialConfigurationService.addToQue(financialConfigurationRequest);
		financialConfigurationResponse.setFinancialConfigurations(financialConfigurationContracts);

		return financialConfigurationResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public FinancialConfigurationResponse update(
			@RequestBody FinancialConfigurationRequest financialConfigurationRequest, BindingResult errors,@RequestParam String tenantId) {

		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		financialConfigurationRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		FinancialConfigurationResponse financialConfigurationResponse = new FinancialConfigurationResponse();
		List<FinancialConfiguration> financialconfigurations = new ArrayList<>();
		financialConfigurationResponse.setResponseInfo(getResponseInfo(financialConfigurationRequest.getRequestInfo()));
		FinancialConfiguration financialConfiguration;
		FinancialConfigurationContract contract;
		List<FinancialConfigurationContract> financialConfigurationContracts = new ArrayList<>();

		for (FinancialConfigurationContract financialConfigurationContract : financialConfigurationRequest
				.getFinancialConfigurations()) {
			financialConfiguration = new FinancialConfiguration();
			model.map(financialConfigurationContract, financialConfiguration);
			financialConfiguration.setLastModifiedBy(financialConfigurationRequest.getRequestInfo().getUserInfo());
			financialConfiguration.setLastModifiedDate(new Date());
			financialconfigurations.add(financialConfiguration);
		}

		financialconfigurations = financialConfigurationService.update(financialconfigurations, errors);

		for (FinancialConfiguration financialConfigurationObj : financialconfigurations) {
			contract = new FinancialConfigurationContract();
			model.map(financialConfigurationObj, contract);
			financialConfigurationObj.setLastModifiedDate(new Date());
			financialConfigurationContracts.add(contract);
		}

		financialConfigurationRequest.setFinancialConfigurations(financialConfigurationContracts);
		financialConfigurationService.addToQue(financialConfigurationRequest);
		financialConfigurationResponse.setFinancialConfigurations(financialConfigurationContracts);

		return financialConfigurationResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public FinancialConfigurationResponse search(
			@ModelAttribute FinancialConfigurationSearchContract financialConfigurationSearchContract,
			@RequestBody RequestInfo requestInfo, BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		FinancialConfigurationSearch domain = new FinancialConfigurationSearch();
		mapper.map(financialConfigurationSearchContract, domain);
		FinancialConfigurationContract contract;
		ModelMapper model = new ModelMapper();
		List<FinancialConfigurationContract> financialConfigurationContracts = new ArrayList<>();
		Pagination<FinancialConfiguration> financialconfigurations = financialConfigurationService.search(domain, errors);

		for (FinancialConfiguration financialConfiguration : financialconfigurations.getPagedData()) {
			contract = new FinancialConfigurationContract();
			model.map(financialConfiguration, contract);
			financialConfigurationContracts.add(contract);
		}

		FinancialConfigurationResponse response = new FinancialConfigurationResponse();
		response.setFinancialConfigurations(financialConfigurationContracts);
		response.setPage(new PaginationContract(financialconfigurations));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}