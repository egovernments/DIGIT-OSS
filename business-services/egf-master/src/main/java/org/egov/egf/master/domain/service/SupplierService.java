package org.egov.egf.master.domain.service;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.constants.Constants;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.ErrorCode;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.util.ApplicationThreadLocals;
import org.egov.egf.master.domain.model.Bank;
import org.egov.egf.master.domain.model.BankAccount;
import org.egov.egf.master.domain.model.Supplier;
import org.egov.egf.master.domain.model.SupplierSearch;
import org.egov.egf.master.domain.repository.BankAccountRepository;
import org.egov.egf.master.domain.repository.BankRepository;
import org.egov.egf.master.domain.repository.SupplierRepository;
import org.egov.egf.master.web.requests.SupplierRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class SupplierService {

	@Autowired
	private SupplierRepository supplierRepository;

	@Autowired
	private SmartValidator validator;
	@Autowired
	private BankAccountRepository bankAccountRepository;
	@Autowired
	private BankRepository bankRepository;

	private BindingResult validate(List<Supplier> suppliers, String method, BindingResult errors) {

                try {
                    switch (method) {
                    case Constants.ACTION_VIEW:
                        // validator.validate(supplierContractRequest.getSupplier(),
                        // errors);
                        break;
                    case Constants.ACTION_CREATE:
                        if (suppliers == null) {
                            throw new InvalidDataException("suppliers", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (Supplier supplier : suppliers) {
                            validator.validate(supplier, errors);
                            if (!supplierRepository.uniqueCheck("code", supplier)) {
                                errors.addError(new FieldError("supplier", "name", supplier.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_UPDATE:
                        if (suppliers == null) {
                            throw new InvalidDataException("suppliers", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (Supplier supplier : suppliers) {
                            if (supplier.getId() == null) {
                                throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(), supplier.getId());
                            }
                            validator.validate(supplier, errors);
                            if (!supplierRepository.uniqueCheck("name", supplier)) {
                                errors.addError(new FieldError("supplier", "name", supplier.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_SEARCH:
                        if (suppliers == null) {
                            throw new InvalidDataException("suppliers", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (Supplier supplier : suppliers) {
                            if (supplier.getTenantId() == null) {
                                throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                        supplier.getTenantId());
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

	public List<Supplier> fetchRelated(List<Supplier> suppliers) {
		for (Supplier supplier : suppliers) {
			// fetch related items
			supplier.setTenantId(ApplicationThreadLocals.getTenantId().get());
			if (supplier.getBankAccount() != null) {
				BankAccount bankAccount = bankAccountRepository.findById(supplier.getBankAccount());
				if (bankAccount == null) {
					throw new InvalidDataException("bankAccount", "bankAccount.invalid", " Invalid bankAccount");
				}
				supplier.setBankAccount(bankAccount);
			}
			if (supplier.getBank() != null) {
				Bank bank = bankRepository.findById(supplier.getBank());
				if (bank == null) {
					throw new InvalidDataException("bank", "bank.invalid", " Invalid bank");
				}
				supplier.setBank(bank);
			}

		}

		return suppliers;
	}

	@Transactional
	public List<Supplier> add(List<Supplier> suppliers, BindingResult errors) {
		suppliers = fetchRelated(suppliers);
		validate(suppliers, Constants.ACTION_CREATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		for(Supplier s:suppliers)s.setId(supplierRepository.getNextSequence());
		return suppliers;

	}

	@Transactional
	public List<Supplier> update(List<Supplier> suppliers, BindingResult errors) {
		suppliers = fetchRelated(suppliers);
		validate(suppliers, Constants.ACTION_UPDATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		return suppliers;

	}

	public void addToQue(SupplierRequest request) {
		supplierRepository.add(request);
	}

        public Pagination<Supplier> search(SupplierSearch supplierSearch, BindingResult errors) {
            
            try {
                
                List<Supplier> suppliers = new ArrayList<>();
                suppliers.add(supplierSearch);
                validate(suppliers, Constants.ACTION_SEARCH, errors);
    
                if (errors.hasErrors()) {
                    throw new CustomBindException(errors);
                }
            
            } catch (CustomBindException e) {
    
                throw new CustomBindException(errors);
            }
    
            return supplierRepository.search(supplierSearch);
        }

	@Transactional
	public Supplier save(Supplier supplier) {
		return supplierRepository.save(supplier);
	}

	@Transactional
	public Supplier update(Supplier supplier) {
		return supplierRepository.update(supplier);
	}

}