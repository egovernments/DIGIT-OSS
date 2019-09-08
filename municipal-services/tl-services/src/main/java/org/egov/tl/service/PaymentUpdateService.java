package org.egov.tl.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.repository.TLRepository;
import org.egov.tl.util.TradeUtil;
import org.egov.tl.web.models.TradeLicense;
import org.egov.tl.web.models.TradeLicenseRequest;
import org.egov.tl.web.models.TradeLicenseSearchCriteria;
import org.egov.tl.web.models.workflow.BusinessService;
import org.egov.tl.workflow.WorkflowIntegrator;
import org.egov.tl.workflow.WorkflowService;
import org.egov.tracer.model.CustomException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

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
			String jsonString = new JSONObject(record).toString();
			DocumentContext documentContext = JsonPath.parse(jsonString);
			Map<String, String> valMap = enrichValMap(documentContext);

			Map<String, Object> info = documentContext.read("$.RequestInfo");
			RequestInfo requestInfo = mapper.convertValue(info, RequestInfo.class);

			if (valMap.get(businessService).equalsIgnoreCase(config.getBusinessService())) {
				TradeLicenseSearchCriteria searchCriteria = new TradeLicenseSearchCriteria();
				searchCriteria.setTenantId(valMap.get(tenantId));
				searchCriteria.setApplicationNumber(valMap.get(consumerCode));
				List<TradeLicense> licenses = tradeLicenseService.getLicensesWithOwnerInfo(searchCriteria, requestInfo);

				BusinessService businessService = workflowService.getBusinessService(licenses.get(0).getTenantId(), requestInfo);


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

				enrichmentService.postStatusEnrichment(updateRequest);

				/*
				 * calling repository to update the object in TL tables
				 */
				Map<String,Boolean> idToIsStateUpdatableMap = util.getIdToIsStateUpdatableMap(businessService,licenses);
				repository.update(updateRequest,idToIsStateUpdatableMap);
			}
		} catch (Exception e) {
			e.printStackTrace();
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
			valMap.put(businessService, context.read("$.Receipt[0].Bill[0].billDetails[0].businessService"));
			valMap.put(consumerCode, context.read("$.Receipt[0].Bill[0].billDetails[0].consumerCode"));
			valMap.put(tenantId, context.read("$.Receipt[0].tenantId"));
		} catch (Exception e) {
			e.printStackTrace();
			throw new CustomException("RECEIPT ERROR", "Unable to fetch values from receipt");
		}
		return valMap;
	}

}
