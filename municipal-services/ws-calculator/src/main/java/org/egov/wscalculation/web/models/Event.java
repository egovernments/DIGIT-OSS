package org.egov.wscalculation.web.models;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.validation.annotation.Validated;

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
public class Event {
	
	@NotNull
	private String tenantId;
	
	private String id;
	
	private String referenceId;
	
	@NotNull
	private String eventType;
	
	private String name;
	
	@NotNull
	private String description;
	
	private Status status;
	
	@NotNull
	private Source source;
	
	private String postedBy;
	
	@Valid
	@NotNull
	private Recipient recepient;
	
	private Action actions;
	
	private EventDetails eventDetails;
		

}
