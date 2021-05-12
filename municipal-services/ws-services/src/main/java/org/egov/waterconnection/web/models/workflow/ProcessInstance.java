package org.egov.waterconnection.web.models.workflow;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.egov.common.contract.request.User;
import org.egov.waterconnection.web.models.Document;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * A Object holds the basic data for a Trade License
 */
@ApiModel(description = "A Object holds the basic data for a Trade License")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-12-04T11:26:25.532+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(of = { "id" })
@ToString
public class ProcessInstance {

	@Size(max = 64)
	@SafeHtml
	@JsonProperty("id")
	private String id;

	@NotNull
	@SafeHtml
	@Size(max = 128)
	@JsonProperty("tenantId")
	private String tenantId;

	@NotNull
	@Size(max = 128)
	@SafeHtml
	@JsonProperty("businessService")
	private String businessService;

	@NotNull
	@Size(max = 128)
	@SafeHtml
	@JsonProperty("businessId")
	private String businessId;

	@NotNull
	@Size(max = 128)
	@SafeHtml
	@JsonProperty("action")
	private String action;

	@NotNull
	@Size(max = 64)
	@SafeHtml
	@JsonProperty("moduleName")
	private String moduleName;

	@JsonProperty("state")
	private State state;

	@JsonProperty("comment")
	@SafeHtml
	private String comment;

	@JsonProperty("documents")
	@Valid
	private List<Document> documents;

	@JsonProperty("assignes")
	private List<User> assignes;

	public ProcessInstance addDocumentsItem(Document documentsItem) {
		if (this.documents == null) {
			this.documents = new ArrayList<>();
		}
		if (!this.documents.contains(documentsItem))
			this.documents.add(documentsItem);

		return this;
	}

}
