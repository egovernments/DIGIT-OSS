package org.egov.egf.master.domain.service;

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
import org.egov.egf.master.domain.model.Fund;
import org.egov.egf.master.domain.model.FundSearch;
import org.egov.egf.master.domain.repository.FundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class FundService {

	@Autowired
	private FundRepository fundRepository;

	@Autowired
	private SmartValidator validator;

	@Transactional
	public List<Fund> create(List<Fund> funds, BindingResult errors, RequestInfo requestInfo) {

		try {

			funds = fetchRelated(funds);
			validate(funds, Constants.ACTION_CREATE, errors);

			if (errors.hasErrors()) {
				throw new CustomBindException(errors);
			}
			for (Fund b : funds) {
				b.setId(fundRepository.getNextSequence());
				b.add();
			}

		} catch (CustomBindException e) {
			throw e;
		}

		return fundRepository.save(funds, requestInfo);

	}

	@Transactional
	public List<Fund> update(List<Fund> funds, BindingResult errors, RequestInfo requestInfo) {

		try {

			funds = fetchRelated(funds);

			validate(funds, Constants.ACTION_UPDATE, errors);

			if (errors.hasErrors()) {
				throw new CustomBindException(errors);
			}
			for (Fund b : funds) {
				b.update();
			}

		} catch (CustomBindException e) {

			throw new CustomBindException(errors);
		}

		return fundRepository.update(funds, requestInfo);

	}

	private BindingResult validate(List<Fund> funds, String method, BindingResult errors) {

                try {
                    switch (method) {
                    case ACTION_VIEW:
                        // validator.validate(fundContractRequest.getFund(), errors);
                        break;
                    case Constants.ACTION_CREATE:
                        if (funds == null) {
                            throw new InvalidDataException("funds", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (Fund fund : funds) {
                            validator.validate(fund, errors);
                            if (!fundRepository.uniqueCheck("name", fund)) {
                                errors.addError(new FieldError("fund", "name", fund.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!fundRepository.uniqueCheck("code", fund)) {
                                errors.addError(new FieldError("fund", "code", fund.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!fundRepository.uniqueCheck("identifier", fund)) {
                                errors.addError(new FieldError("fund", "identifier", fund.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
        
                        }
                        break;
                    case Constants.ACTION_UPDATE:
                        if (funds == null) {
                            throw new InvalidDataException("funds", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (Fund fund : funds) {
                            if (fund.getId() == null) {
                                throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(), fund.getId());
                            }
                            validator.validate(fund, errors);
                            if (!fundRepository.uniqueCheck("name", fund)) {
                                errors.addError(new FieldError("fund", "name", fund.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!fundRepository.uniqueCheck("code", fund)) {
                                errors.addError(new FieldError("fund", "code", fund.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                            if (!fundRepository.uniqueCheck("identifier", fund)) {
                                errors.addError(new FieldError("fund", "identifier", fund.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
        
                        }
                        break;
                    case Constants.ACTION_SEARCH:
                        if (funds == null) {
                            throw new InvalidDataException("funds", ErrorCode.NOT_NULL.getCode(), null);
                        }
                        for (Fund fund : funds) {
                            if (fund.getTenantId() == null) {
                                throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                        fund.getTenantId());
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

	public List<Fund> fetchRelated(List<Fund> funds) {
		for (Fund fund : funds) {
			// fetch related items
            fund.setTenantId(ApplicationThreadLocals.getTenantId().get());
			if (fund.getTenantId() != null)
				if (fund.getParent() != null && fund.getParent().getId() != null) {
					fund.getParent().setTenantId(fund.getTenantId());
					Fund parentId = fundRepository.findById(fund.getParent());
					if (parentId == null) {
						throw new InvalidDataException("parentId", ErrorCode.INVALID_REF_VALUE.getCode(),
								fund.getParent().getId());
					}
					fund.setParent(parentId);
				}

		}

		return funds;
	}

        public Pagination<Fund> search(FundSearch fundSearch, BindingResult errors) {
            
            try {
                
                List<Fund> funds = new ArrayList<>();
                funds.add(fundSearch);
                validate(funds, Constants.ACTION_SEARCH, errors);
    
                if (errors.hasErrors()) {
                    throw new CustomBindException(errors);
                }
            
            } catch (CustomBindException e) {
    
                throw new CustomBindException(errors);
            }
    
            return fundRepository.search(fundSearch);
        }

	@Transactional
	public Fund save(Fund fund) {
		return fundRepository.save(fund);
	}

	@Transactional
	public Fund update(Fund fund) {
		return fundRepository.update(fund);
	}

}