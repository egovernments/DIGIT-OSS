package org.egov.egf.instrument.domain.service;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.ErrorCode;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.instrument.domain.model.InstrumentAccountCode;
import org.egov.egf.instrument.domain.model.InstrumentAccountCodeSearch;
import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.domain.model.InstrumentTypeSearch;
import org.egov.egf.instrument.domain.repository.InstrumentAccountCodeRepository;
import org.egov.egf.instrument.domain.repository.InstrumentTypeRepository;
import org.egov.egf.master.web.contract.ChartOfAccountContract;
import org.egov.egf.master.web.repository.ChartOfAccountContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class InstrumentAccountCodeService {

    public static final String ACTION_CREATE = "create";
    public static final String ACTION_UPDATE = "update";
    public static final String ACTION_DELETE = "delete";
    public static final String ACTION_VIEW = "view";
    public static final String ACTION_EDIT = "edit";
    public static final String ACTION_SEARCH = "search";

    private InstrumentAccountCodeRepository instrumentAccountCodeRepository;

    private SmartValidator validator;

    private ChartOfAccountContractRepository chartOfAccountContractRepository;

    private InstrumentTypeRepository instrumentTypeRepository;

    @Autowired
    public InstrumentAccountCodeService(SmartValidator validator,
            InstrumentAccountCodeRepository instrumentAccountCodeRepository,
            ChartOfAccountContractRepository chartOfAccountContractRepository,
            InstrumentTypeRepository instrumentTypeRepository) {
        this.validator = validator;
        this.instrumentAccountCodeRepository = instrumentAccountCodeRepository;
        this.chartOfAccountContractRepository = chartOfAccountContractRepository;
        this.instrumentTypeRepository = instrumentTypeRepository;
    }

    @Transactional
    public List<InstrumentAccountCode> create(List<InstrumentAccountCode> instrumentAccountCodes, BindingResult errors,
            RequestInfo requestInfo) {

        try {

            instrumentAccountCodes = fetchRelated(instrumentAccountCodes, requestInfo);

            validate(instrumentAccountCodes, ACTION_CREATE, errors);

            if (errors.hasErrors())
                throw new CustomBindException(errors);

        } catch (CustomBindException e) {

            throw new CustomBindException(errors);
        }

        return instrumentAccountCodeRepository.save(instrumentAccountCodes, requestInfo);

    }

    @Transactional
    public List<InstrumentAccountCode> update(List<InstrumentAccountCode> instrumentAccountCodes, BindingResult errors,
            RequestInfo requestInfo) {

        try {

            instrumentAccountCodes = fetchRelated(instrumentAccountCodes, requestInfo);

            validate(instrumentAccountCodes, ACTION_UPDATE, errors);

            if (errors.hasErrors())
                throw new CustomBindException(errors);

        } catch (CustomBindException e) {

            throw new CustomBindException(errors);
        }

        return instrumentAccountCodeRepository.update(instrumentAccountCodes, requestInfo);

    }

    @Transactional
    public List<InstrumentAccountCode> delete(List<InstrumentAccountCode> instrumentAccountCodes, BindingResult errors,
            RequestInfo requestInfo) {

        try {

            validate(instrumentAccountCodes, ACTION_DELETE, errors);

            if (errors.hasErrors())
                throw new CustomBindException(errors);

        } catch (CustomBindException e) {

            throw new CustomBindException(errors);

        }

        return instrumentAccountCodeRepository.delete(instrumentAccountCodes, requestInfo);
    }

    private BindingResult validate(List<InstrumentAccountCode> instrumentaccountcodes, String method,
            BindingResult errors) {

        try {
            switch (method) {
            case ACTION_VIEW:
                // validator.validate(instrumentAccountCodeContractRequest.getInstrumentAccountCode(),
                // errors);
                break;
            case ACTION_CREATE:
                if (instrumentaccountcodes == null)
                    throw new InvalidDataException("instrumentaccountcodes", ErrorCode.NOT_NULL.getCode(), null);
                for (InstrumentAccountCode instrumentAccountCode : instrumentaccountcodes) {
                    validator.validate(instrumentAccountCode, errors);
                    if (!instrumentAccountCodeRepository.uniqueCheck("instrumentTypeId", instrumentAccountCode))
                        errors.addError(new FieldError("instrumentAccountCode", "instrumentType",
                                instrumentAccountCode.getInstrumentType(), false,
                                new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                }
                break;
            case ACTION_UPDATE:
                if (instrumentaccountcodes == null)
                    throw new InvalidDataException("instrumentaccountcodes", ErrorCode.NOT_NULL.getCode(), null);
                for (InstrumentAccountCode instrumentAccountCode : instrumentaccountcodes) {
                    if (instrumentAccountCode.getId() == null)
                        throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                instrumentAccountCode.getId());
                    validator.validate(instrumentAccountCode, errors);
                    if (!instrumentAccountCodeRepository.uniqueCheck("instrumentTypeId", instrumentAccountCode))
                        errors.addError(new FieldError("instrumentAccountCode", "instrumentType",
                                instrumentAccountCode.getInstrumentType(), false,
                                new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                }
                break;
            case ACTION_DELETE:
                if (instrumentaccountcodes == null)
                    throw new InvalidDataException("instrumentaccountcodes", ErrorCode.NOT_NULL.getCode(), null);
                for (InstrumentAccountCode instrumentaccountcode : instrumentaccountcodes)
                    if (instrumentaccountcode.getId() == null)
                        throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                instrumentaccountcode.getId());
            default:

            }
        } catch (IllegalArgumentException e) {
            errors.addError(new ObjectError("Missing data", e.getMessage()));
        }
        return errors;

    }

    public List<InstrumentAccountCode> fetchRelated(List<InstrumentAccountCode> instrumentaccountcodes, RequestInfo requestInfo) {

        if (instrumentaccountcodes != null)
            for (InstrumentAccountCode instrumentAccountCode : instrumentaccountcodes) {

                // fetch related items

                if (instrumentAccountCode.getInstrumentType() != null
                        && instrumentAccountCode.getInstrumentType().getName() != null) {
                    InstrumentTypeSearch instrumentTypeSearch = new InstrumentTypeSearch();
                    instrumentTypeSearch.setName(instrumentAccountCode.getInstrumentType().getName());
                    instrumentTypeSearch.setTenantId(instrumentAccountCode.getInstrumentType().getTenantId());
                    Pagination<InstrumentType> response = instrumentTypeRepository.search(instrumentTypeSearch);
                    if (response == null || response.getPagedData() == null || response.getPagedData().isEmpty())
                        throw new InvalidDataException("instrumentTypeSearchResult", ErrorCode.INVALID_REF_VALUE.getCode(), null);
                    instrumentAccountCode.setInstrumentType(response.getPagedData().get(0));
                }

                if (instrumentAccountCode.getAccountCode() != null
                        && instrumentAccountCode.getAccountCode().getGlcode() != null) {

                    instrumentAccountCode.getAccountCode().setTenantId(instrumentAccountCode.getTenantId());
                    ChartOfAccountContract accountCode = chartOfAccountContractRepository
                            .findByGlcode(instrumentAccountCode.getAccountCode(), requestInfo);

                    if (accountCode == null)
                        throw new InvalidDataException("accountCode", ErrorCode.INVALID_REF_VALUE.getCode(), null);

                    instrumentAccountCode.setAccountCode(accountCode);
                }

            }

        return instrumentaccountcodes;
    }

    @Transactional
    public InstrumentAccountCode delete(InstrumentAccountCode instrumentAccountCode) {
        return instrumentAccountCodeRepository.delete(instrumentAccountCode);
    }

    public Pagination<InstrumentAccountCode> search(InstrumentAccountCodeSearch instrumentAccountCodeSearch) {
        return instrumentAccountCodeRepository.search(instrumentAccountCodeSearch);
    }

    @Transactional
    public InstrumentAccountCode save(InstrumentAccountCode instrumentAccountCode) {
        return instrumentAccountCodeRepository.save(instrumentAccountCode);
    }

    @Transactional
    public InstrumentAccountCode update(InstrumentAccountCode instrumentAccountCode) {
        return instrumentAccountCodeRepository.update(instrumentAccountCode);
    }

}