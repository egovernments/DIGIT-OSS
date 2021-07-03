package org.egov.collection.model;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BankAccountServiceMappingSearchCriteria {

    private String tenantId;

    private List<String> businessDetails;

    private String bankAccount;
    
    private String bank;
    
    private String bankBranch;

}
