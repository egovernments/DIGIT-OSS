package org.egov.pg.web.models;

import lombok.*;

import javax.validation.constraints.NotNull;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @NotNull
    private String uuid;

    @NotNull
    private String name;

    @NotNull
    private String userName;

    @NotNull
    private String mobileNumber;

    private String emailId;

    @NotNull
    private String tenantId;

    public User(org.egov.common.contract.request.User user) {
        this.uuid = user.getUuid();
        this.name = user.getName();
        this.userName = user.getUserName();
        this.mobileNumber = user.getMobileNumber();
        this.emailId = user.getEmailId();
        this.tenantId = user.getTenantId();
    }

}
