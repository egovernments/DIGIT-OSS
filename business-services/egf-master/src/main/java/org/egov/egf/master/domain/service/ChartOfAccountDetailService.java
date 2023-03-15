package org.egov.egf.master.domain.service;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.constants.Constants;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.ErrorCode;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.util.ApplicationThreadLocals;
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.ChartOfAccountDetail;
import org.egov.egf.master.domain.model.ChartOfAccountDetailSearch;
import org.egov.egf.master.domain.repository.AccountDetailTypeRepository;
import org.egov.egf.master.domain.repository.ChartOfAccountDetailRepository;
import org.egov.egf.master.domain.repository.ChartOfAccountRepository;
import org.egov.egf.master.web.requests.ChartOfAccountDetailRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class ChartOfAccountDetailService {

	@Autowired
	private ChartOfAccountDetailRepository chartOfAccountDetailRepository;

	@Autowired
	private SmartValidator validator;
	@Autowired
	private ChartOfAccountRepository chartOfAccountRepository;
	@Autowired
	private AccountDetailTypeRepository accountDetailTypeRepository;

	private BindingResult validate(List<ChartOfAccountDetail> chartofaccountdetails, String method,
			BindingResult errors) {

                try {
                    switch (method) {
                    case Constants.ACTION_VIEW:
                        // validator.validate(chartOfAccountDetailContractRequest.getChartOfAccountDetail(),
                        // errors);
                        break;
                    case Constants.ACTION_CREATE:
                        if (chartofaccountdetails == null) {
                            throw new InvalidDataException("chartofaccountdetails", ErrorCode.NOT_NULL.getCode(),
                                    null);
                        }
                        for (ChartOfAccountDetail chartOfAccountDetail : chartofaccountdetails) {
                            validator.validate(chartOfAccountDetail, errors);
                        }
                        break;
                    case Constants.ACTION_UPDATE:
                        if (chartofaccountdetails == null) {
                            throw new InvalidDataException("chartofaccountdetails", ErrorCode.NOT_NULL.getCode(),
                                    null);
                        }
                        for (ChartOfAccountDetail chartOfAccountDetail : chartofaccountdetails) {
                            if (chartOfAccountDetail.getId() == null) {
                                throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                        chartOfAccountDetail.getId());
                            }
                            validator.validate(chartOfAccountDetail, errors);
                        }
                        break;
                    case Constants.ACTION_SEARCH:
                        if (chartofaccountdetails == null) {
                            throw new InvalidDataException("chartofaccountdetails", ErrorCode.NOT_NULL.getCode(),
                                    null);
                        }
                        for (ChartOfAccountDetail chartofaccountdetail : chartofaccountdetails) {
                            if (chartofaccountdetail.getTenantId() == null) {
                                throw new InvalidDataException("tenantId", ErrorCode.MANDATORY_VALUE_MISSING.getCode(),
                                        chartofaccountdetail.getTenantId());
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

	public List<ChartOfAccountDetail> fetchRelated(List<ChartOfAccountDetail> chartofaccountdetails) {
		for (ChartOfAccountDetail chartOfAccountDetail : chartofaccountdetails) {
			// fetch related items
			chartOfAccountDetail.setTenantId(ApplicationThreadLocals.getTenantId().get());
			if (chartOfAccountDetail.getChartOfAccount() != null) {
				ChartOfAccount chartOfAccount = chartOfAccountRepository
						.findById(chartOfAccountDetail.getChartOfAccount());
				if (chartOfAccount == null) {
					throw new InvalidDataException("chartOfAccount", "chartOfAccount.invalid",
							" Invalid chartOfAccount");
				}
				chartOfAccountDetail.setChartOfAccount(chartOfAccount);
			}
			if (chartOfAccountDetail.getAccountDetailType() != null) {
				AccountDetailType accountDetailType = accountDetailTypeRepository
						.findById(chartOfAccountDetail.getAccountDetailType());
				if (accountDetailType == null) {
					throw new InvalidDataException("accountDetailType", "accountDetailType.invalid",
							" Invalid accountDetailType");
				}
				chartOfAccountDetail.setAccountDetailType(accountDetailType);
			}

		}

		return chartofaccountdetails;
	}

	@Transactional
	public List<ChartOfAccountDetail> add(List<ChartOfAccountDetail> chartofaccountdetails, BindingResult errors) {
		chartofaccountdetails = fetchRelated(chartofaccountdetails);
		validate(chartofaccountdetails, Constants.ACTION_CREATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		for(ChartOfAccountDetail b:chartofaccountdetails)b.setId(chartOfAccountDetailRepository.getNextSequence());
		return chartofaccountdetails;

	}

	@Transactional
	public List<ChartOfAccountDetail> update(List<ChartOfAccountDetail> chartofaccountdetails, BindingResult errors) {
		chartofaccountdetails = fetchRelated(chartofaccountdetails);
		validate(chartofaccountdetails, Constants.ACTION_UPDATE, errors);
		if (errors.hasErrors()) {
			throw new CustomBindException(errors);
		}
		return chartofaccountdetails;

	}

	public void addToQue(ChartOfAccountDetailRequest request) {
		chartOfAccountDetailRepository.add(request);
	}

        public Pagination<ChartOfAccountDetail> search(ChartOfAccountDetailSearch chartOfAccountDetailSearch, BindingResult errors) {
            
            try {
                
                List<ChartOfAccountDetail> chartOfAccountDetails = new ArrayList<>();
                chartOfAccountDetails.add(chartOfAccountDetailSearch);
                validate(chartOfAccountDetails, Constants.ACTION_SEARCH, errors);
    
                if (errors.hasErrors()) {
                    throw new CustomBindException(errors);
                }
            
            } catch (CustomBindException e) {
    
                throw new CustomBindException(errors);
            }
    
            return chartOfAccountDetailRepository.search(chartOfAccountDetailSearch);
        }

	@Transactional
	public ChartOfAccountDetail save(ChartOfAccountDetail chartOfAccountDetail) {
		return chartOfAccountDetailRepository.save(chartOfAccountDetail);
	}

	@Transactional
	public ChartOfAccountDetail update(ChartOfAccountDetail chartOfAccountDetail) {
		return chartOfAccountDetailRepository.update(chartOfAccountDetail);
	}

}