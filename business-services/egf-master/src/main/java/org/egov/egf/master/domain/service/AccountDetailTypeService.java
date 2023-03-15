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
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.AccountDetailTypeSearch;
import org.egov.egf.master.domain.repository.AccountDetailTypeRepository;
import org.egov.egf.master.web.requests.AccountDetailTypeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class AccountDetailTypeService {

	@Autowired
	private AccountDetailTypeRepository accountDetailTypeRepository;

	@Autowired
	private SmartValidator validator;

	@Transactional
	public List<AccountDetailType> create(List<AccountDetailType> accountDetailTypes, BindingResult errors,
			RequestInfo requestInfo) {

		try {

			accountDetailTypes = fetchRelated(accountDetailTypes);

			validate(accountDetailTypes, Constants.ACTION_CREATE, errors);

			if (errors.hasErrors()) {
				throw new CustomBindException(errors);
			}
			for (AccountDetailType b : accountDetailTypes) {
				b.setId(accountDetailTypeRepository.getNextSequence());
			}

		} catch (CustomBindException e) {

			throw new CustomBindException(errors);
		}

		return accountDetailTypeRepository.save(accountDetailTypes, requestInfo);

	}

	@Transactional
	public List<AccountDetailType> update(List<AccountDetailType> accountDetailTypes, BindingResult errors,
			RequestInfo requestInfo) {

		try {

			accountDetailTypes = fetchRelated(accountDetailTypes);

			validate(accountDetailTypes, Constants.ACTION_UPDATE, errors);

			if (errors.hasErrors()) {
				throw new CustomBindException(errors);
			}

		} catch (CustomBindException e) {

			throw new CustomBindException(errors);
		}

		return accountDetailTypeRepository.update(accountDetailTypes, requestInfo);

	}

	private BindingResult validate(List<AccountDetailType> accountdetailtypes, String method, BindingResult errors) {

		try {
			switch (method) {
			case Constants.ACTION_VIEW:
				// validator.validate(accountDetailTypeContractRequest.getAccountDetailType(),
				// errors);
				break;
			case Constants.ACTION_CREATE:
				if (accountdetailtypes == null) {
					throw new InvalidDataException("accountdetailtypes", ErrorCode.NOT_NULL.getCode(), null);
				}
				for (AccountDetailType accountDetailType : accountdetailtypes) {
					validator.validate(accountDetailType, errors);
					if (!accountDetailTypeRepository.uniqueCheck("name", accountDetailType)) {
						errors.addError(new FieldError("accountDetailType", "name", accountDetailType.getName(), false,
								new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
					}
				}
				break;
			case Constants.ACTION_UPDATE:
				if (accountdetailtypes == null) {
					throw new InvalidDataException("accountdetailtypes", ErrorCode.NOT_NULL.getCode(), null);
				}
				for (AccountDetailType accountDetailType : accountdetailtypes) {
					if (accountDetailType.getId() == null) {
						throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
								accountDetailType.getId());
					}
					validator.validate(accountDetailType, errors);
					if (!accountDetailTypeRepository.uniqueCheck("name", accountDetailType)) {
						errors.addError(new FieldError("accountDetailType", "name", accountDetailType.getName(), false,
								new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
					}
				}
				break;
			case Constants.ACTION_SEARCH:
				if (accountdetailtypes == null) {
					throw new InvalidDataException("accountdetailtypes", ErrorCode.NOT_NULL.getCode(), null);
				}
				for (AccountDetailType accountdetailtype : accountdetailtypes) {
					if (accountdetailtype.getTenantId() == null) {
						throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
								accountdetailtype.getTenantId());
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

	public List<AccountDetailType> fetchRelated(List<AccountDetailType> accountdetailtypes) {
		for (AccountDetailType accountDetailType : accountdetailtypes) {
			// fetch related items
			accountDetailType.setTenantId(ApplicationThreadLocals.getTenantId().get());

		}

		return accountdetailtypes;
	}

	@Transactional
	public List<AccountDetailType> add(List<AccountDetailType> accountdetailtypes, BindingResult errors) {
		accountdetailtypes = fetchRelated(accountdetailtypes);
		validate(accountdetailtypes, Constants.ACTION_CREATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		for (AccountDetailType b : accountdetailtypes)
			b.setId(accountDetailTypeRepository.getNextSequence());
		return accountdetailtypes;

	}

	@Transactional
	public List<AccountDetailType> update(List<AccountDetailType> accountdetailtypes, BindingResult errors) {
		accountdetailtypes = fetchRelated(accountdetailtypes);
		validate(accountdetailtypes, Constants.ACTION_UPDATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		return accountdetailtypes;

	}

	public void addToQue(AccountDetailTypeRequest request) {
		accountDetailTypeRepository.add(request);
	}

	public Pagination<AccountDetailType> search(AccountDetailTypeSearch accountDetailTypeSearch, BindingResult errors) {

		try {

			List<AccountDetailType> accountDetailTypes = new ArrayList<>();
			accountDetailTypes.add(accountDetailTypeSearch);
			validate(accountDetailTypes, Constants.ACTION_SEARCH, errors);

			if (errors.hasErrors()) {
				throw new CustomBindException(errors);
			}

		} catch (CustomBindException e) {

			throw new CustomBindException(errors);
		}

		return accountDetailTypeRepository.search(accountDetailTypeSearch);
	}

	@Transactional
	public AccountDetailType save(AccountDetailType accountDetailType) {
		return accountDetailTypeRepository.save(accountDetailType);
	}

	@Transactional
	public AccountDetailType update(AccountDetailType accountDetailType) {
		return accountDetailTypeRepository.update(accountDetailType);
	}

}