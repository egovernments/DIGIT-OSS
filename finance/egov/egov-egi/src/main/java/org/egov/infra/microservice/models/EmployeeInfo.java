package org.egov.infra.microservice.models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Size;

import org.egov.infra.persistence.entity.enums.Gender;
import org.egov.infra.persistence.entity.enums.UserType;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

public class EmployeeInfo {
	
	 private Long id;

	    @Size(min = 1, max = 256)
	    private String code;

	    @Size(max = 5)
	    private String salutation;

	    @Size(min = 3, max = 100)
	    private String name;

	    @Size(min = 1, max = 64)
	    private String userName;

	    private Gender gender;

	    private String maritalStatus;

	    private String bloodGroup;

	    private String permanentAddress;

	    private String permanentCity;

	    private String permanentPinCode;

	    private String correspondenceAddress;

	    private String correspondenceCity;

	    private String correspondencePinCode;

	    private String guardian;

	    @Size(max = 10)
	    private String mobileNumber;

	    @Size(max = 10)
	    private String altContactNumber;

	    @Size(min = 5, max = 128)
	    private String emailId;

	    @Size(max = 10)
	    private String pan;

	    @Size(max = 12)
	    private String aadhaarNumber;

	    @Size(max=36)
	    private String photo;

	    @Size(max=36)
	    private String signature;

	    @Size(max = 200)
	    private String placeOfBirth;

	    private Boolean active;

	    @Valid
	    private UserType type = UserType.EMPLOYEE;

	    private List<Long> languagesKnown = new ArrayList<>();

	    private Long employeeStatus;

	    private Long employeeType;

	    private Long group;

	    private Long motherTongue;

	    private String identificationMark;

	    private String passportNo;

	    private String gpfNo;

	    private Long recruitmentMode;

	    private Long recruitmentType;

	    private Long recruitmentQuota;

	    @Valid
	    private List<Assignment> assignments = new ArrayList<Assignment>();

	    private List<Long> jurisdictions = new ArrayList<Long>();

	    private Long bank;

	    private Long bankBranch;

	    @DateTimeFormat(pattern = "dd/MM/yyyy")
	    @JsonFormat(pattern = "dd/MM/yyyy")
	    private Date dateOfRetirement;

	    @DateTimeFormat(pattern = "dd/MM/yyyy")
	    @JsonFormat(pattern = "dd/MM/yyyy")
	    private Date dateOfAppointment;

	    @DateTimeFormat(pattern = "dd/MM/yyyy")
	    @JsonFormat(pattern = "dd/MM/yyyy")
	    private Date dateOfJoining;

	    private String dob;

	    @Max(100)
	    private Short retirementAge;

	    @DateTimeFormat(pattern = "dd/MM/yyyy")
	    @JsonFormat(pattern = "dd/MM/yyyy")
	    private Date dateOfResignation;

	    @DateTimeFormat(pattern = "dd/MM/yyyy")
	    @JsonFormat(pattern = "dd/MM/yyyy")
	    private Date dateOfTermination;

	    @Size(max = 20)
	    private String bankAccount;

	    @Size(max = 20)
	    private String ifscCode;

	    private List<String> documents = new ArrayList<String>();

	    private String tenantId;

	    public EmployeeInfo(){}

		public EmployeeInfo(Long id, String code, String salutation, String name, String userName, Gender gender,
				String maritalStatus, String bloodGroup, String permanentAddress, String permanentCity,
				String permanentPinCode, String correspondenceAddress, String correspondenceCity,
				String correspondencePinCode, String guardian, String mobileNumber, String altContactNumber,
				String emailId, String pan, String aadhaarNumber, String photo, String signature, String placeOfBirth,
				Boolean active, UserType type, List<Long> languagesKnown, Long employeeStatus, Long employeeType,
				Long group, Long motherTongue, String identificationMark, String passportNo, String gpfNo,
				Long recruitmentMode, Long recruitmentType, Long recruitmentQuota, List<Assignment> assignments,
				List<Long> jurisdictions, Long bank, Long bankBranch, Date dateOfRetirement, Date dateOfAppointment,
				Date dateOfJoining, String dob, Short retirementAge, Date dateOfResignation, Date dateOfTermination,
				String bankAccount, String ifscCode, List<String> documents, String tenantId) {
			this.id = id;
			this.code = code;
			this.salutation = salutation;
			this.name = name;
			this.userName = userName;
			this.gender = gender;
			this.maritalStatus = maritalStatus;
			this.bloodGroup = bloodGroup;
			this.permanentAddress = permanentAddress;
			this.permanentCity = permanentCity;
			this.permanentPinCode = permanentPinCode;
			this.correspondenceAddress = correspondenceAddress;
			this.correspondenceCity = correspondenceCity;
			this.correspondencePinCode = correspondencePinCode;
			this.guardian = guardian;
			this.mobileNumber = mobileNumber;
			this.altContactNumber = altContactNumber;
			this.emailId = emailId;
			this.pan = pan;
			this.aadhaarNumber = aadhaarNumber;
			this.photo = photo;
			this.signature = signature;
			this.placeOfBirth = placeOfBirth;
			this.active = active;
			this.type = type;
			this.languagesKnown = languagesKnown;
			this.employeeStatus = employeeStatus;
			this.employeeType = employeeType;
			this.group = group;
			this.motherTongue = motherTongue;
			this.identificationMark = identificationMark;
			this.passportNo = passportNo;
			this.gpfNo = gpfNo;
			this.recruitmentMode = recruitmentMode;
			this.recruitmentType = recruitmentType;
			this.recruitmentQuota = recruitmentQuota;
			this.assignments = assignments;
			this.jurisdictions = jurisdictions;
			this.bank = bank;
			this.bankBranch = bankBranch;
			this.dateOfRetirement = dateOfRetirement;
			this.dateOfAppointment = dateOfAppointment;
			this.dateOfJoining = dateOfJoining;
			this.dob = dob;
			this.retirementAge = retirementAge;
			this.dateOfResignation = dateOfResignation;
			this.dateOfTermination = dateOfTermination;
			this.bankAccount = bankAccount;
			this.ifscCode = ifscCode;
			this.documents = documents;
			this.tenantId = tenantId;
		}

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getCode() {
			return code;
		}

