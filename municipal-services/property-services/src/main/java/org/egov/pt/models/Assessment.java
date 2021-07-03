package org.egov.pt.models;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.pt.models.enums.Channel;
import org.egov.pt.models.enums.Status;
import org.egov.pt.models.workflow.ProcessInstance;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.SafeHtml;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Assessment {


	@SafeHtml
	@JsonProperty("id")
	private String id ;

	@JsonProperty("tenantId")
	@SafeHtml
	@NotNull
	private String tenantId ;

	@SafeHtml
	@JsonProperty("assessmentNumber")
	private String assessmentNumber ;

	@JsonProperty("financialYear")
	@SafeHtml
	@NotNull
	private String financialYear ;

	@JsonProperty("propertyId")
	@SafeHtml
	@NotNull
	private String propertyId;

	@JsonProperty("assessmentDate")
	@NotNull
	private Long assessmentDate ;

	@JsonProperty("status")
	private Status status ;

	@JsonProperty("source")
	private Source source ;

	@JsonProperty("unitUsageList")
	@Valid
	private List<UnitUsage> unitUsageList ;

	@JsonProperty("documents")
	@Valid
	private Set<Document> documents ;

	@JsonProperty("additionalDetails")
	private JsonNode additionalDetails ;

	@JsonProperty("channel")
	private Channel channel ;


	@JsonProperty("auditDetails")
	private AuditDetails auditDetails ;

	@JsonProperty("workflow")
	private ProcessInstance workflow;


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

	public Assessment addDocumentsItem(Document documentsItem) {
		if (this.documents == null) {
			this.documents = new HashSet<>();
		}
		this.documents.add(documentsItem);
		return this;
	}

}

