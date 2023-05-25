package org.egov.access.domain.model.authorize;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AuthorizationRequest {

    @NotNull
    @Size(min = 1)
    private Set<Role> roles;

    @NotNull
    private String uri;

    @NotNull
    @Size(min = 1)
    private Set<String> tenantIds;

}
