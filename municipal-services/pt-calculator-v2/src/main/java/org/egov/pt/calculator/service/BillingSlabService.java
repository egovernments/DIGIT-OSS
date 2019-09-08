package org.egov.pt.calculator.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.calculator.producer.Producer;
import org.egov.pt.calculator.repository.PTCalculatorDBRepository;
import org.egov.pt.calculator.util.BillingSlabUtils;
import org.egov.pt.calculator.util.Configurations;
import org.egov.pt.calculator.util.ResponseInfoFactory;
import org.egov.pt.calculator.web.models.BillingSlab;
import org.egov.pt.calculator.web.models.BillingSlabReq;
import org.egov.pt.calculator.web.models.BillingSlabRes;
import org.egov.pt.calculator.web.models.BillingSlabSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BillingSlabService {
	
	@Autowired
	private BillingSlabUtils billingSlabUtils;
	
	@Autowired
	private Producer producer;
	
	@Autowired
	private Configurations configurations;
	
	@Autowired
	private PTCalculatorDBRepository dbRepository;
	
	@Autowired
	private ResponseInfoFactory factory;
	
	@Value("${billingslab.max.toFloor}")
	private Double maxToFloor;
	
	@Value("${billingslab.min.fromFloor}")
	private Double minFromFloor;
	
	@Value("${billingslab.max.toPLotSize}")
	private Double maxToPlotSize;

	public BillingSlabRes createBillingSlab(BillingSlabReq billingSlabReq) {
		enrichBillingSlabForCreate(billingSlabReq);
		producer.push(configurations.getBillingSlabSavePersisterTopic(), billingSlabReq);
		return billingSlabUtils.getBillingSlabResponse(billingSlabReq);
	}
	
	public BillingSlabRes updateBillingSlab(BillingSlabReq billingSlabReq) {
		enrichBillingSlabForUpdate(billingSlabReq);
		producer.push(configurations.getBillingSlabUpdatePersisterTopic(), billingSlabReq);
		return billingSlabUtils.getBillingSlabResponse(billingSlabReq);
	}
	
	public void enrichBillingSlabForCreate(BillingSlabReq billingSlabReq) {
		for(BillingSlab billingSlab: billingSlabReq.getBillingSlab()) {
			billingSlab.setId(UUID.randomUUID().toString());
			billingSlab.setAuditDetails(billingSlabUtils.getAuditDetails(billingSlabReq.getRequestInfo()));
			if(null == billingSlab.getToFloor()) {
				billingSlab.setToFloor((null == maxToFloor) ? Double.POSITIVE_INFINITY : maxToFloor);
			}
			if(null == billingSlab.getToPlotSize()) {
				billingSlab.setToPlotSize((null == maxToPlotSize) ? Double.POSITIVE_INFINITY : maxToPlotSize);
			}
			if(null == billingSlab.getFromFloor()) {
				billingSlab.setFromFloor((null == minFromFloor) ? Double.NEGATIVE_INFINITY : minFromFloor);
			}
		}
	}
	
	public void enrichBillingSlabForUpdate(BillingSlabReq billingSlabReq) {
		for(BillingSlab billingSlab: billingSlabReq.getBillingSlab()) {
			billingSlab.setAuditDetails(billingSlabUtils.getAuditDetails(billingSlabReq.getRequestInfo()));
			if(null == billingSlab.getToFloor()) {
				billingSlab.setToFloor((null == maxToFloor) ? Double.POSITIVE_INFINITY : maxToFloor);
			}
			if(null == billingSlab.getToPlotSize()) {
				billingSlab.setToPlotSize((null == maxToPlotSize) ? Double.POSITIVE_INFINITY : maxToPlotSize);
			}
			if(null == billingSlab.getFromFloor()) {
				billingSlab.setFromFloor((null == minFromFloor) ? Double.NEGATIVE_INFINITY : minFromFloor);
			}
		}
	}
	
	public BillingSlabRes searchBillingSlabs(RequestInfo requestInfo, BillingSlabSearchCriteria billingSlabSearcCriteria) {
		List<BillingSlab> billingSlabs = null;
		try {
			billingSlabs = dbRepository.searchBillingSlab(billingSlabSearcCriteria);
		} catch (Exception e) {
			log.error("Exception while fetching billing slabs from db: " + e);
			billingSlabs = new ArrayList<>();
		}
		return BillingSlabRes.builder().responseInfo(factory.createResponseInfoFromRequestInfo(requestInfo, true))
				.billingSlab(billingSlabs).build();
	}
}
 
