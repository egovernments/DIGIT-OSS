package org.egov.fsm.web.model.user;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.validation.Valid;
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
	 
    @Size(max=64)
    @SafeHtml
    @JsonProperty("uuid")
    private String uuid;

    @Size(max=64)
    @SafeHtml
    @JsonProperty("userName")
    private String userName;
    

    @Size(min=1,max=64)
    @SafeHtml
    @Pattern(regexp = "^[a-zA-Z \\-'`\\.]*$", message = "Invalid name. Only alphabets and special characters -, ',`, .")
    @JsonProperty("name")
    private String name;

    @Size(max=64)
    @SafeHtml
    @JsonProperty("password")
    private String password;
    
    @Size(max=64)
    @SafeHtml
    @JsonProperty("mobileNumber")
    private String mobileNumber;
    
    @Size(max=64)
    @SafeHtml
    @JsonProperty("tenantId")
    private String tenantId;

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

    @SafeHtml
    @JsonProperty("gender")
    private String gender;

    public User addRolesItem(Role rolesItem) {
            if (this.roles == null) {
                    this.roles = new ArrayList<>();
            }
            this.roles.add(rolesItem);
            return this;
    }

    @Override
    public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            User user = (User) o;
            return  Objects.equals(emailId, user.emailId);
//                    Objects.equals(dob, user.dob) && //Epoch format not converting properly from UI
                   
    }

    @Override
    public int hashCode() {

            return Objects.hash(uuid);
    }
}
