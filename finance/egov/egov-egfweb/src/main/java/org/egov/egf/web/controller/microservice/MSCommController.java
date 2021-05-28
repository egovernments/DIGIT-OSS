package org.egov.egf.web.controller.microservice;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.egov.infra.microservice.models.Department;
import org.egov.infra.microservice.models.Designation;
import org.egov.infra.microservice.models.EmployeeInfo;
import org.egov.infra.microservice.models.RequestInfoWrapper;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infra.web.support.ui.Inbox;
import org.egov.infra.workflow.entity.StateAware;
import org.egov.infra.workflow.inbox.InboxRenderServiceDelegate;
import org.egov.infra.workflow.matrix.entity.WorkFlowMatrix;
import org.egov.infra.workflow.service.WorkflowService;
import org.hibernate.validator.constraints.SafeHtml;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.session.data.redis.RedisOperationsSessionRepository;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.HttpClientErrorException;

@Controller
@Validated
public class MSCommController {
	
	private static final String SELECT = "Select";

	private static final Logger LOGGER = LoggerFactory.getLogger(MSCommController.class);

    @Autowired
    MicroserviceUtils microserviceUtils;
    
    @Autowired
    RedisOperationsSessionRepository redisRepository;
    
    @Autowired
    private WorkflowService<StateAware> workflowService;

    @Autowired
    private InboxRenderServiceDelegate<StateAware> inboxRenderServiceDelegate;

    @GetMapping(value = "/depratments")
    @ResponseBody
    public List<Department> getDetapartments() {
        return microserviceUtils.getDepartments();
    }

	@GetMapping(value = "/designations")
	@ResponseBody
	public List<Designation> getDesignations(@RequestParam Map<String, String> params) {
		final List<String> workflowDesignations = new ArrayList<>();
		if (!SELECT.equals(params.get("departmentRule").trim())) {
			final WorkFlowMatrix wfmatrix = workflowService.getWfMatrix(params.get("type"),
					params.get("departmentRule").trim(), null, params.get("additionalRule"), params.get("currentState"),
					params.get("pendingAction"));
			if (wfmatrix.getCurrentDesignation() != null) {
				workflowDesignations.addAll(Arrays.asList(wfmatrix.getCurrentDesignation().split(",")));
			}
			return microserviceUtils.getDesignations().stream()
					.filter(desig -> workflowDesignations.contains(desig.getName())).collect(Collectors.toList());
		}
		return Collections.emptyList();
	}

	@GetMapping(value = "/approvers/{deptId}/{desgId}")
	@ResponseBody
	public List<EmployeeInfo> getApprovers(@PathVariable(name = "deptId") @SafeHtml String deptId,
			@PathVariable(name = "desgId") @SafeHtml String desgnId) {
		return microserviceUtils.getApprovers(deptId, desgnId);
	}

    @PostMapping(value = "/rest/ClearToken")
    @ResponseBody
    public ResponseEntity<Object> logout(@RequestBody RequestInfoWrapper request,HttpServletRequest httpReq) {
        try {
            String accessToken = request.getRequestInfo().getAuthToken();
            String sessionId = httpReq.getSession().getId();
            if(sessionId!=null && !sessionId.equalsIgnoreCase("null")){
				LOGGER.info("********* Retrieved session::authtoken******** {}::{}", sessionId, accessToken);
                if(redisRepository!=null){
                	LOGGER.info("*********** Deleting the session for redisrepository {}", sessionId);   
                    microserviceUtils.removeSessionFromRedis(accessToken, sessionId);
                }
            }

        } catch (HttpClientErrorException ex) {

            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(value = "/rest/refreshToken")
    @ResponseBody
    public ResponseEntity<Object> refreshToken(@RequestParam(value = "oldToken") @SafeHtml String oldToken,
            @RequestParam(value = "newToken") @SafeHtml String newToken) {

        try {
            if (null != oldToken && null != newToken) {
                microserviceUtils.refreshToken(oldToken, newToken);
            }
        } catch (HttpClientErrorException ex) {

            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(value = "inbox/items", produces = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public List<Inbox> showInbox() {

        return inboxRenderServiceDelegate.getCurrentUserInboxItems();
    }

    @GetMapping(value = "inbox/history", produces = APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public List<Inbox> showInboxHistory(@RequestParam Long stateId) {
        return inboxRenderServiceDelegate.getWorkflowHistoryItems(stateId);
    }
}
