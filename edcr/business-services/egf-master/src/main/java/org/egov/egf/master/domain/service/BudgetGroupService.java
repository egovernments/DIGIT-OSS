package org.egov.egf.master.domain.service;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.constants.Constants;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.ErrorCode;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.util.ApplicationThreadLocals;
import org.egov.egf.master.domain.model.BudgetGroup;
import org.egov.egf.master.domain.model.BudgetGroupSearch;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.repository.BudgetGroupRepository;
import org.egov.egf.master.domain.repository.ChartOfAccountRepository;
import org.egov.egf.master.web.requests.BudgetGroupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class BudgetGroupService {

	@Autowired
	private BudgetGroupRepository budgetGroupRepository;

	@Autowired
	private SmartValidator validator;
	@Autowired
	private ChartOfAccountRepository chartOfAccountRepository;

	private BindingResult validate(List<BudgetGroup> budgetgroups, String method, BindingResult errors) {

                try {
                    switch (method) {
                    case Constants.ACTION_VIEW:
                        // validator.validate(budgetGroupContractRequest.getBudgetGroup(),
                        // errors);
                        break;
                    case Constants.ACTION_CREATE:
                        if (budgetgroups == null) {
                            throw new InvalidDataException("budgetgroups", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (BudgetGroup budgetGroup : budgetgroups) {
                            validator.validate(budgetGroup, errors);
                            if (!budgetGroupRepository.uniqueCheck("name", budgetGroup)) {
                                errors.addError(new FieldError("budgetGroup", "name", budgetGroup.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_UPDATE:
                        if (budgetgroups == null) {
                            throw new InvalidDataException("budgetgroups", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (BudgetGroup budgetGroup : budgetgroups) {
                            if (budgetGroup.getId() == null) {
                                throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(), budgetGroup.getId());
                            }
                            validator.validate(budgetGroup, errors);
                            if (!budgetGroupRepository.uniqueCheck("name", budgetGroup)) {
                                errors.addError(new FieldError("budgetGroup", "name", budgetGroup.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_SEARCH:
                        if (budgetgroups == null) {
                            throw new InvalidDataException("budgetgroups", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (BudgetGroup budgetgroup : budgetgroups) {
                            if (budgetgroup.getTenantId() == null) {
                                throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                        budgetgroup.getTenantId());
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

	public List<BudgetGroup> fetchRelated(List<BudgetGroup> budgetgroups) {
		for (BudgetGroup budgetGroup : budgetgroups) {
			// fetch related items
			budgetGroup.setTenantId(ApplicationThreadLocals.getTenantId().get());
			if (budgetGroup.getMajorCode() != null) {
				ChartOfAccount majorCode = chartOfAccountRepository.findById(budgetGroup.getMajorCode());
				if (majorCode == null) {
					throw new InvalidDataException("majorCode", "majorCode.invalid", " Invalid majorCode");
				}
				budgetGroup.setMajorCode(majorCode);
			}
			if (budgetGroup.getMaxCode() != null) {
				ChartOfAccount maxCode = chartOfAccountRepository.findById(budgetGroup.getMaxCode());
				if (maxCode == null) {
					throw new InvalidDataException("maxCode", "maxCode.invalid", " Invalid maxCode");
				}
				budgetGroup.setMaxCode(maxCode);
			}
			if (budgetGroup.getMinCode() != null) {
				ChartOfAccount minCode = chartOfAccountRepository.findById(budgetGroup.getMinCode());
				if (minCode == null) {
					throw new InvalidDataException("minCode", "minCode.invalid", " Invalid minCode");
				}
				budgetGroup.setMinCode(minCode);
			}

		}

		return budgetgroups;
	}

	@Transactional
	public List<BudgetGroup> add(List<BudgetGroup> budgetgroups, BindingResult errors) {
		budgetgroups = fetchRelated(budgetgroups);
		validate(budgetgroups, Constants.ACTION_CREATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		for(BudgetGroup b:budgetgroups)b.setId(budgetGroupRepository.getNextSequence());
		return budgetgroups;

	}

	@Transactional
	public List<BudgetGroup> update(List<BudgetGroup> budgetgroups, BindingResult errors) {
		budgetgroups = fetchRelated(budgetgroups);
		validate(budgetgroups, Constants.ACTION_UPDATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		return budgetgroups;

	}

	public void addToQue(BudgetGroupRequest request) {
		budgetGroupRepository.add(request);
	}

        public Pagination<BudgetGroup> search(BudgetGroupSearch budgetGroupSearch, BindingResult errors) {
            
            try {
                
                List<BudgetGroup> budgetGroups = new ArrayList<>();
                budgetGroups.add(budgetGroupSearch);
                validate(budgetGroups, Constants.ACTION_SEARCH, errors);
    
                if (errors.hasErrors()) {
                    throw new CustomBindException(errors);
                }
            
            } catch (CustomBindException e) {
    
                throw new CustomBindException(errors);
            }
    
            return budgetGroupRepository.search(budgetGroupSearch);
        }

	@Transactional
	public BudgetGroup save(BudgetGroup budgetGroup) {
		return budgetGroupRepository.save(budgetGroup);
	}

	@Transactional
	public BudgetGroup update(BudgetGroup budgetGroup) {
		return budgetGroupRepository.update(budgetGroup);
	}

}