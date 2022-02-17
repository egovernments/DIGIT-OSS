
package org.egov.web.notification.mail.consumer.contract;

import java.util.ArrayList;
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

	//added tenantId and list filestoreids for the object
	private Set<String> emailTo;
	private String subject;
	private String body;
	private Set<String> fileStoreId;
	private String tenantId;
	@JsonProperty("isHTML")
	private boolean isHTML;

}