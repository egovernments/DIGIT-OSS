package org.egov.commons.service;



import java.util.List;


import org.egov.commons.model.BusinessAccountSubLedgerDetails;
import org.egov.commons.model.BusinessDetails;
import org.egov.commons.model.BusinessDetailsCommonModel;
import org.egov.commons.model.BusinessDetailsCriteria;
import org.egov.commons.repository.BusinessDetailsRepository;
import org.egov.commons.web.contract.BusinessDetailsRequest;
import org.egov.tracer.kafka.LogAwareKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BusinessDetailsService {


	private BusinessDetailsRepository businessDetailsRepository;

	private LogAwareKafkaTemplate<String, Object> kafkaTemplate;
	
	@Autowired
	public BusinessDetailsService(BusinessDetailsRepository businessDetailsRepository,
			LogAwareKafkaTemplate<String, Object> kafkaTemplate){
		
		this.businessDetailsRepository=businessDetailsRepository;
		this.kafkaTemplate=kafkaTemplate;
		
	}
	
	
	public  BusinessDetailsRequest createDetailsAsync(BusinessDetailsRequest businessDetailsRequest){
		
		kafkaTemplate.send("egov-common-business-details-create",businessDetailsRequest);
		return businessDetailsRequest;
}
	
	
	public void createBusinessDetails(List<BusinessDetails> businessDetails) {
		 businessDetailsRepository.createBusinessDetails(businessDetails);
	}
	
	
	public  BusinessDetailsRequest updateDetailsAsync(BusinessDetailsRequest businessDetailsRequest){
		
		kafkaTemplate.send("egov-common-business-details-update",businessDetailsRequest);
		return businessDetailsRequest;
}

	public void updateBusinessDetails(List<BusinessDetails> businessDetails) {
		 businessDetailsRepository.updateBusinessDetails(businessDetails);
	}

	public BusinessDetailsCommonModel getForCriteria(BusinessDetailsCriteria detailsCriteria) {
		return businessDetailsRepository.getForCriteria(detailsCriteria);
	}

	public boolean getBusinessDetailsByNameAndTenantId(String name, String tenantId, Long id, Boolean isUpdate) {
		return businessDetailsRepository.checkDetailsByNameAndTenantIdExists(name, tenantId,id,isUpdate);
	}

	public boolean getBusinessDetailsByCodeAndTenantId(String code, String tenantId, Long id, Boolean isUpdate) {
		return businessDetailsRepository.checkDetailsByCodeAndTenantIdExists(code, tenantId,id,isUpdate);
	}

}
