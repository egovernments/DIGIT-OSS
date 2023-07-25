package org.egov.fsm.plantmapping.service;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.plantmapping.repository.PlantMappingRepository;
import org.egov.fsm.plantmapping.validator.PlantMappingValidator;
import org.egov.fsm.plantmapping.web.model.PlantMapping;
import org.egov.fsm.plantmapping.web.model.PlantMappingRequest;
import org.egov.fsm.plantmapping.web.model.PlantMappingResponse;
import org.egov.fsm.plantmapping.web.model.PlantMappingSearchCriteria;
import org.egov.fsm.util.FSMErrorConstants;
import org.egov.fsm.util.FSMUtil;
import org.egov.fsm.web.model.AuditDetails;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlantMappingService {

	@Autowired
	private FSMUtil util;
	
	@Autowired
	private PlantMappingValidator validaor;
	
	@Autowired
	private PlantMappingEnrichmentService enrichmentService;
	
	@Autowired
	private PlantMappingRepository repository;
	
	public PlantMapping create(@Valid PlantMappingRequest request) {
		// TODO Auto-generated method stub
		RequestInfo requestInfo = request.getRequestInfo();
		Object mdmsData = util.mDMSCall(requestInfo, request.getPlantMapping().getTenantId());
		if (request.getPlantMapping().getTenantId().split("\\.").length == 1) {
			throw new CustomException(FSMErrorConstants.INVALID_TENANT, "Application Request cannot be create at StateLevel");
		}
		
		validaor.validateCreateOrUpdate(request, mdmsData);
		validaor.validatePlantMappingExists(request);
		enrichmentService.enrichCreateRequest(request, mdmsData);
		repository.save(request);
		return request.getPlantMapping();
	}

	public PlantMapping update(@Valid PlantMappingRequest request) {
		RequestInfo requestInfo = request.getRequestInfo();
		
		PlantMapping plantMap = request.getPlantMapping();
		Object mdmsData = util.mDMSCall(requestInfo, request.getPlantMapping().getTenantId());
		
		
		if (plantMap.getId() == null) {
			throw new CustomException(FSMErrorConstants.UPDATE_ERROR, "FSTP employee map not found in the System" + plantMap.getId());
		}
		
		validaor.validateCreateOrUpdate(request, mdmsData);
		List<String> ids = new ArrayList<String>();
		ids.add( plantMap.getId());
		PlantMappingSearchCriteria criteria = PlantMappingSearchCriteria.builder().tenantId(plantMap.getTenantId()).ids(ids).build();		
		PlantMappingResponse response = repository.getPlantMappingData(criteria);
		if(!(null != response && response.getPlantMapping().size()>0)){
			throw new CustomException(FSMErrorConstants.UPDATE_ERROR, "FSTP employee map not found in the System");
		}
		
		PlantMapping existingPlantMap = response.getPlantMapping().get(0);
		
		AuditDetails auditDetails = util.getAuditDetails(requestInfo.getUserInfo().getUuid(), true);
		auditDetails.setCreatedBy(existingPlantMap.getAuditDetails().getCreatedBy());
		auditDetails.setCreatedTime(existingPlantMap.getAuditDetails().getCreatedTime());
		request.getPlantMapping().setAuditDetails(auditDetails);
		repository.update(request);
		return request.getPlantMapping(); 
	}

	public PlantMappingResponse search(@Valid PlantMappingSearchCriteria criteria, RequestInfo requestInfo) {

		validaor.validateSearch(criteria,requestInfo);
		PlantMappingResponse response = repository.getPlantMappingData(criteria);
		return response;
	}

}