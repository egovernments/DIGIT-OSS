package org.egov.demoutility.model;

import lombok.*;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/*
	Update password request by non logged in user
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
@ToString
public class NonLoggedInUserUpdatePasswordRequest {

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    private String otpReference;

    @Size(max = 64)
    private String userName;
    private String newPassword;

    @Pattern(regexp ="[a-zA-Z. ]*$")
    @Size(max = 256)
    private String tenantId;
    private UserType type;

    public NonLoggedInUserUpdatePasswordRequest toDomain() {
        return NonLoggedInUserUpdatePasswordRequest.builder().otpReference(otpReference)
                .userName(userName).newPassword(newPassword).type(type).tenantId(tenantId).build();
    }
}
