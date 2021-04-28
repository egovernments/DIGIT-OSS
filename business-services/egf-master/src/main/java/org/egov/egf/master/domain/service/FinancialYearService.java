package org.egov.egf.master.domain.service;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.constants.Constants;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.ErrorCode;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.util.ApplicationThreadLocals;
import org.egov.egf.master.domain.model.FinancialYear;
import org.egov.egf.master.domain.model.FinancialYearSearch;
import org.egov.egf.master.domain.repository.FinancialYearRepository;
import org.egov.egf.master.web.requests.FinancialYearRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class FinancialYearService {

	@Autowired
	private FinancialYearRepository financialYearRepository;

	@Autowired
	private SmartValidator validator;

	public BindingResult validate(List<FinancialYear> financialyears, String method, BindingResult errors) {

                try {
                    switch (method) {
                    case Constants.ACTION_VIEW:
                        // validator.validate(financialYearContractRequest.getFinancialYear(),
                        // errors);
                        break;
                    case Constants.ACTION_CREATE:
                        if (financialyears == null) {
                            throw new InvalidDataException("financialyears", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (FinancialYear financialYear : financialyears) {
                            validator.validate(financialYear, errors);
                            if (!financialYearRepository.uniqueCheck("finYearRange", financialYear)) {
                                errors.addError(new FieldError("financialYear", "finYearRange", financialYear.getFinYearRange(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!financialYearRepository.uniqueCheck("startingdate", financialYear)) {
                                errors.addError(new FieldError("financialYear", "startingdate", financialYear.getStartingDate(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!financialYearRepository.uniqueCheck("endingdate", financialYear)) {
                                errors.addError(new FieldError("financialYear", "endingdate", financialYear.getEndingDate(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_UPDATE:
                        if (financialyears == null) {
                            throw new InvalidDataException("financialyears", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (FinancialYear financialYear : financialyears) {
                            if (financialYear.getId() == null) {
                                throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(), financialYear.getId());
                            }
                            validator.validate(financialYear, errors);
                            if (!financialYearRepository.uniqueCheck("finYearRange", financialYear)) {
                                errors.addError(new FieldError("financialYear", "finYearRange", financialYear.getFinYearRange(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!financialYearRepository.uniqueCheck("startingdate", financialYear)) {
                                errors.addError(new FieldError("financialYear", "startingdate", financialYear.getStartingDate(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!financialYearRepository.uniqueCheck("endingdate", financialYear)) {
                                errors.addError(new FieldError("financialYear", "endingdate", financialYear.getEndingDate(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_SEARCH:
                        if (financialyears == null) {
                            throw new InvalidDataException("financialyears", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (FinancialYear financialyear : financialyears) {
                            if (financialyear.getTenantId() == null) {
                                throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                        financialyear.getTenantId());
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

	public List<FinancialYear> fetchRelated(List<FinancialYear> financialyears) {
		for (FinancialYear financialYear : financialyears) {
			// fetch related items
            financialYear.setTenantId(ApplicationThreadLocals.getTenantId().get());

		}

		return financialyears;
	}

	@Transactional
	public List<FinancialYear> add(List<FinancialYear> financialyears, BindingResult errors) {
		financialyears = fetchRelated(financialyears);
		validate(financialyears, Constants.ACTION_CREATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		for(FinancialYear b:financialyears)b.setId(financialYearRepository.getNextSequence());
		return financialyears;

	}

	public List<FinancialYear> update(List<FinancialYear> financialyears, BindingResult errors) {
		financialyears = fetchRelated(financialyears);
		validate(financialyears, Constants.ACTION_UPDATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		return financialyears;

	}

	public void addToQue(FinancialYearRequest request) {
		financialYearRepository.add(request);
	}

        public Pagination<FinancialYear> search(FinancialYearSearch financialYearSearch, BindingResult errors) {
            
            try {
                
                List<FinancialYear> financialYears = new ArrayList<>();
                financialYears.add(financialYearSearch);
                validate(financialYears, Constants.ACTION_SEARCH, errors);
    
                if (errors.hasErrors()) {
                    throw new CustomBindException(errors);
                }
            
            } catch (CustomBindException e) {
    
                throw new CustomBindException(errors);
            }
    
            return financialYearRepository.search(financialYearSearch);
        }

	@Transactional
	public FinancialYear save(FinancialYear financialYear) {
		return financialYearRepository.save(financialYear);
	}

	@Transactional
	public FinancialYear update(FinancialYear financialYear) {
		return financialYearRepository.update(financialYear);
	}
}