package org.egov.pt.util;

import static java.util.Objects.isNull;
import static org.egov.pt.util.PTConstants.CREATE_PROCESS_CONSTANT;
import static org.egov.pt.util.PTConstants.MODULE;
import static org.egov.pt.util.PTConstants.MUTATION_PROCESS_CONSTANT;
import static org.egov.pt.util.PTConstants.NOTIFICATION_LOCALE;
import static org.egov.pt.util.PTConstants.UPDATE_PROCESS_CONSTANT;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.AuditDetails;
import org.egov.pt.models.Property;
import org.egov.pt.models.workflow.ProcessInstance;
import org.egov.pt.models.workflow.ProcessInstanceRequest;
import org.egov.pt.web.contracts.PropertyRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Component
public class PropertyUtil {



    @Autowired
    private PropertyConfiguration config;


    /**
     * Method to return auditDetails for create/update flows
     *
     * @param by
     * @param isCreate
     * @return AuditDetails
     */
    public AuditDetails getAuditDetails(String by, Boolean isCreate) {
    	
        Long time = System.currentTimeMillis();
        if(isCreate)
            return AuditDetails.builder().createdBy(by).lastModifiedBy(by).createdTime(time).lastModifiedTime(time).build();
        else
            return AuditDetails.builder().lastModifiedBy(by).lastModifiedTime(time).build();
    }

    public MdmsCriteriaReq prepareMdMsRequest(String tenantId,String moduleName, List<String> names, String filter, RequestInfo requestInfo) {

        List<MasterDetail> masterDetails = new ArrayList<>();

        names.forEach(name -> {
            masterDetails.add(MasterDetail.builder().name(name).filter(filter).build());
        });

        ModuleDetail moduleDetail = ModuleDetail.builder()
                .moduleName(moduleName).masterDetails(masterDetails).build();
        List<ModuleDetail> moduleDetails = new ArrayList<>();
        moduleDetails.add(moduleDetail);
        MdmsCriteria mdmsCriteria = MdmsCriteria.builder().tenantId(tenantId).moduleDetails(moduleDetails).build();
        return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
    }


	public void addAddressIds(List<Property> responseProperties, Property requestProperty) {

		Map<String, String> propIdToAddrId = responseProperties.stream()
				.collect(Collectors.toMap(Property::getId, prop -> prop.getAddress().getId()));
		requestProperty.getAddress().setId(propIdToAddrId.get(requestProperty.getPropertyId()));
	}


    /**
     * Returns the uri for the localization call
     * @param tenantId TenantId of the propertyRequest
     * @return The uri for localization search call
     */
    public StringBuilder getUri(String tenantId, RequestInfo requestInfo){
        if(config.getIsStateLevel())
            tenantId = tenantId.split("\\.")[0];

        String locale = NOTIFICATION_LOCALE;
        if(!StringUtils.isEmpty(requestInfo.getMsgId()) && requestInfo.getMsgId().split("\\|").length>=2)
            locale = requestInfo.getMsgId().split("\\|")[1];

        StringBuilder uri = new StringBuilder();
        uri.append(config.getLocalizationHost())
                .append(config.getLocalizationContextPath()).append(config.getLocalizationSearchEndpoint());
        uri.append("?").append("locale=").append(locale)
                .append("&tenantId=").append(tenantId)
                .append("&module=").append(MODULE);
        return uri;
    }

	public ProcessInstanceRequest getProcessInstanceForPayment(PropertyRequest propertyRequest) {

			Property property = propertyRequest.getProperty();
			
			ProcessInstance process = ProcessInstance.builder()
				.businessService(config.getPropertyRegistryWf())
				.businessId(property.getAcknowldgementNumber())
				.comment("Payment for property processed")
				.assignes(getUserForWorkflow(property))
				.moduleName("PT")
				.action("PAY")
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
			List<User> owners = getUserForWorkflow(property);
			wf.setAssignes(owners);
			wf.setBusinessService(config.getPropertyRegistryWf());
			wf.setModuleName(config.getPropertyModuleName());
			wf.setAction("OPEN");
			break;

		case MUTATION_PROCESS_CONSTANT:
			break;

		case UPDATE_PROCESS_CONSTANT:
			break;
			
		default:
			break;
		}
		
		return ProcessInstanceRequest.builder()
				.processInstances(Arrays.asList(request.getProperty().getWorkflow()))
				.requestInfo(request.getRequestInfo())
				.build();
	}


	/**
	 *
	 * @param property Property whose owners are to be returned
	 * @return Owners of the property
	 */
	public List<User> getUserForWorkflow(Property property){
		List<User> owners = new LinkedList<>();

		property.getOwners().forEach(ownerInfo -> {
			owners.add(User.builder().uuid(ownerInfo.getUuid()).build());
		});

		owners.add(User.builder().uuid(property.getAccountId()).build());
		return owners;
	}

	/**
	 * Method to merge additional details during update 
	 * 
	 * @param mainNode
	 * @param updateNode
	 * @return
	 */
	public JsonNode jsonMerge(JsonNode mainNode, JsonNode updateNode) {

		if (isNull(mainNode) || mainNode.isNull())
			return updateNode;
		if (isNull(updateNode) || updateNode.isNull())
			return mainNode;

		Iterator<String> fieldNames = updateNode.fieldNames();
		while (fieldNames.hasNext()) {

			String fieldName = fieldNames.next();
			JsonNode jsonNode = mainNode.get(fieldName);
			// if field exists and is an embedded object
			if (jsonNode != null && jsonNode.isObject()) {
				jsonMerge(jsonNode, updateNode.get(fieldName));
			} else {
				if (mainNode instanceof ObjectNode) {
					// Overwrite field
					JsonNode value = updateNode.get(fieldName);
					((ObjectNode) mainNode).set(fieldName, value);
				}
			}

		}
		return mainNode;
	}

	public JsonNode saveOldUuidToRequest(PropertyRequest request, String uuid) {

		ObjectNode additionalDetail = (ObjectNode) request.getProperty().getAdditionalDetails();
		return additionalDetail.put(PTConstants.PREVIOUS_PROPERTY_PREVIOUD_UUID, uuid);
	}
	
}
