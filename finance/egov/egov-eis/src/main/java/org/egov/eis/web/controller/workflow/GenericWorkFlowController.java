/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2018  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact@egovernments.org
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 *
 */
package org.egov.eis.web.controller.workflow;


import org.egov.eis.contract.DepartmentResponse;
import org.egov.eis.contract.RequestInfo;
import org.egov.eis.web.contract.WorkflowContainer;

import org.egov.infra.admin.master.service.DepartmentService;
import org.egov.infra.microservice.models.Department;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infra.workflow.entity.State;
import org.egov.infra.workflow.entity.StateAware;
import org.egov.infra.workflow.matrix.entity.WorkFlowMatrix;
import org.egov.infra.workflow.matrix.service.CustomizedWorkFlowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

@Controller
public abstract class GenericWorkFlowController {

    @Autowired
    protected CustomizedWorkFlowService customizedWorkFlowService;

    @Autowired
    protected DepartmentService departmentService;
    
    @Autowired
    HttpServletRequest serRequest;
    
    @Autowired
    MicroserviceUtils msUtil;
    

    @ModelAttribute(value = "approvalDepartmentList")
    public List<Department> addAllDepartments() {
		System.out.println("************************Retriveing all departments information****************");
       List<Department>deptlist = getDepartmentsFromMs();
		
		return deptlist;
    }

    @ModelAttribute("workflowcontainer")
    public WorkflowContainer getWorkflowContainer() {
        return new WorkflowContainer();
    }

    /**
     * @param prepareModel
     * @param model
     * @param container    This method we are calling In GET Method..
     */
    protected void prepareWorkflow(final Model prepareModel, final StateAware model, final WorkflowContainer container) {
        prepareModel.addAttribute("approverDepartmentList", addAllDepartments());
        prepareModel.addAttribute("validActionList", getValidActions(model, container));
        prepareModel.addAttribute("nextAction", getNextAction(model, container));

    }

    /**
     * @param model
     * @param container
     * @return NextAction From Matrix With Parameters
     * Type,CurrentState,CreatedDate
     */
    public String getNextAction(final StateAware model, final WorkflowContainer container) {

        WorkFlowMatrix wfMatrix = null;
        if (model != null && model.getId() != null)
            if (model.getCurrentState() == null)
                wfMatrix = customizedWorkFlowService.getWfMatrix(model.getStateType(),
                        container.getWorkFlowDepartment(), container.getAmountRule(), container.getAdditionalRule(),
                        State.DEFAULT_STATE_VALUE_CREATED, container.getPendingActions(), model.getCreatedDate(), container.getCurrentDesignation());
            else
                wfMatrix = customizedWorkFlowService.getWfMatrix(model.getStateType(),
                        container.getWorkFlowDepartment(), container.getAmountRule(), container.getAdditionalRule(),
                        model.getCurrentState().getValue(), container.getPendingActions(), model.getCreatedDate(), container.getCurrentDesignation());
        return wfMatrix == null ? "" : wfMatrix.getNextAction();
    }

    /**
     * @param model
     * @param container
     * @return List of WorkFlow Buttons From Matrix By Passing parametres
     * Type,CurrentState,CreatedDate
     */
    public List<String> getValidActions(final StateAware model, final WorkflowContainer container) {
        List<String> validActions;
        if (model == null || model.getId() == null || model.getCurrentState() == null
                || model.getCurrentState().getValue().equals("Closed") || model.getCurrentState().getValue().equals("END"))
            validActions = Arrays.asList("Forward");
        else if (model.getCurrentState() != null)
            validActions = customizedWorkFlowService.getNextValidActions(model.getStateType(), container
                    .getWorkFlowDepartment(), container.getAmountRule(), container.getAdditionalRule(), model
                    .getCurrentState().getValue(), container.getPendingActions(), model.getCreatedDate(), container.getCurrentDesignation());
        else
            validActions = customizedWorkFlowService.getNextValidActions(model.getStateType(),
                    container.getWorkFlowDepartment(), container.getAmountRule(), container.getAdditionalRule(),
                    State.DEFAULT_STATE_VALUE_CREATED, container.getPendingActions(), model.getCreatedDate(), container.getCurrentDesignation());
        return validActions;
    }
    
    private String getAccessToken(){

		String access_token = String.valueOf(serRequest.getSession().getAttribute("access_token"));
		if(access_token==null)
				access_token = msUtil.getAccessTokenFromRedis(serRequest);
		return access_token;
	}
    public List<Department> getDepartmentsFromMs() {
    	
//    	MicroserviceUtils msUtil = new MicroserviceUtils();
    	
    	String access_token = getAccessToken();
    	
    	List<Department>departments = msUtil.getDepartments(access_token, "default");
    	
    	return departments;
    	
//    	String  url = "http://localhost:8080/egov-common-masters/departments/_search?tenantId=default";
//    	
//    	
//    	
//    	RestTemplate restTemplate = new RestTemplate();
//    	MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
//		converter.setObjectMapper(new ObjectMapper());
//		restTemplate.getMessageConverters().add(converter);
//		
//		
//		RequestInfo requestObj = new RequestInfo();
//		HttpHeaders header = new HttpHeaders();
//		header.setContentType(MediaType.APPLICATION_JSON);
//		HttpEntity<RequestInfo> entity = new HttpEntity<RequestInfo>(requestObj, header);
//		
//		ResponseEntity<DepartmentResponse> departmentResponse = null;
//		ResponseEntity<String> depres = null;
//		
//		try {
//			departmentResponse = restTemplate.exchange(url, HttpMethod.POST,entity,DepartmentResponse.class);
//			depres = restTemplate.exchange(url, HttpMethod.POST,entity,String.class);
//			System.out.println("******************************response :"+depres.getBody());
//		} catch (RestClientException e) {
//			// TODO Auto-generated catch block
//			//e.printStackTrace();
//			System.out.println("Department retrieval failed from service...");
//		}
//		
//		if( departmentResponse!=null)
//		System.out.println("******************** Retieved department list size :"+ departmentResponse.getBody().getDepartlist().size()+"*************");
//		
//		return null!=departmentResponse? departmentResponse.getBody().getDepartlist():null;
    
    }

}
