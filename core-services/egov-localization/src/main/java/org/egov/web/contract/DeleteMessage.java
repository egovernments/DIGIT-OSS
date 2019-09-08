package org.egov.web.contract;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.hibernate.validator.constraints.NotEmpty;

@Builder
@Getter
@AllArgsConstructor
public class DeleteMessage {
	@NotEmpty
	private String code;
	@NotEmpty
	private String module;
	@NotEmpty
	private String locale;
}
