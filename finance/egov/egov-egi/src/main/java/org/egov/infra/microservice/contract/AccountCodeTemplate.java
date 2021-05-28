package org.egov.infra.microservice.contract;

import java.util.List;

import org.egov.infra.microservice.models.ChartOfAccounts;
import org.hibernate.validator.constraints.SafeHtml;

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
    @SafeHtml
    private String code;
    @SafeHtml
    private String name;
    @SafeHtml
    private String description;
    @SafeHtml
    private String module;
    @SafeHtml
    private String subModule;
    @SafeHtml
    private String subledgerType;
    private List<ChartOfAccounts> debitCodeDetails;
    private List<ChartOfAccounts> creditCodeDetails;
    private ChartOfAccounts netPayable;
}
