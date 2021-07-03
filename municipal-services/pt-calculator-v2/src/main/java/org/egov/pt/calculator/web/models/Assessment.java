package org.egov.pt.calculator.web.models;

import org.egov.pt.calculator.web.models.property.AuditDetails;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assessment {

	private String uuid;
	
	private String assessmentNumber;
	
	private String propertyId;
	
	private String assessmentYear;
	
	private String demandId;
	
	private String tenantId;
	
	private AuditDetails auditDetails;
	
}
