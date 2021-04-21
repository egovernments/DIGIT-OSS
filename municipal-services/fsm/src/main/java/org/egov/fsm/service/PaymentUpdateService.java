package org.egov.fsm.service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.repository.FSMRepository;
import org.egov.fsm.util.FSMConstants;
import org.egov.fsm.util.FSMErrorConstants;
import org.egov.fsm.web.model.FSM;
import org.egov.fsm.web.model.FSMRequest;
import org.egov.fsm.web.model.FSMResponse;
import org.egov.fsm.web.model.FSMSearchCriteria;
import org.egov.fsm.web.model.Workflow;
import org.egov.fsm.web.model.collection.PaymentDetail;
import org.egov.fsm.web.model.collection.PaymentRequest;
import org.egov.fsm.workflow.WorkflowIntegrator;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PaymentUpdateService {

	private FSMConfiguration config;

	private FSMRepository repository;

	private WorkflowIntegrator wfIntegrator;

	private EnrichmentService enrichmentService;

	private ObjectMapper mapper;

	@Autowired
	public PaymentUpdateService(FSMConfiguration config, FSMRepository repository,
			WorkflowIntegrator wfIntegrator, EnrichmentService enrichmentService, ObjectMapper mapper) {
		this.config = config;
		this.repository = repository;
		this.wfIntegrator = wfIntegrator;
		this.enrichmentService = enrichmentService;
		this.mapper = mapper;

	}

	final String tenantId = "tenantId";

	final String businessService = "businessService";

	final String consumerCode = "consumerCode";

	/**
	 * Process the message from kafka and updates the status to paid
	 * 
	 * @param record
	 *            The incoming message from receipt create consumer
	 */
	public void process(HashMap<String, Object> record) {

		try {
			PaymentRequest paymentRequest = mapper.convertValue(record, PaymentRequest.class);
			RequestInfo requestInfo = paymentRequest.getRequestInfo();
			List<PaymentDetail> paymentDetails = paymentRequest.getPayment().getPaymentDetails();
			String tenantId = paymentRequest.getPayment().getTenantId();

			for (PaymentDetail paymentDetail : paymentDetails) {

				if(paymentDetail.getBusinessService().equalsIgnoreCase(FSMConstants.FSM_PAY_BUSINESS_SERVICE)) {
					
				
					FSMSearchCriteria searchCriteria = new FSMSearchCriteria();
					searchCriteria.setTenantId(tenantId);
					List<String> applNos = Arrays.asList(paymentDetail.getBill().getConsumerCode());
					searchCriteria.setApplicationNos(applNos);
					FSMResponse fsmResponse = repository.getFSMData(searchCriteria, null);
					List<FSM> fsms = fsmResponse.getFsm();
					enrichmentService.enrichFSMSearch(fsms, requestInfo, tenantId);
					if (CollectionUtils.isEmpty(fsms)) {
						throw new CustomException(FSMErrorConstants.INVALID_RECEIPT,
								"No FSM Application found for the comsumerCode "
										+ searchCriteria.getApplicationNos());
					}
					Workflow workflow = Workflow.builder().action("PAY").build();
					fsms.forEach(fsm -> {
					
						FSMRequest updateRequest = FSMRequest.builder().RequestInfo(requestInfo).fsm(fsm).build();
						updateRequest.setWorkflow(workflow);

						Role role = Role.builder().code("SYSTEM_PAYMENT").tenantId(fsm.getTenantId()).build();
						requestInfo.getUserInfo().getRoles().add(role);
						role = Role.builder().code("CITIZEN").tenantId(fsms.get(0).getTenantId()).build();
						requestInfo.getUserInfo().getRoles().add(role);
						

						/*
						 * calling workflow to update status
						 */
						wfIntegrator.callWorkFlow(updateRequest);

						log.debug(" the status of the application is : " + updateRequest.getFsm().getStatus());

						/*
						 * calling repository to update the object in eg_bpa_buildingpaln tables
						 */
						enrichmentService.postStatusEnrichment(updateRequest);

						repository.update(updateRequest, false);
					});
				}
					

				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
