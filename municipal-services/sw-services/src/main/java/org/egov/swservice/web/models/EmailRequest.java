package org.egov.swservice.web.models;

import lombok.*;
import org.egov.common.contract.request.RequestInfo;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
@ToString
public class EmailRequest {
    private RequestInfo requestInfo;
    
    private Email email;
}
