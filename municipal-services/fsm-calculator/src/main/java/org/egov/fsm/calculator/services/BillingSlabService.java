package org.egov.fsm.calculator.services;

import java.util.List;
import java.util.UUID;

import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.calculator.repository.BillingSlabRepository;
import org.egov.fsm.calculator.utils.BillingSlabUtil;
import org.egov.fsm.calculator.validator.BillingSlabValidator;
import org.egov.fsm.calculator.web.models.AuditDetails;
import org.egov.fsm.calculator.web.models.BillingSlab;
import org.egov.fsm.calculator.web.models.BillingSlabRequest;
import org.egov.fsm.calculator.web.models.BillingSlabSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BillingSlabService {

	@Autowired
	private BillingSlabValidator validator;

	@Autowired
	private BillingSlabUtil util;

	@Autowired
	private BillingSlabRepository repository;

	public BillingSlab create(BillingSlabRequest billingSlabRequest) {
		validator.validateCreate(billingSlabRequest);
		RequestInfo requestInfo = billingSlabRequest.getRequestInfo();
		setInsertData(billingSlabRequest.getBillingSlab(), requestInfo);
		repository.save(billingSlabRequest);
		return billingSlabRequest.getBillingSlab();
	}
	
	public BillingSlab update(BillingSlabRequest billingSlabRequest) {
		validator.validateUpdate(billingSlabRequest);
		RequestInfo requestInfo = billingSlabRequest.getRequestInfo();
		setUpdateData(billingSlabRequest.getBillingSlab(), requestInfo);
		repository.update(billingSlabRequest);
		return billingSlabRequest.getBillingSlab();
	}
	
	public List<BillingSlab> search(BillingSlabSearchCriteria criteria, RequestInfo requestInfo) {
		validator.validateSearch( requestInfo,criteria);
		
		return repository.getBillingSlabData(criteria);

	}

	private void setInsertData(BillingSlab billingSlab, RequestInfo requestInfo) {
		billingSlab.setId(UUID.randomUUID().toString());
		billingSlab.setStatus(BillingSlab.StatusEnum.ACTIVE);
		billingSlab.setAuditDetails(util.getAuditDetails(requestInfo.getUserInfo().getUuid(), true));
	}
	
	private void setUpdateData(BillingSlab billingSlab, RequestInfo requestInfo) {
		String createdBy = billingSlab.getAuditDetails().getCreatedBy();
		Long createdTime = billingSlab.getAuditDetails().getCreatedTime();
		AuditDetails audit = util.getAuditDetails(requestInfo.getUserInfo().getUuid(), false);
		audit.setCreatedBy(createdBy);
		audit.setCreatedTime(createdTime);
		billingSlab.setAuditDetails(audit);
	}
	
	

}
