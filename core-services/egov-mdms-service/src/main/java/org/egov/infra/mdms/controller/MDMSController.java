package org.egov.infra.mdms.controller;

import java.util.ArrayList;
import java.util.Map;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.infra.mdms.service.MDMSService;
import org.egov.mdms.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
                                     @RequestParam("masterName") String master,
                                     @RequestParam(value = "filter", required = false) String filter,
                                     @RequestParam("tenantId") String tenantId,
                                     @RequestBody RequestInfo requestInfo) {

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
}
