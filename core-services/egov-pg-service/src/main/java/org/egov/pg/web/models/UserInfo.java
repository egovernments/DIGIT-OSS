package org.egov.pg.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

/**
 * This is acting ID token of the authenticated user on the server. Any value provided by the clients will be ignored and actual user based on authtoken will be used on the server.
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-06-05T12:58:12.679+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserInfo {
    @JsonProperty("tenantId")
    @NotNull
    private String tenantId = null;

    @JsonProperty("id")
    private Integer id = null;

    @JsonProperty("userName")
    @NotNull
    private String userName = null;

    @JsonProperty("mobile")
    private String mobile = null;

    @JsonProperty("email")
    private String email = null;

    @JsonProperty("primaryrole")
    @Valid
    private List<Role> primaryrole = new ArrayList<>();

    @JsonProperty("additionalroles")
    @Valid
    private List<TenantRole> additionalroles = null;


}

