package org.egov.bpa.web.model.NOC;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {
	
	 @JsonProperty("id")
	 private String id;

	 @JsonProperty("documentType")
	 private String documentType;

	 @JsonProperty("fileStoreId")
	 private String fileStoreId;

	 @JsonProperty("documentUid")
	 private String documentUid;

	 @JsonProperty("additionalDetails")
	 private Object additionalDetails;
	 
}