package org.egov.egf.web.controller.microservice;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.egov.infra.microservice.models.Department;
import org.egov.infra.microservice.models.Designation;
import org.egov.infra.microservice.models.EmployeeInfo;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infra.web.spring.annotation.DuplicateRequestToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class MSCommController {

	@Autowired
	MicroserviceUtils msUtil;
	@Autowired
	
	private HttpServletRequest servletrequest;

	
	
	@RequestMapping(value = "/depratments",method=RequestMethod.GET)
	@ResponseBody
	public List<Department> getDetapartments(){
	
		String access_token=getAccessToken();
		String tenantId ="default";
		List<Department> departments = msUtil.getDepartments(access_token, tenantId);
		return departments;
	}
	
	@RequestMapping(value = "/designations",method=RequestMethod.GET)
	@ResponseBody
	public List<Designation> getDesignations(){
		
		String access_token=getAccessToken();
		String tenantId = "default";
		List<Designation> designations = msUtil.getDesignation(access_token, tenantId);
		
		return designations;
	}
	
	@RequestMapping(value="/approvers/{deptId}/{desgId}",method=RequestMethod.GET)
	@ResponseBody
	public List<EmployeeInfo> getApprovers(@PathVariable(name="deptId")String deptId,@PathVariable(name="desgId")String desgnId){
		
		String access_token=getAccessToken();
		String tenantId = "default";
		List<EmployeeInfo> approvers = msUtil.getApprovers(access_token, tenantId,deptId,desgnId);
		
		return approvers;
	}
	
	private String getAccessToken(){

		String access_token =(String) msUtil.readFromRedis(servletrequest.getSession().getId(), "admin_token");
		return access_token;
	}
	
	@RequestMapping(value="/ClearToken",method=RequestMethod.POST)
	private void logout(@RequestParam(value="auth_token")String access_token){
		if(null != access_token){
			msUtil.removeSessionFromRedis(access_token);
		}
	}
	
	@RequestMapping(value="/refreshToken",method=RequestMethod.POST)
	private void refreshToken(@RequestParam(value="oldToken")String oldToken,@RequestParam(value="newToken")String newToken){
		
		if(null!=oldToken && null!=newToken){
			msUtil.refreshToken(oldToken, newToken);
		}
	}
}
