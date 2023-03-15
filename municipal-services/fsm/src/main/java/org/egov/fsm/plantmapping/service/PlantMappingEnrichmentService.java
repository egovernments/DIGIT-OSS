package org.egov.fsm.plantmapping.service;

import java.util.UUID;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.plantmapping.web.model.PlantMapping;
import org.egov.fsm.plantmapping.web.model.PlantMappingRequest;
import org.egov.fsm.util.FSMUtil;
import org.egov.fsm.web.model.AuditDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PlantMappingEnrichmentService {
	

	@Autowired
	private FSMUtil util;

	public void enrichCreateRequest(@Valid PlantMappingRequest request) {
		log.info("calling enrichCreateRequest");
		RequestInfo requestInfo = request.getRequestInfo();
		request.getPlantMapping().setStatus(PlantMapping.StatusEnum.ACTIVE);
		AuditDetails auditDetails = util.getAuditDetails(requestInfo.getUserInfo().getUuid(), true);
		request.getPlantMapping().setAuditDetails(auditDetails);
		request.getPlantMapping().setId(UUID.randomUUID().toString());
	}
}
