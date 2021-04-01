package org.egov.boundary.web.contract.tenant.model;

import lombok.*;
import org.egov.boundary.web.contract.tenant.exception.InvalidTenantDetailsException;

import static org.springframework.util.ObjectUtils.isEmpty;

@Getter
@Builder
@AllArgsConstructor
@EqualsAndHashCode
public class Tenant {

    private Long id;
    private String code;
    private String name;
    private String description;
    private String logoId;
    private String imageId;
    private String domainUrl;
    private String type;
    private String twitterUrl;
    private String facebookUrl;
    private String emailId;
    private String address;
    private String contactNumber;
    private String helpLineNumber;
    @Setter
    private City city;

    public TenantType getType() {
        return TenantType.valueOf(type);
    }

    public void validate() {
        if (isCityAbsent() || !city.isValid() || isCodeAbsent() || isNameAbsent() || isCodeOfInvalidLength() || isLogoIdAbsent()
                || isImageIdAbsent() || isTypeAbsent() || isTypeInvalid() || isContactNumberInvalidLength() || isHelpLineNumberInvalidLength()) {
            throw new InvalidTenantDetailsException(this);
        }
    }

    public boolean isCityAbsent() {
        return isEmpty(city);
    }

    public boolean isCodeAbsent() {
        return isEmpty(code);
    }

    public boolean isNameAbsent() {
        return isEmpty(name);
    }

    public boolean isCodeOfInvalidLength() {
        return code.length() > 256;
    }

    public boolean isLogoIdAbsent() {
        return isEmpty(logoId);
    }

    public boolean isImageIdAbsent() {
        return isEmpty(imageId);
    }

    public boolean isTypeAbsent() {
        return isEmpty(type);
    }

    public boolean isTypeInvalid() {
        try {
            TenantType.valueOf(type);
            return false;
        } catch (IllegalArgumentException ex) {
            return true;
        }
    }

    public boolean isContactNumberInvalidLength() {

        return contactNumber != null && contactNumber.length() > 16;

    }

    public boolean isHelpLineNumberInvalidLength() {

        return helpLineNumber != null && helpLineNumber.length() > 16;

    }

}