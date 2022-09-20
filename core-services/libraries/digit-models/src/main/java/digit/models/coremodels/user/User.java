package digit.models.coremodels.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import digit.models.coremodels.user.config.UserServiceConstants;
import digit.models.coremodels.user.enums.BloodGroup;
import digit.models.coremodels.user.enums.Gender;
import digit.models.coremodels.user.enums.GuardianRelation;
import digit.models.coremodels.user.enums.UserType;
import digit.models.coremodels.user.exception.InvalidUserCreateException;
import digit.models.coremodels.user.exception.InvalidUserUpdateException;
import lombok.*;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.util.CollectionUtils;

import javax.validation.constraints.Email;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.*;

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
        return correspondenceAddress != null && correspondenceAddress.isInvalid();
    }

    @JsonIgnore
    public boolean isPermanentAddressInvalid() {
        return permanentAddress != null && permanentAddress.isInvalid();
    }

    @JsonIgnore
    public boolean isOtpReferenceAbsent() {
        return otpValidationMandatory && isEmpty(otpReference);
    }

    @JsonIgnore
    public boolean isTypeAbsent() {
        return isEmpty(type);
    }

    @JsonIgnore
    public boolean isActiveIndicatorAbsent() {
        return isEmpty(active);
    }

    @JsonIgnore
    public boolean isMobileNumberAbsent() {
        return mobileValidationMandatory && isEmpty(mobileNumber);
    }

    @JsonIgnore
    public boolean isNameAbsent() {
        return isEmpty(name);
    }

    @JsonIgnore
    public boolean isUsernameAbsent() {
        return isEmpty(username);
    }

    @JsonIgnore
    public boolean isTenantIdAbsent() {
        return isEmpty(tenantId);
    }

    @JsonIgnore
    public boolean isPasswordAbsent() {
        return isEmpty(password);
    }

    @JsonIgnore
    public boolean isRolesAbsent() {
        return CollectionUtils.isEmpty(roles) || roles.stream().anyMatch(r -> isEmpty(r.getCode()));
    }

    @JsonIgnore
    public boolean isIdAbsent() {
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
}

