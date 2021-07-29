package org.egov.pt.calculator.util;

import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Configuration
@Getter
public class Configurations {

	//PERSISTER
	@Value("${kafka.topics.billing-slab.save.service}")
	public String billingSlabSavePersisterTopic;
	
	@Value("${kafka.topics.billing-slab.update.service}")
	public String billingSlabUpdatePersisterTopic;

	@Value("${kafka.topics.mutation-billing-slab.save.service}")
	public String mutationbillingSlabSavePersisterTopic;

	@Value("${kafka.topics.mutation-billing-slab.update.service}")
	public String mutationbillingSlabUpdatePersisterTopic;

	@Value("${pt.mutation.deadline.month}")
	public Integer mutationDeadlineMonth;
	
	//MDMS
	@Value("${egov.mdms.host}")
	private String mdmsHost;
	
	@Value("${egov.mdms.search.endpoint}")
	private String mdmsEndpoint;
	
	
	/*
	 * Calculator Configs
	 */
	//assessment service
	@Value("${egov.assessmentservice.host}")
	private String assessmentServiceHost;

	@Value("${egov.assessmentservice.search.endpoint}")
	private String	assessmentSearchEndpoint;
	
	// billing service
	@Value("${egov.billingservice.host}")
	private String billingServiceHost;
	
	@Value("${egov.taxhead.search.endpoint}")
	private String	taxheadsSearchEndpoint;
	
	@Value("${egov.taxperiod.search.endpoint}")
	private String	taxPeriodSearchEndpoint;
	
	@Value("${egov.demand.create.endpoint}")
	private String demandCreateEndPoint;
	
	@Value("${egov.demand.update.endpoint}")
	private String demandUpdateEndPoint;
	
	@Value("${egov.demand.search.endpoint}")
	private String demandSearchEndPoint;
	
	@Value("${egov.bill.gen.endpoint}")
	private String billGenEndPoint;

	// Collections service
	
	@Value("${egov.collectionservice.host}")
	private String collectionServiceHost;
	
	@Value("${egov.receipt.search.endpoint}")
	private String	ReceiptSearchEndpoint;

	@Value("${egov.payment.search.endpoint}")
	private String	PaymentSearchEndpoint;
	
	// billing slab configs
		
	@Value("${billingslab.value.all}")
	private String slabValueAll;
	
	@Value("${billingslab.value.usagemajor.nonresidential}")
	private String usageMajorNonResidential;
	
	@Value("${billingslab.value.occupancytype.rented}")
	private String occupancyTypeRented;
	
	@Value("${billingslab.value.arv.percent}")
	private Double arvPercent;
	
	// property demand configs
	
	@Value("${pt.module.code}")
	private String ptModuleCode;
	
	@Value("${pt.module.minpayable.amount}")
	private Integer ptMinAmountPayable;


	@Value("${pt.financialyear.start.month}")
	private String financialYearStartMonth;

	// PT Service

	@Value("${egov.pt.host}")
	private String ptHost;

	@Value("${egov.pt.search.endpoint}")
	private String ptSearchEndpoint;

	@Value("#{'${egov.pt.source.demand.gen.ignore}'.split(',')}")
	private List<String> sourcesToBeIgnored;
	
	
	//Mutation
	@Value("${pt.mutation.fees.business.code}")
	private String ptMutationBusinessCode;
	
	@Value("${pt.mutation.fee.taxhead}")
	private String ptMutationFeeTaxHead;
	
	@Value("${pt.mutation.penalty.taxhead}")
	private String ptMutationPenaltyTaxHead;
	
	@Value("${pt.mutation.rebate.taxhead}")
	private String ptMutationRebateTaxHead;
	
	@Value("${pt.mutation.exemption.taxhead}")
	private String ptMutationExemptionTaxHead;
	
	@Value("${pt.mutation.minpayable.amount}")
	private BigDecimal ptMutationMinPayable;
	


}
