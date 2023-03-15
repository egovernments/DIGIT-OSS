package org.egov.wscalculation.web.models;

import java.util.Objects;

import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModelProperty;

/**
 * WaterConnection
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-12-02T14:30:33.286+05:30[Asia/Kolkata]")
 public class WaterConnection extends Connection {

	

	@JsonProperty("waterSource")
	private String waterSource = null;

	@JsonProperty("meterId")
	private String meterId = null;

	@JsonProperty("meterInstallationDate")
	private Long meterInstallationDate = null;

	@JsonProperty("proposedPipeSize")
	private Double proposedPipeSize = null;

	@JsonProperty("proposedTaps")
	private Integer proposedTaps = null;

	@JsonProperty("pipeSize")
	private Double pipeSize = null;

	@JsonProperty("noOfTaps")
	private Integer noOfTaps = null;


	public WaterConnection waterSource(String waterSource) {
		this.waterSource = waterSource;
		return this;
	}

	/**
	 * It is a namespaced master data, defined in MDMS
	 * 
	 * @return waterSource
	 **/
	@ApiModelProperty(required = true, value = "It is a namespaced master data, defined in MDMS")
	@Size(min = 2, max = 64)
	public String getWaterSource() {
		return waterSource;
	}

	public void setWaterSource(String waterSource) {
		this.waterSource = waterSource;
	}

	public WaterConnection meterId(String meterId) {
		this.meterId = meterId;
		return this;
	}

	/**
	 * Unique id of the meter.
	 * 
	 * @return meterId
	 **/
	@ApiModelProperty(value = "Unique id of the meter.")

	@Size(min = 2, max = 64)
	public String getMeterId() {
		return meterId;
	}

	public void setMeterId(String meterId) {
		this.meterId = meterId;
	}

	public WaterConnection meterInstallationDate(Long meterInstallationDate) {
		this.meterInstallationDate = meterInstallationDate;
		return this;
	}

	/**
	 * The date of meter installation date.
	 * 
	 * @return meterInstallationDate
	 **/
	@ApiModelProperty(value = "The date of meter installation date.")

	public Long getMeterInstallationDate() {
		return meterInstallationDate;
	}

	public void setMeterInstallationDate(Long meterInstallationDate) {
		this.meterInstallationDate = meterInstallationDate;
	}

	public WaterConnection noOfTaps(Integer noOfTaps) {
		this.noOfTaps = noOfTaps;
		return this;
	}

	/**
	 * No of taps for non-metered calculation attribute.
	 * 
	 * @return noOfTaps
	 **/
	@ApiModelProperty(value = "No of taps for non-metered calculation attribute.")

	public Integer getNoOfTaps() {
		return noOfTaps;
	}

	public void setNoOfTaps(Integer noOfTaps) {
		this.noOfTaps = noOfTaps;
	}

	/**
	 * Proposed taps for non-metered calculation attribute.
	 * 
	 * @return pipeSize
	 **/
	@ApiModelProperty(value = "No of proposed taps no is citizen input")

	public Integer getProposedTaps() {
		return proposedTaps;
	}

	public void setProposedTaps(Integer proposedTaps) {
		this.proposedTaps = proposedTaps;
	}

	public WaterConnection proposedProposedTaps(Integer proposedTaps) {
		this.proposedTaps = proposedTaps;
		return this;
	}

	/**
	 * Proposed Pipe size for non-metered calculation attribute.
	 * 
	 * @return pipeSize
	 **/
	@ApiModelProperty(value = "No of proposed Pipe size is citizen input")

	public Double getProposedPipeSize() {
		return proposedPipeSize;
	}

	public void setProposedPipeSize(Double proposedPipeSize) {
		this.proposedPipeSize = proposedPipeSize;
	}

	public WaterConnection proposedPipeSize(Double proposedPipeSize) {
		this.proposedPipeSize = proposedPipeSize;
		return this;
	}

	public WaterConnection pipeSize(Double pipeSize) {
		this.pipeSize = pipeSize;
		return this;
	}

	/**
	 * Pipe size for non-metered calulation attribute.
	 * 
	 * @return pipeSize
	 **/
	@ApiModelProperty(value = "Pipe size for non-metered calulation attribute.")

	public Double getPipeSize() {
		return pipeSize;
	}

	public void setPipeSize(Double pipeSize) {
		this.pipeSize = pipeSize;
	}

	@Override
	public boolean equals(java.lang.Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		WaterConnection waterConnection = (WaterConnection) o;
		return Objects.equals(this.waterSource, waterConnection.waterSource)
				&& Objects.equals(this.meterId, waterConnection.meterId)
				&& Objects.equals(this.meterInstallationDate, waterConnection.meterInstallationDate) && super.equals(o);
	}

	@Override
	public int hashCode() {
		return Objects.hash(waterSource, meterId, meterInstallationDate, super.hashCode());
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("class WaterConnection {\n");
		sb.append("    ").append(toIndentedString(super.toString())).append("\n");
		sb.append("    waterSource: ").append(toIndentedString(waterSource)).append("\n");
		sb.append("    meterId: ").append(toIndentedString(meterId)).append("\n");
		sb.append("    meterInstallationDate: ").append(toIndentedString(meterInstallationDate)).append("\n");
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
