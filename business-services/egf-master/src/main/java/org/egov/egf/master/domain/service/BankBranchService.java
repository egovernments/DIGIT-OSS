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
import org.egov.egf.master.domain.model.Bank;
import org.egov.egf.master.domain.model.BankBranch;
import org.egov.egf.master.domain.model.BankBranchSearch;
import org.egov.egf.master.domain.repository.BankBranchRepository;
import org.egov.egf.master.domain.repository.BankRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class BankBranchService {

	@Autowired
	private BankBranchRepository bankBranchRepository;

	@Autowired
	private SmartValidator validator;
	@Autowired
	private BankRepository bankRepository;

	@Transactional
	public List<BankBranch> create(List<BankBranch> bankBranches, BindingResult errors, RequestInfo requestInfo) {

		try {

			bankBranches = fetchRelated(bankBranches);

			validate(bankBranches, Constants.ACTION_CREATE, errors);

			if (errors.hasErrors()) {
				throw new CustomBindException(errors);
			}
			for (BankBranch b : bankBranches) {
				b.setId(bankBranchRepository.getNextSequence());
			}

		} catch (CustomBindException e) {

			throw new CustomBindException(errors);
		}

		return bankBranchRepository.save(bankBranches, requestInfo);

	}

	@Transactional
	public List<BankBranch> update(List<BankBranch> bankBranches, BindingResult errors, RequestInfo requestInfo) {

		try {

			bankBranches = fetchRelated(bankBranches);

			validate(bankBranches, Constants.ACTION_UPDATE, errors);

			if (errors.hasErrors()) {
				throw new CustomBindException(errors);
			}

		} catch (CustomBindException e) {

			throw new CustomBindException(errors);
		}

		return bankBranchRepository.update(bankBranches, requestInfo);

	}

	private BindingResult validate(List<BankBranch> bankbranches, String method, BindingResult errors) {

                try {
                    switch (method) {
                    case Constants.ACTION_VIEW:
                        // validator.validate(bankBranchContractRequest.getBankBranch(),
                        // errors);
                        break;
                    case Constants.ACTION_CREATE:
                        if (bankbranches == null) {
                            throw new InvalidDataException("bankbranches", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (BankBranch bankBranch : bankbranches) {
                            validator.validate(bankBranch, errors);
                            if (!bankBranchRepository.uniqueCheck("name", bankBranch)) {
                                errors.addError(new FieldError("bankBranch", "name", bankBranch.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!bankBranchRepository.uniqueCheck("code", bankBranch)) {
                                errors.addError(new FieldError("bankBranch", "code", bankBranch.getCode(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_UPDATE:
                        if (bankbranches == null) {
                            throw new InvalidDataException("bankbranches", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (BankBranch bankBranch : bankbranches) {
                            if (bankBranch.getId() == null) {
                                throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(), bankBranch.getId());
                            }
                            validator.validate(bankBranch, errors);
                            if (!bankBranchRepository.uniqueCheck("name", bankBranch)) {
                                errors.addError(new FieldError("bankBranch", "name", bankBranch.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!bankBranchRepository.uniqueCheck("code", bankBranch)) {
                                errors.addError(new FieldError("bankBranch", "code", bankBranch.getCode(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_SEARCH:
                        if (bankbranches == null) {
                            throw new InvalidDataException("bankbranches", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (BankBranch bankbranch : bankbranches) {
                            if (bankbranch.getTenantId() == null) {
                                throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                        bankbranch.getTenantId());
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

	public List<BankBranch> fetchRelated(List<BankBranch> bankbranches) {
		for (BankBranch bankBranch : bankbranches) {
			// fetch related items
			bankBranch.setTenantId(ApplicationThreadLocals.getTenantId().get());
			if (bankBranch.getTenantId() != null)
				if (bankBranch.getBank() != null && bankBranch.getBank().getId() != null) {
					bankBranch.getBank().setTenantId(bankBranch.getTenantId());
					Bank bank = bankRepository.findById(bankBranch.getBank());
					if (bank == null) {
						throw new InvalidDataException("bank", "bank.invalid", " Invalid bank");
					}
					bankBranch.setBank(bank);
				}

		}

		return bankbranches;
	}

	@Transactional
	public List<BankBranch> update(List<BankBranch> bankbranches, BindingResult errors) {
		bankbranches = fetchRelated(bankbranches);
		validate(bankbranches, Constants.ACTION_UPDATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		return bankbranches;

	}

        public Pagination<BankBranch> search(BankBranchSearch bankBranchSearch, BindingResult errors) {
            
            try {
                
                List<BankBranch> bankBranches = new ArrayList<>();
                bankBranches.add(bankBranchSearch);
                validate(bankBranches, Constants.ACTION_SEARCH, errors);
    
                if (errors.hasErrors()) {
                    throw new CustomBindException(errors);
                }
            
            } catch (CustomBindException e) {
    
                throw new CustomBindException(errors);
            }
    
            return bankBranchRepository.search(bankBranchSearch);
        }

	@Transactional
	public BankBranch save(BankBranch bankBranch) {
		return bankBranchRepository.save(bankBranch);
	}

	@Transactional
	public BankBranch update(BankBranch bankBranch) {
		return bankBranchRepository.update(bankBranch);
	}

}