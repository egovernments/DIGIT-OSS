package org.egov.rb.service;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.rb.config.PropertyConfiguration;
import org.egov.rb.contract.MessageRequest;
import org.egov.rb.pgr.v2.models.Boundary;
import org.egov.rb.pgr.v2.models.GeoLocation;
import org.egov.rb.pgr.v2.models.ServiceRequestV2;
import org.egov.rb.pgr.v2.models.ServiceResponseV2;
import org.egov.rb.pgr.v2.models.User;
import org.egov.rb.pgr.v2.models.Workflow;
import org.egov.rb.pgrmodels.Address;
import org.egov.rb.pgrmodels.Citizen;
import org.egov.rb.pgrmodels.Service;
import org.egov.rb.pgrmodels.Service.SourceEnum;
import org.egov.rb.pgrmodels.ServiceRequest;
import org.egov.rb.pgrmodels.ServiceResponse;
import org.egov.rb.repository.ServiceRequestRepository;
import org.egov.rb.util.Constants;
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

	public Object transform(MessageRequest messageRequest) {

		if (Boolean.valueOf(propertyConfiguration.getPgrv1enabled())) {
			return processPgrV1Request(messageRequest);
		} else {
			return processPgrV2Request(messageRequest);
		}

	}

	private Object processPgrV1Request(MessageRequest messageRequest) {
		String message = null;
		String mobileNumber = messageRequest.getContacts().get(0).getWa_id();
		ServiceRequest servicerequest = prepareServiceRequest(messageRequest);
		StringBuilder url = new StringBuilder(
				propertyConfiguration.getPgrBasePath() + propertyConfiguration.getPgrCreateEndPoint());
		ServiceResponse serviceResponse = (ServiceResponse) serviceRequestRepository.fetchResult(url, servicerequest);
		if (serviceResponse == null) {
			message = "There is some issue in our server.\n we will revert when we get the Complaint Id of your complaint";
			turnIoService.sendTurnMessage(message, mobileNumber);
		} else {
			try {
				message = turnIoService.prepareMessage(serviceResponse.getServices().get(0).getServiceRequestId(),
						mobileNumber);
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

	private Object processPgrV2Request(MessageRequest messageRequest) {
		String message = null;
		String mobileNumber = messageRequest.getContacts().get(0).getWa_id();
		ServiceRequestV2 servicerequest = prepareServiceWrapper(messageRequest);
		StringBuilder url = new StringBuilder(
				propertyConfiguration.getPgrServiceHost() + propertyConfiguration.getPgrServiceCreateEndpoint());
		ServiceResponseV2 serviceResponseV2 = (ServiceResponseV2) serviceRequestRepository.fetchResult(url,
				servicerequest);
		if (serviceResponseV2 == null) {
			message = "There is some issue in our server.\n we will revert when we get the Complaint Id of your complaint";
			turnIoService.sendTurnMessage(message, mobileNumber);
		} else {
			try {
				message = turnIoService.prepareMessage(
						serviceResponseV2.getServiceWrappers().get(0).getService().getServiceRequestId(), mobileNumber);
				turnIoService.sendTurnMessage(message, mobileNumber);
			} catch (Exception e) {
				message = "There is some issue in our server.\n we will revert when we get the Complaint Id of your complaint";
				turnIoService.sendTurnMessage(message, mobileNumber);
				throw new CustomException("PGR_CREATE_ERROR", "Exception while creating PGR complaint ");
			}
		}
		turnIoService.setProfileField(mobileNumber);
		return serviceResponseV2;
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
		Service service = createService(complaintName, serviceCode, mobileNumber, messageRequest);

		List<Service> serviceList = new ArrayList<Service>();
		serviceList.add(service);
		serviceRequest.setRequestInfo(requestInfo);
		serviceRequest.setServices(serviceList);
		return serviceRequest;

	}

	private Service createService(String complaintName, String serviceCode, String mobileNumber,
			MessageRequest messageRequest) {
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
		return service;
	}

	private org.egov.rb.pgr.v2.models.Service createServiceForV2(String complaintName, String serviceCode,
			String mobileNumber, MessageRequest messageRequest) {
		org.egov.rb.pgr.v2.models.Service service = new org.egov.rb.pgr.v2.models.Service();
		User citizen = new User();
		citizen.setMobileNumber(mobileNumber);
		citizen.setName(messageRequest.getContacts().get(0).getProfile().getName());
		service.setCitizen(citizen);
		service.setServiceCode(serviceCode);
		service.setSource(Constants.SOURCE);
		org.egov.rb.pgr.v2.models.Address address = new org.egov.rb.pgr.v2.models.Address();
		address.setCity(messageRequest.getThreadContact().getContact().getCity());
		Boundary boundary = new Boundary();
		boundary.setCode(messageRequest.getThreadContact().getContact().getLocality());
		address.setLocality(boundary);
		GeoLocation geoLocation=new GeoLocation();
		address.setGeoLocation(geoLocation);
		service.setTenantId(messageRequest.getThreadContact().getContact().getCity());
		service.setAddress(address);
		return service;
	}

	private ServiceRequestV2 prepareServiceWrapper(MessageRequest messageRequest) {
		ServiceRequestV2 serviceRequestv2 = new ServiceRequestV2();
		RequestInfo requestInfo = messageRequest.getRequestInfo();
		String complaintName = messageRequest.getThreadContact().getContact().getComplaint_sub_category();
		String serviceCode = turnIoService.getServiceCode(requestInfo, complaintName);
		String mobileNumber = messageRequest.getContacts().get(0).getWa_id().substring(2);
		org.egov.rb.pgr.v2.models.Service service = createServiceForV2(complaintName, serviceCode, mobileNumber,
				messageRequest);
		serviceRequestv2.setRequestInfo(requestInfo);
		serviceRequestv2.setService(service);
		Workflow workflow = new Workflow();
		workflow.setAction(Constants.APPLY);
		serviceRequestv2.setWorkflow(workflow);
		return serviceRequestv2;
	}

	public void sendServiceRequestStatusMessage(ServiceRequest serviceRequest) throws Exception {

		Service service = serviceRequest.getServices().get(0);
		String message = turnIoService.prepareServiceRequestStatusMessage(service.getServiceCode(),
				service.getStatus().toString(), service.getPhone(), service.getServiceRequestId(),
				serviceRequest.getRequestInfo());

		String mobileNumber = serviceRequest.getServices().get(0).getPhone();

		try {
			turnIoService.sendTurnMessage(message, "91" + mobileNumber);
		} catch (Exception e) {
			throw new CustomException("PGR_UPDATE_NOTIFICATION_ERROR",
					"Exception while notifying  PGR complaint status ");
		}
	}

	public void sendServiceRequestV2StatusMessage(ServiceRequestV2 serviceRequest) throws Exception {

		org.egov.rb.pgr.v2.models.Service service = serviceRequest.getService();
		String message = turnIoService.prepareServiceRequestStatusMessage(service.getServiceCode(),
				service.getApplicationStatus(), service.getCitizen().getMobileNumber(), service.getServiceRequestId(),
				serviceRequest.getRequestInfo());

		String mobileNumber = serviceRequest.getService().getCitizen().getMobileNumber();

		try {
			turnIoService.sendTurnMessage(message, "91" + mobileNumber);
		} catch (Exception e) {
			throw new CustomException("PGR_UPDATE_NOTIFICATION_ERROR",
					"Exception while notifying  PGR complaint status ");
		}
	}
}
