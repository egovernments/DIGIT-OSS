package org.egov.noc.web.model.bpa;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import lombok.Data;
import org.egov.common.contract.request.Role;
import org.egov.noc.web.model.AuditDetails;
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
	
	@JsonProperty("status")
	private Boolean status = null;

	@JsonProperty("ownerShipPercentage")
	private BigDecimal ownerShipPercentage = null;

	@SafeHtml
	@JsonProperty("ownerType")
	private String ownerType = null;

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


	
	public OwnerInfo tenantId(String tenantId) {
		this.tenantId = tenantId;
		return this;
	}

	/**
	 * The name of the owner.
	 * 
	 * @return name
	 **/
	@ApiModelProperty(value = "The name of the owner.")
	

	@Size(max = 256)
	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}
	
	public OwnerInfo name(String name) {
		this.name = name;
		return this;
	}

	/**
	 * The name of the owner.
	 * 
	 * @return name
	 **/
	@ApiModelProperty(required = true, value = "The name of the owner.")
	@NotNull

	@Size(max = 256)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public OwnerInfo ownerId(String ownerId) {
		this.ownerId = ownerId;
		return this;
	}

	/**
	 * MobileNumber of the owner.
	 * 
	 * @return mobileNumber
	 **/
	@ApiModelProperty(value = "MobileNumber of the owner.")
	

	@Size(max = 256)
	public String getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
	}

	public OwnerInfo mobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
		return this;
	}

	/**
	 * MobileNumber of the owner.
	 * 
	 * @return mobileNumber
	 **/
	@ApiModelProperty(required = true, value = "MobileNumber of the owner.")
	@NotNull

	@Size(max = 256)
	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public OwnerInfo gender(String gender) {
		this.gender = gender;
		return this;
	}

	/**
	 * Gender of the owner.
	 * 
	 * @return gender
	 **/
	@ApiModelProperty(required = true, value = "Gender of the owner.")
	@NotNull

	@Size(max = 256)
	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public OwnerInfo fatherOrHusbandName(String fatherOrHusbandName) {
		this.fatherOrHusbandName = fatherOrHusbandName;
		return this;
	}

	/**
	 * Father or Husband name of the owner.
	 * 
	 * @return fatherOrHusbandName
	 **/
	@ApiModelProperty(required = true, value = "Father or Husband name of the owner.")
	@NotNull

	@Size(max = 256)
	public String getFatherOrHusbandName() {
		return fatherOrHusbandName;
	}

	public void setFatherOrHusbandName(String fatherOrHusbandName) {
		this.fatherOrHusbandName = fatherOrHusbandName;
	}

	public OwnerInfo correspondenceAddress(String correspondenceAddress) {
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

	public OwnerInfo isPrimaryOwner(Boolean isPrimaryOwner) {
		this.isPrimaryOwner = isPrimaryOwner;
		return this;
	}

	/**
	 * The owner is primary or not
	 * 
	 * @return isPrimaryOwner
	 **/
	@ApiModelProperty(value = "The owner is primary or not")

	public Boolean isIsPrimaryOwner() {
		return isPrimaryOwner;
	}

	public void setIsPrimaryOwner(Boolean isPrimaryOwner) {
		this.isPrimaryOwner = isPrimaryOwner;
	}

	public OwnerInfo ownerShipPercentage(BigDecimal ownerShipPercentage) {
		this.ownerShipPercentage = ownerShipPercentage;
		return this;
	}

	/**
	 * Ownership percentage.
	 * 
	 * @return ownerShipPercentage
	 **/
	@ApiModelProperty(value = "Ownership percentage.")

	@Valid
	public BigDecimal getOwnerShipPercentage() {
		return ownerShipPercentage;
	}

	public void setOwnerShipPercentage(BigDecimal ownerShipPercentage) {
		this.ownerShipPercentage = ownerShipPercentage;
	}

	public OwnerInfo ownerType(String ownerType) {
		this.ownerType = ownerType;
		return this;
	}

	/**
	 * Type of owner, based on this option Exemptions will be applied. This is
	 * master data defined in mdms.
	 * 
	 * @return ownerType
	 **/
	@ApiModelProperty(value = "Type of owner, based on this option Exemptions will be applied. This is master data defined in mdms.")

	@Size(max = 256)
	public String getOwnerType() {
		return ownerType;
	}

	public void setOwnerType(String ownerType) {
		this.ownerType = ownerType;
	}

	public OwnerInfo institutionId(String institutionId) {
		this.institutionId = institutionId;
		return this;
	}

	/**
	 * The id of the institution if the owner is the authorized person for one
	 * 
	 * @return institutionId
	 **/
	@ApiModelProperty(value = "The id of the institution if the owner is the authorized person for one")

	@Size(max = 64)
	public String getInstitutionId() {
		return institutionId;
	}

	public void setInstitutionId(String institutionId) {
		this.institutionId = institutionId;
	}

	public OwnerInfo documents(List<Document> documents) {
		this.documents = documents;
		return this;
	}

	public OwnerInfo addDocumentsItem(Document documentsItem) {
		if (this.documents == null) {
			this.documents = new ArrayList<Document>();
		}
		this.documents.add(documentsItem);
		return this;
	}

	/**
	 * The documents attached by owner for exemption.
	 * 
	 * @return documents
	 **/
	@ApiModelProperty(value = "The documents attached by owner for exemption.")
	@Valid
	public List<Document> getDocuments() {
		return documents;
	}

	public void setDocuments(List<Document> documents) {
		this.documents = documents;
	}

	public OwnerInfo relationship(Relationship relationship) {
		this.relationship = relationship;
		return this;
	}

	/**
	 * Get relationship
	 * 
	 * @return relationship
	 **/
	@ApiModelProperty(value = "")

	@Valid
	public Relationship getRelationship() {
		return relationship;
	}

	public void setRelationship(Relationship relationship) {
		this.relationship = relationship;
	}

	public OwnerInfo additionalDetails(Object additionalDetails) {
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
	public OwnerInfo id(Long id) {
		this.id = id;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	public OwnerInfo uuid(String uuid) {
		this.uuid = uuid;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	public OwnerInfo userName(String userName) {
		this.userName = userName;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}
	
	public OwnerInfo password(String password) {
		this.password = password;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	public OwnerInfo salutation(String salutation) {
		this.salutation = salutation;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getSalutation() {
		return salutation;
	}

	public void setSalutation(String salutation) {
		this.salutation = salutation;
	}
	
	public OwnerInfo emailId(String emailId) {
		this.emailId = emailId;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}


	public OwnerInfo altContactNumber(String altContactNumber) {
		this.altContactNumber = altContactNumber;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getAltContactNumber() {
		return altContactNumber;
	}

	public void setAltContactNumber(String altContactNumber) {
		this.altContactNumber = altContactNumber;
	}


	public OwnerInfo pan(String pan) {
		this.pan = pan;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getPan() {
		return pan;
	}

	public void setPan(String pan) {
		this.pan = pan;
	}


	public OwnerInfo aadhaarNumber(String aadhaarNumber) {
		this.aadhaarNumber = aadhaarNumber;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getAadhaarNumber() {
		return aadhaarNumber;
	}

	public void setAadhaarNumber(String aadhaarNumber) {
		this.aadhaarNumber = aadhaarNumber;
	}

	public OwnerInfo permanentAddress(String permanentAddress) {
		this.permanentAddress = permanentAddress;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getPermanentAddress() {
		return permanentAddress;
	}

	public void setPermanentAddress(String permanentAddress) {
		this.permanentAddress = permanentAddress;
	}

	public OwnerInfo permanentCity(String permanentCity) {
		this.permanentCity = permanentCity;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getPermanentCity() {
		return permanentCity;
	}

	public void setPermanentCity(String permanentCity) {
		this.permanentCity = permanentCity;
	}

	public OwnerInfo permanentPincode(String permanentPincode) {
		this.permanentPincode = permanentPincode;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getPermanentPincode() {
		return permanentPincode;
	}

	public void setPermanentPincode(String permanentPincode) {
		this.permanentPincode = permanentPincode;
	}

	public OwnerInfo correspondenceCity(String correspondenceCity) {
		this.correspondenceCity = correspondenceCity;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getCorrespondenceCity() {
		return correspondenceCity;
	}

	public void setCorrespondenceCity(String correspondenceCity) {
		this.correspondenceCity = correspondenceCity;
	}
	
	public OwnerInfo correspondencePincode(String correspondencePincode) {
		this.correspondencePincode = correspondencePincode;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getCorrespondencePincode() {
		return correspondencePincode;
	}
	public void setCorrespondencePincode(String correspondencePincode) {
		this.correspondencePincode = correspondencePincode;
	}
	
	public OwnerInfo active(Boolean active) {
		this.active = active;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}
	
	public OwnerInfo dob(Long dob) {
		this.dob = dob;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public Long getDob() {
		return dob;
	}

	public void setDob(Long dob) {
		this.dob = dob;
	}
	
	
	public OwnerInfo pwdExpiryDate(Long pwdExpiryDate) {
		this.pwdExpiryDate = pwdExpiryDate;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public Long getPwdExpiryDate() {
		return pwdExpiryDate;
	}

	public void setPwdExpiryDate(Long pwdExpiryDate) {
		this.pwdExpiryDate = pwdExpiryDate;
	}
	
	
	public OwnerInfo locale(String locale) {
		this.locale = locale;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getLocale() {
		return locale;
	}

	public void setLocale(String locale) {
		this.locale = locale;
	}
	
	
	public OwnerInfo type(String type) {
		this.type = type;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}


	public OwnerInfo signature(String signature) {
		this.signature = signature;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getsignature() {
		return signature;
	}

	public void setSignature(String signature) {
		this.signature = signature;
	}


	public OwnerInfo accountLocked(Boolean accountLocked) {
		this.accountLocked = accountLocked;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public Boolean getAccountLocked() {
		return accountLocked;
	}

	public void setAccountLocked(Boolean accountLocked) {
		this.accountLocked = accountLocked;
	}


	public OwnerInfo roles(@Valid List<Role> roles) {
		this.roles = roles;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public @Valid List<Role> getRoles() {
		return roles;
	}

	public void setRoles(@Valid List<Role> roles) {
		this.roles = roles;
	}


	public OwnerInfo bloodGroup(String bloodGroup) {
		this.bloodGroup = bloodGroup;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getBloodGroup() {
		return bloodGroup;
	}

	public void setBloodGroup(String bloodGroup) {
		this.bloodGroup = bloodGroup;
	}
	

	public OwnerInfo identificationMark(String identificationMark) {
		this.identificationMark = identificationMark;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getIdentificationMark() {
		return identificationMark;
	}

	public void setIdentificationMark(String identificationMark) {
		this.identificationMark = identificationMark;
	}
	

	public OwnerInfo photo(String photo) {
		this.photo = photo;
		return this;
	}

	/**
	 * Json object to capture any extra information which is not accommodated of
	 * model
	 * 
	 * @return additionalDetails
	 **/
	@ApiModelProperty(value = "Json object to capture any extra information which is not accommodated of model")

	public String getPhoto() {
		return photo;
	}

	public void setPhoto(String photo) {
		this.photo = photo;
	}


	public OwnerInfo auditDetails(AuditDetails auditDetails) {
		this.auditDetails = auditDetails;
		return this;
	}

	/**
	 * Get relationship
	 * 
	 * @return relationship
	 **/
	@ApiModelProperty(value = "")
	

	@Valid
	public AuditDetails getAuditDetails() {
		return auditDetails;
	}

	public void setAuditDetails(AuditDetails auditDetails) {
		this.auditDetails = auditDetails;
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

	public Boolean getStatus() {
		return status;
	}

	public void setStatus(Boolean status) {
		this.status = status;
	}
}
