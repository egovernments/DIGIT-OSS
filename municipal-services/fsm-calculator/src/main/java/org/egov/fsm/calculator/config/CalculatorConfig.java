package org.egov.fsm.calculator.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@Data
public class CalculatorConfig {


    @Value("${egov.billingservice.host}")
    private String billingHost;

    @Value("${egov.taxhead.search.endpoint}")
    private String taxHeadSearchEndpoint;

    @Value("${egov.taxperiod.search.endpoint}")
    private String taxPeriodSearchEndpoint;

    @Value("${egov.demand.create.endpoint}")
    private String demandCreateEndpoint;

    @Value("${egov.demand.update.endpoint}")
    private String demandUpdateEndpoint;

    @Value("${egov.demand.search.endpoint}")
    private String demandSearchEndpoint;

    @Value("${egov.bill.gen.endpoint}")
    private String billGenerateEndpoint;

    @Value("${egov.fsm.appl.fee.taxhead}")
    private String applicationFeeTaxHead;

  
    @Value("${egov.fsm.appl.fee.businesssrv}")
    private String applicationFeeBusinessService;

    //tradelicense Registry
    @Value("${egov.fsm.host}")
    private String fsmHost;

    @Value("${egov.fsm.context.path}")
    private String fsmContextPath;

    @Value("${egov.fsm.create.endpoint}")
    private String fsmCreateEndpoint;

    @Value("${egov.fsm.update.endpoint}")
    private String fsmUpdateEndpoint;

    @Value("${egov.fsm.search.endpoint}")
    private String fsmSearchEndpoint;
   
    //MDMS
    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsSearchEndpoint;



}
