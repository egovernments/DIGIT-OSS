package org.egov.waterconnection.web.models;

import java.util.Objects;

import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import io.swagger.annotations.ApiModelProperty;

/**
 * PlumberInfo
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-01-22T12:39:45.543+05:30[Asia/Kolkata]")
public class PlumberInfo {
	@SafeHtml
	@JsonProperty("id")
	private String id = null;

	@SafeHtml
	@JsonProperty("name")
	private String name = null;

	@SafeHtml
	@JsonProperty("licenseNo")
	private String licenseNo = null;

	@SafeHtml
	@JsonProperty("mobileNumber")
	private String mobileNumber = null;

	@SafeHtml
	@JsonProperty("gender")
	private String gender = null;

	@SafeHtml
	@JsonProperty("fatherOrHusbandName")
	private String fatherOrHusbandName = null;

	@SafeHtml
	@JsonProperty("correspondenceAddress")
	private String correspondenceAddress = null;

	/**
	 * The relationship of gaurdian.
	 */
	public enum RelationshipEnum {
		FATHER("FATHER"),

		HUSBAND("HUSBAND");

		private String value;

		RelationshipEnum(String value) {
			this.value = value;
		}

		@Override
		@JsonValue
		public String toString() {
			return String.valueOf(value);
		}

		@JsonCreator
		public static RelationshipEnum fromValue(String text) {
			for (RelationshipEnum b : RelationshipEnum.values()) {
				if (String.valueOf(b.value).equals(text)) {
					return b;
				}
			}
			return null;
		}
	}

	@SafeHtml
	@JsonProperty("relationship")
	private String relationship = null;

	@JsonProperty("additionalDetails")
	private Object additionalDetails = null;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails = null;

	public PlumberInfo name(String name) {
		this.name = name;
		return this;
	}

	/**
	 * The name of the user.
	 * 
	 * @return name
	 **/
	@ApiModelProperty(value = "The name of the user.")

	@Size(max = 256)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public PlumberInfo licenseNo(String licenseNo) {
		this.licenseNo = licenseNo;
		return this;
	}

	/**
	 * Plumber unique license number.
	 * 
	 * @return licenseNo
	 **/
	@ApiModelProperty(value = "Plumber unique license number.")

	@Size(max = 256)
	public String getLicenseNo() {
		return licenseNo;
	}

	public void setLicenseNo(String licenseNo) {
		this.licenseNo = licenseNo;
	}

	public PlumberInfo mobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
		return this;
	}

	/**
	 * MobileNumber of the user.
	 * 
	 * @return mobileNumber
	 **/
	@ApiModelProperty(value = "MobileNumber of the user.")

	@Size(max = 256)
	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public PlumberInfo gender(String gender) {
		this.gender = gender;
		return this;
	}

	/**
	 * Gender of the user.
	 * 
	 * @return gender
	 **/
	@ApiModelProperty(value = "Gender of the user.")

	@Size(max = 256)
	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public PlumberInfo fatherOrHusbandName(String fatherOrHusbandName) {
		this.fatherOrHusbandName = fatherOrHusbandName;
		return this;
	}

	/**
	 * Father or Husband name of the user.
	 * 
	 * @return fatherOrHusbandName
	 **/
	@ApiModelProperty(value = "Father or Husband name of the user.")

	@Size(max = 256)
	public String getFatherOrHusbandName() {
		return fatherOrHusbandName;
	}

	public void setFatherOrHusbandName(String fatherOrHusbandName) {
		this.fatherOrHusbandName = fatherOrHusbandName;
	}

	public PlumberInfo correspondenceAddress(String correspondenceAddress) {
		this.correspondenceAddress = correspondenceAddress;
		return this;
	}

	/**
	 * The current address of the owner for correspondence.
	 * 
	 * @return correspondenceAddress
	 **/
	@ApiModelProperty(value = "The current address of the owner for correspondence.")

	@Size(max = 1024)
	public String getCorrespondenceAddress() {
		return correspondenceAddress;
	}

	public void setCorrespondenceAddress(String correspondenceAddress) {
		this.correspondenceAddress = correspondenceAddress;
	}

	public PlumberInfo relationship(String relationship) {
		this.relationship = relationship;
		return this;
	}

	/**
	 * The relationship of gaurdian.
	 * 
	 * @return relationship
	 **/
	@ApiModelProperty(value = "The relationship of gaurdian.")

	public String getRelationship() {
		return relationship;
	}

	public void setRelationship(String relationship) {
		this.relationship = relationship;
	}

	public PlumberInfo additionalDetails(Object additionalDetails) {
		this.additionalDetails = additionalDetails;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public Object getAdditionalDetails() {
		return additionalDetails;
	}

	public void setAdditionalDetails(Object additionalDetails) {
		this.additionalDetails = additionalDetails;
	}

	public PlumberInfo id(String id) {
		this.id = id;
		return this;
	}

	/**
	 * The id of the user.
	 * 
	 * @return name
	 **/
	@ApiModelProperty(value = "The id of the user.")

	@Size(max = 256)
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public PlumberInfo auditDetails(AuditDetails auditDetails) {
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

	@Override
	public boolean equals(java.lang.Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		PlumberInfo plumberInfo = (PlumberInfo) o;
		return Objects.equals(this.id, plumberInfo.id) && Objects.equals(this.name, plumberInfo.name)
				&& Objects.equals(this.licenseNo, plumberInfo.licenseNo)
				&& Objects.equals(this.mobileNumber, plumberInfo.mobileNumber)
				&& Objects.equals(this.gender, plumberInfo.gender)
				&& Objects.equals(this.fatherOrHusbandName, plumberInfo.fatherOrHusbandName)
				&& Objects.equals(this.correspondenceAddress, plumberInfo.correspondenceAddress)
				&& Objects.equals(this.relationship, plumberInfo.relationship)
				&& Objects.equals(this.additionalDetails, plumberInfo.additionalDetails);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, name, licenseNo, mobileNumber, gender, fatherOrHusbandName, correspondenceAddress,
				relationship, additionalDetails);
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("class PlumberInfo {\n");
		sb.append("    id: ").append(toIndentedString(id)).append("\n");
		sb.append("    name: ").append(toIndentedString(name)).append("\n");
		sb.append("    licenseNo: ").append(toIndentedString(licenseNo)).append("\n");
		sb.append("    mobileNumber: ").append(toIndentedString(mobileNumber)).append("\n");
		sb.append("    gender: ").append(toIndentedString(gender)).append("\n");
		sb.append("    fatherOrHusbandName: ").append(toIndentedString(fatherOrHusbandName)).append("\n");
		sb.append("    correspondenceAddress: ").append(toIndentedString(correspondenceAddress)).append("\n");
		sb.append("    relationship: ").append(toIndentedString(relationship)).append("\n");
		sb.append("    additionalDetails: ").append(toIndentedString(additionalDetails)).append("\n");
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
