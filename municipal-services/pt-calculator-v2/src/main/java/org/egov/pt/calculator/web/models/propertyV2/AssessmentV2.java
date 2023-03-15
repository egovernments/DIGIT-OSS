package org.egov.pt.calculator.web.models.propertyV2;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.egov.pt.calculator.web.models.property.AuditDetails;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AssessmentV2 {


	@JsonProperty("id")
	private String id ;

	@JsonProperty("tenantId")
	@NotNull
	private String tenantId ;

	@JsonProperty("assessmentNumber")
	private String assessmentNumber ;

	@JsonProperty("financialYear")
	@NotNull
	private String financialYear ;

	@JsonProperty("propertyId")
	@NotNull
	private String propertyId;

	@JsonProperty("assessmentDate")
	@NotNull
	private Long assessmentDate ;

	@JsonProperty("status")
	private String status ;

	@JsonProperty("source")
	@NotNull
	private Source source ;

	@JsonProperty("unitUsageList")
	@Valid
	private List<UnitUsage> unitUsageList ;

	@JsonProperty("documentV2s")
	@Valid
	private Set<DocumentV2> documents ;

	@JsonProperty("additionalDetails")
	private JsonNode additionalDetails ;

	@JsonProperty("channel")
	private String channel ;


	@JsonProperty("auditDetails")
	private AuditDetails auditDetails ;



	public enum Source {

		MUNICIPAL_RECORDS("MUNICIPAL_RECORDS"),

		WEBAPP("WEBAPP"),

		MOBILEAPP("MOBILEAPP"),

		FIELD_SURVEY("FIELD_SURVEY");

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

	public AssessmentV2 addDocumentsItem(DocumentV2 documentsItem) {
		if (this.documents == null) {
			this.documents = new HashSet<>();
		}
		this.documents.add(documentsItem);
		return this;
	}

}

