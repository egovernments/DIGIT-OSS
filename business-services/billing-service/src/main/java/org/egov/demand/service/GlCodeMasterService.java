package org.egov.demand.service;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.GlCodeMaster;
import org.egov.demand.model.GlCodeMasterCriteria;
import org.egov.demand.repository.GlCodeMasterRepository;
import org.egov.demand.web.contract.GlCodeMasterResponse;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class GlCodeMasterService {

	private static final Logger logger = LoggerFactory.getLogger(GlCodeMasterService.class);
	
	@Autowired
	private ResponseFactory responseInfoFactory;
	
	@Autowired
	private GlCodeMasterRepository glCodeMasterRepository;

	public GlCodeMasterResponse getGlCodes(GlCodeMasterCriteria searchGlCode, RequestInfo requestInfo) {
		logger.info("GlCodeMasterService getTaxHeads");
		List<GlCodeMaster> glCodeMaster= glCodeMasterRepository.findForCriteria(searchGlCode);
		return getGlCodeMasterResponse(glCodeMaster,requestInfo);
	}
	
	private GlCodeMasterResponse getGlCodeMasterResponse(List<GlCodeMaster> glCodeMaster, RequestInfo requestInfo) {
		GlCodeMasterResponse glCodeMasterResponse = new GlCodeMasterResponse();
		glCodeMasterResponse.setGlCodeMasters(glCodeMaster);
		glCodeMasterResponse.setResponseInfo(responseInfoFactory.getResponseInfo(requestInfo, HttpStatus.OK));
		return glCodeMasterResponse;
	}
	
	
}
