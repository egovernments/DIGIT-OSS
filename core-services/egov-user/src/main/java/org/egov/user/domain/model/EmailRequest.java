package org.egov.user.domain.model;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
@Data
public class EmailRequest {
    private RequestInfo requestInfo;

    private Email email;
}