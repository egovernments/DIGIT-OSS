package org.egov.echallan.service;


import java.util.HashMap;
import java.util.List;
import org.egov.common.contract.request.RequestInfo;
import org.egov.echallan.config.ChallanConfiguration;
import org.egov.echallan.model.AuditDetails;
import org.egov.echallan.model.Challan;
import org.egov.echallan.model.Challan.StatusEnum;
import org.egov.echallan.model.ChallanRequest;
import org.egov.echallan.model.SearchCriteria;
import org.egov.echallan.producer.Producer;
import org.egov.echallan.util.CommonUtils;
import org.egov.echallan.web.models.collection.Payment;
import org.egov.echallan.web.models.collection.PaymentDetail;
import org.egov.echallan.web.models.collection.PaymentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;

import static org.egov.echallan.util.ChallanConstants.TENANTID_MDC_STRING;
 

@Service
@Slf4j
public class PaymentUpdateService {
	
	@Autowired
	private ObjectMapper mapper; 
	
	@Autowired
	private ChallanService challanService;
	
	@Autowired
	private Producer producer;
	
	@Autowired
	private ChallanConfiguration config;
	
	@Autowired
	 private CommonUtils commUtils;
	
	
	
	public void process(HashMap<String, Object> record) {

		try {
			log.info("Process for object"+ record);
			PaymentRequest paymentRequest = mapper.convertValue(record, PaymentRequest.class);
			RequestInfo requestInfo = paymentRequest.getRequestInfo();
			String tenantId = paymentRequest.getPayment().getTenantId();

			// Adding in MDC so that tracer can add it in header
			MDC.put(TENANTID_MDC_STRING, tenantId);

			//Update the challan only when the payment is fully done.
			if( paymentRequest.getPayment().getTotalAmountPaid().compareTo(paymentRequest.getPayment().getTotalDue())!=0) 
				return;
			List<PaymentDetail> paymentDetails = paymentRequest.getPayment().getPaymentDetails();
			for (PaymentDetail paymentDetail : paymentDetails) {
				SearchCriteria criteria = new SearchCriteria();
				criteria.setTenantId(paymentRequest.getPayment().getTenantId());
				criteria.setChallanNo(paymentDetail.getBill().getConsumerCode());
				criteria.setBusinessService(paymentDetail.getBusinessService());
				List<Challan> challans = challanService.search(criteria, requestInfo);
				//update challan only if payment is done for challan. 
				if(!CollectionUtils.isEmpty(challans) ) {
					String uuid = requestInfo.getUserInfo().getUuid();
				    AuditDetails auditDetails = commUtils.getAuditDetails(uuid, true);
					for(Challan challan: challans){
						challan.setApplicationStatus(StatusEnum.PAID);
						challan.setReceiptNumber(paymentDetail.getReceiptNumber());
					}
					challans.get(0).setAuditDetails(auditDetails);
					ChallanRequest request = ChallanRequest.builder().requestInfo(requestInfo).challan(challans.get(0)).build();
					producer.push(request.getChallan().getTenantId(),config.getUpdateChallanTopic(), request);
				}
			}
		} catch (Exception e) {
			log.error("Exception while processing payment update: ",e);
		}

	}

}
