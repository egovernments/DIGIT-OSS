package org.egov.infra.microservice.contract;

import java.util.List;

import org.egov.infra.microservice.models.ChartOfAccounts;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
@Setter
@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AccountCodeTemplate {

    private int id;
    private String code;
    private String name;
    private String description;
    private String module;
    private String subModule;
    private String subledgerType;
    private List<ChartOfAccounts> debitCodeDetails;
    private List<ChartOfAccounts> creditCodeDetails;
    private ChartOfAccounts netPayable;
}
