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
import org.egov.egf.master.domain.model.BankAccount;
import org.egov.egf.master.domain.model.BankAccountSearch;
import org.egov.egf.master.domain.model.BankBranch;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.Fund;
import org.egov.egf.master.domain.repository.BankAccountRepository;
import org.egov.egf.master.domain.repository.BankBranchRepository;
import org.egov.egf.master.domain.repository.ChartOfAccountRepository;
import org.egov.egf.master.domain.repository.FundRepository;
import org.egov.egf.master.web.requests.BankAccountRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class BankAccountService {

	@Autowired
	private BankAccountRepository bankAccountRepository;

	@Autowired
	private SmartValidator validator;
	@Autowired
	private ChartOfAccountRepository chartOfAccountRepository;
	@Autowired
	private BankBranchRepository bankBranchRepository;
	@Autowired
	private FundRepository fundRepository;

	@Transactional
	public List<BankAccount> create(List<BankAccount> bankAccounts, BindingResult errors, RequestInfo requestInfo) {

		try {

			bankAccounts = fetchRelated(bankAccounts);

			validate(bankAccounts, Constants.ACTION_CREATE, errors);

			if (errors.hasErrors()) {
				throw new CustomBindException(errors);
			}
			for (BankAccount b : bankAccounts) {
				b.setId(bankAccountRepository.getNextSequence());
			}

		} catch (CustomBindException e) {

			throw new CustomBindException(errors);
		}

		return bankAccountRepository.save(bankAccounts, requestInfo);

	}

	@Transactional
	public List<BankAccount> update(List<BankAccount> bankAccounts, BindingResult errors, RequestInfo requestInfo) {

		try {

			bankAccounts = fetchRelated(bankAccounts);

			validate(bankAccounts, Constants.ACTION_UPDATE, errors);

			if (errors.hasErrors()) {
				throw new CustomBindException(errors);
			}

		} catch (CustomBindException e) {

			throw new CustomBindException(errors);
		}

		return bankAccountRepository.update(bankAccounts, requestInfo);

	}

	private BindingResult validate(List<BankAccount> bankaccounts, String method, BindingResult errors) {

		try {
			switch (method) {
			case Constants.ACTION_VIEW:
				// validator.validate(bankAccountContractRequest.getBankAccount(),
				// errors);
				break;
			case Constants.ACTION_CREATE:
				if (bankaccounts == null) {
					throw new InvalidDataException("bankaccounts", ErrorCode.NOT_NULL.getCode(), null);
				}
				for (BankAccount bankAccount : bankaccounts) {
					validator.validate(bankAccount, errors);
					if (!bankAccountRepository.uniqueCheck("accountNumber", bankAccount)) {
						errors.addError(new FieldError("bankAccount", "name", bankAccount.getAccountNumber(), false,
								new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
					}
				}
				break;
			case Constants.ACTION_UPDATE:
				if (bankaccounts == null) {
					throw new InvalidDataException("bankaccounts", ErrorCode.NOT_NULL.getCode(), null);
				}
				for (BankAccount bankAccount : bankaccounts) {
					if (bankAccount.getId() == null) {
						throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
								bankAccount.getId());
					}
					validator.validate(bankAccount, errors);
					if (!bankAccountRepository.uniqueCheck("accountNumber", bankAccount)) {
						errors.addError(new FieldError("bankAccount", "name", bankAccount.getAccountNumber(), false,
								new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
					}
				}
				break;
			case Constants.ACTION_SEARCH:
				if (bankaccounts == null) {
					throw new InvalidDataException("bankaccounts", ErrorCode.NOT_NULL.getCode(), null);
				}
				for (BankAccount bankaccount : bankaccounts) {
					if (bankaccount.getTenantId() == null) {
						throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
								bankaccount.getTenantId());
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

	public List<BankAccount> fetchRelated(List<BankAccount> bankaccounts) {
		for (BankAccount bankAccount : bankaccounts) {
			// fetch related items
			bankAccount.setTenantId(ApplicationThreadLocals.getTenantId().get());
			if (bankAccount.getBankBranch() != null) {
				BankBranch bankBranch = bankBranchRepository.findById(bankAccount.getBankBranch());
				if (bankBranch == null) {
					throw new InvalidDataException("bankBranch", "bankBranch.invalid", " Invalid bankBranch");
				}
				bankAccount.setBankBranch(bankBranch);
			}
			if (bankAccount.getChartOfAccount() != null) {
				ChartOfAccount chartOfAccount = chartOfAccountRepository.findById(bankAccount.getChartOfAccount());
				if (chartOfAccount == null) {
					throw new InvalidDataException("chartOfAccount", "chartOfAccount.invalid",
							" Invalid chartOfAccount");
				}
				bankAccount.setChartOfAccount(chartOfAccount);
			}
			if (bankAccount.getFund() != null) {
				Fund fund = fundRepository.findById(bankAccount.getFund());
				if (fund == null) {
					throw new InvalidDataException("fund", "fund.invalid", " Invalid fund");
				}
				bankAccount.setFund(fund);
			}

		}

		return bankaccounts;
	}

	@Transactional
	public List<BankAccount> update(List<BankAccount> bankaccounts, BindingResult errors) {
		bankaccounts = fetchRelated(bankaccounts);
		validate(bankaccounts, Constants.ACTION_UPDATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		return bankaccounts;

	}

	public void addToQue(BankAccountRequest request) {
		bankAccountRepository.add(request);
	}

	public Pagination<BankAccount> search(BankAccountSearch bankAccountSearch, BindingResult errors) {

		try {

			List<BankAccount> bankAccounts = new ArrayList<>();
			bankAccounts.add(bankAccountSearch);
			validate(bankAccounts, Constants.ACTION_SEARCH, errors);

			if (errors.hasErrors()) {
				throw new CustomBindException(errors);
			}

		} catch (CustomBindException e) {

			throw new CustomBindException(errors);
		}

		return bankAccountRepository.search(bankAccountSearch);
	}

	@Transactional
	public BankAccount save(BankAccount bankAccount) {
		return bankAccountRepository.save(bankAccount);
	}

	@Transactional
	public BankAccount update(BankAccount bankAccount) {
		return bankAccountRepository.update(bankAccount);
	}

}