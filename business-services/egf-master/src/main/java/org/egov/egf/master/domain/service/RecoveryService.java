package org.egov.egf.master.domain.service;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.ErrorCode;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.util.ApplicationThreadLocals;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.ChartOfAccountSearch;
import org.egov.egf.master.domain.model.Recovery;
import org.egov.egf.master.domain.model.RecoverySearch;
import org.egov.egf.master.domain.repository.ChartOfAccountRepository;
import org.egov.egf.master.domain.repository.RecoveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class RecoveryService {

    @Autowired
    private RecoveryRepository recoveryRepository;

    @Autowired
    private SmartValidator validator;

    @Autowired
    private ChartOfAccountRepository chartOfAccountRepository;

    @Transactional
    public List<Recovery> create(List<Recovery> recoveries, BindingResult errors,
                                 RequestInfo requestInfo) {

        try {

            recoveries = fetchRelated(recoveries);

            validate(recoveries, Constants.ACTION_CREATE, errors);

            if (errors.hasErrors()) {
                throw new CustomBindException(errors);
            }
            for (Recovery b : recoveries) {
                b.setId(recoveryRepository.getNextSequence());
            }

        } catch (CustomBindException e) {

            throw new CustomBindException(errors);
        }

        return recoveryRepository.save(recoveries, requestInfo);

    }

    @Transactional
    public List<Recovery> update(List<Recovery> recoveries, BindingResult errors,
                                 RequestInfo requestInfo) {

        try {

            recoveries = fetchRelated(recoveries);

            validate(recoveries, Constants.ACTION_UPDATE, errors);

            if (errors.hasErrors()) {
                throw new CustomBindException(errors);
            }

        } catch (CustomBindException e) {

            throw new CustomBindException(errors);
        }

        return recoveryRepository.update(recoveries, requestInfo);

    }

    private BindingResult validate(List<Recovery> recoveries, String method, BindingResult errors) {

                try {
                    switch (method) {
                    case Constants.ACTION_VIEW:
                        // validator.validate(fundContractRequest.getFund(), errors);
                        break;
                    case Constants.ACTION_CREATE:
                        if (recoveries == null) {
                            throw new InvalidDataException("recoveries", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (Recovery recovery : recoveries) {
                            validator.validate(recovery, errors);
                            if (!recoveryRepository.uniqueCheck("name", recovery)) {
                                errors.addError(new FieldError("recovery", "name", recovery.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!recoveryRepository.uniqueCheck("code", recovery)) {
                                errors.addError(new FieldError("recovery", "code", recovery.getCode(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_UPDATE:
                        if (recoveries == null) {
                            throw new InvalidDataException("recoveries", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (Recovery recovery : recoveries) {
                            if (recovery.getId() == null) {
                                throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(), recovery.getId());
                            }
                            validator.validate(recovery, errors);
                            if (!recoveryRepository.uniqueCheck("name", recovery)) {
                                errors.addError(new FieldError("recovery", "name", recovery.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!recoveryRepository.uniqueCheck("code", recovery)) {
                                errors.addError(new FieldError("recovery", "code", recovery.getCode(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_SEARCH:
                        if (recoveries == null) {
                            throw new InvalidDataException("recoveries", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (Recovery recovery : recoveries) {
                            if (recovery.getTenantId() == null) {
                                throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                        recovery.getTenantId());
                            }
                        }
                        break;
                    default:
        
                    }
                } catch (IllegalArgumentException e) {
            errors.addError(new ObjectError("Missing data", e.getMessage()));
        }
        return errors;
    }

    public List<Recovery> fetchRelated(List<Recovery> recoveries) {
        for (Recovery recovery : recoveries) {
            // fetch related items
            recovery.setTenantId(ApplicationThreadLocals.getTenantId().get());
            if(recovery.getChartOfAccount() != null) {
                ChartOfAccountSearch chartOfAccountSearch = new ChartOfAccountSearch();
                chartOfAccountSearch.setGlcode(recovery.getChartOfAccount().getGlcode());
                Pagination<ChartOfAccount> response = chartOfAccountRepository.search(chartOfAccountSearch);
                if (response == null || response.getPagedData() == null || response.getPagedData().isEmpty()) {
                    throw new InvalidDataException("chartOfAccount", "chartOfAccount.invalid", " Invalid chartOfAccount");
                }else{
                   recovery.setChartOfAccount(response.getPagedData().get(0));
                }
            }
        }

        return recoveries;

    }

    public Pagination<Recovery> search(RecoverySearch recoverySearch, BindingResult errors) {
        
        try {
            
            List<Recovery> recoveries = new ArrayList<>();
            recoveries.add(recoverySearch);
            validate(recoveries, Constants.ACTION_SEARCH, errors);

            if (errors.hasErrors()) {
                throw new CustomBindException(errors);
            }
        
        } catch (CustomBindException e) {

            throw new CustomBindException(errors);
        }

        return recoveryRepository.search(recoverySearch);
    }

    @Transactional
    public Recovery save(Recovery recovery) {
        return recoveryRepository.save(recovery);
    }

    @Transactional
    public Recovery update(Recovery recovery) {
        return recoveryRepository.update(recovery);
    }

}