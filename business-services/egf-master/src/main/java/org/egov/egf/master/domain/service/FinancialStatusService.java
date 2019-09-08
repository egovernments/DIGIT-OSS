package org.egov.egf.master.domain.service;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.constants.Constants;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.ErrorCode;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.util.ApplicationThreadLocals;
import org.egov.egf.master.domain.model.FinancialStatus;
import org.egov.egf.master.domain.model.FinancialStatusSearch;
import org.egov.egf.master.domain.repository.FinancialStatusRepository;
import org.egov.egf.master.web.requests.FinancialStatusRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class FinancialStatusService {

	@Autowired
	private FinancialStatusRepository financialStatusRepository;

	@Autowired
	private SmartValidator validator;

	private BindingResult validate(List<FinancialStatus> financialstatuses, String method, BindingResult errors) {

                try {
                    switch (method) {
                    case Constants.ACTION_VIEW:
                        // validator.validate(financialStatusContractRequest.getFinancialStatus(),
                        // errors);
                        break;
                    case Constants.ACTION_CREATE:
                        if (financialstatuses == null) {
                            throw new InvalidDataException("financialstatuses", ErrorCode.NOT_NULL.getCode(),
                                    null);
                        }
                        for (FinancialStatus financialStatus : financialstatuses) {
                            validator.validate(financialStatus, errors);
                            if (!financialStatusRepository.uniqueCheck("name", financialStatus)) {
                                errors.addError(new FieldError("financialStatus", "name", financialStatus.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!financialStatusRepository.uniqueCheck("code", financialStatus)) {
                                errors.addError(new FieldError("financialStatus", "code", financialStatus.getCode(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_UPDATE:
                        if (financialstatuses == null) {
                            throw new InvalidDataException("financialstatuses", ErrorCode.NOT_NULL.getCode(),
                                    null);
                        }
                        for (FinancialStatus financialStatus : financialstatuses) {
                            if (financialStatus.getId() == null) {
                                throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(), financialStatus.getId());
                            }
                            validator.validate(financialStatus, errors);
                            if (!financialStatusRepository.uniqueCheck("name", financialStatus)) {
                                errors.addError(new FieldError("financialStatus", "name", financialStatus.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!financialStatusRepository.uniqueCheck("code", financialStatus)) {
                                errors.addError(new FieldError("financialStatus", "code", financialStatus.getCode(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_SEARCH:
                        if (financialstatuses == null) {
                            throw new InvalidDataException("financialstatuses", ErrorCode.NOT_NULL.getCode(),
                                    null);
                        }
                        for (FinancialStatus financialstatus : financialstatuses) {
                            if (financialstatus.getTenantId() == null) {
                                throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                        financialstatus.getTenantId());
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

	public List<FinancialStatus> fetchRelated(List<FinancialStatus> financialstatuses) {
		for (FinancialStatus financialStatus : financialstatuses) {
			// fetch related items
            financialStatus.setTenantId(ApplicationThreadLocals.getTenantId().get());

		}

		return financialstatuses;
	}

	@Transactional
	public List<FinancialStatus> add(List<FinancialStatus> financialstatuses, BindingResult errors) {
		financialstatuses = fetchRelated(financialstatuses);
		validate(financialstatuses, Constants.ACTION_CREATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		return financialstatuses;

	}

	@Transactional
	public List<FinancialStatus> update(List<FinancialStatus> financialstatuses, BindingResult errors) {
		financialstatuses = fetchRelated(financialstatuses);
		validate(financialstatuses, Constants.ACTION_UPDATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		return financialstatuses;

	}

	public void addToQue(FinancialStatusRequest request) {
		financialStatusRepository.add(request);
	}

        public Pagination<FinancialStatus> search(FinancialStatusSearch financialStatusSearch, BindingResult errors) {
            
            try {
                
                List<FinancialStatus> financialStatuses = new ArrayList<>();
                financialStatuses.add(financialStatusSearch);
                validate(financialStatuses, Constants.ACTION_SEARCH, errors);
    
                if (errors.hasErrors()) {
                    throw new CustomBindException(errors);
                }
            
            } catch (CustomBindException e) {
    
                throw new CustomBindException(errors);
            }
    
            return financialStatusRepository.search(financialStatusSearch);
        }

	@Transactional
	public FinancialStatus save(FinancialStatus financialStatus) {
		return financialStatusRepository.save(financialStatus);
	}

	@Transactional
	public FinancialStatus update(FinancialStatus financialStatus) {
		return financialStatusRepository.update(financialStatus);
	}

}