package org.egov.web.contract;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.hibernate.validator.constraints.NotEmpty;

@Builder
@Getter
@AllArgsConstructor
public class UpdateMessage {
	@NotEmpty
	private String code;
	@NotEmpty
	private String message;
}
