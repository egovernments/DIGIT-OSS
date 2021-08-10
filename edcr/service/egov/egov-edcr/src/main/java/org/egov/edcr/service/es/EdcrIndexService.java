package org.egov.edcr.service.es;


import org.egov.commons.entity.Source;
import org.egov.edcr.entity.EdcrApplication;
import org.egov.edcr.entity.es.EdcrIndex;
import org.egov.edcr.repository.es.EdcrIndexRepository;
import org.egov.edcr.utility.DcrConstants;
import org.egov.infra.admin.master.entity.City;
import org.egov.infra.admin.master.service.CityService;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.elasticsearch.entity.ApplicationIndex;
import org.egov.infra.elasticsearch.entity.enums.ApprovalStatus;
import org.egov.infra.elasticsearch.entity.enums.ClosureStatus;
import org.egov.infra.elasticsearch.service.ApplicationIndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static org.apache.commons.lang3.StringUtils.EMPTY;

@Service
@Transactional(readOnly = true)
public class EdcrIndexService {
	private static final String url = "/edcr/edcrapplication/view/%s";

	@Autowired
	private CityService cityService;

	@Autowired
	private EdcrIndexRepository edcrIndexRepository;
	
	   @Value("${elasticsearch.enable}")
		private Boolean enable;

	@Autowired
	private ApplicationIndexService applicationIndexService;
	   
	public EdcrIndex createEdcrIndex(final EdcrApplication edcrApp) {
		if(enable){
		final City cityWebsite = cityService.getCityByURL(ApplicationThreadLocals.getDomainName());
		EdcrIndex edcrIndex = new EdcrIndex();
		edcrIndex.setId(cityWebsite.getCode() + "-" + edcrApp.getApplicationNumber());
		buildUlbDetails(cityWebsite, edcrIndex);
		buildApplicationData(edcrApp, edcrIndex);
		edcrIndex.setOccupancy(edcrApp.getOccupancy() == null ? EMPTY : edcrApp.getOccupancy());
		edcrIndex.setApplicantName(edcrApp.getApplicantName() == null ? EMPTY : edcrApp.getApplicantName());
		edcrIndex.setServiceType(edcrApp.getServiceType() == null ? EMPTY : edcrApp.getServiceType());
		edcrIndex.setAmenities(edcrApp.getAmenities() == null ? EMPTY : edcrApp.getAmenities());
		
		if(!edcrApp.getEdcrApplicationDetails().isEmpty()){
		Integer noOfAppDtls =	edcrApp.getEdcrApplicationDetails().size();
		edcrIndex.setDcrNumber(edcrApp.getEdcrApplicationDetails().get(noOfAppDtls - 1).getDcrNumber() == null ? EMPTY : 
			edcrApp.getEdcrApplicationDetails().get(noOfAppDtls - 1).getDcrNumber());
		}
		if(edcrApp.getCreatedBy() != null){
		edcrIndex.setStakeHolderId(edcrApp.getCreatedBy().getId() == null ? EMPTY : String.valueOf(edcrApp.getCreatedBy().getId()));
		}
		edcrIndexRepository.save(edcrIndex);
		return edcrIndex;
		}else
		{
			return null;
		}
	}

	private void buildApplicationData(EdcrApplication edcrApp, EdcrIndex edcrIndex) {
		edcrIndex.setApplicationDate(edcrApp.getApplicationDate());
		edcrIndex.setApplicationNumber(edcrApp.getApplicationNumber() == null ? EMPTY : edcrApp.getApplicationNumber());
		edcrIndex.setStatus(edcrApp.getStatus() == null ? EMPTY : edcrApp.getStatus());
	}

	private void buildUlbDetails(City cityWebsite, EdcrIndex edcrIndex) {
		edcrIndex.setUlbName(cityWebsite.getName());
		edcrIndex.setDistrictName(cityWebsite.getDistrictName());
		edcrIndex.setRegionName(cityWebsite.getRegionName());
		edcrIndex.setUlbGrade(cityWebsite.getGrade());
		edcrIndex.setUlbCode(cityWebsite.getCode());

	}
	
