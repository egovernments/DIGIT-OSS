package org.egov.swservice.workflow;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.egov.swservice.config.SWConfiguration;
import org.egov.swservice.util.SWConstants;
import org.egov.swservice.util.SewerageServicesUtil;
import org.egov.swservice.web.models.Property;
import org.egov.swservice.web.models.SewerageConnection;
import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.egov.swservice.web.models.workflow.ProcessInstance;
import org.egov.swservice.web.models.workflow.ProcessInstanceRequest;
import org.egov.swservice.web.models.workflow.ProcessInstanceResponse;
import org.egov.tracer.model.CustomException;
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

	private static final String MODULE_NAME_VALUE = "SW";

	private RestTemplate rest;

	private SWConfiguration config;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private SewerageServicesUtil servicesUtil;
	
	@Autowired
	public WorkflowIntegrator(RestTemplate rest, SWConfiguration config) {
		this.rest = rest;
		this.config = config;
	}

	/**
	 * Method to integrate with workflow
	 *
	 * takes the sewerage request as parameter constructs the work-flow request
	 *
	 * and sets the resultant status from wf-response back to sewerage object
	 *
	 * @param sewerageConnectionRequest - Sewerage Connection Request
	 * @param property - Property Object
	 */
	public void callWorkFlow(SewerageConnectionRequest sewerageConnectionRequest, Property property) {
		String wfBusinessServiceName = config.getBusinessServiceValue();
		
		if(sewerageConnectionRequest.isDisconnectRequest()
				|| (sewerageConnectionRequest.getSewerageConnection().getApplicationStatus().equalsIgnoreCase(SWConstants.PENDING_FOR_PAYMENT_STATUS_CODE)
				&& sewerageConnectionRequest.getSewerageConnection().getApplicationNo().contains(SWConstants.APPLICATION_DISCONNECTION_CODE))) {
			wfBusinessServiceName = config.getDisconnectBusinessServiceName();
		} else if(servicesUtil.isModifyConnectionRequest(sewerageConnectionRequest)){
			wfBusinessServiceName = config.getModifySWBusinessServiceName();
		}
		SewerageConnection connection = sewerageConnectionRequest.getSewerageConnection();
		ProcessInstance processInstance = ProcessInstance.builder()
				.businessId(sewerageConnectionRequest.getSewerageConnection().getApplicationNo())
				.tenantId(property.getTenantId())
				.businessService(wfBusinessServiceName).moduleName(MODULE_NAME_VALUE)
				.action(connection.getProcessInstance().getAction()).build();

		if (!StringUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getProcessInstance())) {
			if (!CollectionUtils
					.isEmpty(sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAssignes())) {
				processInstance.setAssignes(
						sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAssignes());
			}
			if (!CollectionUtils
					.isEmpty(sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getDocuments())) {
				processInstance.setDocuments(
						sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getDocuments());
			}
			if (!StringUtils
					.isEmpty(sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getComment())) {
				processInstance.setComment(
						sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getComment());
			}

		}
		List<ProcessInstance> processInstances = new ArrayList<>();
		processInstances.add(processInstance);
		ProcessInstanceResponse processInstanceResponse;

		try {
			processInstanceResponse = mapper.convertValue(
					rest.postForObject(config.getWfHost().concat(config.getWfTransitionPath()),
							ProcessInstanceRequest.builder().requestInfo(sewerageConnectionRequest.getRequestInfo())
									.processInstances(processInstances).build(),
							Map.class),
					ProcessInstanceResponse.class);
		} catch (HttpClientErrorException e) {
			/*
			 * extracting message from client error exception
			 */
			DocumentContext responseContext = JsonPath.parse(e.getResponseBodyAsString());
			List<Object> errorList;
			try {
				errorList = responseContext.read("$.Errors");
			} catch (PathNotFoundException ex1) {
				StringBuilder builder = new StringBuilder();
				builder.append(" Unable to read the json path in error object : ").append(ex1.getMessage());
				log.error(builder.toString());
				throw new CustomException("EG_SW_WF_ERROR_KEY_NOT_FOUND", builder.toString());
			}
			throw new CustomException("EG_WF_ERROR", errorList.toString());
		} catch (Exception e) {
			throw new CustomException("EG_WF_ERROR",
					" Exception occurred while integrating with workflow : " + e.getMessage());
		}

		/*
		 * on success result from work-flow read the data and set the status
		 * back to SW object
		 */
		processInstanceResponse.getProcessInstances().forEach(pInstance -> {
			if (sewerageConnectionRequest.getSewerageConnection().getApplicationNo()
					.equals(pInstance.getBusinessId())) {
				sewerageConnectionRequest.getSewerageConnection()
						.setApplicationStatus(pInstance.getState().getApplicationStatus());
			}
		});

	}
}