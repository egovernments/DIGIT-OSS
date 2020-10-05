package org.egov.swservice.validator;

import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.egov.swservice.util.SewerageServicesUtil;
import org.egov.swservice.web.models.Property;
import org.egov.swservice.web.models.SewerageConnection;
import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.egov.swservice.web.models.Status;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ValidateProperty {

	@Autowired
	private SewerageServicesUtil sewerageServiceUtil;

	/**
	 * 
	 * @param property
	 *            property
	 */
	public void validatePropertyFields(Property property) {
		if (StringUtils.isEmpty(property.getTenantId())) {
			throw new CustomException("INVALID_PROPERTY", "SewerageConnection cannot be updated without tenantId");
		}
		if (org.springframework.util.StringUtils.isEmpty(property.getStatus()) || (!property.getStatus().equals(Status.ACTIVE))) {
			throw new CustomException("INVALID_PROPERTY_STATUS", " Please enter a valid property ID");
		}
	}
	
	public Property getOrValidateProperty(SewerageConnectionRequest sewerageConnectionRequest) {
		Optional<Property> propertyList = sewerageServiceUtil.propertySearch(sewerageConnectionRequest).stream()
				.findFirst();
		if (!propertyList.isPresent()) {
			throw new CustomException("INVALID_PROPERTY_ID",
					"Water connection cannot be enriched without property");
		} 
		Property property = propertyList.get();
		if (StringUtils.isEmpty(property.getUsageCategory()) && !(sewerageConnectionRequest.getRequestInfo().getUserInfo().getType().equalsIgnoreCase("SYSTEM"))) {
			throw new CustomException("INVALID_PROPERTY_USAGE_TYPE",
					"Water connection cannot be enriched without property usage type");
		}

		return property;
	}

	public void validatePropertyForConnection(List<SewerageConnection> sewerageConnectionList) {
		sewerageConnectionList.forEach(sewerageConnection -> {
			if (StringUtils.isEmpty(sewerageConnection.getPropertyId())) {
				StringBuilder builder = new StringBuilder();
				builder.append("Property not found for Id")
						.append(sewerageConnection.getConnectionNo() == null ? sewerageConnection.getApplicationNo()
								: sewerageConnection.getConnectionNo());
				log.error("INVALID_PROPERTY_ID", builder.toString());
			}
		});
	}
}
