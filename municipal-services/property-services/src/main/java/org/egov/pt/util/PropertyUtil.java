package org.egov.pt.util;

import static org.egov.pt.util.PTConstants.ASMT_MODULENAME;
import static org.egov.pt.util.PTConstants.BILL_AMOUNT_PATH;
import static org.egov.pt.util.PTConstants.BILL_NODEMAND_ERROR_CODE;
import static org.egov.pt.util.PTConstants.CREATE_PROCESS_CONSTANT;
import static org.egov.pt.util.PTConstants.MUTATION_PROCESS_CONSTANT;
import static org.egov.pt.util.PTConstants.UPDATE_PROCESS_CONSTANT;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.OwnerInfo;
import org.egov.pt.models.Property;
import org.egov.pt.models.user.UserDetailResponse;
import org.egov.pt.models.workflow.ProcessInstance;
import org.egov.pt.models.workflow.ProcessInstanceRequest;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.web.contracts.PropertyRequest;
import org.egov.pt.web.contracts.RequestInfoWrapper;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class PropertyUtil extends CommonUtils {
	
	@Autowired
	private PropertyConfiguration configs;
	
	@Autowired
	private ServiceRequestRepository restRepo;
	
	@Autowired
	private ObjectMapper mapper;
	
    /**
	 * Populates the owner fields inside of property objects from the response by user api
	 * 
	 * Ignoring if now user is not found in user response, no error will be thrown
	 * 
	 * @param userDetailResponse response from user api which contains list of user
	 *                           which are used to populate owners in properties
	 * @param properties         List of property whose owner's are to be populated
	 *                           from userDetailResponse
	 */
	public void enrichOwner(UserDetailResponse userDetailResponse, List<Property> properties) {

		List<OwnerInfo> users = userDetailResponse.getUser();
		Map<String, OwnerInfo> userIdToOwnerMap = new HashMap<>();
		users.forEach(user -> userIdToOwnerMap.put(user.getUuid(), user));

		properties.forEach(property -> {

			property.getOwners().forEach(owner -> {

				if (userIdToOwnerMap.get(owner.getUuid()) == null)
					log.info("OWNER SEARCH ERROR", "The owner with UUID : \"" + owner.getUuid() +
							"\" for the property with Id \"" + property.getPropertyId() + "\" is not present in user search response");
				else
					owner.addUserDetail(userIdToOwnerMap.get(owner.getUuid()));
			});
		});
	}
	

	public ProcessInstanceRequest getProcessInstanceForMutationPayment(PropertyRequest propertyRequest) {

			Property property = propertyRequest.getProperty();
			
			ProcessInstance process = ProcessInstance.builder()
				.businessService(configs.getMutationWfName())
				.businessId(property.getAcknowldgementNumber())
				.comment("Payment for property processed")
				.moduleName(PTConstants.ASMT_MODULENAME)
				.tenantId(property.getTenantId())
				.action(PTConstants.ACTION_PAY)
				.build();
			
			return ProcessInstanceRequest.builder()
					.requestInfo(propertyRequest.getRequestInfo())
					.processInstances(Arrays.asList(process))
					.build();
	}
	
	public ProcessInstanceRequest getWfForPropertyRegistry(PropertyRequest request, String process) {
		
		Property property = request.getProperty();
		ProcessInstance wf = null != property.getWorkflow() ? property.getWorkflow() : new ProcessInstance();
		
		wf.setBusinessId(property.getAcknowldgementNumber());
		wf.setTenantId(property.getTenantId());
	
		
		switch (process) {
		
		case CREATE_PROCESS_CONSTANT :

			wf.setBusinessService(configs.getCreatePTWfName());
			wf.setModuleName(configs.getPropertyModuleName());
			wf.setAction("OPEN");
			break;

		case MUTATION_PROCESS_CONSTANT:
			break;

		case UPDATE_PROCESS_CONSTANT:
			break;
			
		default:
			break;
		}
		
		property.setWorkflow(wf);
		return ProcessInstanceRequest.builder()
				.processInstances(Arrays.asList(wf))
				.requestInfo(request.getRequestInfo())
				.build();
	}

	/**
	 * 
	 * @param request
	 * @param propertyFromSearch
	 */
	public void mergeAdditionalDetails(PropertyRequest request, Property propertyFromSearch) {

		request.getProperty().setAdditionalDetails(jsonMerge(propertyFromSearch.getAdditionalDetails(),
				request.getProperty().getAdditionalDetails()));
	}

	/**
	 * Setting the uuid of old peoprty record to the new record
	 * @param request
	 * @param uuid
	 * @return
	 */
	public JsonNode saveOldUuidToRequest(PropertyRequest request, String uuid) {

		ObjectNode objectNodeDetail;
		JsonNode additionalDetails = request.getProperty().getAdditionalDetails();

		if (null == additionalDetails || (null != additionalDetails && additionalDetails.isNull())) {
			objectNodeDetail = mapper.createObjectNode();

		} else {

			objectNodeDetail = (ObjectNode) additionalDetails;
		}
		request.getProperty().setAdditionalDetails(objectNodeDetail);
		return objectNodeDetail.put(PTConstants.PREVIOUS_PROPERTY_PREVIOUD_UUID, uuid);
	}

	public void clearSensitiveDataForPersistance(Property property) {
		property.getOwners().forEach(owner -> owner.setMobileNumber(null));
	}

/**
 * Utility method to fetch bill for validation of payment
 * 
 * @param propertyId
 * @param tenantId
 * @param request
 */
	public Boolean isBillUnpaid(String propertyId, String tenantId, RequestInfo request) {

		Object res = null;
		
		StringBuilder uri = new StringBuilder(configs.getEgbsHost())
				.append(configs.getEgbsFetchBill())
				.append("?tenantId=").append(tenantId)
				.append("&consumerCode=").append(propertyId)
				.append("&businessService=").append(ASMT_MODULENAME);

		try {
			res = restRepo.fetchResult(uri, new RequestInfoWrapper(request)).get();
		} catch (ServiceCallException e) {
			
			if(!e.getError().contains(BILL_NODEMAND_ERROR_CODE))
				throw e;
		}
		
		if (res != null) {
			JsonNode node = mapper.convertValue(res, JsonNode.class);
			Double amount = node.at(BILL_AMOUNT_PATH).asDouble();
			return amount > 0;
		}
		return false;
	}


public void setdataForNotification(PropertyRequest request, String notificationAction) {

		ProcessInstance workflow = request.getProperty().getWorkflow();

		if (workflow != null) {

			workflow.setNotificationAction(notificationAction);
		} else {
			workflow = ProcessInstance.builder().notificationAction(notificationAction).build();
		}
		request.getProperty().setWorkflow(workflow);
	}
}
