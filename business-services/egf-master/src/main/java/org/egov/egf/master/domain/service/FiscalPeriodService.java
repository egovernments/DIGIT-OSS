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
import org.egov.egf.master.domain.model.FiscalPeriod;
import org.egov.egf.master.domain.model.FiscalPeriodSearch;
import org.egov.egf.master.domain.repository.FinancialYearRepository;
import org.egov.egf.master.domain.repository.FiscalPeriodRepository;
import org.egov.egf.master.web.requests.FiscalPeriodRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class FiscalPeriodService {

	@Autowired
	private FiscalPeriodRepository fiscalPeriodRepository;

	@Autowired
	private SmartValidator validator;
	@Autowired
	private FinancialYearRepository financialYearRepository;

	private BindingResult validate(List<FiscalPeriod> fiscalperiods, String method, BindingResult errors) {

                try {
                    switch (method) {
                    case Constants.ACTION_VIEW:
                        // validator.validate(fiscalPeriodContractRequest.getFiscalPeriod(),
                        // errors);
                        break;
                    case Constants.ACTION_CREATE:
                        if (fiscalperiods == null) {
                            throw new InvalidDataException("fiscalperiods", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (FiscalPeriod fiscalPeriod : fiscalperiods) {
                            validator.validate(fiscalPeriod, errors);
                            if (!fiscalPeriodRepository.uniqueCheck("name", fiscalPeriod)) {
                                errors.addError(new FieldError("fiscalPeriod", "name", fiscalPeriod.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_UPDATE:
                        if (fiscalperiods == null) {
                            throw new InvalidDataException("fiscalperiods", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (FiscalPeriod fiscalPeriod : fiscalperiods) {
                            if (fiscalPeriod.getId() == null) {
                                throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(), fiscalPeriod.getId());
                            }
                            validator.validate(fiscalPeriod, errors);
                            if (!fiscalPeriodRepository.uniqueCheck("name", fiscalPeriod)) {
                                errors.addError(new FieldError("fiscalPeriod", "name", fiscalPeriod.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_SEARCH:
                        if (fiscalperiods == null) {
                            throw new InvalidDataException("fiscalperiods", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (FiscalPeriod fiscalperiod : fiscalperiods) {
                            if (fiscalperiod.getTenantId() == null) {
                                throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                        fiscalperiod.getTenantId());
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

	public List<FiscalPeriod> fetchRelated(List<FiscalPeriod> fiscalperiods) {
		for (FiscalPeriod fiscalPeriod : fiscalperiods) {
			// fetch related items
            fiscalPeriod.setTenantId(ApplicationThreadLocals.getTenantId().get());
			if (fiscalPeriod.getFinancialYear() != null) {
				FinancialYear financialYear = financialYearRepository.findById(fiscalPeriod.getFinancialYear());
				if (financialYear == null) {
					throw new InvalidDataException("financialYear", "financialYear.invalid", " Invalid financialYear");
				}
				fiscalPeriod.setFinancialYear(financialYear);
			}

		}

		return fiscalperiods;
	}

	@Transactional
	public List<FiscalPeriod> add(List<FiscalPeriod> fiscalperiods, BindingResult errors) {
		fiscalperiods = fetchRelated(fiscalperiods);
		validate(fiscalperiods, Constants.ACTION_CREATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		for(FiscalPeriod b:fiscalperiods)b.setId(fiscalPeriodRepository.getNextSequence());
		return fiscalperiods;

	}

	@Transactional
	public List<FiscalPeriod> update(List<FiscalPeriod> fiscalperiods, BindingResult errors) {
		fiscalperiods = fetchRelated(fiscalperiods);
		validate(fiscalperiods, Constants.ACTION_UPDATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		return fiscalperiods;

	}

	public void addToQue(FiscalPeriodRequest request) {
		fiscalPeriodRepository.add(request);
	}

        public Pagination<FiscalPeriod> search(FiscalPeriodSearch fiscalPeriodSearch, BindingResult errors) {
            
            try {
                
                List<FiscalPeriod> fiscalPeriods = new ArrayList<>();
                fiscalPeriods.add(fiscalPeriodSearch);
                validate(fiscalPeriods, Constants.ACTION_SEARCH, errors);
    
                if (errors.hasErrors()) {
                    throw new CustomBindException(errors);
                }
            
            } catch (CustomBindException e) {
    
                throw new CustomBindException(errors);
            }
    
            return fiscalPeriodRepository.search(fiscalPeriodSearch);
        }

	@Transactional
	public FiscalPeriod save(FiscalPeriod fiscalPeriod) {
		return fiscalPeriodRepository.save(fiscalPeriod);
	}

	@Transactional
	public FiscalPeriod update(FiscalPeriod fiscalPeriod) {
		return fiscalPeriodRepository.update(fiscalPeriod);
	}

}