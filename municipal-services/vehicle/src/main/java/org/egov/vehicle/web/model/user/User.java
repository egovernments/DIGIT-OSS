package org.egov.vehicle.web.model.user;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.egov.common.contract.request.Role;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

@Validated
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

	@JsonProperty("id")
    private Long id;

    @SafeHtml
    @Size(max=64)
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

    @NotNull
    @SafeHtml
    @Size(max=100)
    @Pattern(regexp = "^[a-zA-Z0-9 \\-'`\\.]*$", message = "Invalid name. Only alphabets and special characters -, ',`, .")
    @JsonProperty("name")
    private String name;

    @NotNull
    @SafeHtml
    @JsonProperty("gender")
    private String gender;

    @NotNull
    @SafeHtml
    @Pattern(regexp = "^[0-9]{10}$", message = "MobileNumber should be 10 digit number")
    @JsonProperty("mobileNumber")
    private String mobileNumber;

    @Size(max=128)
    @SafeHtml
    @NotNull
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

    @Size(max=300)
    @SafeHtml
    @JsonProperty("correspondenceAddress")
    private String correspondenceAddress;

    @JsonProperty("active")
    private Boolean active;

    @NotNull
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

    @Size(max=36)
    @SafeHtml
    @JsonProperty("signature")
    private String signature;

    @JsonProperty("accountLocked")
    private Boolean accountLocked;

    @JsonProperty("roles")
    @Valid
    private List<Role> roles;

    @NotNull
    @SafeHtml
    @Size(max=100)
    @JsonProperty("fatherOrHusbandName")
    private String fatherOrHusbandName;

    @NotNull
    @JsonProperty("relationship")
    private GuardianRelation relationship;


    public enum GuardianRelation {
        FATHER, MOTHER, HUSBAND, OTHER;
    }
    
    @Size(max=32)
    @SafeHtml
    @JsonProperty("bloodGroup")
    private String bloodGroup;

    @Size(max=300)
    @SafeHtml
    @JsonProperty("identificationMark")
    private String identificationMark;

    @Size(max=36)
    @JsonProperty("photo")
    private String photo;

    @Size(max=64)
    @SafeHtml
    @JsonProperty("createdBy")
    private String createdBy;

    @JsonProperty("createdDate")
    private Long createdDate;

    @Size(max=64)
    @SafeHtml
    @JsonProperty("lastModifiedBy")
    private String lastModifiedBy;

    @JsonProperty("lastModifiedDate")
    private Long lastModifiedDate;

    @SafeHtml
    @JsonProperty("otpReference")
    private String otpReference;

    @Size(max=256)
    @SafeHtml
    @NonNull
    @JsonProperty("tenantId")
    private String tenantId;
}
