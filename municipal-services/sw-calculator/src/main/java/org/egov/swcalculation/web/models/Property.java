package org.egov.swcalculation.web.models;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.swcalculation.web.models.workflow.ProcessInstance;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Property
 */

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Property extends PropertyInfo {

	@JsonProperty("acknowldgementNumber")
	private String acknowldgementNumber;

	@JsonProperty("propertyType")
	private String propertyType;

	@JsonProperty("ownershipCategory")
	private String ownershipCategory;

	@JsonProperty("owners")
	@Valid
	private List<OwnerInfo> owners;

	@JsonProperty("institution")
	private Institution institution;

	@JsonProperty("creationReason")
	private CreationReason creationReason;
	
	@JsonProperty("usageCategory")
	private String usageCategory;

	@JsonProperty("noOfFloors")
	private Long noOfFloors;

	@JsonProperty("landArea")
	private Double landArea;

	@JsonProperty("superBuiltUpArea")
	private BigDecimal superBuiltUpArea;

	@JsonProperty("source")
	private Source source;

	@JsonProperty("channel")
	private Channel channel;

	@JsonProperty("documents")
	@Valid
	private List<Document> documents;

	@JsonProperty("units")
	private List<Unit> units;

	@JsonProperty("additionalDetails")
	private Object additionalDetails;
	
	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;

	@JsonProperty("workflow")
	private ProcessInstance workflow;

	@Builder
	public Property(String id, String propertyId, String surveyId, List<String> linkedProperties, String tenantId,
			String accountId, String oldPropertyId, Status status, Address address, String acknowldgementNumber,
			String propertyType, String ownershipCategory, List<OwnerInfo> owners, Institution institution,
			CreationReason creationReason, String usageCategory, Long noOfFloors, Double landArea,
			BigDecimal superBuiltUpArea, Source source, Channel channel, List<Document> documents, List<Unit> units,
			Object additionalDetails, AuditDetails auditDetails, ProcessInstance workflow) {
		super(id, propertyId, surveyId, linkedProperties, tenantId, accountId, oldPropertyId, status, address);
		this.acknowldgementNumber = acknowldgementNumber;
		this.propertyType = propertyType;
		this.ownershipCategory = ownershipCategory;
		this.owners = owners;
		this.institution = institution;
		this.creationReason = creationReason;
		this.usageCategory = usageCategory;
		this.noOfFloors = noOfFloors;
		this.landArea = landArea;
		this.superBuiltUpArea = superBuiltUpArea;
		this.source = source;
		this.channel = channel;
		this.documents = documents;
		this.units = units;
		this.additionalDetails = additionalDetails;
		this.auditDetails = auditDetails;
		this.workflow = workflow;
	}

	public Property addOwnersItem(OwnerInfo ownersItem) {
		if (this.owners == null) {
			this.owners = new ArrayList<>();
		}

		if (null != ownersItem)
			this.owners.add(ownersItem);
		return this;
	}
	
	public Property addUnitsItem(Unit unit) {
		if (this.units == null) {
			this.units = new ArrayList<>();
		}

		if (null != unit)
			this.units.add(unit);
		return this;
	}

	public Property addDocumentsItem(Document documentsItem) {
		if (this.documents == null) {
			this.documents = new ArrayList<>();
		}

		if (null != documentsItem)
			this.documents.add(documentsItem);
		return this;
	}
}
