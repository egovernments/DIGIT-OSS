package org.egov.infra.mdms.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.infra.mdms.service.MDMSService;
import org.egov.mdms.model.District;
import org.egov.mdms.model.Khasra;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.MdmsResponse;
import org.egov.mdms.model.ModuleDetail;
import org.egov.mdms.model.Must;
import org.egov.mdms.model.Owner;
import org.egov.mdms.model.Tehsil;
import org.egov.mdms.model.Village;
import org.springframework.beans.factory.annotation.Autowired;
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

		Map<String, Map<String, JSONArray>> response = mdmsService.searchMaster(mdmsCriteriaReq);
		MdmsResponse mdmsResponse = new MdmsResponse();
		mdmsResponse.setMdmsRes(response);

		return new ResponseEntity<>(mdmsResponse, HttpStatus.OK);
	}

	@PostMapping("_get")
	@ResponseBody
	private ResponseEntity<?> search(@RequestParam("moduleName") String module,
			@RequestParam("masterName") String master, @RequestParam(value = "filter", required = false) String filter,
			@RequestParam("tenantId") String tenantId, @RequestBody RequestInfo requestInfo) {

		log.info("MDMSController mdmsCriteriaReq [" + module + ", " + master + ", " + filter + "]");
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
		return new ResponseEntity<>(mdmsResponse, HttpStatus.OK);

	}

	@PostMapping("_district")
	@ResponseBody
	private List<District> getDistrict(@RequestBody @Valid RequestInfo requestInfo) throws Exception {

		return mdmsService.getDistrict();
	}

	@PostMapping("_tehsil")
	@ResponseBody
	private List<Tehsil> getTehsil(@RequestBody @Valid RequestInfo requestInfo, @RequestParam("dCode") String dCode)
			throws Exception {
		return mdmsService.getTehsil(dCode);
	}

	@PostMapping("_village")
	@ResponseBody
	private List<Village> getVillages(@RequestBody @Valid RequestInfo requestInfo, @RequestParam("dCode") String dCode,
			@RequestParam("tCode") String tCode) throws Exception {
		return mdmsService.getVillages(dCode, tCode);
	}

	@PostMapping("_must")
	@ResponseBody
	private Must getMurabaByNVCODE(@RequestBody @Valid RequestInfo requestInfo, @RequestParam("dCode") String dCode,
			@RequestParam("tCode") String tCode, @RequestParam("NVCode") String nvCode) throws Exception {
		return mdmsService.getMurabaByNVCODE(dCode, tCode, nvCode);
	}

	@PostMapping("_khasra")
	@ResponseBody
	private List<Khasra> getKhasraListByNVCODE(@RequestBody @Valid RequestInfo requestInfo,
			@RequestParam("dCode") String dCode, @RequestParam("tCode") String tCode,
			@RequestParam("NVCode") String nvCode, @RequestParam("murba") String murba) throws Exception {
		return mdmsService.getKhasraListByNVCODE(dCode, tCode, nvCode, murba);
	}

	@PostMapping("_owner")
	@ResponseBody()
	
	private List<Owner> getOwnersbykhewatOnline(@RequestBody @Valid RequestInfo requestInfo,
			@RequestParam("dCode") String dCode, @RequestParam("tCode") String tCode,
			@RequestParam("NVCode") String nvCode, @RequestParam("khewat") String khewat) throws Exception {
		
		return mdmsService.getOwnersbykhewatOnline(dCode, tCode, nvCode, khewat);
	}
}
