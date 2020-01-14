package org.egov.pt.models;

import java.util.List;

import javax.validation.Valid;

import org.egov.pt.models.enums.Channel;
import org.egov.pt.models.enums.Source;
import org.egov.pt.models.enums.Status;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Contains the assessment details of a constructionDetail. Assessment refers to
 * the calculation of property tax for the given constructionDetail number and
 * financial year
 */

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assessment {

	@JsonProperty("id")
	private String id;
	
	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("assessmentNumber")
	private String assessmentNumber;

	@JsonProperty("propertyId")
	private String propertyId;

	@JsonProperty("financialYear")
	private String financialYear;

	@JsonProperty("assessmentDate")
	private Long assessmentDate;

	@JsonProperty("source")
	private Source source;

	@JsonProperty("channel")
	private Channel channel;

	@JsonProperty("status")
	private Status status;

	@JsonProperty("documents")
	@Valid
	private List<Document> documents;

	@JsonProperty("unitUsageList")
	@Valid
	private List<UnitUsage> unitUsageList;

	@JsonProperty("additionalDetails")
	private Object additionalDetails;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;
}
