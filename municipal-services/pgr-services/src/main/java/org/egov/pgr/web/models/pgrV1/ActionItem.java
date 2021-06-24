package org.egov.pgr.web.models.pgrV1;

import lombok.*;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotNull;

@Validated
@AllArgsConstructor
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@Setter
@ToString
@Builder
public class ActionItem {
	
	@NotNull
	private String actionUrl;
	
	@NotNull
	private String code;

}
