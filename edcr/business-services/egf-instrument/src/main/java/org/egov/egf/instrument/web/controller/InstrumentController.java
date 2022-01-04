package org.egov.egf.instrument.web.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.common.web.contract.PaginationContract;
import org.egov.egf.instrument.domain.model.Instrument;
import org.egov.egf.instrument.domain.model.InstrumentSearch;
import org.egov.egf.instrument.domain.service.InstrumentService;
import org.egov.egf.instrument.web.contract.InstrumentContract;
import org.egov.egf.instrument.web.contract.InstrumentSearchContract;
import org.egov.egf.instrument.web.mapper.InstrumentMapper;
import org.egov.egf.instrument.web.requests.InstrumentRequest;
import org.egov.egf.instrument.web.requests.InstrumentResponse;
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
@RequestMapping("/instruments")
public class InstrumentController {

    public static final String ACTION_CREATE = "create";
    public static final String ACTION_UPDATE = "update";
    public static final String ACTION_DELETE = "delete";
    public static final String PLACEHOLDER = "placeholder";

    @Autowired
    private InstrumentService instrumentService;

    @PostMapping("/_create")
    @ResponseStatus(HttpStatus.CREATED)
    public InstrumentResponse create(@RequestBody InstrumentRequest instrumentRequest, BindingResult errors) {

        InstrumentMapper mapper = new InstrumentMapper();
        InstrumentResponse instrumentResponse = new InstrumentResponse();
        instrumentResponse.setResponseInfo(getResponseInfo(instrumentRequest.getRequestInfo()));
        List<Instrument> instruments = new ArrayList<>();
        Instrument instrument;
        List<InstrumentContract> instrumentContracts = new ArrayList<>();
        InstrumentContract contract;

        instrumentRequest.getRequestInfo().setAction(ACTION_CREATE);

        for (InstrumentContract instrumentContract : instrumentRequest.getInstruments()) {
            instrument = mapper.toDomain(instrumentContract);
            instrument.setCreatedDate(new Date());
            instrument.setCreatedBy(instrumentRequest.getRequestInfo().getUserInfo());
            instrument.setLastModifiedBy(instrumentRequest.getRequestInfo().getUserInfo());
            instruments.add(instrument);
        }

        instruments = instrumentService.create(instruments, errors, instrumentRequest.getRequestInfo());

        for (Instrument i : instruments) {
            contract = mapper.toContract(i);
            instrumentContracts.add(contract);
        }

        instrumentResponse.setInstruments(instrumentContracts);

        return instrumentResponse;
    }

    @PostMapping("/_update")
    @ResponseStatus(HttpStatus.CREATED)
    public InstrumentResponse update(@RequestBody InstrumentRequest instrumentRequest, BindingResult errors) {

        InstrumentMapper mapper = new InstrumentMapper();
        instrumentRequest.getRequestInfo().setAction(ACTION_UPDATE);
        InstrumentResponse instrumentResponse = new InstrumentResponse();
        List<Instrument> instruments = new ArrayList<>();
        instrumentResponse.setResponseInfo(getResponseInfo(instrumentRequest.getRequestInfo()));
        Instrument instrument;
        InstrumentContract contract;
        List<InstrumentContract> instrumentContracts = new ArrayList<>();

        for (InstrumentContract instrumentContract : instrumentRequest.getInstruments()) {
            instrument = mapper.toDomain(instrumentContract);
            instrument.setLastModifiedBy(instrumentRequest.getRequestInfo().getUserInfo());
            instrument.setLastModifiedDate(new Date());
            instruments.add(instrument);
        }

        instruments = instrumentService.update(instruments, errors, instrumentRequest.getRequestInfo());

        for (Instrument i : instruments) {
            contract = mapper.toContract(i);
            instrumentContracts.add(contract);
        }

        instrumentResponse.setInstruments(instrumentContracts);

        return instrumentResponse;
    }

