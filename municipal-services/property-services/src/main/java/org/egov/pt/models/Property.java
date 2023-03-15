package org.egov.pt.models;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Digits;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;

import org.egov.pt.models.enums.Channel;
import org.egov.pt.models.enums.CreationReason;
import org.egov.pt.models.enums.Source;
import org.egov.pt.models.enums.Status;
import org.egov.pt.models.workflow.ProcessInstance;
import org.hibernate.validator.constraints.SafeHtml;
import org.javers.core.metamodel.annotation.DiffIgnore;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

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
@Builder
public class Property extends PropertyInfo {

	@JsonProperty("acknowldgementNumber")
	@SafeHtml
	private String acknowldgementNumber;

	@JsonProperty("propertyType")
	@SafeHtml
	private String propertyType;

	@JsonProperty("ownershipCategory")
	@SafeHtml
	private String ownershipCategory;

	@JsonProperty("owners")
	@Valid
	private List<OwnerInfo> owners;

	@JsonProperty("institution")
	private Institution institution;

	@JsonProperty("creationReason")
	@NotNull(message="The value provided is either Invald or null")
	private CreationReason creationReason;
	
	@JsonProperty("usageCategory")
	@SafeHtml
	private String usageCategory;

	@Max(value = 500)
	@JsonProperty("noOfFloors")
	private Long noOfFloors;

	@Digits(integer = 8, fraction = 2)
	@JsonProperty("landArea")
	private Double landArea;

	@Digits(integer = 8, fraction = 2)
	@JsonProperty("superBuiltUpArea")
	private BigDecimal superBuiltUpArea;

	@JsonProperty("source")
	private Source source;

	@JsonProperty("channel")
	private Channel channel;

	@JsonProperty("documents")
	@Valid
	@DiffIgnore
	private List<Document> documents;

	@JsonProperty("units")
	@Valid
	private List<Unit> units;

	@DiffIgnore
	@JsonProperty("additionalDetails")
	private JsonNode additionalDetails;
	
	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;

	@JsonProperty("workflow")
	@DiffIgnore
	private ProcessInstance workflow;
	
	@JsonProperty("AlternateUpdated")
	private boolean AlternateUpdated;

	@Builder.Default
	@JsonProperty("isOldDataEncryptionRequest")
	private boolean isOldDataEncryptionRequest = false;

	@Builder
	public Property(String id, String propertyId, String surveyId, List<String> linkedProperties, String tenantId,
			String accountId, String oldPropertyId, Status status, Address address, String acknowldgementNumber,
			String propertyType, String ownershipCategory, List<OwnerInfo> owners, Institution institution,
			CreationReason creationReason, String usageCategory, Long noOfFloors, Double landArea,
			BigDecimal superBuiltUpArea, Source source, Channel channel, List<Document> documents, List<Unit> units,
			JsonNode additionalDetails, AuditDetails auditDetails, ProcessInstance workflow) {
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
