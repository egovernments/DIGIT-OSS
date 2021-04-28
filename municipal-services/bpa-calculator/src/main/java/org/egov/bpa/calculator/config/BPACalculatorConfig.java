package org.egov.bpa.calculator.config;

import java.math.BigDecimal;

import lombok.Data;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Data
public class BPACalculatorConfig {


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

    @Value("${egov.demand.minimum.payable.amount}")
    private BigDecimal minimumPayableAmount;

    @Value("${egov.demand.appl.businessservice}")
    private String applFeeBusinessService;

    @Value("${egov.demand.sanc.businessservice}")
    private String sanclFeeBusinessService;
  

    //tradelicense Registry
    @Value("${egov.tradelicense.host}")
    private String bpaHost;

    @Value("${egov.bpa.context.path}")
    private String bpaContextPath;

    @Value("${egov.bpa.create.endpoint}")
    private String bpaCreateEndpoint;

    @Value("${egov.bpa.update.endpoint}")
    private String bpaUpdateEndpoint;

    @Value("${egov.bpa.search.endpoint}")
    private String bpaSearchEndpoint;


    //TaxHeads
    @Value("${egov.appl.fee}")
    private String baseApplFeeHead;

    @Value("${egov.sanc.fee}")
    private String baseSancFeeHead;
    
    @Value("${egov.appl.fee.defaultAmount}")
    private String applFeeDefaultAmount;
    
    @Value("${egov.sanc.fee.defaultAmount}")
    private String sancFeeDefaultAmount;
    
    @Value("${egov.taxhead.adhoc.penalty}")
    private String adhocPenaltyTaxHead;

    @Value("${egov.taxhead.adhoc.exemption}")
    private String adhocExemptionTaxHead;
    
	@Value("${egov.low.appl.fee}")
	private String baseLowApplFeeHead;
	
	@Value("${egov.low.sanc.fee}")
	private String baseLowSancFeeHead;

    @Value("${egov.oc.appl.fee}")
    private String OCApplFee;
    
	@Value("${egov.oc.sanc.fee}")
	private String OCSancFee;
	
	@Value("${egov.oc.appl.fee.defaultAmount}")
	private String OCApplFeeDefaultAmount;


    //MDMS
    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsSearchEndpoint;


//    Kafka Topics
    @Value("${persister.save.bpa.calculation.topic}")
    private String saveTopic;

    @Value("${egov.edcr.host}")
	private String edcrHost;
    
    @Value("${egov.edcr.getPlan.endpoint}")
	private String getPlanEndPoint;
    
    @Value("${egov.demand.lowriskpermit.businessservice}")
    private String lowRiskPermitFeeBusinessService;
    
    @Value("${egov.demand.oc.appl.businessservice}")
    private String OCApplBusinessservice;
    
    @Value("${egov.demand.oc.sanc.businessservice}")
    private String OCSancBusinessservice;
    
    //CalculaterType Default Values
//    @Value("${egov.tl.calculationtype.tradetype.default}")
//    private String defaultTradeUnitCalculationType;
//
//    @Value("${egov.tl.calculationtype.accessory.default}")
//    private String defaultAccessoryCalculationType;


}
