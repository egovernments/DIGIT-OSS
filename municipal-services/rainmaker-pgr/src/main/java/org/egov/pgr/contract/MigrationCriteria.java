package org.egov.pgr.contract;

import lombok.*;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MigrationCriteria {


    private Set<String> tenantIds;

    private Integer offset;

    private Set<String> serviceRequestIds;


}
