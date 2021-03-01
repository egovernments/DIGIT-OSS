package org.egov.fsm.web.model;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FSMAudit {

	@JsonProperty("who")
	private String who = null;

	@JsonProperty("when")
	private Long when = null;

	@JsonProperty("what")
	private Map<String, Object> what;

}
