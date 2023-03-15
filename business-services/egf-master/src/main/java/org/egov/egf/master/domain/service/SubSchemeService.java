package org.egov.egf.master.domain.service;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.constants.Constants;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.ErrorCode;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.util.ApplicationThreadLocals;
import org.egov.egf.master.domain.model.Scheme;
import org.egov.egf.master.domain.model.SubScheme;
import org.egov.egf.master.domain.model.SubSchemeSearch;
import org.egov.egf.master.domain.repository.SchemeRepository;
import org.egov.egf.master.domain.repository.SubSchemeRepository;
import org.egov.egf.master.web.requests.SubSchemeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class SubSchemeService {

	@Autowired
	private SubSchemeRepository subSchemeRepository;

	@Autowired
	private SmartValidator validator;
	@Autowired
	private SchemeRepository schemeRepository;

	private BindingResult validate(List<SubScheme> subschemes, String method, BindingResult errors) {

                try {
                    switch (method) {
                    case Constants.ACTION_VIEW:
                        // validator.validate(subSchemeContractRequest.getSubScheme(),
                        // errors);
                        break;
                    case Constants.ACTION_CREATE:
                        if (subschemes == null) {
                            throw new InvalidDataException("subschemes", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (SubScheme subScheme : subschemes) {
                            validator.validate(subScheme, errors);
                            if (!subSchemeRepository.uniqueCheck("code", subScheme)) {
                                errors.addError(new FieldError("subScheme", "name", subScheme.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_UPDATE:
                        if (subschemes == null) {
                            throw new InvalidDataException("subschemes", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (SubScheme subScheme : subschemes) {
                            if (subScheme.getId() == null) {
                                throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(), subScheme.getId());
                            }
                            validator.validate(subScheme, errors);
                            if (!subSchemeRepository.uniqueCheck("name", subScheme)) {
                                errors.addError(new FieldError("subScheme", "name", subScheme.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_SEARCH:
                        if (subschemes == null) {
                            throw new InvalidDataException("subschemes", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (SubScheme subscheme : subschemes) {
                            if (subscheme.getTenantId() == null) {
                                throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                        subscheme.getTenantId());
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

	public List<SubScheme> fetchRelated(List<SubScheme> subschemes) {
		for (SubScheme subScheme : subschemes) {
			// fetch related items
            subScheme.setTenantId(ApplicationThreadLocals.getTenantId().get());
			if (subScheme.getScheme() != null) {
				Scheme scheme = schemeRepository.findById(subScheme.getScheme());
				if (scheme == null) {
					throw new InvalidDataException("scheme", "scheme.invalid", " Invalid scheme");
				}
				subScheme.setScheme(scheme);
			}

		}

		return subschemes;
	}

	@Transactional
	public List<SubScheme> add(List<SubScheme> subschemes, BindingResult errors) {
		subschemes = fetchRelated(subschemes);
		validate(subschemes, Constants.ACTION_CREATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		for(SubScheme b:subschemes)b.setId(subSchemeRepository.getNextSequence());
		return subschemes;

	}

	@Transactional
	public List<SubScheme> update(List<SubScheme> subschemes, BindingResult errors) {
		subschemes = fetchRelated(subschemes);
		validate(subschemes, Constants.ACTION_UPDATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		return subschemes;

	}

	public void addToQue(SubSchemeRequest request) {
		subSchemeRepository.add(request);
	}

        public Pagination<SubScheme> search(SubSchemeSearch subSchemeSearch, BindingResult errors) {
            
            try {
                
                List<SubScheme> subSchemes = new ArrayList<>();
                subSchemes.add(subSchemeSearch);
                validate(subSchemes, Constants.ACTION_SEARCH, errors);
    
                if (errors.hasErrors()) {
                    throw new CustomBindException(errors);
                }
            
            } catch (CustomBindException e) {
    
                throw new CustomBindException(errors);
            }
    
            return subSchemeRepository.search(subSchemeSearch);
        }

	@Transactional
	public SubScheme save(SubScheme subScheme) {
		return subSchemeRepository.save(subScheme);
	}

	@Transactional
	public SubScheme update(SubScheme subScheme) {
		return subSchemeRepository.update(subScheme);
	}

}