    @PostMapping("/_delete")
    @ResponseStatus(HttpStatus.CREATED)
    public InstrumentResponse delete(@RequestBody InstrumentRequest instrumentRequest, BindingResult errors) {

        InstrumentMapper mapper = new InstrumentMapper();
        instrumentRequest.getRequestInfo().setAction(ACTION_DELETE);
        InstrumentResponse instrumentResponse = new InstrumentResponse();
        List<Instrument> instruments = new ArrayList<>();
        instrumentResponse.setResponseInfo(getResponseInfo(instrumentRequest.getRequestInfo()));
        Instrument instrument;
        InstrumentContract contract;
        List<InstrumentContract> instrumentContracts = new ArrayList<>();

        for (InstrumentContract instrumentContract : instrumentRequest.getInstruments()) {
            instrument = mapper.toDomain(instrumentContract);
            instruments.add(instrument);
        }

        instruments = instrumentService.delete(instruments, errors, instrumentRequest.getRequestInfo());

        for (Instrument i : instruments) {
            contract = mapper.toContract(i);
            instrumentContracts.add(contract);
        }

        instrumentResponse.setInstruments(instrumentContracts);

        return instrumentResponse;
    }

    @PostMapping("/_search")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public InstrumentResponse search(@ModelAttribute InstrumentSearchContract instrumentSearchContract,
            RequestInfo requestInfo, BindingResult errors) {

        InstrumentMapper mapper = new InstrumentMapper();
        InstrumentSearch domain = mapper.toSearchDomain(instrumentSearchContract);
        InstrumentContract contract;
        List<InstrumentContract> instrumentContracts = new ArrayList<>();
        Pagination<Instrument> instruments = instrumentService.search(domain);

        if (instruments.getPagedData() != null)
            for (Instrument instrument : instruments.getPagedData()) {
                contract = mapper.toContract(instrument);
                instrumentContracts.add(contract);
            }

        InstrumentResponse response = new InstrumentResponse();
        response.setInstruments(instrumentContracts);
        response.setPage(new PaginationContract(instruments));
        response.setResponseInfo(getResponseInfo(requestInfo));

        return response;

    }

    @PostMapping("/_deposit")
    @ResponseStatus(HttpStatus.CREATED)
    public InstrumentResponse depositInstrument(@RequestBody InstrumentRequest instrumentDepositRequest, BindingResult errors) {

        InstrumentMapper mapper = new InstrumentMapper();
        InstrumentResponse instrumentResponse = new InstrumentResponse();
        instrumentResponse.setResponseInfo(getResponseInfo(instrumentDepositRequest.getRequestInfo()));
        List<Instrument> instruments = new ArrayList<>();
        List<InstrumentContract> instrumentContracts = new ArrayList<>();
        InstrumentContract contract;

        instrumentDepositRequest.getRequestInfo().setAction(ACTION_UPDATE);

        instruments = instrumentService.deposit(instrumentDepositRequest, errors, instrumentDepositRequest.getRequestInfo());

        for (Instrument i : instruments) {
            contract = mapper.toContract(i);
            instrumentContracts.add(contract);
        }

        instrumentResponse.setInstruments(instrumentContracts);

        return instrumentResponse;
    }

    @PostMapping("/_dishonor")
    @ResponseStatus(HttpStatus.CREATED)
    public InstrumentResponse dishonorInstrument(@RequestBody InstrumentRequest instrumentDepositRequest, BindingResult errors) {

        InstrumentMapper mapper = new InstrumentMapper();
        InstrumentResponse instrumentResponse = new InstrumentResponse();
        instrumentResponse.setResponseInfo(getResponseInfo(instrumentDepositRequest.getRequestInfo()));
        List<Instrument> instruments = new ArrayList<>();
        List<InstrumentContract> instrumentContracts = new ArrayList<>();
        InstrumentContract contract;

        instrumentDepositRequest.getRequestInfo().setAction(ACTION_UPDATE);

        instruments = instrumentService.dishonor(instrumentDepositRequest, errors, instrumentDepositRequest.getRequestInfo());

        for (Instrument i : instruments) {
            contract = mapper.toContract(i);
            instrumentContracts.add(contract);
        }

        instrumentResponse.setInstruments(instrumentContracts);

        return instrumentResponse;
    }

    private ResponseInfo getResponseInfo(RequestInfo requestInfo) {
        return ResponseInfo.builder().apiId(requestInfo.getApiId()).ver(requestInfo.getVer())
                .resMsgId(requestInfo.getMsgId()).resMsgId(PLACEHOLDER).status(PLACEHOLDER).build();
    }

}