package org.egov.bpa.web.model.NOC;

import java.util.List;

import org.springframework.validation.annotation.Validated;

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
public class Workflow {

	@JsonProperty("action")
	private String action;

	@JsonProperty("assignes")
	private List<String> assignes;

	@JsonProperty("comment")
	private String comment;

	@JsonProperty("documents")
    private List<Document> documents;

}