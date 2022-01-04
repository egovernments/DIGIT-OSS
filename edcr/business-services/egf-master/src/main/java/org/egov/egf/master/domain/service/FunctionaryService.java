package org.egov.egf.master.domain.service;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.constants.Constants;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.ErrorCode;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.util.ApplicationThreadLocals;
import org.egov.egf.master.domain.model.Functionary;
import org.egov.egf.master.domain.model.FunctionarySearch;
import org.egov.egf.master.domain.repository.FunctionaryRepository;
import org.egov.egf.master.web.requests.FunctionaryRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class FunctionaryService {

	@Autowired
	private FunctionaryRepository functionaryRepository;

	@Autowired
	private SmartValidator validator;

	private BindingResult validate(List<Functionary> functionaries, String method, BindingResult errors) {

                try {
                    switch (method) {
                    case Constants.ACTION_VIEW:
                        // validator.validate(functionaryContractRequest.getFunctionary(),
                        // errors);
                        break;
                    case Constants.ACTION_CREATE:
                        if (functionaries == null) {
                            throw new InvalidDataException("functionaries", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (Functionary functionary : functionaries) {
                            validator.validate(functionary, errors);
                            if (!functionaryRepository.uniqueCheck("name", functionary)) {
                                errors.addError(new FieldError("functionary", "name", functionary.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!functionaryRepository.uniqueCheck("code", functionary)) {
                                errors.addError(new FieldError("functionary", "code", functionary.getCode(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_UPDATE:
                        if (functionaries == null) {
                            throw new InvalidDataException("functionaries", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (Functionary functionary : functionaries) {
                            if (functionary.getId() == null) {
                                throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(), functionary.getId());
                            }
                            validator.validate(functionary, errors);
                            if (!functionaryRepository.uniqueCheck("name", functionary)) {
                                errors.addError(new FieldError("functionary", "name", functionary.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!functionaryRepository.uniqueCheck("code", functionary)) {
                                errors.addError(new FieldError("functionary", "code", functionary.getCode(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_SEARCH:
                        if (functionaries == null) {
                            throw new InvalidDataException("functionaries", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (Functionary functionary : functionaries) {
                            if (functionary.getTenantId() == null) {
                                throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                        functionary.getTenantId());
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

	public List<Functionary> fetchRelated(List<Functionary> functionaries) {
		for (Functionary functionary : functionaries) {
			// fetch related items
            functionary.setTenantId(ApplicationThreadLocals.getTenantId().get());

		}

		return functionaries;
	}

	@Transactional
	public List<Functionary> add(List<Functionary> functionaries, BindingResult errors) {
		functionaries = fetchRelated(functionaries);
		validate(functionaries, Constants.ACTION_CREATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		for(Functionary b:functionaries)b.setId(functionaryRepository.getNextSequence());
		return functionaries;

	}

	@Transactional
	public List<Functionary> update(List<Functionary> functionaries, BindingResult errors) {
		functionaries = fetchRelated(functionaries);
		validate(functionaries, Constants.ACTION_UPDATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		return functionaries;

	}

	public void addToQue(FunctionaryRequest request) {
		functionaryRepository.add(request);
	}

        public Pagination<Functionary> search(FunctionarySearch functionarySearch, BindingResult errors) {
            
            try {
                
                List<Functionary> functionaries = new ArrayList<>();
                functionaries.add(functionarySearch);
                validate(functionaries, Constants.ACTION_SEARCH, errors);
    
                if (errors.hasErrors()) {
                    throw new CustomBindException(errors);
                }
            
            } catch (CustomBindException e) {
    
                throw new CustomBindException(errors);
            }
    
            return functionaryRepository.search(functionarySearch);
        }

	@Transactional
	public Functionary save(Functionary functionary) {
		return functionaryRepository.save(functionary);
	}

	@Transactional
	public Functionary update(Functionary functionary) {
		return functionaryRepository.update(functionary);
	}

}