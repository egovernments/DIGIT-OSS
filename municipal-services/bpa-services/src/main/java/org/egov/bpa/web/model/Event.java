package org.egov.bpa.web.model;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.bpa.web.model.landInfo.Source;
import org.egov.bpa.web.model.landInfo.Status;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
	private Recepient recepient;

	private Action actions;

	private EventDetails eventDetails;



}
