package org.egov.egf.instrument.domain.service;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.ErrorCode;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.instrument.domain.model.SurrenderReason;
import org.egov.egf.instrument.domain.model.SurrenderReasonSearch;
import org.egov.egf.instrument.domain.repository.SurrenderReasonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class SurrenderReasonService {

    public static final String ACTION_CREATE = "create";
    public static final String ACTION_UPDATE = "update";
    public static final String ACTION_DELETE = "delete";
    public static final String ACTION_VIEW = "view";
    public static final String ACTION_EDIT = "edit";
    public static final String ACTION_SEARCH = "search";

    @Autowired
    private SurrenderReasonRepository surrenderReasonRepository;

    @Autowired
    private SmartValidator validator;

    @Autowired
    public SurrenderReasonService(SmartValidator validator, SurrenderReasonRepository surrenderReasonRepository) {
        this.validator = validator;
        this.surrenderReasonRepository = surrenderReasonRepository;
    }

    @Transactional
    public List<SurrenderReason> create(List<SurrenderReason> surrenderReasons, BindingResult errors,
            RequestInfo requestInfo) {

        try {

            surrenderReasons = fetchRelated(surrenderReasons);

            validate(surrenderReasons, ACTION_CREATE, errors);

            if (errors.hasErrors())
                throw new CustomBindException(errors);

        } catch (CustomBindException e) {

            throw new CustomBindException(errors);
        }

        return surrenderReasonRepository.save(surrenderReasons, requestInfo);

    }

    @Transactional
    public List<SurrenderReason> update(List<SurrenderReason> surrenderReasons, BindingResult errors,
            RequestInfo requestInfo) {

        try {

            surrenderReasons = fetchRelated(surrenderReasons);

            validate(surrenderReasons, ACTION_UPDATE, errors);

            if (errors.hasErrors())
                throw new CustomBindException(errors);

        } catch (CustomBindException e) {

            throw new CustomBindException(errors);
        }

        return surrenderReasonRepository.update(surrenderReasons, requestInfo);

    }

    @Transactional
    public List<SurrenderReason> delete(List<SurrenderReason> surrenderReasons, BindingResult errors,
            RequestInfo requestInfo) {

        try {

            validate(surrenderReasons, ACTION_DELETE, errors);

            if (errors.hasErrors())
                throw new CustomBindException(errors);

        } catch (CustomBindException e) {

            throw new CustomBindException(errors);

        }

        return surrenderReasonRepository.delete(surrenderReasons, requestInfo);

    }

    private BindingResult validate(List<SurrenderReason> surrenderreasons, String method, BindingResult errors) {

        try {
            switch (method) {
            case ACTION_VIEW:
                // validator.validate(surrenderReasonContractRequest.getSurrenderReason(),
                // errors);
                break;
            case ACTION_CREATE:
                if (surrenderreasons == null)
                    throw new InvalidDataException("surrenderreasons", ErrorCode.NOT_NULL.getCode(), null);
                for (SurrenderReason surrenderReason : surrenderreasons) {
                    validator.validate(surrenderReason, errors);
                    if (!surrenderReasonRepository.uniqueCheck("name", surrenderReason))
                        errors.addError(new FieldError("surrenderReason", "name", surrenderReason.getName(), false,
                                new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                }
                break;
            case ACTION_UPDATE:
                if (surrenderreasons == null)
                    throw new InvalidDataException("surrenderreasons", ErrorCode.NOT_NULL.getCode(), null);
                for (SurrenderReason surrenderReason : surrenderreasons) {
                    if (surrenderReason.getId() == null)
                        throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                surrenderReason.getId());
                    validator.validate(surrenderReason, errors);
                    if (!surrenderReasonRepository.uniqueCheck("name", surrenderReason))
                        errors.addError(new FieldError("surrenderReason", "name", surrenderReason.getName(), false,
                                new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                }
            case ACTION_DELETE:
                if (surrenderreasons == null)
                    throw new InvalidDataException("surrenderreasons", ErrorCode.NOT_NULL.getCode(), null);
                for (SurrenderReason surrenderreason : surrenderreasons)
                    if (surrenderreason.getId() == null)
                        throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                surrenderreason.getId());
                break;
            default:

            }
        } catch (IllegalArgumentException e) {
            errors.addError(new ObjectError("Missing data", e.getMessage()));
        }
        return errors;

    }

    @Transactional
    public SurrenderReason delete(SurrenderReason surrenderReason) {
        return surrenderReasonRepository.delete(surrenderReason);
    }

    public List<SurrenderReason> fetchRelated(List<SurrenderReason> surrenderreasons) {

        return surrenderreasons;
    }

    public Pagination<SurrenderReason> search(SurrenderReasonSearch surrenderReasonSearch) {
        return surrenderReasonRepository.search(surrenderReasonSearch);
    }

    @Transactional
    public SurrenderReason save(SurrenderReason surrenderReason) {
        return surrenderReasonRepository.save(surrenderReason);
    }

    @Transactional
    public SurrenderReason update(SurrenderReason surrenderReason) {
        return surrenderReasonRepository.update(surrenderReason);
    }

}