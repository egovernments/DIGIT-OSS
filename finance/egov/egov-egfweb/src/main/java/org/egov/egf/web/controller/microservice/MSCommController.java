package org.egov.egf.web.controller.microservice;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.egov.infra.microservice.models.Department;
import org.egov.infra.microservice.models.Designation;
import org.egov.infra.microservice.models.EmployeeInfo;
import org.egov.infra.microservice.models.RequestInfoWrapper;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infra.web.support.ui.Inbox;
import org.egov.infra.workflow.entity.StateAware;
import org.egov.infra.workflow.inbox.InboxRenderServiceDelegate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.session.data.redis.RedisOperationsSessionRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;

@Controller
public class MSCommController {

    @Autowired
    MicroserviceUtils microserviceUtils;
    @Autowired
    private HttpServletRequest servletrequest;
    
    @Autowired
    RedisOperationsSessionRepository redisRepository;

    @Autowired
    private InboxRenderServiceDelegate<StateAware> inboxRenderServiceDelegate;

    @RequestMapping(value = "/depratments", method = RequestMethod.GET)
    @ResponseBody
    public List<Department> getDetapartments() {

        List<Department> departments = microserviceUtils.getDepartments();
        return departments;
    }

    @RequestMapping(value = "/designations", method = RequestMethod.GET)
    @ResponseBody
    public List<Designation> getDesignations() {

        List<Designation> designations = microserviceUtils.getDesignations();

        return designations;
    }

    @RequestMapping(value = "/approvers/{deptId}/{desgId}", method = RequestMethod.GET)
    @ResponseBody
    public List<EmployeeInfo> getApprovers(@PathVariable(name = "deptId") String deptId,
            @PathVariable(name = "desgId") String desgnId) {

        List<EmployeeInfo> approvers = microserviceUtils.getApprovers(deptId, desgnId);

        return approvers;
    }

    @RequestMapping(value = "/rest/ClearToken", method = RequestMethod.POST)
    @ResponseBody
    private ResponseEntity logout(@RequestBody RequestInfoWrapper request,HttpServletRequest httpReq) {
        try {
            String access_token = request.getRequestInfo().getAuthToken();
            String sessionId = httpReq.getSession().getId();
//            String sessionId =(String) microserviceUtils.readSesionIdByAuthToken(access_token);
            if(sessionId!=null && !sessionId.equalsIgnoreCase("null")){
                System.out.println("********* Retrieved session::authtoken******** "+sessionId+"::"+access_token);
                if(redisRepository!=null){
                 System.out.println("*********** Deleting the session for redisrepository "+ sessionId);   
//                    redisRepository.delete(sessionId);
                    microserviceUtils.removeSessionFromRedis(access_token, sessionId);
                }
                
            }

//            if (null != access_token) {
//                microserviceUtils.removeSessionFromRedis(access_token);
//            }
        } catch (Exception ex) {

            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/rest/refreshToken", method = RequestMethod.POST)
    @ResponseBody
    private ResponseEntity refreshToken(@RequestParam(value = "oldToken") String oldToken,
            @RequestParam(value = "newToken") String newToken) {

        try {
            if (null != oldToken && null != newToken) {
                microserviceUtils.refreshToken(oldToken, newToken);
            }
        } catch (Exception ex) {

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
