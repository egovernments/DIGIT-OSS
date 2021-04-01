package org.egov.web.contract;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;

@Getter
@AllArgsConstructor
@Builder
public class ErrorField {
    @NonNull
    private String code;
    @NonNull
    private String message;
    @NonNull
    private String field;
}

