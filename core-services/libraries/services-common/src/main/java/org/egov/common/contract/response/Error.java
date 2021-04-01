package org.egov.common.contract.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
public class Error {
    private int code;
    private String message;
    private String description;
    private List<ErrorField> fields;
}
