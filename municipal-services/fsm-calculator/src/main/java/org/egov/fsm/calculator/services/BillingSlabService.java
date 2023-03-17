package org.egov.fsm.calculator.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.calculator.repository.BillingSlabRepository;
import org.egov.fsm.calculator.repository.querybuilder.BillingSlabQueryBuilder;
import org.egov.fsm.calculator.utils.BillingSlabUtil;
import org.egov.fsm.calculator.utils.CalculatorConstants;
import org.egov.fsm.calculator.validator.BillingSlabValidator;
import org.egov.fsm.calculator.web.models.AuditDetails;
import org.egov.fsm.calculator.web.models.BillingSlab;
import org.egov.fsm.calculator.web.models.BillingSlab.SlumEnum;
import org.egov.fsm.calculator.web.models.BillingSlabRequest;
import org.egov.fsm.calculator.web.models.BillingSlabSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BillingSlabService {

	@Autowired
	private BillingSlabValidator validator;

	@Autowired
	private BillingSlabUtil util;

	@Autowired
	private BillingSlabRepository repository;
	@Autowired
	private BillingSlabQueryBuilder queryBuilder;
	@Autowired
	private MDMSService mdmsService;

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

	public List<BillingSlab> search(BillingSlabSearchCriteria criteria, RequestInfo requestInfo)
			throws JsonProcessingException {
		log.info("zeroPrice Search Started::");
		validator.validateSearch(requestInfo, criteria);
		List<BillingSlab> billingSlabList = new ArrayList<>();

		if (criteria.getSlum() == null || criteria.getSlum().equals(SlumEnum.NO)) {
			log.info("zeroPrice Search With Slum-NO ::");
			billingSlabList = repository.getBillingSlabData(criteria);

		} else {
			Object mdmsData = mdmsService.mDMSCall(requestInfo, criteria.getTenantId());

			List<Map> zeroPricingData = JsonPath.read(mdmsData, CalculatorConstants.ZERO_PRICE_CHECK_FROM_MDMS_PATH);
			if (zeroPricingData != null
					&& zeroPricingData.get(0).get(CalculatorConstants.ZERO_PRICE_CHECK_STATUS).equals(true)) {
				BillingSlab billingSlab = new BillingSlab();
				billingSlab.setPrice(new BigDecimal(0));
				billingSlab.setSlum(criteria.getSlum());
				billingSlab.setTenantId(criteria.getTenantId());
				billingSlab.setPropertyType(criteria.getTenantId());
				billingSlabList.add(billingSlab);
				
			} else {
				billingSlabList = repository.getBillingSlabData(criteria);

			}
		}
		return billingSlabList;

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
