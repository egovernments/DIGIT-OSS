package org.egov.egf.master.domain.service;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.constants.Constants;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.ErrorCode;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.util.ApplicationThreadLocals;
import org.egov.egf.master.domain.model.AccountCodePurpose;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.ChartOfAccountSearch;
import org.egov.egf.master.domain.repository.AccountCodePurposeRepository;
import org.egov.egf.master.domain.repository.ChartOfAccountRepository;
import org.egov.egf.master.web.requests.ChartOfAccountRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class ChartOfAccountService {

	@Autowired
	private ChartOfAccountRepository chartOfAccountRepository;

	@Autowired
	private SmartValidator validator;

	@Autowired
	private AccountCodePurposeRepository accountCodePurposeRepository;

	private BindingResult validate(List<ChartOfAccount> chartofaccounts, String method, BindingResult errors) {

                try {
                    switch (method) {
                    case Constants.ACTION_VIEW:
                        // validator.validate(chartOfAccountContractRequest.getChartOfAccount(),
                        // errors);
                        break;
                    case Constants.ACTION_CREATE:
                        if (chartofaccounts == null) {
                            throw new InvalidDataException("chartofaccounts", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (ChartOfAccount chartOfAccount : chartofaccounts) {
                            validator.validate(chartOfAccount, errors);
                            if (!chartOfAccountRepository.uniqueCheck("name", chartOfAccount)) {
                                errors.addError(new FieldError("chartOfAccount", "name", chartOfAccount.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!chartOfAccountRepository.uniqueCheck("glcode", chartOfAccount)) {
                                errors.addError(new FieldError("chartOfAccount", "glcode", chartOfAccount.getGlcode(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_UPDATE:
                        if (chartofaccounts == null) {
                            throw new InvalidDataException("chartofaccounts", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (ChartOfAccount chartOfAccount : chartofaccounts) {
                            if (chartOfAccount.getId() == null) {
                                throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(), chartOfAccount.getId());
                            }
                            validator.validate(chartOfAccount, errors);
                            if (!chartOfAccountRepository.uniqueCheck("name", chartOfAccount)) {
                                errors.addError(new FieldError("chartOfAccount", "name", chartOfAccount.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!chartOfAccountRepository.uniqueCheck("glcode", chartOfAccount)) {
                                errors.addError(new FieldError("chartOfAccount", "glcode", chartOfAccount.getGlcode(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_SEARCH:
                        if (chartofaccounts == null) {
                            throw new InvalidDataException("chartofaccounts", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (ChartOfAccount chartofaccount : chartofaccounts) {
                            if (chartofaccount.getTenantId() == null) {
                                throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                        chartofaccount.getTenantId());
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

	public List<ChartOfAccount> fetchRelated(List<ChartOfAccount> chartofaccounts) {
		for (ChartOfAccount chartOfAccount : chartofaccounts) {
			// fetch related items
			chartOfAccount.setTenantId(ApplicationThreadLocals.getTenantId().get());
			if (chartOfAccount.getAccountCodePurpose() != null) {
				AccountCodePurpose accountCodePurpose = accountCodePurposeRepository
						.findById(chartOfAccount.getAccountCodePurpose());
				if (accountCodePurpose == null) {
					throw new InvalidDataException("accountCodePurpose", "accountCodePurpose.invalid",
							" Invalid accountCodePurpose");
				}
				chartOfAccount.setAccountCodePurpose(accountCodePurpose);
			}
			if (chartOfAccount.getParentId() != null) {
				ChartOfAccount parentId = chartOfAccountRepository.findById(chartOfAccount.getParentId());
				if (parentId == null) {
					throw new InvalidDataException("parentId", "parentId.invalid", " Invalid parentId");
				}
				chartOfAccount.setParentId(parentId);
			}

		}

		return chartofaccounts;
	}

	@Transactional
	public List<ChartOfAccount> add(List<ChartOfAccount> chartofaccounts, BindingResult errors) {
		chartofaccounts = fetchRelated(chartofaccounts);
		validate(chartofaccounts, Constants.ACTION_CREATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		for(ChartOfAccount b:chartofaccounts)b.setId(chartOfAccountRepository.getNextSequence());
		return chartofaccounts;

	}

	@Transactional
	public List<ChartOfAccount> update(List<ChartOfAccount> chartofaccounts, BindingResult errors) {
		chartofaccounts = fetchRelated(chartofaccounts);
		validate(chartofaccounts, Constants.ACTION_UPDATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		return chartofaccounts;

	}

	public void addToQue(ChartOfAccountRequest request) {
		chartOfAccountRepository.add(request);
	}

        public Pagination<ChartOfAccount> search(ChartOfAccountSearch chartOfAccountSearch, BindingResult errors) {
            
            try {
                
                List<ChartOfAccount> chartOfAccounts = new ArrayList<>();
                chartOfAccounts.add(chartOfAccountSearch);
                validate(chartOfAccounts, Constants.ACTION_SEARCH, errors);
    
                if (errors.hasErrors()) {
                    throw new CustomBindException(errors);
                }
            
            } catch (CustomBindException e) {
    
                throw new CustomBindException(errors);
            }
    
            return chartOfAccountRepository.search(chartOfAccountSearch);
        }

	@Transactional
	public ChartOfAccount save(ChartOfAccount chartOfAccount) {
		return chartOfAccountRepository.save(chartOfAccount);
	}

	@Transactional
	public ChartOfAccount update(ChartOfAccount chartOfAccount) {
		return chartOfAccountRepository.update(chartOfAccount);
	}

}