package org.egov.common.contract.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
public class PlainAccessRequest {
    private String recordId;

    private List<String> plainRequestFields;
}
