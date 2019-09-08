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
import org.egov.egf.master.domain.model.SubScheme;
import org.egov.egf.master.domain.model.SubSchemeSearch;
import org.egov.egf.master.domain.service.SubSchemeService;
import org.egov.egf.master.web.contract.SubSchemeContract;
import org.egov.egf.master.web.contract.SubSchemeSearchContract;
import org.egov.egf.master.web.requests.SubSchemeRequest;
import org.egov.egf.master.web.requests.SubSchemeResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/subschemes")
public class SubSchemeController {

	@Autowired
	private SubSchemeService subSchemeService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public SubSchemeResponse create(@RequestBody SubSchemeRequest subSchemeRequest, BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		SubSchemeResponse subSchemeResponse = new SubSchemeResponse();
		subSchemeResponse.setResponseInfo(getResponseInfo(subSchemeRequest.getRequestInfo()));
		List<SubScheme> subschemes = new ArrayList<>();
		SubScheme subScheme;
		List<SubSchemeContract> subSchemeContracts = new ArrayList<>();
		SubSchemeContract contract;

		subSchemeRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (SubSchemeContract subSchemeContract : subSchemeRequest.getSubSchemes()) {
			subScheme = new SubScheme();
			model.map(subSchemeContract, subScheme);
			subScheme.setCreatedDate(new Date());
			subScheme.setCreatedBy(subSchemeRequest.getRequestInfo().getUserInfo());
			subScheme.setLastModifiedBy(subSchemeRequest.getRequestInfo().getUserInfo());
			subschemes.add(subScheme);
		}

		subschemes = subSchemeService.add(subschemes, errors);

		for (SubScheme f : subschemes) {
			contract = new SubSchemeContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			subSchemeContracts.add(contract);
		}

		subSchemeRequest.setSubSchemes(subSchemeContracts);
		subSchemeService.addToQue(subSchemeRequest);
		subSchemeResponse.setSubSchemes(subSchemeContracts);

		return subSchemeResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public SubSchemeResponse update(@RequestBody SubSchemeRequest subSchemeRequest, BindingResult errors,@RequestParam String tenantId) {

		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		subSchemeRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		SubSchemeResponse subSchemeResponse = new SubSchemeResponse();
		List<SubScheme> subschemes = new ArrayList<>();
		subSchemeResponse.setResponseInfo(getResponseInfo(subSchemeRequest.getRequestInfo()));
		SubScheme subScheme;
		SubSchemeContract contract;
		List<SubSchemeContract> subSchemeContracts = new ArrayList<>();

		for (SubSchemeContract subSchemeContract : subSchemeRequest.getSubSchemes()) {
			subScheme = new SubScheme();
			model.map(subSchemeContract, subScheme);
			subScheme.setLastModifiedBy(subSchemeRequest.getRequestInfo().getUserInfo());
			subScheme.setLastModifiedDate(new Date());
			subschemes.add(subScheme);
		}

		subschemes = subSchemeService.update(subschemes, errors);

		for (SubScheme subSchemeObj : subschemes) {
			contract = new SubSchemeContract();
			model.map(subSchemeObj, contract);
			subSchemeObj.setLastModifiedDate(new Date());
			subSchemeContracts.add(contract);
		}

		subSchemeRequest.setSubSchemes(subSchemeContracts);
		subSchemeService.addToQue(subSchemeRequest);
		subSchemeResponse.setSubSchemes(subSchemeContracts);

		return subSchemeResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public SubSchemeResponse search(@ModelAttribute SubSchemeSearchContract subSchemeSearchContract,
			@RequestBody RequestInfo requestInfo, BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		SubSchemeSearch domain = new SubSchemeSearch();
		mapper.map(subSchemeSearchContract, domain);
		SubSchemeContract contract;
		ModelMapper model = new ModelMapper();
		List<SubSchemeContract> subSchemeContracts = new ArrayList<>();
		Pagination<SubScheme> subschemes = subSchemeService.search(domain, errors);

		for (SubScheme subScheme : subschemes.getPagedData()) {
			contract = new SubSchemeContract();
			model.map(subScheme, contract);
			subSchemeContracts.add(contract);
		}

		SubSchemeResponse response = new SubSchemeResponse();
		response.setSubSchemes(subSchemeContracts);
		response.setPage(new PaginationContract(subschemes));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}