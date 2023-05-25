package org.egov.egf.master.web.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.util.ApplicationThreadLocals;
import org.egov.common.web.contract.PaginationContract;
import org.egov.egf.master.domain.model.Fund;
import org.egov.egf.master.domain.model.FundSearch;
import org.egov.egf.master.domain.service.FundService;
import org.egov.egf.master.web.contract.FundContract;
import org.egov.egf.master.web.contract.FundSearchContract;
import org.egov.egf.master.web.requests.FundRequest;
import org.egov.egf.master.web.requests.FundResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/funds")
public class FundController {

    @Autowired
    private FundService fundService;

    @PostMapping("/_create")
    @ResponseStatus(HttpStatus.CREATED)
    public FundResponse create(@RequestBody FundRequest fundRequest, BindingResult errors,@RequestParam String tenantId) {

        ApplicationThreadLocals.setRequestInfo(fundRequest.getRequestInfo());
//        ApplicationThreadLocals.setTenantId();
        if (errors.hasErrors()) {
            throw new CustomBindException(errors);
        }

        ModelMapper model = new ModelMapper();
        FundResponse fundResponse = new FundResponse();
        fundResponse.setResponseInfo(getResponseInfo(fundRequest.getRequestInfo()));
        List<Fund> funds = new ArrayList<>();
        Fund fund;
        List<FundContract> fundContracts = new ArrayList<>();
        FundContract contract;

        fundRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

        for (FundContract fundContract : fundRequest.getFunds()) {
            fund = new Fund();
            model.map(fundContract, fund);
            fund.setCreatedDate(new Date());
            fund.setCreatedBy(fundRequest.getRequestInfo().getUserInfo());
            fund.setLastModifiedBy(fundRequest.getRequestInfo().getUserInfo());
            funds.add(fund);
        }

        funds = fundService.create(funds, errors, fundRequest.getRequestInfo());

        for (Fund f : funds) {
            contract = new FundContract();
            contract.setCreatedDate(new Date());
            model.map(f, contract);
            fundContracts.add(contract);
        }

        fundResponse.setFunds(fundContracts);

        return fundResponse;
    }

    @PostMapping("/_update")
    @ResponseStatus(HttpStatus.CREATED)
    public FundResponse update(@RequestBody FundRequest fundRequest, BindingResult errors,@RequestParam String tenantId) {

        if (errors.hasErrors()) {
            throw new CustomBindException(errors);
        }
        fundRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
        ModelMapper model = new ModelMapper();
        FundResponse fundResponse = new FundResponse();
        List<Fund> funds = new ArrayList<>();
        fundResponse.setResponseInfo(getResponseInfo(fundRequest.getRequestInfo()));
        Fund fund;
        FundContract contract;
        List<FundContract> fundContracts = new ArrayList<>();

        for (FundContract fundContract : fundRequest.getFunds()) {
            fund = new Fund();
            model.map(fundContract, fund);
            fund.setLastModifiedBy(fundRequest.getRequestInfo().getUserInfo());
            fund.setLastModifiedDate(new Date());
            funds.add(fund);
        }

        funds = fundService.update(funds, errors, fundRequest.getRequestInfo());

        for (Fund fundObj : funds) {
            contract = new FundContract();
            model.map(fundObj, contract);
            fundObj.setLastModifiedDate(new Date());
            fundContracts.add(contract);
        }

        fundResponse.setFunds(fundContracts);

        return fundResponse;
    }

    @PostMapping("/_search")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public FundResponse search(@ModelAttribute FundSearchContract fundSearchContract, @RequestBody RequestInfo requestInfo,
            BindingResult errors,@RequestParam String tenantId) {
    	
    	System.out.println("requestInfo in FundController Search "+requestInfo.toString());
    	System.out.println("requestInfo in FundController Search "+requestInfo.getAuthToken());
    	ModelMapper mapper = new ModelMapper();
        FundSearch domain = new FundSearch();
        mapper.map(fundSearchContract, domain);
        FundContract contract;
        ModelMapper model = new ModelMapper();
        List<FundContract> fundContracts = new ArrayList<>();
        Pagination<Fund> funds = fundService.search(domain, errors);

        if (funds.getPagedData() != null) {
            for (Fund fund : funds.getPagedData()) {
                contract = new FundContract();
                model.map(fund, contract);
                fundContracts.add(contract);
            }
        }

        FundResponse response = new FundResponse();
        response.setFunds(fundContracts);
        response.setPage(new PaginationContract(funds));
        response.setResponseInfo(getResponseInfo(requestInfo));

        return response;

    }

    private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
        return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
                .resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
    }

}
