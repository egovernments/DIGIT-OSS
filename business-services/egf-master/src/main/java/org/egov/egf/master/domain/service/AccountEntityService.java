package org.egov.egf.master.domain.service;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.ErrorCode;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.util.ApplicationThreadLocals;
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.AccountEntity;
import org.egov.egf.master.domain.model.AccountEntitySearch;
import org.egov.egf.master.domain.repository.AccountDetailTypeRepository;
import org.egov.egf.master.domain.repository.AccountEntityRepository;
import org.egov.egf.master.web.requests.AccountEntityRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class AccountEntityService {

    @Autowired
    private AccountEntityRepository accountEntityRepository;

    @Autowired
    private SmartValidator validator;
    @Autowired
    private AccountDetailTypeRepository accountDetailTypeRepository;

    @Transactional
    public List<AccountEntity> create(List<AccountEntity> accountEntities, BindingResult errors, RequestInfo requestInfo) {

        try {

            accountEntities = fetchRelated(accountEntities);

            validate(accountEntities, Constants.ACTION_CREATE, errors);

            if (errors.hasErrors()) {
                throw new CustomBindException(errors);
            }
            for (AccountEntity b : accountEntities) {
                b.setId(accountEntityRepository.getNextSequence());
            }

        } catch (CustomBindException e) {

            throw new CustomBindException(errors);
        }

        return accountEntityRepository.save(accountEntities, requestInfo);

    }

    @Transactional
    public List<AccountEntity> update(List<AccountEntity> accountEntities, BindingResult errors, RequestInfo requestInfo) {

        try {

            accountEntities = fetchRelated(accountEntities);

            validate(accountEntities, Constants.ACTION_UPDATE, errors);

            if (errors.hasErrors()) {
                throw new CustomBindException(errors);
            }

        } catch (CustomBindException e) {

            throw new CustomBindException(errors);
        }

        return accountEntityRepository.update(accountEntities, requestInfo);

    }

    private BindingResult validate(List<AccountEntity> accountentities, String method, BindingResult errors) {

        try {
            switch (method) {
                case Constants.ACTION_VIEW:
                    // validator.validate(accountEntityContractRequest.getAccountEntity(),
                    // errors);
                    break;
                case Constants.ACTION_CREATE:
                    if (accountentities == null) {
                        throw new InvalidDataException("accountentities", ErrorCode.NOT_NULL.getCode(), null);
                    }
                    for (AccountEntity accountEntity : accountentities) {
                        validator.validate(accountEntity, errors);
                        if (!accountEntityRepository.uniqueCheck("name", accountEntity)) {
                            errors.addError(new FieldError("accountEntity", "name", accountEntity.getName(), false,
                                    new String[]{ErrorCode.NON_UNIQUE_VALUE.getCode()}, null, null));
                        }
                        if (!accountEntityRepository.uniqueCheck("code", accountEntity)) {
                            errors.addError(new FieldError("accountEntity", "code", accountEntity.getCode(), false,
                                    new String[]{ErrorCode.NON_UNIQUE_VALUE.getCode()}, null, null));
                        }
                    }
                    break;
                case Constants.ACTION_UPDATE:
                    if (accountentities == null) {
                        throw new InvalidDataException("accountentities", ErrorCode.NOT_NULL.getCode(), null);
                    }
                    for (AccountEntity accountEntity : accountentities) {
                        if (accountEntity.getId() == null) {
                            throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(), accountEntity.getId());
                        }
                        validator.validate(accountEntity, errors);
                        if (!accountEntityRepository.uniqueCheck("name", accountEntity)) {
                            errors.addError(new FieldError("accountEntity", "name", accountEntity.getName(), false,
                                    new String[]{ErrorCode.NON_UNIQUE_VALUE.getCode()}, null, null));
                        }
                        if (!accountEntityRepository.uniqueCheck("code", accountEntity)) {
                            errors.addError(new FieldError("accountEntity", "code", accountEntity.getCode(), false,
                                    new String[]{ErrorCode.NON_UNIQUE_VALUE.getCode()}, null, null));
                        }
                    }
                    break;
                case Constants.ACTION_SEARCH:
                    if (accountentities == null) {
                        throw new InvalidDataException("accountentities", ErrorCode.NOT_NULL.getCode(), null);
                    }
                    for (AccountEntity accountEntity : accountentities) {
                        if (accountEntity.getTenantId() == null) {
                            throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                    accountEntity.getTenantId());
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

    public List<AccountEntity> fetchRelated(List<AccountEntity> accountentities) {
        for (AccountEntity accountEntity : accountentities) {
            // fetch related items
            accountEntity.setTenantId(ApplicationThreadLocals.getTenantId().get());
            if (accountEntity.getAccountDetailType() != null) {
                AccountDetailType accountDetailType = accountDetailTypeRepository
                        .findById(accountEntity.getAccountDetailType());
                if (accountDetailType == null) {
                    throw new InvalidDataException("accountDetailType", "accountDetailType.invalid",
                            " Invalid accountDetailType");
                }
                accountEntity.setAccountDetailType(accountDetailType);
            }

        }

        return accountentities;
    }

    @Transactional
    public List<AccountEntity> add(List<AccountEntity> accountentities, BindingResult errors) {
        accountentities = fetchRelated(accountentities);
        validate(accountentities, Constants.ACTION_CREATE, errors);
        if (errors.hasErrors()) {
            throw new CustomBindException(errors);
        }
        for (AccountEntity b : accountentities) b.setId(accountEntityRepository.getNextSequence());
        return accountentities;

    }

    @Transactional
    public List<AccountEntity> update(List<AccountEntity> accountentities, BindingResult errors) {
        accountentities = fetchRelated(accountentities);
        validate(accountentities, Constants.ACTION_UPDATE, errors);
        if (errors.hasErrors()) {
            throw new CustomBindException(errors);
        }
        return accountentities;

    }

    public void addToQue(AccountEntityRequest request) {
        accountEntityRepository.add(request);
    }

    public Pagination<AccountEntity> search(AccountEntitySearch accountEntitySearch, BindingResult errors) {

        try {

            List<AccountEntity> accountentities = new ArrayList<>();
            accountentities.add(accountEntitySearch);
            validate(accountentities, Constants.ACTION_SEARCH, errors);

            if (errors.hasErrors()) {
                throw new CustomBindException(errors);
            }

        } catch (CustomBindException e) {

            throw new CustomBindException(errors);
        }

        return accountEntityRepository.search(accountEntitySearch);
    }

    @Transactional
    public AccountEntity save(AccountEntity accountEntity) {
        return accountEntityRepository.save(accountEntity);
    }

    @Transactional
    public AccountEntity update(AccountEntity accountEntity) {
        return accountEntityRepository.update(accountEntity);
    }

}