	 public void updateIndexes(final EdcrApplication edcrApplication, String applctnType) {
		 if(enable)
		 {
		   ApplicationIndex applicationIndex = applicationIndexService.findByApplicationNumber(edcrApplication
	                .getApplicationNumber());
	        if (applicationIndex != null && edcrApplication.getId() != null){
	        	ApprovalStatus status = null;
	        	if(edcrApplication.getStatus().equals("Accepted")){
	        		status = ApprovalStatus.APPROVED;
	        	}
	        	else if(edcrApplication.getStatus().equals("Not Accepted")
						|| edcrApplication.getStatus().equals("Aborted")) {
					status = ApprovalStatus.REJECTED;
				}
	        	applicationIndex.setStatus(edcrApplication.getStatus());
	        	applicationIndex.setApproved(status);
	        	applicationIndex.setApplicationType(applctnType);
	            applicationIndexService.updateApplicationIndex(applicationIndex);
	            createEdcrIndex(edcrApplication);
	        }
	        else {
	        	ApprovalStatus status = null;
	        	if(edcrApplication.getStatus().equals("Accepted")){
	        		status = ApprovalStatus.APPROVED;
	        	}
	        	else if(edcrApplication.getStatus().equals("Not Accepted")
						|| edcrApplication.getStatus().equals("Aborted")){
	        		status = ApprovalStatus.REJECTED;
	        	}
	            applicationIndex = ApplicationIndex.builder().withModuleName(DcrConstants.APPLICATION_MODULE_TYPE)
	                    .withApplicationNumber(edcrApplication.getApplicationNumber())
	                    .withApplicationDate(edcrApplication.getApplicationDate())
	                    .withApplicantName(edcrApplication.getApplicantName())
	                    .withStatus(edcrApplication.getStatus())	                  
	                    .withConsumerCode(edcrApplication.getApplicationNumber())
	                    .withClosed(ClosureStatus.YES)
	                    .withApproved(status)
	                    .withUrl(String.format(url, edcrApplication.getApplicationNumber()))
	                    .withChannel(Source.CITIZENPORTAL.name())
	                    .withApplicationType(applctnType)
	                    .build();
	            applicationIndexService.createApplicationIndex(applicationIndex);
	            createEdcrIndex(edcrApplication);
	        }
	        
	    } 
	 }
	 
	 public void updateEdcrRestIndexes(final EdcrApplication edcrApplication, String applctnType) {
		   ApplicationIndex applicationIndex = applicationIndexService.findByApplicationNumber(edcrApplication
	                .getApplicationNumber());
	        if (applicationIndex != null && edcrApplication.getId() != null){
	        	ApprovalStatus status = null;
	        	if(edcrApplication.getStatus().equals("Accepted")){
	        		status = ApprovalStatus.APPROVED;
	        	}
	        	else if(edcrApplication.getStatus().equals("Not Accepted")
						|| edcrApplication.getStatus().equals("Aborted")) {
					status = ApprovalStatus.REJECTED;
				}
	        	applicationIndex.setStatus(edcrApplication.getStatus());
	        	applicationIndex.setApproved(status);
	        	applicationIndex.setApplicationType(applctnType);
	            applicationIndexService.updateApplicationIndex(applicationIndex);
	            createEdcrIndex(edcrApplication);
	        }
	        else {
	        	ApprovalStatus status = null;
	        	if(edcrApplication.getStatus().equals("Accepted")){
	        		status = ApprovalStatus.APPROVED;
	        	}
	        	else if(edcrApplication.getStatus().equals("Not Accepted")
						|| edcrApplication.getStatus().equals("Aborted")){
	        		status = ApprovalStatus.REJECTED;
	        	}
	            applicationIndex = ApplicationIndex.builder().withModuleName(DcrConstants.APPLICATION_MODULE_TYPE)
	                    .withApplicationNumber(edcrApplication.getApplicationNumber())
	                    .withApplicationDate(edcrApplication.getApplicationDate())
	                    .withApplicantName(edcrApplication.getApplicantName())
	                    .withStatus(edcrApplication.getStatus())	                  
	                    .withConsumerCode(edcrApplication.getApplicationNumber())
	                    .withClosed(ClosureStatus.YES)
	                    .withApproved(status)
	                    .withUrl(String.format(url, edcrApplication.getApplicationNumber()))
	                    .withChannel(Source.THIRDPARTY.name())
	                    .withApplicationType(applctnType)
	                    .build();
	            applicationIndexService.createApplicationIndex(applicationIndex);
	            createEdcrIndex(edcrApplication);
	        
	    }

	 }
}
