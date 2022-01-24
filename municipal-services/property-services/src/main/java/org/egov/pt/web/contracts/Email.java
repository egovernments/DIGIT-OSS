package org.egov.pt.web.contracts;

import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Email {

	private Set<String> emailTo;
	private String subject;
	private String body;
	private String tenantId;
	private Set<String> fileStoreId;
	@JsonProperty("isHTML")
	private boolean isHTML;

}
