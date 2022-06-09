package org.egov.tl.web.models.property;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;
import org.egov.tl.web.models.AuditDetails;
import org.egov.tl.web.models.Document;
import org.egov.tl.web.models.Institution;
import org.egov.tl.web.models.OwnerInfo;
import org.hibernate.validator.constraints.SafeHtml;
import org.javers.core.metamodel.annotation.DiffIgnore;

import javax.validation.Valid;
import javax.validation.constraints.Digits;
import javax.validation.constraints.Max;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Property
 */

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Property {

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

	@JsonProperty("documents")
	@Valid
	@DiffIgnore
	private List<Document> documents;

	@DiffIgnore
	@JsonProperty("additionalDetails")
	private JsonNode additionalDetails;
	
	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;
	
	@JsonProperty("AlternateUpdated")
	private boolean AlternateUpdated;

	public Property addOwnersItem(OwnerInfo ownersItem) {
		if (this.owners == null) {
			this.owners = new ArrayList<>();
		}

		if (null != ownersItem)
			this.owners.add(ownersItem);
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
