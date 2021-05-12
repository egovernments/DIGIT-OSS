package org.egov.userevent.web.contract;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Validated
@AllArgsConstructor
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@Setter
@ToString
@Builder
public class Action {
	@SafeHtml
	private String tenantId;

	@SafeHtml
	private String id;

	@SafeHtml
	private String eventId;
	
	@NotNull
	private List<ActionItem> actionUrls;
	
}
