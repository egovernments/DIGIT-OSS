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
import org.egov.egf.master.domain.model.ChartOfAccountDetail;
import org.egov.egf.master.domain.model.ChartOfAccountDetailSearch;
import org.egov.egf.master.domain.service.ChartOfAccountDetailService;
import org.egov.egf.master.web.contract.ChartOfAccountDetailContract;
import org.egov.egf.master.web.contract.ChartOfAccountDetailSearchContract;
import org.egov.egf.master.web.requests.ChartOfAccountDetailRequest;
import org.egov.egf.master.web.requests.ChartOfAccountDetailResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chartofaccountdetails")
public class ChartOfAccountDetailController {

	@Autowired
	private ChartOfAccountDetailService chartOfAccountDetailService;

	@PostMapping("/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public ChartOfAccountDetailResponse create(@RequestBody ChartOfAccountDetailRequest chartOfAccountDetailRequest,
			BindingResult errors,@RequestParam String tenantId) {
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}

		ModelMapper model = new ModelMapper();
		ChartOfAccountDetailResponse chartOfAccountDetailResponse = new ChartOfAccountDetailResponse();
		chartOfAccountDetailResponse.setResponseInfo(getResponseInfo(chartOfAccountDetailRequest.getRequestInfo()));
		List<ChartOfAccountDetail> chartofaccountdetails = new ArrayList<>();
		ChartOfAccountDetail chartOfAccountDetail;
		List<ChartOfAccountDetailContract> chartOfAccountDetailContracts = new ArrayList<>();
		ChartOfAccountDetailContract contract;

		chartOfAccountDetailRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

		for (ChartOfAccountDetailContract chartOfAccountDetailContract : chartOfAccountDetailRequest
				.getChartOfAccountDetails()) {
			chartOfAccountDetail = new ChartOfAccountDetail();
			model.map(chartOfAccountDetailContract, chartOfAccountDetail);
			chartOfAccountDetail.setCreatedDate(new Date());
			chartOfAccountDetail.setCreatedBy(chartOfAccountDetailRequest.getRequestInfo().getUserInfo());
			chartOfAccountDetail.setLastModifiedBy(chartOfAccountDetailRequest.getRequestInfo().getUserInfo());
			chartofaccountdetails.add(chartOfAccountDetail);
		}

		chartofaccountdetails = chartOfAccountDetailService.add(chartofaccountdetails, errors);

		for (ChartOfAccountDetail f : chartofaccountdetails) {
			contract = new ChartOfAccountDetailContract();
			contract.setCreatedDate(new Date());
			model.map(f, contract);
			chartOfAccountDetailContracts.add(contract);
		}

		chartOfAccountDetailRequest.setChartOfAccountDetails(chartOfAccountDetailContracts);
		chartOfAccountDetailService.addToQue(chartOfAccountDetailRequest);
		chartOfAccountDetailResponse.setChartOfAccountDetails(chartOfAccountDetailContracts);

		return chartOfAccountDetailResponse;
	}

	@PostMapping("/_update")
	@ResponseStatus(HttpStatus.CREATED)
	public ChartOfAccountDetailResponse update(@RequestBody ChartOfAccountDetailRequest chartOfAccountDetailRequest,
			BindingResult errors,@RequestParam String tenantId) {

		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		chartOfAccountDetailRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		ModelMapper model = new ModelMapper();
		ChartOfAccountDetailResponse chartOfAccountDetailResponse = new ChartOfAccountDetailResponse();
		List<ChartOfAccountDetail> chartofaccountdetails = new ArrayList<>();
		chartOfAccountDetailResponse.setResponseInfo(getResponseInfo(chartOfAccountDetailRequest.getRequestInfo()));
		ChartOfAccountDetail chartOfAccountDetail;
		ChartOfAccountDetailContract contract;
		List<ChartOfAccountDetailContract> chartOfAccountDetailContracts = new ArrayList<>();

		for (ChartOfAccountDetailContract chartOfAccountDetailContract : chartOfAccountDetailRequest
				.getChartOfAccountDetails()) {
			chartOfAccountDetail = new ChartOfAccountDetail();
			model.map(chartOfAccountDetailContract, chartOfAccountDetail);
			chartOfAccountDetail.setLastModifiedBy(chartOfAccountDetailRequest.getRequestInfo().getUserInfo());
			chartOfAccountDetail.setLastModifiedDate(new Date());
			chartofaccountdetails.add(chartOfAccountDetail);
		}

		chartofaccountdetails = chartOfAccountDetailService.update(chartofaccountdetails, errors);

		for (ChartOfAccountDetail chartOfAccountDetailObj : chartofaccountdetails) {
			contract = new ChartOfAccountDetailContract();
			model.map(chartOfAccountDetailObj, contract);
			chartOfAccountDetailObj.setLastModifiedDate(new Date());
			chartOfAccountDetailContracts.add(contract);
		}

		chartOfAccountDetailRequest.setChartOfAccountDetails(chartOfAccountDetailContracts);
		chartOfAccountDetailService.addToQue(chartOfAccountDetailRequest);
		chartOfAccountDetailResponse.setChartOfAccountDetails(chartOfAccountDetailContracts);

		return chartOfAccountDetailResponse;
	}

	@PostMapping("/_search")
	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	public ChartOfAccountDetailResponse search(
			@ModelAttribute ChartOfAccountDetailSearchContract chartOfAccountDetailSearchContract,
			@RequestBody RequestInfo requestInfo, BindingResult errors,@RequestParam String tenantId) {

		ModelMapper mapper = new ModelMapper();
		ChartOfAccountDetailSearch domain = new ChartOfAccountDetailSearch();
		mapper.map(chartOfAccountDetailSearchContract, domain);
		ChartOfAccountDetailContract contract;
		ModelMapper model = new ModelMapper();
		List<ChartOfAccountDetailContract> chartOfAccountDetailContracts = new ArrayList<>();
		Pagination<ChartOfAccountDetail> chartofaccountdetails = chartOfAccountDetailService.search(domain, errors);

		for (ChartOfAccountDetail chartOfAccountDetail : chartofaccountdetails.getPagedData()) {
			contract = new ChartOfAccountDetailContract();
			model.map(chartOfAccountDetail, contract);
			chartOfAccountDetailContracts.add(contract);
		}

		ChartOfAccountDetailResponse response = new ChartOfAccountDetailResponse();
		response.setChartOfAccountDetails(chartOfAccountDetailContracts);
		response.setPage(new PaginationContract(chartofaccountdetails));
		response.setResponseInfo(getResponseInfo(requestInfo));

		return response;

	}

	private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
		return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
				.resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
	}

}