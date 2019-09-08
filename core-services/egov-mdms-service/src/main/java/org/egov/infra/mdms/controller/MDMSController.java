package org.egov.infra.mdms.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.infra.mdms.model.MdmsUpdateRequest;
import org.egov.infra.mdms.service.MDMSService;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.MdmsResponse;
import org.egov.mdms.model.ModuleDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;

@RestController
@Slf4j
@RequestMapping(value = "/v1")
public class MDMSController {

	@Autowired
	private MDMSService mdmsService;

	@PostMapping("_search")
	@ResponseBody
	private ResponseEntity<?> search(@RequestBody @Valid MdmsCriteriaReq mdmsCriteriaReq) {
		
		long startTime = new Date().getTime();
		log.info("api startTime:"+startTime);
		log.info("MDMSController mdmsCriteriaReq:" + mdmsCriteriaReq);
		/*
		 * if(bindingResult.hasErrors()) { throw new
		 * CustomBindingResultExceprion(bindingResult); }
		 */
		Map<String, Map<String, JSONArray>> response = mdmsService.searchMaster(mdmsCriteriaReq);
		MdmsResponse mdmsResponse = new MdmsResponse();
		mdmsResponse.setMdmsRes(response);
		
		long endTime = new Date().getTime();
		log.info("api endTime:"+endTime);
		long totaltime = (endTime-startTime);
		log.info("Total execution time in ms:"+ totaltime);
		
		return new ResponseEntity<>(mdmsResponse, HttpStatus.OK);

		
	}
	

	@PostMapping("_get")
	@ResponseBody
	private ResponseEntity<?> search(@RequestParam("moduleName") String module,
									 @RequestParam("masterName") String master,
									 @RequestParam(value = "filter", required = false) String filter,
									 @RequestParam("tenantId") String tenantId,
									 @RequestBody RequestInfo requestInfo){

    	log.info("MDMSController mdmsCriteriaReq [" + module + ", " + master + ", " + filter + "]");
    	/*if(bindingResult.hasErrors()) {
    		throw new CustomBindingResultExceprion(bindingResult);
    	}*/

    	MdmsCriteriaReq mdmsCriteriaReq = new MdmsCriteriaReq();
    	mdmsCriteriaReq.setRequestInfo(requestInfo);
		MdmsCriteria criteria = new MdmsCriteria();
		criteria.setTenantId(tenantId);

		ModuleDetail detail = new ModuleDetail();
		detail.setModuleName(module);

		MasterDetail masterDetail = new MasterDetail();
		masterDetail.setName(master);
		masterDetail.setFilter(filter);
		ArrayList<MasterDetail> masterList = new ArrayList<>();
		masterList.add(masterDetail);
		detail.setMasterDetails(masterList);

		ArrayList<ModuleDetail> moduleList = new ArrayList<>();
		moduleList.add(detail);

		criteria.setModuleDetails(moduleList);
		mdmsCriteriaReq.setMdmsCriteria(criteria);

		Map<String, Map<String, JSONArray>> response = mdmsService.searchMaster(mdmsCriteriaReq);
		MdmsResponse mdmsResponse = new MdmsResponse();
		mdmsResponse.setMdmsRes(response);
		return new ResponseEntity<>(mdmsResponse ,HttpStatus.OK);

	}
	
	
	
	
	@PostMapping("_reload")
	@ResponseBody
	private ResponseEntity<?> reload(@RequestParam("filePath") String filePath,
									 @RequestParam("tenantId") String tenantId,
									 @RequestBody RequestInfo requestInfo){

		System.out.println(filePath+","+tenantId);
		mdmsService.updateCache(filePath, tenantId);
		return new ResponseEntity<>("Success" ,HttpStatus.OK);
	}
	
	@PostMapping("_reloadobj")
	@ResponseBody
	private ResponseEntity<?> reloadObj(@RequestBody MdmsUpdateRequest mdmsUpdateRequest){
		System.out.println("mdmsUpdateRequest:"+mdmsUpdateRequest);
		System.out.println("mdmsUpdateRequest key:"+mdmsUpdateRequest.getMdmsReq().keySet());
		
		 mdmsService.reloadObj(mdmsUpdateRequest.getMdmsReq());
		return new ResponseEntity<>("Success" ,HttpStatus.OK);
	}
	
}
