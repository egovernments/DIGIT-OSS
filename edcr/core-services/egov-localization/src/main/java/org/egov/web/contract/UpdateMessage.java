package org.egov.web.contract;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.NotEmpty;
import org.hibernate.validator.constraints.SafeHtml;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateMessage {
	@NotEmpty
    @SafeHtml
	private String code;
	@NotEmpty
    @SafeHtml
	private String message;
}
