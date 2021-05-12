package org.egov.user.web.contract;

import lombok.*;
import org.codehaus.jackson.annotate.JsonProperty;
import org.egov.common.contract.request.RequestInfo;
import org.egov.user.config.UserServiceConstants;
import org.egov.user.domain.model.enums.UserType;

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

    @Pattern(regexp = UserServiceConstants.PATTERN_TENANT)
    @Size(max = 256)
    private String tenantId;
    private UserType type;

    public org.egov.user.domain.model.NonLoggedInUserUpdatePasswordRequest toDomain() {
        return org.egov.user.domain.model.NonLoggedInUserUpdatePasswordRequest.builder().otpReference(otpReference)
                .userName(userName).newPassword(newPassword).type(type).tenantId(tenantId).build();
    }
}
