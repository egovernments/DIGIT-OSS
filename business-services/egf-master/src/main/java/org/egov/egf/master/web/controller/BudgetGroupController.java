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
import org.egov.egf.master.domain.model.BudgetGroup;
import org.egov.egf.master.domain.model.BudgetGroupSearch;
import org.egov.egf.master.domain.service.BudgetGroupService;
import org.egov.egf.master.web.contract.BudgetGroupContract;
import org.egov.egf.master.web.contract.BudgetGroupSearchContract;
import org.egov.egf.master.web.requests.BudgetGroupRequest;
import org.egov.egf.master.web.requests.BudgetGroupResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/budgetgroups")
public class BudgetGroupController {

	@Autowired
	private BudgetGroupService budgetGroupService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public BudgetGroupResponse create(@RequestBody BudgetGroupRequest budgetGroupRequest, BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		BudgetGroupResponse budgetGroupResponse = new BudgetGroupResponse();
		budgetGroupResponse.setResponseInfo(getResponseInfo(budgetGroupRequest.getRequestInfo()));
		List<BudgetGroup> budgetgroups = new ArrayList<>();
		BudgetGroup budgetGroup;
		List<BudgetGroupContract> budgetGroupContracts = new ArrayList<>();
		BudgetGroupContract contract;

		budgetGroupRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (BudgetGroupContract budgetGroupContract : budgetGroupRequest.getBudgetGroups()) {
			budgetGroup = new BudgetGroup();
			model.map(budgetGroupContract, budgetGroup);
			budgetGroup.setCreatedDate(new Date());
			budgetGroup.setCreatedBy(budgetGroupRequest.getRequestInfo().getUserInfo());
			budgetGroup.setLastModifiedBy(budgetGroupRequest.getRequestInfo().getUserInfo());
			budgetgroups.add(budgetGroup);
		}

		budgetgroups = budgetGroupService.add(budgetgroups, errors);

		for (BudgetGroup f : budgetgroups) {
			contract = new BudgetGroupContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			budgetGroupContracts.add(contract);
		}

		budgetGroupRequest.setBudgetGroups(budgetGroupContracts);
		budgetGroupService.addToQue(budgetGroupRequest);
		budgetGroupResponse.setBudgetGroups(budgetGroupContracts);

		return budgetGroupResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public BudgetGroupResponse update(@RequestBody BudgetGroupRequest budgetGroupRequest, BindingResult errors,@RequestParam String tenantId) {

		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		budgetGroupRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		BudgetGroupResponse budgetGroupResponse = new BudgetGroupResponse();
		List<BudgetGroup> budgetgroups = new ArrayList<>();
		budgetGroupResponse.setResponseInfo(getResponseInfo(budgetGroupRequest.getRequestInfo()));
		BudgetGroup budgetGroup;
		BudgetGroupContract contract;
		List<BudgetGroupContract> budgetGroupContracts = new ArrayList<>();

		for (BudgetGroupContract budgetGroupContract : budgetGroupRequest.getBudgetGroups()) {
			budgetGroup = new BudgetGroup();
			model.map(budgetGroupContract, budgetGroup);
			budgetGroup.setLastModifiedBy(budgetGroupRequest.getRequestInfo().getUserInfo());
			budgetGroup.setLastModifiedDate(new Date());
			budgetgroups.add(budgetGroup);
		}

		budgetgroups = budgetGroupService.update(budgetgroups, errors);

		for (BudgetGroup budgetGroupObj : budgetgroups) {
			contract = new BudgetGroupContract();
			model.map(budgetGroupObj, contract);
			budgetGroupObj.setLastModifiedDate(new Date());
			budgetGroupContracts.add(contract);
		}

		budgetGroupRequest.setBudgetGroups(budgetGroupContracts);
		budgetGroupService.addToQue(budgetGroupRequest);
		budgetGroupResponse.setBudgetGroups(budgetGroupContracts);

		return budgetGroupResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public BudgetGroupResponse search(@ModelAttribute BudgetGroupSearchContract budgetGroupSearchContract,
			@RequestBody RequestInfo requestInfo, BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		BudgetGroupSearch domain = new BudgetGroupSearch();
		mapper.map(budgetGroupSearchContract, domain);
		BudgetGroupContract contract;
		ModelMapper model = new ModelMapper();
		List<BudgetGroupContract> budgetGroupContracts = new ArrayList<>();
		Pagination<BudgetGroup> budgetgroups = budgetGroupService.search(domain, errors);

		for (BudgetGroup budgetGroup : budgetgroups.getPagedData()) {
			contract = new BudgetGroupContract();
			model.map(budgetGroup, contract);
			budgetGroupContracts.add(contract);
		}

		BudgetGroupResponse response = new BudgetGroupResponse();
		response.setBudgetGroups(budgetGroupContracts);
		response.setPage(new PaginationContract(budgetgroups));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}