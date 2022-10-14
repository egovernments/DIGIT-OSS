package org.egov.user.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import org.apache.commons.lang3.time.DateUtils;
import org.egov.user.config.*;
import org.egov.user.domain.exception.InvalidUserCreateException;
import org.egov.user.domain.exception.InvalidUserUpdateException;
import org.egov.user.domain.model.enums.BloodGroup;
import org.egov.user.domain.model.enums.Gender;
import org.egov.user.domain.model.enums.GuardianRelation;
import org.egov.user.domain.model.enums.UserType;
import org.hibernate.validator.constraints.Email;
import org.springframework.util.CollectionUtils;

import java.util.*;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import static org.springframework.util.ObjectUtils.isEmpty;

@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder(toBuilder = true)
public class User {

    private Long id;
    private String uuid;

    @Pattern(regexp = UserServiceConstants.PATTERN_TENANT)
    @Size(max = 50)
    private String tenantId;
    private String username;
    private String title;
    private String password;
    private String salutation;

    @Pattern(regexp = UserServiceConstants.PATTERN_NAME)
    private String guardian;

    private GuardianRelation guardianRelation;

    @Pattern(regexp = UserServiceConstants.PATTERN_NAME)
    @Size(max = 50)
    private String name;
    private Gender gender;
    private String mobileNumber;

    @Email
    private String emailId;
    private String altContactNumber;
    private String pan;
    private String aadhaarNumber;
    private Address permanentAddress;
    private Address correspondenceAddress;
    private Set<Address> addresses;
    private Boolean active;
    private Set<Role> roles;
    private Date dob;
    private Date passwordExpiryDate;
    private String locale = "en_IN";
    private UserType type;
    private BloodGroup bloodGroup;
    private String identificationMark;
    private String signature;
    private String photo;
    private Boolean accountLocked;
    private Long accountLockedDate;
    private Date lastModifiedDate;
    private Date createdDate;
    private String otpReference;
    private Long createdBy;
    private Long lastModifiedBy;
    private Long loggedInUserId;
    private boolean otpValidationMandatory;
    private boolean mobileValidationMandatory = true;
    private String alternateMobileNumber;
    private Long parentid;

    public User addAddressItem(Address addressItem) {
        if (this.addresses == null) {
            this.addresses = new HashSet<>();
        }
        this.addresses.add(addressItem);
        return this;
    }

    public User addRolesItem(Role roleItem) {
        if (this.roles == null) {
            this.roles = new HashSet<>();
        }
        this.roles.add(roleItem);
        return this;
    }

    public void validateNewUser() {
        validateNewUser(true);
    }

    public void validateNewUser(boolean createUserValidateName) {
        if (isUsernameAbsent()
                || (createUserValidateName && isNameAbsent())
                || isMobileNumberAbsent()
                || isActiveIndicatorAbsent()
                || isTypeAbsent()
                || isPermanentAddressInvalid()
                || isCorrespondenceAddressInvalid()
                || isRolesAbsent()
                || isOtpReferenceAbsent()
                || isTenantIdAbsent()) {
            throw new InvalidUserCreateException(this);
        }
    }

    public void validateUserModification() {
        if (isPermanentAddressInvalid()
                || isCorrespondenceAddressInvalid()
                || isTenantIdAbsent()
        ) {
            throw new InvalidUserUpdateException(this);
        }
    }

    @JsonIgnore
    public boolean isCorrespondenceAddressInvalid() {
    	System.out.println("==correspondance address : " + correspondenceAddress);
        return correspondenceAddress != null && correspondenceAddress.isInvalid();
    }

    @JsonIgnore
    public boolean isPermanentAddressInvalid() {
    	System.out.println("===permanent address  : " + permanentAddress);
        return permanentAddress != null && permanentAddress.isInvalid();
    }

    @JsonIgnore
    public boolean isOtpReferenceAbsent() {
    	System.out.println("==tp is  + " + otpReference);
        return otpValidationMandatory && isEmpty(otpReference);
    }

    @JsonIgnore
    public boolean isTypeAbsent() {
    	System.out.println("===Type is : " + type);
        return isEmpty(type);
    }

    @JsonIgnore
    public boolean isActiveIndicatorAbsent() {
    	System.out.println("===is Active Indicator : " + active);
        return isEmpty(active);
    }

    @JsonIgnore
    public boolean isMobileNumberAbsent() {
    	System.out.println("===mobile number : " + mobileNumber);
        return mobileValidationMandatory && isEmpty(mobileNumber);
    }

    @JsonIgnore
    public boolean isNameAbsent() {
    	System.out.println("===name is :" +name);
        return isEmpty(name);
    }

    @JsonIgnore
    public boolean isUsernameAbsent() {
    	System.out.println("====user is : " + username);
        return isEmpty(username);
    }

    @JsonIgnore
    public boolean isTenantIdAbsent() {
    	System.out.println("====tenant is : " + tenantId);
        return isEmpty(tenantId);
    }

    @JsonIgnore
    public boolean isPasswordAbsent() {
    	System.out.println("=====password is : " + password);
        return isEmpty(password);
    }

    @JsonIgnore
    public boolean isRolesAbsent() {
    	System.out.println("====role is : " + roles);
        return CollectionUtils.isEmpty(roles) || roles.stream().anyMatch(r -> isEmpty(r.getCode()));
    }

    @JsonIgnore
    public boolean isIdAbsent() {
    	System.out.println("===id is : " + id);
        return id == null;
    }

    public void nullifySensitiveFields() {
        username = null;
        type = null;
        mobileNumber = null;
        password = null;
        passwordExpiryDate = null;
        roles = null;
        accountLocked = null;
        accountLockedDate = null;
    }

    @JsonIgnore
    public boolean isLoggedInUserDifferentFromUpdatedUser() {
        return !id.equals(loggedInUserId);
    }

    public void setRoleToCitizen() {
        type = UserType.CITIZEN;
        roles = Collections.singleton(Role.getCitizenRole());
    }

    public void updatePassword(String newPassword) {
        password = newPassword;
    }

    @JsonIgnore
    public OtpValidationRequest getOtpValidationRequest() {
        return OtpValidationRequest.builder()
                .mobileNumber(mobileNumber)
                .tenantId(tenantId)
                .otpReference(otpReference)
                .build();
    }

    @JsonIgnore
    public List<Address> getPermanentAndCorrespondenceAddresses() {
        final ArrayList<Address> addresses = new ArrayList<>();
        if (correspondenceAddress != null && correspondenceAddress.isNotEmpty()) {
            addresses.add(correspondenceAddress);
        }
        if (permanentAddress != null && permanentAddress.isNotEmpty()) {
            addresses.add(permanentAddress);
        }
        return addresses;
    }

    public void setDefaultPasswordExpiry(int expiryInDays) {
        if (passwordExpiryDate == null) {
            passwordExpiryDate = DateUtils.addDays(new Date(), expiryInDays);
        }
    }

    public void setActive(boolean isActive) {
        active = isActive;
    }

	public User() {
		// TODO Auto-generated constructor stub
	}



}


