package org.egov.common.contract.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
public class ErrorField {
    @NonNull
    private String code;
    @NonNull
    private String message;
    @NonNull
    private String field;
}

