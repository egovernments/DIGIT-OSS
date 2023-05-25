package org.egov.rb.service;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.rb.config.PropertyConfiguration;
import org.egov.rb.contract.MessageRequest;
import org.egov.rb.pgrmodels.Address;
import org.egov.rb.pgrmodels.Citizen;
import org.egov.rb.pgrmodels.Service;
import org.egov.rb.pgrmodels.Service.SourceEnum;
import org.egov.rb.pgrmodels.ServiceRequest;
import org.egov.rb.pgrmodels.ServiceResponse;
import org.egov.rb.repository.ServiceRequestRepository;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.extern.slf4j.Slf4j;

@org.springframework.stereotype.Service
@Slf4j
public class TransformService {

	@Autowired
	PropertyConfiguration propertyConfiguration;

	@Autowired
	ServiceRequestRepository serviceRequestRepository;

	@Autowired
	TurnIoService turnIoService;

	/***
	 * Method performs business logic to transform the data and call the pgr data we
	 * are binding the pgr uri to transform
	 * 
	 * @param messageRequest
	 * @return serviceResponse
	 */

	public ServiceResponse transform(MessageRequest messageRequest) {
		String message = null;
		String mobileNumber = messageRequest.getContacts().get(0).getWa_id();
		ServiceRequest servicerequest = prepareServiceRequest(messageRequest);
		StringBuilder url = new StringBuilder(
				propertyConfiguration.getPgrBasePath() + propertyConfiguration.getPgrCreateEndPoint());
		ServiceResponse serviceResponse = serviceRequestRepository.fetchResult(url, servicerequest);
		if (serviceResponse == null) {
			message = "There is some issue in our server.\n we will revert when we get the Complaint Id of your complaint";
			turnIoService.sendTurnMessage(message, mobileNumber);
		} else {
			try {
				message = turnIoService.prepareMessage(serviceResponse.getServices().get(0), mobileNumber);
				turnIoService.sendTurnMessage(message, mobileNumber);
			} catch (Exception e) {
				message = "There is some issue in our server.\n we will revert when we get the Complaint Id of your complaint";
				turnIoService.sendTurnMessage(message, mobileNumber);
				throw new CustomException("PGR_CREATE_ERROR", "Exception while creating PGR complaint ");
			}
		}
		turnIoService.setProfileField(mobileNumber);
		return serviceResponse;
	}

	/***
	 * method performs mapping the data messageRequest to serviceReguest fields and
	 * get the data from the serviceRequest
	 * 
	 * @param messageRequest
	 * @return serviceRequest
	 */

	private ServiceRequest prepareServiceRequest(MessageRequest messageRequest) {
		ServiceRequest serviceRequest = new ServiceRequest();
		RequestInfo requestInfo = messageRequest.getRequestInfo();

		String complaintName = messageRequest.getThreadContact().getContact().getComplaint_sub_category();
		String serviceCode = turnIoService.getServiceCode(requestInfo, complaintName);
		String mobileNumber = messageRequest.getContacts().get(0).getWa_id().substring(2);

		Service service = new Service();
		Citizen citizen = new Citizen();
		citizen.setMobileNumber(mobileNumber);
		citizen.setName(messageRequest.getContacts().get(0).getProfile().getName());
		service.setCitizen(citizen);
		service.setServiceCode(serviceCode);
		service.setSource(SourceEnum.RBBOT);
		Address addressDetail = new Address();
		addressDetail.setCity(messageRequest.getThreadContact().getContact().getCity());
		addressDetail.setMohalla(messageRequest.getThreadContact().getContact().getLocality());
		service.setTenantId(messageRequest.getThreadContact().getContact().getCity());
		service.setPhone(mobileNumber);
		service.setAddressDetail(addressDetail);

		List<Service> serviceList = new ArrayList<Service>();
		serviceList.add(service);
		serviceRequest.setRequestInfo(requestInfo);
		serviceRequest.setServices(serviceList);
		return serviceRequest;

	}

	public void sendServiceRequestStatusMessage(ServiceRequest serviceRequest) throws Exception  {
		
		String message=turnIoService.prepareServiceRequestStatusMessage(serviceRequest);
		
		String mobileNumber=serviceRequest.getServices().get(0).getPhone();
		
		try {
			turnIoService.sendTurnMessage(message, "91"+mobileNumber);
		} catch (Exception e) {
			throw new CustomException("PGR_UPDATE_NOTIFICATION_ERROR", "Exception while notifying  PGR complaint status ");
		}
	}
}
