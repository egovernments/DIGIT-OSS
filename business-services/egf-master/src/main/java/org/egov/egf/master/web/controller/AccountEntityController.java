package org.egov.egf.master.web.controller;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.web.contract.PaginationContract;
import org.egov.egf.master.domain.model.AccountEntity;
import org.egov.egf.master.domain.model.AccountEntitySearch;
import org.egov.egf.master.domain.service.AccountEntityService;
import org.egov.egf.master.web.contract.AccountEntityContract;
import org.egov.egf.master.web.contract.AccountEntitySearchContract;
import org.egov.egf.master.web.requests.AccountEntityRequest;
import org.egov.egf.master.web.requests.AccountEntityResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/accountentities")
public class AccountEntityController {

    @Autowired
    private AccountEntityService accountEntityService;

    @PostMapping("/_create")
    @ResponseStatus(HttpStatus.CREATED)
    public AccountEntityResponse create(@RequestBody AccountEntityRequest accountEntityRequest, BindingResult errors,@RequestParam String tenantId) {
        if (errors.hasErrors()) {
            throw new CustomBindException(errors);
        }

        ModelMapper model = new ModelMapper();
        AccountEntityResponse accountEntityResponse = new AccountEntityResponse();
        accountEntityResponse.setResponseInfo(getResponseInfo(accountEntityRequest.getRequestInfo()));
        List<AccountEntity> accountentities = new ArrayList<>();
        AccountEntity accountEntity;
        List<AccountEntityContract> accountEntityContracts = new ArrayList<>();
        AccountEntityContract contract;

        accountEntityRequest.getRequestInfo().setAction(Constants.ACTION_CREATE);

        for (AccountEntityContract accountEntityContract : accountEntityRequest.getAccountEntities()) {
            accountEntity = new AccountEntity();
            model.map(accountEntityContract, accountEntity);
            accountEntity.setCreatedDate(new Date());
            accountEntity.setCreatedBy(accountEntityRequest.getRequestInfo().getUserInfo());
            accountEntity.setLastModifiedBy(accountEntityRequest.getRequestInfo().getUserInfo());
            accountentities.add(accountEntity);
        }

        accountentities = accountEntityService.create(accountentities, errors, accountEntityRequest.getRequestInfo());

        for (AccountEntity f : accountentities) {
            contract = new AccountEntityContract();
            contract.setCreatedDate(new Date());
            model.map(f, contract);
            accountEntityContracts.add(contract);
        }

        accountEntityResponse.setAccountEntities(accountEntityContracts);

        return accountEntityResponse;
    }

    @PostMapping("/_update")
    @ResponseStatus(HttpStatus.CREATED)
    public AccountEntityResponse update(@RequestBody AccountEntityRequest accountEntityRequest, BindingResult errors,@RequestParam String tenantId) {

        if (errors.hasErrors()) {
            throw new CustomBindException(errors);
        }
        accountEntityRequest.getRequestInfo().setAction(Constants.ACTION_UPDATE);
        ModelMapper model = new ModelMapper();
        AccountEntityResponse accountEntityResponse = new AccountEntityResponse();
        List<AccountEntity> accountentities = new ArrayList<>();
        accountEntityResponse.setResponseInfo(getResponseInfo(accountEntityRequest.getRequestInfo()));
        AccountEntity accountEntity;
        AccountEntityContract contract;
        List<AccountEntityContract> accountEntityContracts = new ArrayList<>();

        for (AccountEntityContract accountEntityContract : accountEntityRequest.getAccountEntities()) {
            accountEntity = new AccountEntity();
            model.map(accountEntityContract, accountEntity);
            accountEntity.setLastModifiedBy(accountEntityRequest.getRequestInfo().getUserInfo());
            accountEntity.setLastModifiedDate(new Date());
            accountentities.add(accountEntity);
        }

        accountentities = accountEntityService.update(accountentities, errors, accountEntityRequest.getRequestInfo());

        for (AccountEntity accountEntityObj : accountentities) {
            contract = new AccountEntityContract();
            model.map(accountEntityObj, contract);
            accountEntityObj.setLastModifiedDate(new Date());
            accountEntityContracts.add(contract);
        }

        accountEntityResponse.setAccountEntities(accountEntityContracts);

        return accountEntityResponse;
    }

    @PostMapping("/_search")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public AccountEntityResponse search(@ModelAttribute AccountEntitySearchContract accountEntitySearchContract,
                                        @RequestBody RequestInfo requestInfo, BindingResult errors,@RequestParam String tenantId) {

        ModelMapper mapper = new ModelMapper();
        AccountEntitySearch domain = new AccountEntitySearch();
        mapper.map(accountEntitySearchContract, domain);
        AccountEntityContract contract;
        ModelMapper model = new ModelMapper();
        List<AccountEntityContract> accountEntityContracts = new ArrayList<>();
        Pagination<AccountEntity> accountentities = accountEntityService.search(domain, errors);

        for (AccountEntity accountEntity : accountentities.getPagedData()) {
            contract = new AccountEntityContract();
            model.map(accountEntity, contract);
            accountEntityContracts.add(contract);
        }

        AccountEntityResponse response = new AccountEntityResponse();
        response.setAccountEntities(accountEntityContracts);
        response.setPage(new PaginationContract(accountentities));
        response.setResponseInfo(getResponseInfo(requestInfo));

        return response;

    }

    private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
        return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
                .resMsgId(requestInfo.getMsgId()).resMsgId("placeholder").status("placeholder").build();
    }

}