package org.egov.egf.instrument.web.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.common.web.contract.PaginationContract;
import org.egov.egf.instrument.domain.model.SurrenderReason;
import org.egov.egf.instrument.domain.model.SurrenderReasonSearch;
import org.egov.egf.instrument.domain.service.SurrenderReasonService;
import org.egov.egf.instrument.web.contract.SurrenderReasonContract;
import org.egov.egf.instrument.web.contract.SurrenderReasonSearchContract;
import org.egov.egf.instrument.web.mapper.SurrenderReasonMapper;
import org.egov.egf.instrument.web.requests.SurrenderReasonRequest;
import org.egov.egf.instrument.web.requests.SurrenderReasonResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/surrenderreasons")
public class SurrenderReasonController {

    public static final String ACTION_CREATE = "create";
    public static final String ACTION_UPDATE = "update";
    public static final String ACTION_DELETE = "delete";
    public static final String PLACEHOLDER = "placeholder";

    @Autowired
    private SurrenderReasonService surrenderReasonService;

    @PostMapping("/_create")
    @ResponseStatus(HttpStatus.CREATED)
    public SurrenderReasonResponse create(@RequestBody SurrenderReasonRequest surrenderReasonRequest,
            BindingResult errors) {

        SurrenderReasonMapper mapper = new SurrenderReasonMapper();
        SurrenderReasonResponse surrenderReasonResponse = new SurrenderReasonResponse();
        surrenderReasonResponse.setResponseInfo(getResponseInfo(surrenderReasonRequest.getRequestInfo()));
        List<SurrenderReason> surrenderreasons = new ArrayList<>();
        SurrenderReason surrenderReason;
        List<SurrenderReasonContract> surrenderReasonContracts = new ArrayList<>();
        SurrenderReasonContract contract;

        surrenderReasonRequest.getRequestInfo().setAction(ACTION_CREATE);

        for (SurrenderReasonContract surrenderReasonContract : surrenderReasonRequest.getSurrenderReasons()) {
            surrenderReason = mapper.toDomain(surrenderReasonContract);
            surrenderReason.setCreatedDate(new Date());
            surrenderReason.setCreatedBy(surrenderReasonRequest.getRequestInfo().getUserInfo());
            surrenderReason.setLastModifiedBy(surrenderReasonRequest.getRequestInfo().getUserInfo());
            surrenderreasons.add(surrenderReason);
        }

        surrenderreasons = surrenderReasonService.create(surrenderreasons, errors,
                surrenderReasonRequest.getRequestInfo());

        for (SurrenderReason sr : surrenderreasons) {
            contract = mapper.toContract(sr);
            surrenderReasonContracts.add(contract);
        }

        surrenderReasonResponse.setSurrenderReasons(surrenderReasonContracts);

        return surrenderReasonResponse;
    }

    @PostMapping("/_update")
    @ResponseStatus(HttpStatus.CREATED)
    public SurrenderReasonResponse update(@RequestBody SurrenderReasonRequest surrenderReasonRequest,
            BindingResult errors) {

        SurrenderReasonMapper mapper = new SurrenderReasonMapper();
        surrenderReasonRequest.getRequestInfo().setAction(ACTION_UPDATE);
        SurrenderReasonResponse surrenderReasonResponse = new SurrenderReasonResponse();
        List<SurrenderReason> surrenderreasons = new ArrayList<>();
        surrenderReasonResponse.setResponseInfo(getResponseInfo(surrenderReasonRequest.getRequestInfo()));
        SurrenderReason surrenderReason;
        SurrenderReasonContract contract;
        List<SurrenderReasonContract> surrenderReasonContracts = new ArrayList<>();

        for (SurrenderReasonContract surrenderReasonContract : surrenderReasonRequest.getSurrenderReasons()) {
            surrenderReason = mapper.toDomain(surrenderReasonContract);
            surrenderReason.setLastModifiedBy(surrenderReasonRequest.getRequestInfo().getUserInfo());
            surrenderReason.setLastModifiedDate(new Date());
            surrenderreasons.add(surrenderReason);
        }

        surrenderreasons = surrenderReasonService.update(surrenderreasons, errors,
                surrenderReasonRequest.getRequestInfo());

        for (SurrenderReason sr : surrenderreasons) {
            contract = mapper.toContract(sr);
            surrenderReasonContracts.add(contract);
        }
        surrenderReasonResponse.setSurrenderReasons(surrenderReasonContracts);

        return surrenderReasonResponse;
    }

    @PostMapping("/_delete")
    @ResponseStatus(HttpStatus.CREATED)
    public SurrenderReasonResponse delete(@RequestBody SurrenderReasonRequest surrenderReasonRequest,
            BindingResult errors) {

        SurrenderReasonMapper mapper = new SurrenderReasonMapper();
        surrenderReasonRequest.getRequestInfo().setAction(ACTION_DELETE);
        SurrenderReasonResponse surrenderReasonResponse = new SurrenderReasonResponse();
        List<SurrenderReason> surrenderreasons = new ArrayList<>();
        surrenderReasonResponse.setResponseInfo(getResponseInfo(surrenderReasonRequest.getRequestInfo()));
        SurrenderReason surrenderReason;
        SurrenderReasonContract contract;
        List<SurrenderReasonContract> surrenderReasonContracts = new ArrayList<>();

        for (SurrenderReasonContract surrenderReasonContract : surrenderReasonRequest.getSurrenderReasons()) {
            surrenderReason = mapper.toDomain(surrenderReasonContract);
            surrenderreasons.add(surrenderReason);
        }

        surrenderreasons = surrenderReasonService.delete(surrenderreasons, errors,
                surrenderReasonRequest.getRequestInfo());

        for (SurrenderReason sr : surrenderreasons) {
            contract = mapper.toContract(sr);
            surrenderReasonContracts.add(contract);
        }
        surrenderReasonResponse.setSurrenderReasons(surrenderReasonContracts);

        return surrenderReasonResponse;
    }

    @PostMapping("/_search")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public SurrenderReasonResponse search(@ModelAttribute SurrenderReasonSearchContract surrenderReasonSearchContract,
            RequestInfo requestInfo, BindingResult errors) {

        SurrenderReasonMapper mapper = new SurrenderReasonMapper();
        SurrenderReasonSearch domain = mapper.toSearchDomain(surrenderReasonSearchContract);
        SurrenderReasonContract contract;
        List<SurrenderReasonContract> surrenderReasonContracts = new ArrayList<>();
        Pagination<SurrenderReason> surrenderreasons = surrenderReasonService.search(domain);

        if (surrenderreasons.getPagedData() != null)
            for (SurrenderReason surrenderReason : surrenderreasons.getPagedData()) {
                contract = mapper.toContract(surrenderReason);
                surrenderReasonContracts.add(contract);
            }

        SurrenderReasonResponse response = new SurrenderReasonResponse();
        response.setSurrenderReasons(surrenderReasonContracts);
        response.setPage(new PaginationContract(surrenderreasons));
        response.setResponseInfo(getResponseInfo(requestInfo));

        return response;

    }

    private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
        return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
                .resMsgId(requestInfo.getMsgId()).resMsgId(PLACEHOLDER).status(PLACEHOLDER).build();
    }

}