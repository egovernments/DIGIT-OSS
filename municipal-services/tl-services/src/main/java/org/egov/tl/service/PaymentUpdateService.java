package org.egov.tl.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;

import lombok.extern.slf4j.Slf4j;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.repository.TLRepository;
import org.egov.tl.util.TradeUtil;
import org.egov.tl.web.models.TradeLicense;
import org.egov.tl.web.models.TradeLicenseRequest;
import org.egov.tl.web.models.TradeLicenseSearchCriteria;
import org.egov.tl.web.models.collection.PaymentDetail;
import org.egov.tl.web.models.collection.PaymentRequest;
import org.egov.tl.web.models.workflow.BusinessService;
import org.egov.tl.workflow.WorkflowIntegrator;
import org.egov.tl.workflow.WorkflowService;
import org.egov.tracer.model.CustomException;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.egov.tl.util.TLConstants.*;


@Service
@Slf4j
public class PaymentUpdateService {

	private TradeLicenseService tradeLicenseService;

	private TLConfiguration config;

	private TLRepository repository;

	private WorkflowIntegrator wfIntegrator;

	private EnrichmentService enrichmentService;

	private ObjectMapper mapper;

	private WorkflowService workflowService;

	private TradeUtil util;

	@Value("${workflow.bpa.businessServiceCode.fallback_enabled}")
	private Boolean pickWFServiceNameFromTradeTypeOnly;

	@Autowired
	public PaymentUpdateService(TradeLicenseService tradeLicenseService, TLConfiguration config, TLRepository repository,
								WorkflowIntegrator wfIntegrator, EnrichmentService enrichmentService, ObjectMapper mapper,
								WorkflowService workflowService,TradeUtil util) {
		this.tradeLicenseService = tradeLicenseService;
		this.config = config;
		this.repository = repository;
		this.wfIntegrator = wfIntegrator;
		this.enrichmentService = enrichmentService;
		this.mapper = mapper;
		this.workflowService = workflowService;
		this.util = util;
	}




	final String tenantId = "tenantId";

	final String businessService = "businessService";

	final String consumerCode = "consumerCode";

	/**
	 * Process the message from kafka and updates the status to paid
	 * 
	 * @param record The incoming message from receipt create consumer
	 */
	public void process(HashMap<String, Object> record) {

		try {
			PaymentRequest paymentRequest = mapper.convertValue(record,PaymentRequest.class);
			RequestInfo requestInfo = paymentRequest.getRequestInfo();
			String tenantId = paymentRequest.getPayment().getTenantId();
			List<PaymentDetail> paymentDetails = paymentRequest.getPayment().getPaymentDetails();

			// Adding in MDC so that tracer can add it in header
			MDC.put(TENANTID_MDC_STRING, tenantId);


			for(PaymentDetail paymentDetail : paymentDetails){
				if (paymentDetail.getBusinessService().equalsIgnoreCase(businessService_TL) || paymentDetail.getBusinessService().equalsIgnoreCase(businessService_BPA)) {
					TradeLicenseSearchCriteria searchCriteria = new TradeLicenseSearchCriteria();
					searchCriteria.setTenantId(tenantId);
					searchCriteria.setApplicationNumber(paymentDetail.getBill().getConsumerCode());
					searchCriteria.setBusinessService(paymentDetail.getBusinessService());
					List<TradeLicense> licenses = tradeLicenseService.getLicensesWithOwnerInfo(searchCriteria, requestInfo);
					String wfbusinessServiceName = null;
					switch (paymentDetail.getBusinessService()) {
						case businessService_TL:
							wfbusinessServiceName = config.getTlBusinessServiceValue();
							break;

						case businessService_BPA:
							String tradeType = licenses.get(0).getTradeLicenseDetail().getTradeUnits().get(0).getTradeType();
							if (pickWFServiceNameFromTradeTypeOnly)
								tradeType = tradeType.split("\\.")[0];
							wfbusinessServiceName = tradeType;
							break;
					}
				BusinessService businessService = workflowService.getBusinessService(licenses.get(0).getTenantId(), requestInfo,wfbusinessServiceName);


					if (CollectionUtils.isEmpty(licenses))
						throw new CustomException("INVALID RECEIPT",
								"No tradeLicense found for the comsumerCode " + searchCriteria.getApplicationNumber());

					licenses.forEach(license -> license.setAction(ACTION_PAY));

					// FIXME check if the update call to repository can be avoided
					// FIXME check why aniket is not using request info from consumer
					// REMOVE SYSTEM HARDCODING AFTER ALTERING THE CONFIG IN WF FOR TL

					Role role = Role.builder().code("SYSTEM_PAYMENT").tenantId(licenses.get(0).getTenantId()).build();
					requestInfo.getUserInfo().getRoles().add(role);
					TradeLicenseRequest updateRequest = TradeLicenseRequest.builder().requestInfo(requestInfo)
							.licenses(licenses).build();

					/*
					 * calling workflow to update status
					 */
					wfIntegrator.callWorkFlow(updateRequest);

					updateRequest.getLicenses()
							.forEach(obj -> log.info(" the status of the application is : " + obj.getStatus()));

					List<String> endStates = Collections.nCopies(updateRequest.getLicenses().size(), STATUS_APPROVED);
					switch (paymentDetail.getBusinessService()) {
						case businessService_BPA:
							endStates = util.getBPAEndState(updateRequest);
							break;
					}
					enrichmentService.postStatusEnrichment(updateRequest,endStates,null);

					/*
					 * calling repository to update the object in TL tables
					 */
					Map<String,Boolean> idToIsStateUpdatableMap = util.getIdToIsStateUpdatableMap(businessService,licenses);
					repository.update(updateRequest,idToIsStateUpdatableMap);
			}
		 }
		} catch (Exception e) {
			log.error("KAFKA_PROCESS_ERROR", e);
		}

	}

	/**
	 * Extracts the required fields as map
	 * 
	 * @param context The documentcontext of the incoming receipt
	 * @return Map containing values of required fields
	 */
	private Map<String, String> enrichValMap(DocumentContext context) {
		Map<String, String> valMap = new HashMap<>();
		try {
			valMap.put(businessService, context.read("$.Payments.*.paymentDetails[?(@.businessService=='TL')].businessService"));
			valMap.put(consumerCode, context.read("$.Payments.*.paymentDetails[?(@.businessService=='TL')].bill.consumerCode"));
			valMap.put(tenantId, context.read("$.Payments[0].tenantId"));
		} catch (Exception e) {
			throw new CustomException("PAYMENT ERROR", "Unable to fetch values from payment");
		}
		return valMap;
	}

}
