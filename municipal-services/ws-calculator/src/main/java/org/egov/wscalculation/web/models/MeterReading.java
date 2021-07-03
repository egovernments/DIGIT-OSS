package org.egov.wscalculation.web.models;

import java.util.Objects;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
/**
 * This is lightweight meter reading object that can be used as reference by
 * definitions needing meterreading linking.
 */
@ApiModel(description = "This is lightweight meter reading object that can be used as reference by definitions needing meterreading linking.")
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-11-12T10:46:14.653+05:30[Asia/Kolkata]")
public class MeterReading {

	@SafeHtml
	@JsonProperty("id")
	private String id = null;

	@SafeHtml
	@JsonProperty("billingPeriod")
	private String billingPeriod = null;

	/**
	 * Gets or Sets meterStatus
	 */
	public enum MeterStatusEnum {
		WORKING("Working"),

		LOCKED("Locked"),

		BREAKDOWN("Breakdown"),

		NO_METER("No-meter"),

		RESET("Reset"),

		REPLACEMENT("Replacement");

		private String value;

		MeterStatusEnum(String value) {
			this.value = value;
		}

		@Override
		@JsonValue
		public String toString() {
			return String.valueOf(value);
		}

		@JsonCreator
		public static MeterStatusEnum fromValue(String text) {
			for (MeterStatusEnum b : MeterStatusEnum.values()) {
				if (String.valueOf(b.value).equals(text)) {
					return b;
				}
			}
			return null;
		}
	}

	@JsonProperty("meterStatus")
	private MeterStatusEnum meterStatus = null;

	@JsonProperty("lastReading")
	private Double lastReading = null;

	@JsonProperty("lastReadingDate")
	private Long lastReadingDate = null;

	@JsonProperty("currentReading")
	private Double currentReading = null;

	@JsonProperty("currentReadingDate")
	private Long currentReadingDate = null;

	@SafeHtml
	@JsonProperty("connectionNo")
	private String connectionNo = null;

	@JsonProperty("consumption")
	private Double consumption = null;

	@JsonProperty("generateDemand")
	private Boolean generateDemand = Boolean.TRUE;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails = null;

	@SafeHtml
	@JsonProperty("tenantId")
	private String tenantId = null;

	public MeterReading id(String id) {
		this.id = id;
		return this;
	}

	/**
	 * Unique Identifier of the meterreading for internal reference.
	 *
	 * @return id
	 **/
	@ApiModelProperty(readOnly = true, value = "Unique Identifier of the meterreading for internal reference.")

	@Size(min = 1, max = 64)
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public MeterReading billingPeriod(String billingPeriod) {
		this.billingPeriod = billingPeriod;
		return this;
	}

	public MeterReading connectionNo(String connectionNo) {
		this.connectionNo = connectionNo;
		return this;
	}

	/**
	 * Formatted billingPeriod
	 *
	 * @return billingPeriod
	 **/
	@ApiModelProperty(required = true, readOnly = true, value = "Formatted billingPeriod")
	@NotNull

	public String getConnectionNo() {
		return connectionNo;
	}

	public void setConnectionNo(String connectionNo) {
		this.connectionNo = connectionNo;
	}

	/**
	 * Formatted billingPeriod
	 *
	 * @return billingPeriod
	 **/
	@ApiModelProperty(required = true, readOnly = true, value = "Formatted billingPeriod")
	@NotNull

	@Size(min = 1, max = 64)
	public String getBillingPeriod() {
		return billingPeriod;
	}

	public void setBillingPeriod(String billingPeriod) {
		this.billingPeriod = billingPeriod;
	}

	public MeterReading meterStatus(MeterStatusEnum meterStatus) {
		this.meterStatus = meterStatus;
		return this;
	}

	/**
	 * Get meterStatus
	 *
	 * @return meterStatus
	 **/
	@ApiModelProperty(required = true, readOnly = true, value = "")
	@NotNull

	public MeterStatusEnum getMeterStatus() {
		return meterStatus;
	}

	public void setMeterStatus(MeterStatusEnum meterStatus) {
		this.meterStatus = meterStatus;
	}

	public MeterReading lastReading(Double lastReading) {
		this.lastReading = lastReading;
		return this;
	}

	/**
	 * Last Reading
	 *
	 * @return lastReading
	 **/
	@ApiModelProperty(required = true, value = "Last Reading")
	@NotNull

	public Double getLastReading() {
		return lastReading;
	}

