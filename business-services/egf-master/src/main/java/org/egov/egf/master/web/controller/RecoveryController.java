package org.egov.egf.master.web.controller;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.web.contract.PaginationContract;
import org.egov.egf.master.domain.model.Recovery;
import org.egov.egf.master.domain.model.RecoverySearch;
import org.egov.egf.master.domain.service.RecoveryService;
import org.egov.egf.master.web.contract.RecoveryContract;
import org.egov.egf.master.web.contract.RecoverySearchContract;
import org.egov.egf.master.web.requests.RecoveryRequest;
import org.egov.egf.master.web.requests.RecoveryResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/recoverys")
public class RecoveryController {

    @Autowired
    private RecoveryService recoveryService;

    @PostMapping("/_create")
    @ResponseStatus(HttpStatus.CREATED)
    public RecoveryResponse create(@RequestBody RecoveryRequest recoveryRequest, BindingResult errors,@RequestParam String tenantId) {
        if (errors.hasErrors()) {
            throw new CustomBindException(errors);
        }

        ModelMapper model = new ModelMapper();
        RecoveryResponse recoveryResponse = new RecoveryResponse();
        recoveryResponse.setResponseInfo(getResponseInfo(recoveryRequest.getRequestInfo()));

        List<Recovery> recoverys = new ArrayList<>();
        Recovery recovery;
        List<RecoveryContract> recoveryContracts = new ArrayList<>();
        RecoveryContract contract;

        recoveryRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

        for (RecoveryContract recoveryContract : recoveryRequest.getRecoverys()) {
            recovery = new Recovery();
            model.map(recoveryContract, recovery);
            recovery.setCreatedDate(new Date());
            recovery.setCreatedBy(recoveryRequest.getRequestInfo().getUserInfo());
            recovery.setLastModifiedBy(recoveryRequest.getRequestInfo().getUserInfo());
            recoverys.add(recovery);
        }

        recoverys = recoveryService.create(recoverys, errors, recoveryRequest.getRequestInfo());

        for (Recovery f : recoverys) {
            contract = new RecoveryContract();
            contract.setCreatedDate(new Date());
            model.map(f, contract);
            recoveryContracts.add(contract);
        }

        recoveryResponse.setRecoverys(recoveryContracts);

        return recoveryResponse;
    }

    @PostMapping("/_update")
    @ResponseStatus(HttpStatus.CREATED)
    public RecoveryResponse update(@RequestBody RecoveryRequest recoveryRequest, BindingResult errors,@RequestParam String tenantId) {

        if (errors.hasErrors()) {
            throw new CustomBindException(errors);
        }
        recoveryRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);

        ModelMapper model = new ModelMapper();
        RecoveryResponse recoveryResponse = new RecoveryResponse();
        recoveryResponse.setResponseInfo(getResponseInfo(recoveryRequest.getRequestInfo()));

        List<Recovery> recoverys = new ArrayList<>();
        Recovery recovery;
        List<RecoveryContract> recoveryContracts = new ArrayList<>();
        RecoveryContract contract;


        for (RecoveryContract recoveryContract : recoveryRequest.getRecoverys()) {
            recovery = new Recovery();
            model.map(recoveryContract, recovery);
            recoveryContract.setLastModifiedBy(recoveryRequest.getRequestInfo().getUserInfo());
            recoveryContract.setLastModifiedDate(new Date());
            recoverys.add(recovery);
        }

        recoverys = recoveryService.update(recoverys, errors, recoveryRequest.getRequestInfo());

        for (Recovery recoveryObj : recoverys) {
            contract = new RecoveryContract();
            model.map(recoveryObj, contract);
            recoveryObj.setLastModifiedDate(new Date());
            recoveryContracts.add(contract);
        }

        recoveryResponse.setRecoverys(recoveryContracts);

        return recoveryResponse;
    }

    @PostMapping("/_search")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public RecoveryResponse search(@ModelAttribute RecoverySearchContract recoverySearchContract, @RequestBody RequestInfo requestInfo,
                                   BindingResult errors,@RequestParam String tenantId) {

        ModelMapper mapper = new ModelMapper();
        RecoverySearch domain = new RecoverySearch();
        mapper.map(recoverySearchContract, domain);
        RecoveryContract contract;
        ModelMapper model = new ModelMapper();
        List<RecoveryContract> recoveryContracts = new ArrayList<>();
        Pagination<Recovery> recoverys = recoveryService.search(domain, errors);

        if (recoverys.getPagedData() != null) {
            for (Recovery recovery : recoverys.getPagedData()) {
                contract = new RecoveryContract();
                model.map(recovery, contract);
                recoveryContracts.add(contract);
            }
        }

        RecoveryResponse response = new RecoveryResponse();
        response.setRecoverys(recoveryContracts);
        response.setPage(new PaginationContract(recoverys));
        response.setResponseInfo(getResponseInfo(requestInfo));

        return response;

    }

    private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
        return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
                .resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
    }

}
