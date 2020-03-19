package org.egov.pt.service;

import java.util.HashMap;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.models.collection.Bill;
import org.egov.pt.models.collection.PaymentDetail;
import org.egov.pt.models.collection.PaymentRequest;
import org.egov.pt.models.enums.Status;
import org.egov.pt.producer.Producer;
import org.egov.pt.util.PropertyUtil;
import org.egov.pt.web.contracts.PropertyRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Sets;

@Service
public class PaymentUpdateService {

	@Autowired
	private PropertyService propertyService;

	@Autowired
	private PropertyConfiguration config;

	@Autowired
	private WorkflowService wfIntegrator;

	@Autowired
	private Producer producer;

	@Autowired
	private ObjectMapper mapper;
	
	@Autowired
	private PropertyUtil util;

	/**
	 * Process the message from kafka and updates the status to paid
	 * 
	 * @param record The incoming message from receipt create consumer
	 */
	public void process(HashMap<String, Object> record) {

		try {

			PaymentRequest paymentRequest = mapper.convertValue(record, PaymentRequest.class);
			RequestInfo requestInfo = paymentRequest.getRequestInfo();

			List<PaymentDetail> paymentDetails = paymentRequest.getPayment().getPaymentDetails();
			String tenantId = paymentRequest.getPayment().getTenantId();

			for (PaymentDetail paymentDetail : paymentDetails) {

				if (config.getBusinessServiceList().contains(paymentDetail.getBusinessService())
						&& paymentDetail.getBusinessService().equalsIgnoreCase("PT")) {

					updateWorkflowForPt(requestInfo, tenantId, paymentDetail);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	/**
	 * method to do workflow update for Property
	 * 
	 * @param requestInfo
	 * @param tenantId
	 * @param paymentDetail
	 */
	private void updateWorkflowForPt(RequestInfo requestInfo, String tenantId, PaymentDetail paymentDetail) {
		Bill bill  = paymentDetail.getBill();
		
		PropertyCriteria criteria = PropertyCriteria.builder()
				.propertyIds(Sets.newHashSet(bill.getConsumerCode()))
				.tenantId(tenantId)
				.build();
				
		List<Property> properties = propertyService.getPropertiesWithOwnerInfo(criteria, requestInfo);

		if (CollectionUtils.isEmpty(properties))
			throw new CustomException("INVALID RECEIPT",
					"No tradeLicense found for the comsumerCode " + criteria.getPropertyIds());

		Role role = Role.builder().code("SYSTEM_PAYMENT").build();
		requestInfo.getUserInfo().getRoles().add(role);
		
		properties.forEach( property -> {
			
			PropertyRequest updateRequest = PropertyRequest.builder().requestInfo(requestInfo)
					.property(property).build();
			
			String status = wfIntegrator.callWorkFlow(util.getProcessInstanceForPayment(updateRequest));
			updateRequest.getProperty().setStatus(Status.fromValue(status));
			
			producer.push(config.getUpdatePropertyTopic(), updateRequest);
		});
	}

}