	public void setLastReading(Double lastReading) {
		this.lastReading = lastReading;
	}

	public MeterReading lastReadingDate(Long lastReadingDate) {
		this.lastReadingDate = lastReadingDate;
		return this;
	}

	/**
	 * The date of meter last reading date.
	 *
	 * @return lastReadingDate
	 **/
	@ApiModelProperty(required = true, value = "The date of meter last reading date.")
	@NotNull

	public Long getLastReadingDate() {
		return lastReadingDate;
	}

	public void setLastReadingDate(Long lastReadingDate) {
		this.lastReadingDate = lastReadingDate;
	}

	public MeterReading currentReading(Double currentReading) {
		this.currentReading = currentReading;
		return this;
	}

	public MeterReading consumption(Double consumption) {
		this.consumption = consumption;
		return this;
	}

	public Double getConsumption() {
		return consumption;
	}

	public void setConsumption(Double consumption) {
		this.consumption = consumption;
	}

	/**
	 * Current Reading
	 *
	 * @return currentReading
	 **/
	@ApiModelProperty(required = true, value = "Current Reading")
	@NotNull

	public Double getCurrentReading() {
		return currentReading;
	}

	public void setCurrentReading(Double currentReading) {
		this.currentReading = currentReading;
	}

	public MeterReading currentReadingDate(Long currentReadingDate) {
		this.currentReadingDate = currentReadingDate;
		return this;
	}

	/**
	 * The date of meter current reading date.
	 *
	 * @return currentReadingDate
	 **/
	@ApiModelProperty(required = true, value = "The date of meter current reading date.")
	@NotNull

	public Long getCurrentReadingDate() {
		return currentReadingDate;
	}

	public void setCurrentReadingDate(Long currentReadingDate) {
		this.currentReadingDate = currentReadingDate;
	}

	public MeterReading generateDemand(Boolean generateDemand) {
		this.generateDemand = generateDemand;
		return this;
	}

	public Boolean getGenerateDemand() {
		return generateDemand;
	}

	public void setGenerateDemand(Boolean generateDemand) {
		this.generateDemand = generateDemand;
	}

	public MeterReading auditDetails(AuditDetails auditDetails) {
		this.auditDetails = auditDetails;
		return this;
	}

	/**
	 * Get auditDetails
	 *
	 * @return auditDetails
	 **/
	@ApiModelProperty(value = "")
	public AuditDetails getAuditDetails() {
		return auditDetails;
	}

	public void setAuditDetails(AuditDetails auditDetails) {
		this.auditDetails = auditDetails;
	}

	public MeterReading tenantId(String tenantId) {
		this.tenantId = tenantId;
		return this;
	}

	@ApiModelProperty(value = "")
	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

	@Override
	public boolean equals(java.lang.Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		MeterReading meterReading = (MeterReading) o;
		return Objects.equals(this.id, meterReading.id)
				&& Objects.equals(this.billingPeriod, meterReading.billingPeriod)
				&& Objects.equals(this.meterStatus, meterReading.meterStatus)
				&& Objects.equals(this.lastReading, meterReading.lastReading)
				&& Objects.equals(this.lastReadingDate, meterReading.lastReadingDate)
				&& Objects.equals(this.currentReading, meterReading.currentReading)
				&& Objects.equals(this.currentReadingDate, meterReading.currentReadingDate)
				&& Objects.equals(this.consumption, meterReading.consumption)
				&& Objects.equals(this.tenantId, meterReading.tenantId);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, billingPeriod, meterStatus, lastReading, lastReadingDate, currentReading,
				currentReadingDate, tenantId);
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("class MeterReading {\n");

		sb.append("    id: ").append(toIndentedString(id)).append("\n");
		sb.append("    billingPeriod: ").append(toIndentedString(billingPeriod)).append("\n");
		sb.append("    meterStatus: ").append(toIndentedString(meterStatus)).append("\n");
		sb.append("    lastReading: ").append(toIndentedString(lastReading)).append("\n");
		sb.append("    lastReadingDate: ").append(toIndentedString(lastReadingDate)).append("\n");
		sb.append("    currentReading: ").append(toIndentedString(currentReading)).append("\n");
		sb.append("    currentReadingDate: ").append(toIndentedString(currentReadingDate)).append("\n");
		sb.append("    consumption: ").append(toIndentedString(consumption)).append("\n");
		sb.append("	   tenantId: ").append(toIndentedString(tenantId)).append("\n");
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
