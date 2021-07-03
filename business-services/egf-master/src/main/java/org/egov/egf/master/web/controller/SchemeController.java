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
import org.egov.egf.master.domain.model.Scheme;
import org.egov.egf.master.domain.model.SchemeSearch;
import org.egov.egf.master.domain.service.SchemeService;
import org.egov.egf.master.web.contract.SchemeContract;
import org.egov.egf.master.web.contract.SchemeSearchContract;
import org.egov.egf.master.web.requests.SchemeRequest;
import org.egov.egf.master.web.requests.SchemeResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/schemes")
public class SchemeController {

	@Autowired
	private SchemeService schemeService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public SchemeResponse create(@RequestBody SchemeRequest schemeRequest, BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		SchemeResponse schemeResponse = new SchemeResponse();
		schemeResponse.setResponseInfo(getResponseInfo(schemeRequest.getRequestInfo()));
		List<Scheme> schemes = new ArrayList<>();
		Scheme scheme;
		List<SchemeContract> schemeContracts = new ArrayList<>();
		SchemeContract contract;

		schemeRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (SchemeContract schemeContract : schemeRequest.getSchemes()) {
			scheme = new Scheme();
			model.map(schemeContract, scheme);
			scheme.setCreatedDate(new Date());
			scheme.setCreatedBy(schemeRequest.getRequestInfo().getUserInfo());
			scheme.setLastModifiedBy(schemeRequest.getRequestInfo().getUserInfo());
			schemes.add(scheme);
		}

		schemes = schemeService.add(schemes, errors);

		for (Scheme f : schemes) {
			contract = new SchemeContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			schemeContracts.add(contract);
		}

		schemeRequest.setSchemes(schemeContracts);
		schemeService.addToQue(schemeRequest);
		schemeResponse.setSchemes(schemeContracts);

		return schemeResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public SchemeResponse update(@RequestBody SchemeRequest schemeRequest, BindingResult errors,@RequestParam String tenantId) {

		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		schemeRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		SchemeResponse schemeResponse = new SchemeResponse();
		List<Scheme> schemes = new ArrayList<>();
		schemeResponse.setResponseInfo(getResponseInfo(schemeRequest.getRequestInfo()));
		Scheme scheme;
		SchemeContract contract;
		List<SchemeContract> schemeContracts = new ArrayList<>();

		for (SchemeContract schemeContract : schemeRequest.getSchemes()) {
			scheme = new Scheme();
			model.map(schemeContract, scheme);
			scheme.setLastModifiedBy(schemeRequest.getRequestInfo().getUserInfo());
			scheme.setLastModifiedDate(new Date());
			schemes.add(scheme);
		}

		schemes = schemeService.update(schemes, errors);

		for (Scheme schemeObj : schemes) {
			contract = new SchemeContract();
			model.map(schemeObj, contract);
			schemeObj.setLastModifiedDate(new Date());
			schemeContracts.add(contract);
		}

		schemeRequest.setSchemes(schemeContracts);
		schemeService.addToQue(schemeRequest);
		schemeResponse.setSchemes(schemeContracts);

		return schemeResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public SchemeResponse search(@ModelAttribute SchemeSearchContract schemeSearchContract, @RequestBody RequestInfo requestInfo,
			BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		SchemeSearch domain = new SchemeSearch();
		mapper.map(schemeSearchContract, domain);
		SchemeContract contract;
		ModelMapper model = new ModelMapper();
		List<SchemeContract> schemeContracts = new ArrayList<>();
		Pagination<Scheme> schemes = schemeService.search(domain, errors);

		for (Scheme scheme : schemes.getPagedData()) {
			contract = new SchemeContract();
			model.map(scheme, contract);
			schemeContracts.add(contract);
		}

		SchemeResponse response = new SchemeResponse();
		response.setSchemes(schemeContracts);
		response.setPage(new PaginationContract(schemes));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}