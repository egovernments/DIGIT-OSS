package org.egov.bpa.web.model.landInfo;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import lombok.Data;
import org.egov.bpa.web.model.AuditDetails;
import org.egov.bpa.web.model.Document;
import org.egov.common.contract.request.Role;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

/**
 * OwnerInfo
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-06-23T05:54:07.373Z[GMT]")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class OwnerInfo {
 
	@SafeHtml
	@JsonProperty("tenantId")
	private String tenantId = null;

	@SafeHtml
	@JsonProperty("name")
	private String name = null;

	@SafeHtml
	@JsonProperty("ownerId")
	private String ownerId = null;

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

	@JsonProperty("isPrimaryOwner")
	private Boolean isPrimaryOwner = null;

	@JsonProperty("ownerShipPercentage")
	private BigDecimal ownerShipPercentage = null;

	@SafeHtml
	@JsonProperty("ownerType")
	private String ownerType = null;
	
	@JsonProperty("status")
	private Boolean status = null;

	@SafeHtml
	@JsonProperty("institutionId")
	private String institutionId = null;

	@JsonProperty("documents")
	@Valid
	private List<Document> documents = null;

	@JsonProperty("relationship")
	private Relationship relationship = null;

	@JsonProperty("additionalDetails")
	private Object additionalDetails = null;
	
	@JsonProperty("id")
    private Long id;
	 
    @Size(max=64)
	@SafeHtml
    @JsonProperty("uuid")
    private String uuid;

    @Size(max=64)
	@SafeHtml
    @JsonProperty("userName")
    private String userName;

    @Size(max=64)
	@SafeHtml
    @JsonProperty("password")
    private String password;

	@SafeHtml
    @JsonProperty("salutation")
    private String salutation;

    @Size(max=128)
	@SafeHtml
    @JsonProperty("emailId")
    private String emailId;

    @Size(max=50)
	@SafeHtml
    @JsonProperty("altContactNumber")
    private String altContactNumber;

    @Size(max=10)
	@SafeHtml
    @JsonProperty("pan")
    private String pan;

    @Pattern(regexp = "^[0-9]{12}$", message = "AdharNumber should be 12 digit number")
	@SafeHtml
    @JsonProperty("aadhaarNumber")
    private String aadhaarNumber;

    @Size(max=300)
	@SafeHtml
    @JsonProperty("permanentAddress")
    private String permanentAddress;

    @Size(max=300)
	@SafeHtml
    @JsonProperty("permanentCity")
    private String permanentCity;

    @Size(max=10)
	@SafeHtml
    @JsonProperty("permanentPinCode")
    private String permanentPincode;

    @Size(max=300)
	@SafeHtml
    @JsonProperty("correspondenceCity")
    private String correspondenceCity;

    @Size(max=10)
	@SafeHtml
    @JsonProperty("correspondencePinCode")
    private String correspondencePincode;

    @JsonProperty("active")
    private Boolean active;

    @JsonProperty("dob")
    private Long dob;

    @JsonProperty("pwdExpiryDate")
    private Long pwdExpiryDate;

    @Size(max=16)
	@SafeHtml
    @JsonProperty("locale")
    private String locale;

    @Size(max=50)
	@SafeHtml
    @JsonProperty("type")
    private String type;

	@SafeHtml
    @JsonProperty("signature")
    private String signature;

    @JsonProperty("accountLocked")
    private Boolean accountLocked;

    @JsonProperty("roles")
    @Valid
    private List<Role> roles;

    @Size(max=32)
	@SafeHtml
    @JsonProperty("bloodGroup")
    private String bloodGroup;

	@SafeHtml
    @JsonProperty("identificationMark")
    private String identificationMark;

	@SafeHtml
	@JsonProperty("photo")
    private String photo;

    @Size(max=64)
    @JsonProperty("createdBy")
    private String createdBy;

    @JsonProperty("createdDate")
    private Long createdDate;

    @Size(max=64)
    @JsonProperty("lastModifiedBy")
    private String lastModifiedBy;

    @JsonProperty("lastModifiedDate")
    private Long lastModifiedDate;

	@SafeHtml
    @JsonProperty("otpReference")
    private String otpReference;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails;


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

	/**
	 * Populates Owner fields from the given User object
	 * 
	 * @param user
	 *            User object obtained from user service
	 */
	public void addUserWithoutAuditDetail(OwnerInfo user) {
		this.setUuid(user.getUuid());
		this.setId(user.getId());
		this.setUserName(user.getUserName());
		this.setPassword(user.getPassword());
		this.setSalutation(user.getSalutation());
		this.setName(user.getName());
		this.setGender(user.getGender());
		this.setMobileNumber(user.getMobileNumber());
		this.setEmailId(user.getEmailId());
		this.setAltContactNumber(user.getAltContactNumber());
		this.setPan(user.getPan());
		this.setAadhaarNumber(user.getAadhaarNumber());
		this.setPermanentAddress(user.getPermanentAddress());
		this.setPermanentCity(user.getPermanentCity());
		this.setPermanentPincode(user.getPermanentPincode());
		this.setCorrespondenceAddress(user.getCorrespondenceAddress());
		this.setCorrespondenceCity(user.getCorrespondenceCity());
		this.setCorrespondencePincode(user.getCorrespondencePincode());
		this.setActive(user.getActive());
		this.setDob(user.getDob());
		this.setPwdExpiryDate(user.getPwdExpiryDate());
		this.setLocale(user.getLocale());
		this.setType(user.getType());
		this.setAccountLocked(user.getAccountLocked());
		this.setRoles(user.getRoles());
		this.setFatherOrHusbandName(user.getFatherOrHusbandName());
		this.setBloodGroup(user.getBloodGroup());
		this.setIdentificationMark(user.getIdentificationMark());
		this.setPhoto(user.getPhoto());
		this.setTenantId(user.getTenantId());
	}

	/**
	 * Populates Owner fields from the given User object
	 * 
	 * @param user
	 *            User object obtained from user service
	 */
	public void addUserDetail(OwnerInfo user) {
		this.setUserName(user.getUserName());
		this.setPassword(user.getPassword());
		this.setTenantId(user.getTenantId());
	}

	public OwnerInfo(OwnerInfo user) {
		this.setTenantId(user.getTenantId());
		this.setUserName(user.getUserName());
		this.setName(user.getName());
		this.setMobileNumber(user.getMobileNumber());
		this.setUuid(user.getUuid());
	}

	public void addCitizenDetail(OwnerInfo user) {
		this.setTenantId(user.getTenantId());
		this.setUserName(user.getUserName());
		this.setUuid(user.getUuid());
	}

	/*@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (!super.equals(obj))
			return false;
		if (getClass() != obj.getClass())
			return false;
		
		return true;
	}*/

	/*@Builder
	public OwnerInfo(Long id, String uuid, String userName, String password, String salutation, String name,
			String gender, String mobileNumber, String emailId, String altContactNumber, String pan,
			String aadhaarNumber, String permanentAddress, String permanentCity, String permanentPincode,
			String correspondenceCity, String correspondencePincode, String correspondenceAddress, Boolean active,
			Long dob, Long pwdExpiryDate, String locale, String type, String signature, Boolean accountLocked,
			List<Role> roles, String fatherOrHusbandName, String bloodGroup, String identificationMark, String photo,
			String createdBy, Long createdDate, String lastModifiedBy, Long lastModifiedDate, String otpReference,
			String tenantId, String ownerId, Boolean isPrimaryOwner, BigDecimal ownerShipPercentage, String ownerType,
			String institutionId, Relationship relationship, Object additionalDetails, AuditDetails auditDetails) {
		super(id, uuid, userName, password, salutation, name, gender, mobileNumber, emailId, altContactNumber, pan,
				aadhaarNumber, permanentAddress, permanentCity, permanentPincode, correspondenceCity,
				correspondencePincode, correspondenceAddress, active, dob, pwdExpiryDate, locale, type, signature,
				accountLocked, roles, fatherOrHusbandName, bloodGroup, identificationMark, photo, createdBy,
				createdDate, lastModifiedBy, lastModifiedDate, otpReference, tenantId);
		this.ownerId = ownerId;
		this.isPrimaryOwner = isPrimaryOwner;
		this.ownerShipPercentage = ownerShipPercentage;
		this.ownerType = ownerType;
		this.institutionId = institutionId;
		this.relationship = relationship;
		this.additionalDetails = additionalDetails;
//		this.auditDetails = auditDetails;
	}*/
	
	 public org.egov.common.contract.request.User toCommonUser(){
         org.egov.common.contract.request.User commonUser = new org.egov.common.contract.request.User();
         commonUser.setId(this.getId());
         commonUser.setUserName(this.getUserName());
         commonUser.setName(this.getName());
         commonUser.setType(this.getType());
         commonUser.setMobileNumber(this.getMobileNumber());
         commonUser.setEmailId(this.getEmailId());
//         commonUser.setRoles((List<org.egov.common.contract.request.Role>)this.getRoles());
         commonUser.setTenantId(this.getTenantId());
         commonUser.setUuid(this.getUuid());
         return commonUser;
 }
}
