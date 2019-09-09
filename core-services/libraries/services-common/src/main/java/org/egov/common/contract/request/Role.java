package org.egov.common.contract.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
public class Role {
    private Long id;
    private String name;
    private String code;
    private String tenantId;
}
