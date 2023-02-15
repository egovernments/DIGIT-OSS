package digit.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class BTRCalculatorConfigs {

    @Value("${egov.billingservice.host}")
    private String billingServiceHost;

    @Value("${egov.demand.create.endpoint}")
    private String demandCreateEndpoint;

    @Value("${egov.billingservice.fetch.bill}")
    private String fetchBillEndpoint;

    @Value("${btr.taxhead.master.code}")
    private String taxHeadMasterCode;

    @Value("${btr.module.code}")
    private String moduleCode;

}