		public void setCode(String code) {
			this.code = code;
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

		public String getUserName() {
			return userName;
		}

		public void setUserName(String userName) {
			this.userName = userName;
		}

		public Gender getGender() {
			return gender;
		}

		public void setGender(Gender gender) {
			this.gender = gender;
		}

		public String getMaritalStatus() {
			return maritalStatus;
		}

		public void setMaritalStatus(String maritalStatus) {
			this.maritalStatus = maritalStatus;
		}

		public String getBloodGroup() {
			return bloodGroup;
		}

		public void setBloodGroup(String bloodGroup) {
			this.bloodGroup = bloodGroup;
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

		public String getGuardian() {
			return guardian;
		}

		public void setGuardian(String guardian) {
			this.guardian = guardian;
		}

		public String getMobileNumber() {
			return mobileNumber;
		}

		public void setMobileNumber(String mobileNumber) {
			this.mobileNumber = mobileNumber;
		}

		public String getAltContactNumber() {
			return altContactNumber;
		}

		public void setAltContactNumber(String altContactNumber) {
			this.altContactNumber = altContactNumber;
		}

		public String getEmailId() {
			return emailId;
		}

		public void setEmailId(String emailId) {
			this.emailId = emailId;
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

		public String getPhoto() {
			return photo;
		}

		public void setPhoto(String photo) {
			this.photo = photo;
		}

		public String getSignature() {
			return signature;
		}

		public void setSignature(String signature) {
			this.signature = signature;
		}

		public String getPlaceOfBirth() {
			return placeOfBirth;
		}

		public void setPlaceOfBirth(String placeOfBirth) {
			this.placeOfBirth = placeOfBirth;
		}

		public Boolean getActive() {
			return active;
		}

		public void setActive(Boolean active) {
			this.active = active;
		}

		public UserType getType() {
			return type;
		}

		public void setType(UserType type) {
			this.type = type;
		}

		public List<Long> getLanguagesKnown() {
			return languagesKnown;
		}

		public void setLanguagesKnown(List<Long> languagesKnown) {
			this.languagesKnown = languagesKnown;
		}

		public Long getEmployeeStatus() {
			return employeeStatus;
		}

		public void setEmployeeStatus(Long employeeStatus) {
			this.employeeStatus = employeeStatus;
		}

		public Long getEmployeeType() {
			return employeeType;
		}

		public void setEmployeeType(Long employeeType) {
			this.employeeType = employeeType;
		}

		public Long getGroup() {
			return group;
		}

		public void setGroup(Long group) {
			this.group = group;
		}

		public Long getMotherTongue() {
			return motherTongue;
		}

		public void setMotherTongue(Long motherTongue) {
			this.motherTongue = motherTongue;
		}

		public String getIdentificationMark() {
			return identificationMark;
		}

		public void setIdentificationMark(String identificationMark) {
			this.identificationMark = identificationMark;
		}

		public String getPassportNo() {
			return passportNo;
		}

		public void setPassportNo(String passportNo) {
			this.passportNo = passportNo;
		}

		public String getGpfNo() {
			return gpfNo;
		}

		public void setGpfNo(String gpfNo) {
			this.gpfNo = gpfNo;
		}

		public Long getRecruitmentMode() {
			return recruitmentMode;
		}

		public void setRecruitmentMode(Long recruitmentMode) {
			this.recruitmentMode = recruitmentMode;
		}

		public Long getRecruitmentType() {
			return recruitmentType;
		}

		public void setRecruitmentType(Long recruitmentType) {
			this.recruitmentType = recruitmentType;
		}

		public Long getRecruitmentQuota() {
			return recruitmentQuota;
		}

		public void setRecruitmentQuota(Long recruitmentQuota) {
			this.recruitmentQuota = recruitmentQuota;
		}

		public List<Assignment> getAssignments() {
			return assignments;
		}

		public void setAssignments(List<Assignment> assignments) {
			this.assignments = assignments;
		}

		public List<Long> getJurisdictions() {
			return jurisdictions;
		}

		public void setJurisdictions(List<Long> jurisdictions) {
			this.jurisdictions = jurisdictions;
		}

		public Long getBank() {
			return bank;
		}

		public void setBank(Long bank) {
			this.bank = bank;
		}

		public Long getBankBranch() {
			return bankBranch;
		}

		public void setBankBranch(Long bankBranch) {
			this.bankBranch = bankBranch;
		}

		public Date getDateOfRetirement() {
			return dateOfRetirement;
		}

		public void setDateOfRetirement(Date dateOfRetirement) {
			this.dateOfRetirement = dateOfRetirement;
		}

		public Date getDateOfAppointment() {
			return dateOfAppointment;
		}

		public void setDateOfAppointment(Date dateOfAppointment) {
			this.dateOfAppointment = dateOfAppointment;
		}

		public Date getDateOfJoining() {
			return dateOfJoining;
		}

		public void setDateOfJoining(Date dateOfJoining) {
			this.dateOfJoining = dateOfJoining;
		}

		public String getDob() {
			return dob;
		}

		public void setDob(String dob) {
			this.dob = dob;
		}

		public Short getRetirementAge() {
			return retirementAge;
		}

		public void setRetirementAge(Short retirementAge) {
			this.retirementAge = retirementAge;
		}

		public Date getDateOfResignation() {
			return dateOfResignation;
		}

		public void setDateOfResignation(Date dateOfResignation) {
			this.dateOfResignation = dateOfResignation;
		}

		public Date getDateOfTermination() {
			return dateOfTermination;
		}

		public void setDateOfTermination(Date dateOfTermination) {
			this.dateOfTermination = dateOfTermination;
		}

		public String getBankAccount() {
			return bankAccount;
		}

		public void setBankAccount(String bankAccount) {
			this.bankAccount = bankAccount;
		}

		public String getIfscCode() {
			return ifscCode;
		}

		public void setIfscCode(String ifscCode) {
			this.ifscCode = ifscCode;
		}

		public List<String> getDocuments() {
			return documents;
		}

		public void setDocuments(List<String> documents) {
			this.documents = documents;
		}

		public String getTenantId() {
			return tenantId;
		}

		public void setTenantId(String tenantId) {
			this.tenantId = tenantId;
		}

		@Override
		public String toString() {
			return "EmployeeInfo [id=" + id + ", code=" + code + ", salutation=" + salutation + ", name=" + name
					+ ", userName=" + userName + ", gender=" + gender + ", maritalStatus=" + maritalStatus
					+ ", bloodGroup=" + bloodGroup + ", permanentAddress=" + permanentAddress + ", permanentCity="
					+ permanentCity + ", permanentPinCode=" + permanentPinCode + ", correspondenceAddress="
					+ correspondenceAddress + ", correspondenceCity=" + correspondenceCity + ", correspondencePinCode="
					+ correspondencePinCode + ", guardian=" + guardian + ", mobileNumber=" + mobileNumber
					+ ", altContactNumber=" + altContactNumber + ", emailId=" + emailId + ", pan=" + pan
					+ ", aadhaarNumber=" + aadhaarNumber + ", photo=" + photo + ", signature=" + signature
					+ ", placeOfBirth=" + placeOfBirth + ", active=" + active + ", type=" + type + ", languagesKnown="
					+ languagesKnown + ", employeeStatus=" + employeeStatus + ", employeeType=" + employeeType
					+ ", group=" + group + ", motherTongue=" + motherTongue + ", identificationMark="
					+ identificationMark + ", passportNo=" + passportNo + ", gpfNo=" + gpfNo + ", recruitmentMode="
					+ recruitmentMode + ", recruitmentType=" + recruitmentType + ", recruitmentQuota="
					+ recruitmentQuota + ", assignments=" + assignments + ", jurisdictions=" + jurisdictions + ", bank="
					+ bank + ", bankBranch=" + bankBranch + ", dateOfRetirement=" + dateOfRetirement
					+ ", dateOfAppointment=" + dateOfAppointment + ", dateOfJoining=" + dateOfJoining + ", dob=" + dob
					+ ", retirementAge=" + retirementAge + ", dateOfResignation=" + dateOfResignation
					+ ", dateOfTermination=" + dateOfTermination + ", bankAccount=" + bankAccount + ", ifscCode="
					+ ifscCode + ", documents=" + documents + ", tenantId=" + tenantId + "]";
		}
	    
}
