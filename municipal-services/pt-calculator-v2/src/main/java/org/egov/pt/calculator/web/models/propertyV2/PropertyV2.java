package org.egov.pt.calculator.web.models.propertyV2;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.pt.calculator.web.models.property.AuditDetails;
import org.egov.pt.calculator.web.models.property.OwnerInfo;


import javax.validation.Valid;
import javax.validation.constraints.Digits;
import javax.validation.constraints.Max;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * PropertyV2
 */

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PropertyV2 extends PropertyInfoV2 {

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
	private InstitutionV2 institutionV2;

	@JsonProperty("creationReason")
	private String creationReason;
	
	@JsonProperty("usageCategory")
	private String usageCategory;

	@Max(value = 500)
	@JsonProperty("noOfFloors")
	private Long noOfFloors;

	@Digits(integer = 10, fraction = 2)
	@JsonProperty("landArea")
	private Double landArea;

	@Digits(integer = 10, fraction = 2)
	@JsonProperty("superBuiltUpArea")
	private BigDecimal superBuiltUpArea;

	@JsonProperty("source")
	private String source;

	@JsonProperty("channel")
	private String channel;

	@JsonProperty("documents")
	@Valid
	private List<DocumentV2> documentV2s;

	@JsonProperty("units")
	@Valid
	private List<UnitV2> units;

	@JsonProperty("additionalDetails")
	private Object additionalDetails;
	
	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;



	@Builder
	public PropertyV2(String id, String propertyId, String surveyId, List<String> linkedProperties, String tenantId,
					  String accountId, String oldPropertyId, String status, AddressV2 addressV2, String acknowldgementNumber,
					  String propertyType, String ownershipCategory, List<OwnerInfo> owners, InstitutionV2 institutionV2,
					  String creationReason, String usageCategory, Long noOfFloors, Double landArea,
					  BigDecimal superBuiltUpArea, String source, String channel, List<DocumentV2> documentV2s, List<UnitV2> units,
					  Object additionalDetails, AuditDetails auditDetails) {
		super(id, propertyId, surveyId, linkedProperties, tenantId, accountId, oldPropertyId, status, addressV2);
		this.acknowldgementNumber = acknowldgementNumber;
		this.propertyType = propertyType;
		this.ownershipCategory = ownershipCategory;
		this.owners = owners;
		this.institutionV2 = institutionV2;
		this.creationReason = creationReason;
		this.usageCategory = usageCategory;
		this.noOfFloors = noOfFloors;
		this.landArea = landArea;
		this.superBuiltUpArea = superBuiltUpArea;
		this.source = source;
		this.channel = channel;
		this.documentV2s = documentV2s;
		this.units = units;
		this.additionalDetails = additionalDetails;
		this.auditDetails = auditDetails;
	}

	public PropertyV2 addOwnersItem(OwnerInfo ownersItem) {
		if (this.owners == null) {
			this.owners = new ArrayList<>();
		}

		if (null != ownersItem)
			this.owners.add(ownersItem);
		return this;
	}
	
	public PropertyV2 addUnitsItem(UnitV2 unit) {
		if (this.units == null) {
			this.units = new ArrayList<>();
		}

		if (null != unit)
			this.units.add(unit);
		return this;
	}

	public PropertyV2 addDocumentsItem(DocumentV2 documentsItem) {
		if (this.documentV2s == null) {
			this.documentV2s = new ArrayList<>();
		}

		if (null != documentsItem)
			this.documentV2s.add(documentsItem);
		return this;
	}
}
