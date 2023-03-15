package org.egov.swcalculation.web.models;

import java.util.Objects;

import javax.validation.Valid;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModelProperty;

/**
 * SewerageConnection
 */
@Validated
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

	public SewerageConnection noOfWaterClosets(Integer noOfWaterClosets) {
		this.noOfWaterClosets = noOfWaterClosets;
		return this;
	}

	/**
	 * Get noOfWaterClosets
	 * 
	 * @return noOfWaterClosets
	 **/
	@ApiModelProperty(value = "")

	@Valid
	public Integer getNoOfWaterClosets() {
		return noOfWaterClosets;
	}

	public void setNoOfWaterClosets(Integer noOfWaterClosets) {
		this.noOfWaterClosets = noOfWaterClosets;
	}

	public SewerageConnection proposedWaterClosets(Integer proposedWaterClosets) {
		this.proposedWaterClosets = proposedWaterClosets;
		return this;
	}

	/**
	 * Get proposedWaterClosets
	 * 
	 * @return proposedWaterClosets
	 **/
	@ApiModelProperty(value = "")

	@Valid
	public Integer getProposedWaterClosets() {
		return proposedWaterClosets;
	}

	public void setProposedWaterClosets(Integer proposedWaterClosets) {
		this.proposedWaterClosets = proposedWaterClosets;
	}

	public SewerageConnection noOfToilets(Integer noOfToilets) {
		this.noOfToilets = noOfToilets;
		return this;
	}

	/**
	 * Get noOfToilets
	 * 
	 * @return noOfToilets
	 **/
	@ApiModelProperty(value = "")

	@Valid
	public Integer getNoOfToilets() {
		return noOfToilets;
	}

	public void setNoOfToilets(Integer noOfToilets) {
		this.noOfToilets = noOfToilets;
	}

	public SewerageConnection proposedToilets(Integer proposedToilets) {
		this.proposedToilets = proposedToilets;
		return this;
	}

	/**
	 * Get proposedToilets
	 * 
	 * @return proposedToilets
	 **/
	@ApiModelProperty(value = "")

	@Valid
	public Integer getProposedToilets() {
		return proposedToilets;
	}

	public void setProposedToilets(Integer proposedToilets) {
		this.proposedToilets = proposedToilets;
	}

	@Override
	public boolean equals(java.lang.Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		SewerageConnection sewerageConnection = (SewerageConnection) o;
		return Objects.equals(this.noOfWaterClosets, sewerageConnection.noOfWaterClosets)
				&& Objects.equals(this.proposedWaterClosets, sewerageConnection.proposedWaterClosets)
				&& Objects.equals(this.noOfToilets, sewerageConnection.noOfToilets)
				&& Objects.equals(this.proposedToilets, sewerageConnection.proposedToilets) && super.equals(o);
	}

	@Override
	public int hashCode() {
		return Objects.hash(noOfWaterClosets, proposedWaterClosets, noOfToilets, proposedToilets, super.hashCode());
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("class SewerageConnection {\n");
		sb.append("    ").append(toIndentedString(super.toString())).append("\n");
		sb.append("    noOfWaterClosets: ").append(toIndentedString(noOfWaterClosets)).append("\n");
		sb.append("    proposedWaterClosets: ").append(toIndentedString(proposedWaterClosets)).append("\n");
		sb.append("    noOfToilets: ").append(toIndentedString(noOfToilets)).append("\n");
		sb.append("    proposedToilets: ").append(toIndentedString(proposedToilets)).append("\n");
		sb.append("}");
		return sb.toString();
	}

	/**
	 * Convert the given object to string with each line indented by 4 spaces
	 * (except the first line).
	 */
	private String toIndentedString(java.lang.Object o) {
		if (o == null) {
			return "null";
		}
		return o.toString().replace("\n", "\n    ");
	}
}
