package org.egov.egf.master.domain.service;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.constants.Constants;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.ErrorCode;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.util.ApplicationThreadLocals;
import org.egov.egf.master.domain.model.Fund;
import org.egov.egf.master.domain.model.Scheme;
import org.egov.egf.master.domain.model.SchemeSearch;
import org.egov.egf.master.domain.repository.FundRepository;
import org.egov.egf.master.domain.repository.SchemeRepository;
import org.egov.egf.master.web.requests.SchemeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class SchemeService {

	@Autowired
	private SchemeRepository schemeRepository;

	@Autowired
	private SmartValidator validator;
	@Autowired
	private FundRepository fundRepository;

	private BindingResult validate(List<Scheme> schemes, String method, BindingResult errors) {

                try {
                    switch (method) {
                    case Constants.ACTION_VIEW:
                        // validator.validate(schemeContractRequest.getScheme(),
                        // errors);
                        break;
                    case Constants.ACTION_CREATE:
                        if (schemes == null) {
                            throw new InvalidDataException("schemes", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (Scheme scheme : schemes) {
                            validator.validate(scheme, errors);
                            if (!schemeRepository.uniqueCheck("name", scheme)) {
                                errors.addError(new FieldError("scheme", "name", scheme.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!schemeRepository.uniqueCheck("code", scheme)) {
                                errors.addError(new FieldError("scheme", "code", scheme.getCode(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_UPDATE:
                        if (schemes == null) {
                            throw new InvalidDataException("schemes", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (Scheme scheme : schemes) {
                            if (scheme.getId() == null) {
                                throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(), scheme.getId());
                            }
                            validator.validate(scheme, errors);
                            if (!schemeRepository.uniqueCheck("name", scheme)) {
                                errors.addError(new FieldError("scheme", "name", scheme.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!schemeRepository.uniqueCheck("code", scheme)) {
                                errors.addError(new FieldError("scheme", "code", scheme.getCode(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_SEARCH:
                        if (schemes == null) {
                            throw new InvalidDataException("schemes", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (Scheme scheme : schemes) {
                            if (scheme.getTenantId() == null) {
                                throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                        scheme.getTenantId());
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

	public List<Scheme> fetchRelated(List<Scheme> schemes) {
		for (Scheme scheme : schemes) {
			// fetch related items
            scheme.setTenantId(ApplicationThreadLocals.getTenantId().get());
			if (scheme.getFund() != null) {
				Fund fund = fundRepository.findById(scheme.getFund());
				if (fund == null) {
					throw new InvalidDataException("fund", "fund.invalid", " Invalid fund");
				}
				scheme.setFund(fund);
			}

		}

		return schemes;
	}

	@Transactional
	public List<Scheme> add(List<Scheme> schemes, BindingResult errors) {
		schemes = fetchRelated(schemes);
		validate(schemes, Constants.ACTION_CREATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		for(Scheme b:schemes)b.setId(schemeRepository.getNextSequence());
		return schemes;

	}

	@Transactional
	public List<Scheme> update(List<Scheme> schemes, BindingResult errors) {
		schemes = fetchRelated(schemes);
		validate(schemes, Constants.ACTION_UPDATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		return schemes;

	}

	public void addToQue(SchemeRequest request) {
		schemeRepository.add(request);
	}

        public Pagination<Scheme> search(SchemeSearch schemeSearch, BindingResult errors) {
            
            try {
                
                List<Scheme> schemes = new ArrayList<>();
                schemes.add(schemeSearch);
                validate(schemes, Constants.ACTION_SEARCH, errors);
    
                if (errors.hasErrors()) {
                    throw new CustomBindException(errors);
                }
            
            } catch (CustomBindException e) {
    
                throw new CustomBindException(errors);
            }
    
            return schemeRepository.search(schemeSearch);
        }

	@Transactional
	public Scheme save(Scheme scheme) {
		return schemeRepository.save(scheme);
	}

	@Transactional
	public Scheme update(Scheme scheme) {
		return schemeRepository.update(scheme);
	}

}