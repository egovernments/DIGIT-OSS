package org.egov.swservice.web.models;

import java.util.Objects;

import javax.validation.Valid;

import lombok.*;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModelProperty;

/**
 * SewerageConnection
 */
@Validated
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-03-13T11:29:47.358+05:30[Asia/Kolkata]")
public class SewerageConnection extends Connection {
	@JsonProperty("proposedWaterClosets")
	private Integer proposedWaterClosets = null;

	@JsonProperty("proposedToilets")
	private Integer proposedToilets = null;

	@JsonProperty("noOfWaterClosets")
	private Integer noOfWaterClosets = null;

	@JsonProperty("noOfToilets")
	private Integer noOfToilets = null;

	@JsonProperty("isDisconnectionTemporary")
	private Boolean isDisconnectionTemporary = false;

	@JsonProperty("disconnectionReason")
	private String disconnectionReason = null;

}
