package org.egov.fsm.plantmapping.service;

import java.util.UUID;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.plantmapping.repository.PlantMappingRepository;
import org.egov.fsm.plantmapping.web.model.PlantMapping;
import org.egov.fsm.plantmapping.web.model.PlantMappingRequest;
import org.egov.fsm.service.UserService;
import org.egov.fsm.util.FSMUtil;
import org.egov.fsm.web.model.AuditDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PlantMappingEnrichmentService {
	
	

	
	@Autowired
	private PlantMappingRepository repository ;

	@Autowired
	private UserService userService;
	
	@Autowired
	private FSMUtil util;

	public void enrichCreateRequest(@Valid PlantMappingRequest request, Object mdmsData) {
		// TODO Auto-generated method stub
		RequestInfo requestInfo = request.getRequestInfo();
		
//		if( request.getRequestInfo().getUserInfo().getType().equalsIgnoreCase(FSMConstants.CITIZEN)) {
//			User citzen = new User();
//			BeanUtils.copyProperties(request.getRequestInfo().getUserInfo(), citzen);
//			request.getPlantMapping().setCitizen(citzen);
//		}else {
//			userService.manageApplicant(request);
//		}
		
		request.getPlantMapping().setStatus(PlantMapping.StatusEnum.ACTIVE);
		AuditDetails auditDetails = util.getAuditDetails(requestInfo.getUserInfo().getUuid(), true);
		request.getPlantMapping().setAuditDetails(auditDetails);
		request.getPlantMapping().setId(UUID.randomUUID().toString());
		

	}


}
