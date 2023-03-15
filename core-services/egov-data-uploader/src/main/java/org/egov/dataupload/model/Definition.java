package org.egov.dataupload.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Definition {

	@JsonProperty("name")
	private String name;
	
	@JsonProperty("templateFileName")
	private String templateFileName;

    @JsonProperty("isParentChild")
    private Boolean isParentChild;

    @JsonProperty("uniqueParentKeys")
    private List<String> uniqueParentKeys;

    @JsonProperty("uniqueKeysForInnerObject")
    private List<String> uniqueKeysForInnerObject;

    @JsonProperty("requests")
    private List<Request> requests;

}