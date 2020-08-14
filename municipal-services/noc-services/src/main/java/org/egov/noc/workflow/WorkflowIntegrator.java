package org.egov.noc.workflow;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.egov.noc.config.NOCConfiguration;
import org.egov.noc.util.NOCConstants;
import org.egov.noc.web.model.Noc;
import org.egov.noc.web.model.NocRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.PathNotFoundException;

import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;

@Service
@Slf4j
public class WorkflowIntegrator {

	private static final String TENANTIDKEY = "tenantId";

	private static final String BUSINESSSERVICEKEY = "businessService";

	private static final String ACTIONKEY = "action";

	private static final String COMMENTKEY = "comment";

	private static final String MODULENAMEKEY = "moduleName";

	private static final String BUSINESSIDKEY = "businessId";

	private static final String DOCUMENTSKEY = "documents";

	private static final String ASSIGNEEKEY = "assignes";
	
	private static final String UUIDKEY = "uuid";

	private static final String WORKFLOWREQUESTARRAYKEY = "ProcessInstances";

	private static final String REQUESTINFOKEY = "RequestInfo";

	private static final String PROCESSINSTANCESJOSNKEY = "$.ProcessInstances";

	private static final String BUSINESSIDJOSNKEY = "$.businessId";

	private static final String STATUSJSONKEY = "$.state.applicationStatus";

	private RestTemplate rest;

	private NOCConfiguration config;

	@Autowired
	public WorkflowIntegrator(RestTemplate rest, NOCConfiguration config) {
		this.rest = rest;
		this.config = config;
	}

	/**
	 * Method to integrate with workflow
	 *
	 * takes the noc request as parameter constructs the work-flow request
	 *
	 * and sets the resultant status from wf-response back to noc object
	 *
	 * @param nocRequest
	 */
	public void callWorkFlow(NocRequest nocRequest, String bussinessServiceValue) {
		String wfTenantId = nocRequest.getNoc().getTenantId();
		JSONArray array = new JSONArray();
		Noc noc = nocRequest.getNoc();
		JSONObject obj = new JSONObject();
		obj.put(BUSINESSIDKEY, noc.getApplicationNo());
		obj.put(TENANTIDKEY, wfTenantId);
		obj.put(BUSINESSSERVICEKEY, bussinessServiceValue);
		obj.put(MODULENAMEKEY, NOCConstants.NOC_MODULE);
		obj.put(ACTIONKEY, noc.getWorkflow().getAction());
		
		if(noc.getWorkflow().getComment() != null)
		  obj.put(COMMENTKEY, noc.getWorkflow().getComment());
		
		if (!CollectionUtils.isEmpty(noc.getWorkflow().getAssignes())) {
			List<Map<String, String>> uuidmaps = new LinkedList<>();
			noc.getWorkflow().getAssignes().forEach(assignee -> {
				Map<String, String> uuidMap = new HashMap<>();
				uuidMap.put(UUIDKEY, assignee);
				uuidmaps.add(uuidMap);
			});
			obj.put(ASSIGNEEKEY, uuidmaps);
		}
		
		obj.put(DOCUMENTSKEY, noc.getWorkflow().getDocuments());
		array.add(obj);
		JSONObject workFlowRequest = new JSONObject();
		workFlowRequest.put(REQUESTINFOKEY, nocRequest.getRequestInfo());
		workFlowRequest.put(WORKFLOWREQUESTARRAYKEY, array);
		String response = null;
		try {
			response = rest.postForObject(config.getWfHost().concat(config.getWfTransitionPath()), workFlowRequest,
					String.class);
		} catch (HttpClientErrorException e) {

			/*
			 * extracting message from client error exception
			 */
			DocumentContext responseContext = JsonPath.parse(e.getResponseBodyAsString());
			List<Object> errros = null;
			try {
				errros = responseContext.read("$.Errors");
			} catch (PathNotFoundException pnfe) {
				log.error("EG_NOC_WF_ERROR_KEY_NOT_FOUND",
						" Unable to read the json path in error object : " + pnfe.getMessage());
				throw new CustomException("EG_NOC_WF_ERROR_KEY_NOT_FOUND",
						" Unable to read the json path in error object : " + pnfe.getMessage());
			}
			throw new CustomException("EG_WF_ERROR", errros.toString());
		} catch (Exception e) {
			throw new CustomException("EG_WF_ERROR",
					" Exception occured while integrating with workflow : " + e.getMessage());
		}

		/*
		 * on success result from work-flow read the data and set the status
		 * back to NOC object
		 */
		DocumentContext responseContext = JsonPath.parse(response);
		List<Map<String, Object>> responseArray = responseContext.read(PROCESSINSTANCESJOSNKEY);
		Map<String, String> idStatusMap = new HashMap<>();
		responseArray.forEach(object -> {

			DocumentContext instanceContext = JsonPath.parse(object);
			idStatusMap.put(instanceContext.read(BUSINESSIDJOSNKEY), instanceContext.read(STATUSJSONKEY));
		});
		// setting the status back to NOC object from wf response
		noc.setApplicationStatus(idStatusMap.get(noc.getApplicationNo()));
	}
}
