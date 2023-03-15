package org.egov.tenant.web.contract;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Tenant {
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
    private City city;
    private String address;
    private String contactNumber;
    private String helpLineNumber;

    public Tenant(org.egov.tenant.domain.model.Tenant tenant, City city) {
        this.code = tenant.getCode();
        this.name = tenant.getName();
        this.description = tenant.getDescription();
        this.logoId = tenant.getLogoId();
        this.imageId = tenant.getImageId();
        this.domainUrl = tenant.getDomainUrl();
        this.type = tenant.getType().toString();
        this.twitterUrl= tenant.getTwitterUrl();
        this.facebookUrl= tenant.getFacebookUrl();
        this.address = tenant.getAddress();
        this.contactNumber = tenant.getContactNumber();
        this.helpLineNumber = tenant.getHelpLineNumber();
        this.emailId = tenant.getEmailId();
       
        this.city = city;
    }

    @JsonIgnore
    public org.egov.tenant.domain.model.Tenant toDomain() {
        org.egov.tenant.domain.model.City city;

        if (this.city != null) {
            city = this.city.toDomain();
        } else {
            city = null;
        }

        return org.egov.tenant.domain.model.Tenant.builder()
            .code(code)
            .name(name)
            .description(description)
            .logoId(logoId)
            .imageId(imageId)
            .domainUrl(domainUrl)
            .type(type)
            .twitterUrl(twitterUrl)
            .facebookUrl(facebookUrl)
            .emailId(emailId)
            .address(address)
            .contactNumber(contactNumber)
            .helpLineNumber(helpLineNumber)
            .city(city)
            .build();
    }
}
