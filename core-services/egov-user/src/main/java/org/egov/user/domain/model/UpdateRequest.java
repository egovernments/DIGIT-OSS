package org.egov.user.domain.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.egov.user.domain.model.enums.AddressType;
import org.egov.user.domain.model.enums.BloodGroup;
import org.egov.user.domain.model.enums.Gender;
import org.egov.user.domain.model.enums.UserType;
import org.egov.user.web.contract.RoleRequest;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRequest {

    private Long id;
    private String userName;
    private String salutation;
    private String name;
    private String gender;
    private String mobileNumber;
    private String emailId;
    private String altContactNumber;
    private String pan;
    private String aadhaarNumber;
    private String permanentAddress;
    private String permanentCity;
    private String permanentPinCode;
    private String correspondenceAddress;
    private String correspondenceCity;
    private String correspondencePinCode;
    private Boolean active;
    private String locale;
    private UserType type;
    private Boolean accountLocked;
    private Long accountLockedDate;
    private String fatherOrHusbandName;
    private String signature;
    private String bloodGroup;
    private String photo;
    private String identificationMark;
    private Long createdBy;
    private String password;
    private String otpReference;
    private Long lastModifiedBy;
    private String tenantId;

    private Set<RoleRequest> roles;

    private String uuid;


    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private Date createdDate;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private Date lastModifiedDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dob;
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private Date pwdExpiryDate;

    public UpdateRequest(User user) {

        this.id = user.getId();
        this.userName = user.getUsername();
        this.salutation = user.getSalutation();
        this.name = user.getName();
        this.gender = user.getGender() != null ? user.getGender().toString() : null;
        this.mobileNumber = user.getMobileNumber();
        this.emailId = user.getEmailId();
        this.altContactNumber = user.getAltContactNumber();
        this.pan = user.getPan();
        this.aadhaarNumber = user.getAadhaarNumber();
        this.active = user.getActive();
        this.dob = user.getDob();
        this.pwdExpiryDate = user.getPasswordExpiryDate();
        this.locale = user.getLocale();
        this.type = user.getType();
        this.accountLocked = user.getAccountLocked();
        this.accountLockedDate = user.getAccountLockedDate();
        this.signature = user.getSignature();
        this.bloodGroup = user.getBloodGroup() != null ? user.getBloodGroup().getValue() : null;
        this.photo = user.getPhoto();
        this.identificationMark = user.getIdentificationMark();
        this.createdBy = user.getCreatedBy();
        this.createdDate = user.getCreatedDate();
        this.lastModifiedBy = user.getLastModifiedBy();
        this.lastModifiedDate = user.getLastModifiedDate();
        this.tenantId = user.getTenantId();
        this.roles = convertDomainRoleToContract(user.getRoles());
        this.fatherOrHusbandName = user.getGuardian();
        this.uuid = user.getUuid();
        mapPermanentAddress(user);
        mapCorrespondenceAddress(user);
    }

    private void mapCorrespondenceAddress(User user) {
        if (user.getCorrespondenceAddress() != null) {
            this.correspondenceAddress = user.getCorrespondenceAddress().getAddress();
            this.correspondenceCity = user.getCorrespondenceAddress().getCity();
            this.correspondencePinCode = user.getCorrespondenceAddress().getPinCode();
        }
    }

    private void mapPermanentAddress(User user) {
        if (user.getPermanentAddress() != null) {
            this.permanentAddress = user.getPermanentAddress().getAddress();
            this.permanentCity = user.getPermanentAddress().getCity();
            this.permanentPinCode = user.getPermanentAddress().getPinCode();
        }
    }

    private Set<RoleRequest> convertDomainRoleToContract(Set<Role> roleEntities) {
        if (roleEntities == null) return new HashSet<>();
        return roleEntities.stream().map(RoleRequest::new).collect(Collectors.toSet());
    }

    @JsonIgnore
    public User toDomain(Long loggedInUserId, boolean isCreate) {
        BloodGroup bloodGroup = null;
        try {
            if (this.bloodGroup != null)
                bloodGroup = BloodGroup.valueOf(this.bloodGroup.toUpperCase());
        } catch (Exception e) {
            bloodGroup = BloodGroup.fromValue(this.bloodGroup);
        }
        return User.builder()
                .uuid(this.uuid)
                .id(this.id)
                .name(this.name)
                .username(this.userName)
                .salutation(this.salutation)
                .mobileNumber(this.mobileNumber)
                .emailId(this.emailId)
                .altContactNumber(this.altContactNumber)
                .pan(this.pan)
                .aadhaarNumber(this.aadhaarNumber)
                .active(isActive(isCreate))
                .dob(this.dob)
                .passwordExpiryDate(this.pwdExpiryDate)
                .locale(this.locale)
                .type(this.type)
                .accountLocked(isAccountLocked(isCreate))
                .accountLockedDate(this.accountLockedDate)
                .signature(this.signature)
                .photo(this.photo)
                .identificationMark(this.identificationMark)
                .gender(this.gender != null ? Gender.valueOf(this.gender.toUpperCase()) : null)
                .bloodGroup(bloodGroup)
                .lastModifiedDate(new Date())
                .createdDate(new Date())
                .otpReference(this.otpReference)
                .tenantId(this.tenantId)
                .password(this.password)
                .roles(toDomainRoles())
                .loggedInUserId(loggedInUserId)
                .permanentAddress(toDomainPermanentAddress())
                .correspondenceAddress(toDomainCorrespondenceAddress())
                .guardian(fatherOrHusbandName)
                .build();
    }

    private Boolean isActive(boolean isCreate) {
        if (this.active == null && isCreate) {
            return false;
        }
        return this.active;
    }

    private Boolean isAccountLocked(boolean isCreate) {
        if (this.accountLocked == null && isCreate) {
            return false;
        }
        return this.accountLocked;
    }

    private Address toDomainPermanentAddress() {
        return Address.builder()
                .type(AddressType.PERMANENT)
                .city(permanentCity)
                .pinCode(permanentPinCode)
                .address(permanentAddress)
                .build();
    }

    private Address toDomainCorrespondenceAddress() {
        return Address.builder()
                .type(AddressType.CORRESPONDENCE)
                .city(correspondenceCity)
                .pinCode(correspondencePinCode)
                .address(correspondenceAddress)
                .build();
    }

    private Set<Role> toDomainRoles() {
        return this.roles != null
                ? this.roles.stream()
                .map(RoleRequest::toDomain)
                .distinct()
                .collect(Collectors.toSet())
                : null;
    }
}
