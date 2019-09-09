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
import org.egov.egf.master.domain.model.BankSearch;
import org.egov.egf.master.domain.repository.BankRepository;
import org.egov.egf.master.persistence.repository.BankJdbcRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class BankService {

	@Autowired
	private BankRepository bankRepository;
	
	@Autowired
        private BankJdbcRepository bankJdbcRepository;

	@Autowired
	private SmartValidator validator;
 
	@Transactional
	public List<Bank> create(List<Bank> banks, BindingResult errors, RequestInfo requestInfo) {

		try {

			banks = fetchRelated(banks);

			validate(banks, Constants.ACTION_CREATE, errors);

			if (errors.hasErrors()) {
				throw new CustomBindException(errors);
			}
			for (Bank b : banks) {
				b.setId(bankRepository.getNextSequence());
                b.setTenantId(ApplicationThreadLocals.getTenantId().get());
			}

		} catch (CustomBindException e) {

			throw new CustomBindException(errors);
		}

		return bankRepository.save(banks, requestInfo);

	}

	@Transactional
	public List<Bank> update(List<Bank> banks, BindingResult errors, RequestInfo requestInfo) {

		try {

			banks = fetchRelated(banks);

			validate(banks, Constants.ACTION_UPDATE, errors);

			if (errors.hasErrors()) {
				throw new CustomBindException(errors);
			}

		} catch (CustomBindException e) {

			throw new CustomBindException(errors);
		}

		return bankRepository.update(banks, requestInfo);

	}

	private BindingResult validate(List<Bank> banks, String method, BindingResult errors) {

                try {
                    switch (method) {
                    case Constants.ACTION_VIEW:
                        // validator.validate(bankContractRequest.getBank(), errors);
                        break;
                    case Constants.ACTION_CREATE:
                        if (banks == null) {
                            throw new InvalidDataException("banks", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (Bank bank : banks) {
                            validator.validate(bank, errors);
                            if (!bankRepository.uniqueCheck("name", bank)) {
                                errors.addError(new FieldError("bank", "name", bank.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!bankRepository.uniqueCheck("code", bank)) {
                                errors.addError(new FieldError("bank", "code", bank.getCode(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_UPDATE:
                        if (banks == null) {
                            throw new InvalidDataException("banks", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (Bank bank : banks) {
                            if (bank.getId() == null) {
                                throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(), bank.getId());
                            }
                            validator.validate(bank, errors);
                            if (!bankRepository.uniqueCheck("name", bank)) {
                                errors.addError(new FieldError("bank", "name", bank.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!bankRepository.uniqueCheck("code", bank)) {
                                errors.addError(new FieldError("bank", "code", bank.getCode(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_SEARCH:
                        if (banks == null) {
                            throw new InvalidDataException("banks", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (Bank bank : banks) {
                            if (bank.getTenantId() == null) {
                                throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                        bank.getTenantId());
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

	public List<Bank> fetchRelated(List<Bank> banks) {

		return banks;
	}

	@Transactional
	public List<Bank> update(List<Bank> banks, BindingResult errors) {
		banks = fetchRelated(banks);
		validate(banks, Constants.ACTION_UPDATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		return banks;

	}

        public Pagination<Bank> search(BankSearch bankSearch, BindingResult errors) {
            
            try {
                
                List<Bank> banks = new ArrayList<>();
                banks.add(bankSearch);
                validate(banks, Constants.ACTION_SEARCH, errors);
    
                if (errors.hasErrors()) {
                    throw new CustomBindException(errors);
                }
            
            } catch (CustomBindException e) {
    
                throw new CustomBindException(errors);
            }
    
            return bankRepository.search(bankSearch);
        }

	@Transactional
	public Bank save(Bank bank) {
		return bankRepository.save(bank);
	}

	@Transactional
	public Bank update(Bank bank) {
		return bankRepository.update(bank);
	}

}