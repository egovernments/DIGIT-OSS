package org.egov.common.contract.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
public class ErrorResponse {
    private ResponseInfo responseInfo;
    private Error error;
}

