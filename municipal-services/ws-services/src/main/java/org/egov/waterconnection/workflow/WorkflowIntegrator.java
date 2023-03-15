package org.egov.waterconnection.workflow;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.egov.tracer.model.CustomException;
import org.egov.waterconnection.config.WSConfiguration;
import org.egov.waterconnection.constants.WCConstants;
import org.egov.waterconnection.util.WaterServicesUtil;
import org.egov.waterconnection.web.models.Property;
import org.egov.waterconnection.web.models.WaterConnectionRequest;
import org.egov.waterconnection.web.models.workflow.ProcessInstance;
import org.egov.waterconnection.web.models.workflow.ProcessInstanceRequest;
import org.egov.waterconnection.web.models.workflow.ProcessInstanceResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.PathNotFoundException;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class WorkflowIntegrator {

	private static final String MODULENAMEVALUE = "WS";

	@Autowired
	private WSConfiguration config;

	@Autowired
	private ObjectMapper mapper;
	
	@Autowired
	private RestTemplate rest;
	
	@Autowired
	private WaterServicesUtil wsUtil;

	/**
	 * Method to integrate with workflow
	 *
	 * takes the water connection request as parameter constructs the work-flow
	 * request
	 *
	 * and sets the resultant status from wf-response back to water-connection
	 * request object
	 *
	 * @param waterConnectionRequest
	 */
	public void callWorkFlow(WaterConnectionRequest waterConnectionRequest, Property property) {
		String wfBusinessServiceName = config.getBusinessServiceValue();

		if(waterConnectionRequest.isDisconnectRequest()
				|| (waterConnectionRequest.getWaterConnection().getApplicationStatus().equalsIgnoreCase(WCConstants.PENDING_FOR_PAYMENT_STATUS_CODE)
				&& waterConnectionRequest.getWaterConnection().getApplicationNo().contains(WCConstants.APPLICATION_DISCONNECTION_CODE))) {
			wfBusinessServiceName = config.getDisconnectBusinessServiceName();
		} else if(wsUtil.isModifyConnectionRequest(waterConnectionRequest)) {
			wfBusinessServiceName = config.getModifyWSBusinessServiceName();
		}
		ProcessInstance processInstance = ProcessInstance.builder()
				.businessId(waterConnectionRequest.getWaterConnection().getApplicationNo())
				.tenantId(property.getTenantId())
				.businessService(wfBusinessServiceName).moduleName(MODULENAMEVALUE)
				.action(waterConnectionRequest.getWaterConnection().getProcessInstance().getAction()).build();
		if (!StringUtils.isEmpty(waterConnectionRequest.getWaterConnection().getProcessInstance())) {
			if (!CollectionUtils
					.isEmpty(waterConnectionRequest.getWaterConnection().getProcessInstance().getAssignes())) {
				processInstance
						.setAssignes(waterConnectionRequest.getWaterConnection().getProcessInstance().getAssignes());
			}
			if (!CollectionUtils
					.isEmpty(waterConnectionRequest.getWaterConnection().getProcessInstance().getDocuments())) {
				processInstance
						.setDocuments(waterConnectionRequest.getWaterConnection().getProcessInstance().getDocuments());
			}
			if (!StringUtils.isEmpty(waterConnectionRequest.getWaterConnection().getProcessInstance().getComment())) {
				processInstance
						.setComment(waterConnectionRequest.getWaterConnection().getProcessInstance().getComment());
			}

		}
		List<ProcessInstance> processInstances = new ArrayList<>();
		processInstances.add(processInstance);
		ProcessInstanceResponse processInstanceResponse = null;
		log.info("PI :"+processInstances);
		try {
			processInstanceResponse = mapper.convertValue(
					rest.postForObject(config.getWfHost().concat(config.getWfTransitionPath()),
							ProcessInstanceRequest.builder().requestInfo(waterConnectionRequest.getRequestInfo())
									.processInstances(processInstances).build(),
							Map.class),
					ProcessInstanceResponse.class);
			
		} catch (HttpClientErrorException e) {
			/*
			 * extracting message from client error exception
			 */
			DocumentContext responseContext = JsonPath.parse(e.getResponseBodyAsString());
			List<Object> errros = null;
			try {
				errros = responseContext.read("$.Errors");
			} catch (PathNotFoundException pnfe) {
				StringBuilder builder = new StringBuilder();
				builder.append(" Unable to read the json path in error object : ").append(pnfe.getMessage());
				log.error("EG_WS_WF_ERROR_KEY_NOT_FOUND", builder.toString());
				throw new CustomException("EG_WS_WF_ERROR_KEY_NOT_FOUND", builder.toString());
			}
			throw new CustomException("EG_WF_ERROR", errros.toString());
		} catch (Exception e) {
			throw new CustomException("EG_WF_ERROR",
					" Exception occured while integrating with workflow : " + e.getMessage());
		}

		/*
		 * on success result from work-flow read the data and set the status back to WS
		 * object
		 */
		processInstanceResponse.getProcessInstances().forEach(pInstance -> {
			if (waterConnectionRequest.getWaterConnection().getApplicationNo().equals(pInstance.getBusinessId())) {
				waterConnectionRequest.getWaterConnection()
						.setApplicationStatus(pInstance.getState().getApplicationStatus());
			}
		});
	}
}