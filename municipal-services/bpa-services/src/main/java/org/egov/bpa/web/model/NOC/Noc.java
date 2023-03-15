package org.egov.bpa.web.model.NOC;

import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotNull;

import org.egov.bpa.web.model.NOC.enums.ApplicationType;
import org.egov.bpa.web.model.NOC.enums.Status;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Validated
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Noc {   
	
	  @JsonProperty("id")
	  private String id;

	  @NotNull
	  @JsonProperty("tenantId")
	  private String tenantId;

	  @JsonProperty("applicationNo")
	  private String applicationNo;

	  @JsonProperty("nocNo")
	  private String nocNo;

	  @NotNull
	  @JsonProperty("applicationType")
	  private ApplicationType applicationType;

	  @NotNull
	  @JsonProperty("nocType")
	  private String nocType;

	  @JsonProperty("accountId")
	  private String accountId;

	  @NotNull
	  @JsonProperty("source")
	  private String source;

	  @JsonProperty("sourceRefId")
	  private String sourceRefId;

	  @JsonProperty("landId")
	  private String landId;

	  @JsonProperty("status")
	  private Status status;

	  @JsonProperty("applicationStatus")
	  private String applicationStatus;

	  @JsonProperty("documents")
	  private List<Document> documents;

	  @JsonProperty("workflow")
	  private Workflow workflow;

	  @JsonProperty("auditDetails")
	  private AuditDetails auditDetails;

	  @JsonProperty("additionalDetails")
	  private Object additionalDetails;		  
		
	  @JsonIgnore
	  private ArrayList<String> docIds;
		
	  public Noc addDocumentsItem(Document documentsItem) {
		if (this.documents == null) {
			this.documents = new ArrayList<>();
		}
		if (this.docIds == null) {
			this.docIds = new ArrayList<String>();
		}
	
		if (!this.docIds.contains(documentsItem.getId())) {
			this.documents.add(documentsItem);
			this.docIds.add(documentsItem.getId());
		}
	
		return this;
	 }
	
}
