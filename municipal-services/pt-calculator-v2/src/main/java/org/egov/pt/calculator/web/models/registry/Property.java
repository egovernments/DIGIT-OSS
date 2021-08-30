package org.egov.pt.calculator.web.models.registry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import org.egov.pt.calculator.web.models.demand.Status;
import org.egov.pt.calculator.web.models.property.Address;
import org.egov.pt.calculator.web.models.property.AuditDetails;
import org.egov.pt.calculator.web.models.property.Document;
import org.egov.pt.calculator.web.models.property.OwnerInfo;
import org.egov.pt.calculator.web.models.property.Property.CreationReasonEnum;
import org.egov.pt.calculator.web.models.property.PropertyInfo.StatusEnum;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Property extends PropertyInfo {

	@JsonProperty("acknowldgementNumber")
	private String acknowldgementNumber;

	@JsonProperty("propertyType")
	private String propertyType;

	@JsonProperty("usageCategory")
	private String usageCategory;

	@JsonProperty("ownershipCategory")
	private String ownershipCategory;

	@JsonProperty("owners")
	@Valid
	@NotNull
	private Set<OwnerInfo> owners;

	@JsonProperty("institution")
	@Valid
	private List<Institution> institution;

	@JsonProperty("creationReason")
	private CreationReasonEnum creationReason;

	@JsonProperty("occupancyDate")
	private Long occupancyDate;

	@JsonProperty("constructionDate")
	private Long constructionDate;

	@JsonProperty("noOfFloors")
	private Long noOfFloors;

	@JsonProperty("landArea")
	@Min(1)
	private Double landArea;

	@JsonProperty("source")
	@NotNull
	private Source source;

	@JsonProperty("documents")
	@Valid
	private List<Document> documents;

	@JsonProperty("additionalDetails")
	private Object additionalDetails;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;
	
	@JsonProperty("workflow")
	private ProcessInstance workflow;

	public enum Source {

		PT("PT"),

		TL("TL"),

		WAS("WAS"),

		DATA_MIGRATION("DATA_MIGRATION"),
		
		WEBAPP("WEBAPP"),
		
		MOBILEAPP("MOBILEAPP");

		private String value;

		Source(String value) {
			this.value = value;
		}

		@Override
		@JsonValue
		public String toString() {
			return String.valueOf(value);
		}

		@JsonCreator
		public static Source fromValue(String text) {
			for (Source b : Source.values()) {
				if (String.valueOf(b.value).equalsIgnoreCase(text)) {
					return b;
				}
			}
			return null;
		}
	}

	public Property addInstitutionItem(Institution institutionItem) {

		if (this.institution == null) {
			this.institution = new ArrayList<>();
		}

		if (null != institutionItem)
			this.institution.add(institutionItem);
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

	@Builder
	public Property(String id, String propertyId, String tenantId, String accountId, String oldPropertyId,
			StatusEnum status, Address address, List<String> parentProperties, String acknowldgementNumber,
			String propertyType, String usageCategory, String ownershipCategory, Set<OwnerInfo> owners,
			List<Institution> institution, CreationReasonEnum creationReason, Long occupancyDate, Long constructionDate,
			Long noOfFloors, Double landArea, Source source, List<Document> documents, Object additionalDetails,
			AuditDetails auditDetails) {
		super(id, propertyId, tenantId, accountId, oldPropertyId, status, address, parentProperties);
		this.acknowldgementNumber = acknowldgementNumber;
		this.propertyType = propertyType;
		this.usageCategory = usageCategory;
		this.ownershipCategory = ownershipCategory;
		this.owners = owners;
		this.institution = institution;
		this.creationReason = creationReason;
		this.occupancyDate = occupancyDate;
		this.constructionDate = constructionDate;
		this.noOfFloors = noOfFloors;
		this.landArea = landArea;
		this.source = source;
		this.documents = documents;
		this.additionalDetails = additionalDetails;
		this.auditDetails = auditDetails;
	}

}
