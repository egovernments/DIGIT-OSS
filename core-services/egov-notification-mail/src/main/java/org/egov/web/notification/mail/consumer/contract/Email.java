package org.egov.web.notification.mail.consumer.contract;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Email {

	@NotNull
	private Set<String> emailTo;
	private String subject;
	private String body;
	@JsonProperty("isHTML")
	private boolean isHTML;

}
