package org.egov.egf.master.domain.service;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.constants.Constants;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.ErrorCode;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.util.ApplicationThreadLocals;
import org.egov.egf.master.domain.model.FinancialConfiguration;
import org.egov.egf.master.domain.model.FinancialConfigurationSearch;
import org.egov.egf.master.domain.repository.FinancialConfigurationRepository;
import org.egov.egf.master.web.requests.FinancialConfigurationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class FinancialConfigurationService {

	@Autowired
	private FinancialConfigurationRepository financialConfigurationRepository;

	@Autowired
	private SmartValidator validator;
	
	@Value("${fetch_data_from}")
	private String fetchDataFrom;

	private BindingResult validate(List<FinancialConfiguration> financialconfigurations, String method,
			BindingResult errors) {

                try {
                    switch (method) {
                    case Constants.ACTION_VIEW:
                        // validator.validate(financialConfigurationContractRequest.getFinancialConfiguration(),
                        // errors);
                        break;
                    case Constants.ACTION_CREATE:
                        if (financialconfigurations == null) {
                            throw new InvalidDataException("financialconfigurations", ErrorCode.NOT_NULL.getCode(),
                                    null);
                        }
                        for (FinancialConfiguration financialConfiguration : financialconfigurations) {
                            validator.validate(financialConfiguration, errors);
                            if (!financialConfigurationRepository.uniqueCheck("name", financialConfiguration)) {
                                errors.addError(new FieldError("financialConfiguration", "name", financialConfiguration.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_UPDATE:
                        if (financialconfigurations == null) {
                            throw new InvalidDataException("financialconfigurations", ErrorCode.NOT_NULL.getCode(),
                                    null);
                        }
                        for (FinancialConfiguration financialConfiguration : financialconfigurations) {
                            if (financialConfiguration.getId() == null) {
                                throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                        financialConfiguration.getId());
                            }
                            validator.validate(financialConfiguration, errors);
                            if (!financialConfigurationRepository.uniqueCheck("name", financialConfiguration)) {
                                errors.addError(new FieldError("financialConfiguration", "name", financialConfiguration.getName(), false,
                                        new String[] { ErrorCode.NON_UNIQUE_VALUE.getCode() }, null, null));
                            }
                        }
                        break;
                    case Constants.ACTION_SEARCH:
                        if (financialconfigurations == null) {
                            throw new InvalidDataException("financialconfigurations", ErrorCode.NOT_NULL.getCode(),
                                    null);
                        }
                        for (FinancialConfiguration financialconfiguration : financialconfigurations) {
                            if (financialconfiguration.getTenantId() == null) {
                                throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                        financialconfiguration.getTenantId());
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

	public List<FinancialConfiguration> fetchRelated(List<FinancialConfiguration> financialconfigurations) {
		for (FinancialConfiguration financialConfiguration : financialconfigurations) {
			// fetch related items
            financialConfiguration.setTenantId(ApplicationThreadLocals.getTenantId().get());

		}

		return financialconfigurations;
	}

	@Transactional
	public List<FinancialConfiguration> add(List<FinancialConfiguration> financialconfigurations,
			BindingResult errors) {
		financialconfigurations = fetchRelated(financialconfigurations);
		validate(financialconfigurations, Constants.ACTION_CREATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		return financialconfigurations;

	}

	@Transactional
	public List<FinancialConfiguration> update(List<FinancialConfiguration> financialconfigurations,
			BindingResult errors) {
		financialconfigurations = fetchRelated(financialconfigurations);
		validate(financialconfigurations, Constants.ACTION_UPDATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		return financialconfigurations;

	}

	public void addToQue(FinancialConfigurationRequest request) {
		financialConfigurationRepository.add(request);
	}

        public Pagination<FinancialConfiguration> search(FinancialConfigurationSearch financialConfigurationSearch, BindingResult errors) {
            
            try {
                
                List<FinancialConfiguration> financialConfigurations = new ArrayList<>();
                financialConfigurations.add(financialConfigurationSearch);
                validate(financialConfigurations, Constants.ACTION_SEARCH, errors);
    
                if (errors.hasErrors()) {
                    throw new CustomBindException(errors);
                }
            
            } catch (CustomBindException e) {
    
                throw new CustomBindException(errors);
            }
    
            return financialConfigurationRepository.search(financialConfigurationSearch);
        }

	@Transactional
	public FinancialConfiguration save(FinancialConfiguration financialConfiguration) {
		return financialConfigurationRepository.save(financialConfiguration);
	}

	@Transactional
	public FinancialConfiguration update(FinancialConfiguration financialConfiguration) {
		return financialConfigurationRepository.update(financialConfiguration);
	}
	
	public String fetchDataFrom() {
            return fetchDataFrom;
    }

}