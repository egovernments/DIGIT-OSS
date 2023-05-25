package org.egov.egf.master.domain.service;

import static org.egov.common.constants.Constants.ACTION_CREATE;
import static org.egov.common.constants.Constants.ACTION_UPDATE;
import static org.egov.common.constants.Constants.ACTION_VIEW;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.ErrorCode;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.util.ApplicationThreadLocals;
import org.egov.egf.master.domain.model.AccountCodePurpose;
import org.egov.egf.master.domain.model.AccountCodePurposeSearch;
import org.egov.egf.master.domain.repository.AccountCodePurposeRepository;
import org.egov.egf.master.web.requests.AccountCodePurposeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class AccountCodePurposeService {

	@Autowired
	private AccountCodePurposeRepository accountCodePurposeRepository;

	@Autowired
	private SmartValidator validator;

	@Transactional
	public List<AccountCodePurpose> create(List<AccountCodePurpose> accountCodePurposes, BindingResult errors,
			RequestInfo requestInfo) {

		try {

			accountCodePurposes = fetchRelated(accountCodePurposes);

			validate(accountCodePurposes, Constants.ACTION_CREATE, errors);

			if (errors.hasErrors()) {
				throw new CustomBindException(errors);
			}
			for (AccountCodePurpose account : accountCodePurposes) {
				account.setId(accountCodePurposeRepository.getNextSequence());
			}

		} catch (CustomBindException e) {

			throw new CustomBindException(errors);
		}

		return accountCodePurposeRepository.save(accountCodePurposes, requestInfo);

	}

	@Transactional
	public List<AccountCodePurpose> update(List<AccountCodePurpose> accountCodePurposes, BindingResult errors,
			RequestInfo requestInfo) {

		try {

			accountCodePurposes = fetchRelated(accountCodePurposes);

			validate(accountCodePurposes, Constants.ACTION_UPDATE, errors);

			if (errors.hasErrors()) {
				throw new CustomBindException(errors);
			}

		} catch (CustomBindException e) {

			throw new CustomBindException(errors);
		}

		return accountCodePurposeRepository.update(accountCodePurposes, requestInfo);

	}

	private BindingResult validate(List<AccountCodePurpose> accountcodepurposes, String method, BindingResult errors) {

		try {
			switch (method) {
			case ACTION_VIEW:
				// validator.validate(accountCodePurposeContractRequest.getAccountCodePurpose(),
				// errors);
				break;
			case ACTION_CREATE:
				if (accountcodepurposes == null) {
					throw new InvalidDataException("accountcodepurposes", ErrorCode.NOT_NULL.getCode(), null);
				}
				for (AccountCodePurpose accountCodePurpose : accountcodepurposes) {
					validator.validate(accountCodePurpose, errors);

					if (!accountCodePurposeRepository.uniqueCheck("name", accountCodePurpose)) {
						errors.addError(new FieldError("accountCodePurpose", "name", accountCodePurpose.getName(),
								false, new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
					}

				}
				break;
			case ACTION_UPDATE:
				if (accountcodepurposes == null) {
					throw new InvalidDataException("accountcodepurposes", ErrorCode.NOT_NULL.getCode(), null);
				}
				for (AccountCodePurpose accountCodePurpose : accountcodepurposes) {
					if (accountCodePurpose.getId() == null) {
						throw new InvalidDataException("id", ErrorCode.NULL_VALUE.getCode(),
								accountCodePurpose.getId());
					}
					validator.validate(accountCodePurpose, errors);

					if (!accountCodePurposeRepository.uniqueCheck("name", accountCodePurpose)) {
						errors.addError(new FieldError("accountCodePurpose", "name", accountCodePurpose.getName(),
								false, new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
					}

				}
				break;
			case Constants.ACTION_SEARCH:
				if (accountcodepurposes == null) {
					throw new InvalidDataException("accountcodepurposes", ErrorCode.NOT_NULL.getCode(), null);
				}
				for (AccountCodePurpose accountcodepurpose : accountcodepurposes) {
					if (accountcodepurpose.getTenantId() == null) {
						throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
								accountcodepurpose.getTenantId());
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

	public List<AccountCodePurpose> fetchRelated(List<AccountCodePurpose> accountcodepurposes) {
		for (AccountCodePurpose accountCodePurpose : accountcodepurposes) {
			// fetch related items
			accountCodePurpose.setTenantId(ApplicationThreadLocals.getTenantId().get());

		}

		return accountcodepurposes;
	}

	@Transactional
	public List<AccountCodePurpose> add(List<AccountCodePurpose> accountcodepurposes, BindingResult errors) {
		accountcodepurposes = fetchRelated(accountcodepurposes);
		validate(accountcodepurposes, Constants.ACTION_CREATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		for (AccountCodePurpose b : accountcodepurposes)
			b.setId(accountCodePurposeRepository.getNextSequence());
		return accountcodepurposes;

	}

	@Transactional
	public List<AccountCodePurpose> update(List<AccountCodePurpose> accountcodepurposes, BindingResult errors) {
		accountcodepurposes = fetchRelated(accountcodepurposes);
		validate(accountcodepurposes, Constants.ACTION_UPDATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		return accountcodepurposes;

	}

	public void addToQue(AccountCodePurposeRequest request) {
		accountCodePurposeRepository.add(request);
	}

	public Pagination<AccountCodePurpose> search(AccountCodePurposeSearch accountCodePurposeSearch,
			BindingResult errors) {

		try {

			List<AccountCodePurpose> accountCodePurposes = new ArrayList<>();
			accountCodePurposes.add(accountCodePurposeSearch);
			validate(accountCodePurposes, Constants.ACTION_SEARCH, errors);

			if (errors.hasErrors()) {
				throw new CustomBindException(errors);
			}

		} catch (CustomBindException e) {

			throw new CustomBindException(errors);
		}

		return accountCodePurposeRepository.search(accountCodePurposeSearch);
	}

	@Transactional
	public AccountCodePurpose save(AccountCodePurpose accountCodePurpose) {
		return accountCodePurposeRepository.save(accountCodePurpose);
	}

	@Transactional
	public AccountCodePurpose update(AccountCodePurpose accountCodePurpose) {
		return accountCodePurposeRepository.update(accountCodePurpose);
	}

}