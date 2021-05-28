package org.egov.infra.microservice.contract;

import java.util.Date;
import java.util.List;

import org.hibernate.validator.constraints.SafeHtml;

import com.fasterxml.jackson.annotation.JsonFormat;

public class UserSearchResponseContent {

    private Long id;
    @SafeHtml
    private String userName;
    @SafeHtml
    private String salutation;
    @SafeHtml
    private String name;
    @SafeHtml
    private String gender;
    @SafeHtml
    private String mobileNumber;
    @SafeHtml
    private String emailId;
    @SafeHtml
    private String altContactNumber;
    @SafeHtml
    private String pan;
    @SafeHtml
    private String aadhaarNumber;
    @SafeHtml
    private String permanentAddress;
    @SafeHtml
    private String permanentCity;
    @SafeHtml
    private String permanentPinCode;
    @SafeHtml
    private String correspondenceAddress;
    @SafeHtml
    private String correspondenceCity;
    @SafeHtml
    private String correspondencePinCode;
    private Boolean active;
    @SafeHtml
    private String locale;
    @SafeHtml
    private String type;
    private Boolean accountLocked;
    @SafeHtml
    private String fatherOrHusbandName;
    @SafeHtml
    private String signature;
    @SafeHtml
    private String bloodGroup;
    @SafeHtml
    private String photo;
    @SafeHtml
    private String identificationMark;
    private Long createdBy;
    private Long lastModifiedBy;
    @SafeHtml
    private String tenantId;
    private List<RoleRequest> roles;
    @SafeHtml
    private String uuid;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private Date createdDate;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private Date lastModifiedDate;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date dob;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private Date pwdExpiryDate;

    public UserSearchResponseContent() {
    }

    public UserSearchResponseContent(Long id, String userName, String salutation, String name, String gender,
            String mobileNumber, String emailId, String altContactNumber, String pan, String aadhaarNumber,
            String permanentAddress, String permanentCity, String permanentPinCode, String correspondenceAddress,
            String correspondenceCity, String correspondencePinCode, Boolean active, String locale, String type,
            Boolean accountLocked, String fatherOrHusbandName, String signature, String bloodGroup, String photo,
            String identificationMark, Long createdBy, Long lastModifiedBy, String tenantId, List<RoleRequest> roles,
            String uuid, Date createdDate, Date lastModifiedDate, Date dob, Date pwdExpiryDate) {
        this.id = id;
        this.userName = userName;
        this.salutation = salutation;
        this.name = name;
        this.gender = gender;
        this.mobileNumber = mobileNumber;
        this.emailId = emailId;
        this.altContactNumber = altContactNumber;
        this.pan = pan;
        this.aadhaarNumber = aadhaarNumber;
        this.permanentAddress = permanentAddress;
        this.permanentCity = permanentCity;
        this.permanentPinCode = permanentPinCode;
        this.correspondenceAddress = correspondenceAddress;
        this.correspondenceCity = correspondenceCity;
        this.correspondencePinCode = correspondencePinCode;
        this.active = active;
        this.locale = locale;
        this.type = type;
        this.accountLocked = accountLocked;
        this.fatherOrHusbandName = fatherOrHusbandName;
        this.signature = signature;
        this.bloodGroup = bloodGroup;
        this.photo = photo;
        this.identificationMark = identificationMark;
        this.createdBy = createdBy;
        this.lastModifiedBy = lastModifiedBy;
        this.tenantId = tenantId;
        this.roles = roles;
        this.uuid = uuid;
        this.createdDate = createdDate;
        this.lastModifiedDate = lastModifiedDate;
        this.dob = dob;
        this.pwdExpiryDate = pwdExpiryDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getSalutation() {
        return salutation;
    }

    public void setSalutation(String salutation) {
        this.salutation = salutation;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getAltContactNumber() {
        return altContactNumber;
    }

    public void setAltContactNumber(String altContactNumber) {
        this.altContactNumber = altContactNumber;
    }

    public String getPan() {
        return pan;
    }

    public void setPan(String pan) {
        this.pan = pan;
    }

    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public void setAadhaarNumber(String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
    }

    public String getPermanentAddress() {
        return permanentAddress;
    }

    public void setPermanentAddress(String permanentAddress) {
        this.permanentAddress = permanentAddress;
    }

    public String getPermanentCity() {
        return permanentCity;
    }

    public void setPermanentCity(String permanentCity) {
        this.permanentCity = permanentCity;
    }

    public String getPermanentPinCode() {
        return permanentPinCode;
    }

    public void setPermanentPinCode(String permanentPinCode) {
        this.permanentPinCode = permanentPinCode;
    }

    public String getCorrespondenceAddress() {
        return correspondenceAddress;
    }

    public void setCorrespondenceAddress(String correspondenceAddress) {
        this.correspondenceAddress = correspondenceAddress;
    }

    public String getCorrespondenceCity() {
        return correspondenceCity;
    }

    public void setCorrespondenceCity(String correspondenceCity) {
        this.correspondenceCity = correspondenceCity;
    }

    public String getCorrespondencePinCode() {
        return correspondencePinCode;
    }

    public void setCorrespondencePinCode(String correspondencePinCode) {
        this.correspondencePinCode = correspondencePinCode;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getLocale() {
        return locale;
    }

    public void setLocale(String locale) {
        this.locale = locale;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getAccountLocked() {
        return accountLocked;
    }

    public void setAccountLocked(Boolean accountLocked) {
        this.accountLocked = accountLocked;
    }

    public String getFatherOrHusbandName() {
        return fatherOrHusbandName;
    }

    public void setFatherOrHusbandName(String fatherOrHusbandName) {
        this.fatherOrHusbandName = fatherOrHusbandName;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getIdentificationMark() {
        return identificationMark;
    }

    public void setIdentificationMark(String identificationMark) {
        this.identificationMark = identificationMark;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Long getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(Long lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public List<RoleRequest> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleRequest> roles) {
        this.roles = roles;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(Date lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public Date getPwdExpiryDate() {
        return pwdExpiryDate;
    }

    public void setPwdExpiryDate(Date pwdExpiryDate) {
        this.pwdExpiryDate = pwdExpiryDate;
    }

}
