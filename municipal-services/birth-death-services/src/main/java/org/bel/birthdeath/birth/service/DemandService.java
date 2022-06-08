package org.bel.birthdeath.birth.service;

import java.math.BigDecimal;
import java.util.LinkedList;
import java.util.List;

import org.bel.birthdeath.birth.calculation.Calculation;
import org.bel.birthdeath.birth.certmodel.BirthCertificate;
import org.bel.birthdeath.common.calculation.demand.models.Demand;
import org.bel.birthdeath.common.calculation.demand.models.DemandDetail;
import org.bel.birthdeath.common.repository.DemandRepository;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;



@Service
public class DemandService {

    @Autowired
    private DemandRepository demandRepository;

    public static final String MDMS_ROUNDOFF_TAXHEAD= "_ROUNDOFF";
    /**
     * Creates or updates Demand
     * @param requestInfo The RequestInfo of the calculation request
     * @param calculations The Calculation Objects for which org.bel.birthdeath.common.calculation.demand.models has to be generated or updated
     */
    public void generateDemand(RequestInfo requestInfo,List<Calculation> calculations){

        List<Calculation> createCalculations = new LinkedList<>();
        if(!CollectionUtils.isEmpty(calculations)){
            for(Calculation calculation : calculations) {
            	createCalculations.add(calculation);
            }
        }
        if(!CollectionUtils.isEmpty(createCalculations))
            createDemand(requestInfo,createCalculations);

    }



    /**
     * Creates org.bel.birthdeath.common.calculation.demand.models for the given list of calculations
     * @param requestInfo The RequestInfo of the calculation request
     * @param calculations List of calculation object
     * @return Demands that are created
     */
    private List<Demand> createDemand(RequestInfo requestInfo,List<Calculation> calculations){
        List<Demand> demands = new LinkedList<>();
        for(Calculation calculation : calculations) {
            BirthCertificate birthCertificate = null;

            if(calculation.getBirthCertificate()!=null)
                birthCertificate = calculation.getBirthCertificate();

            if (birthCertificate == null)
                throw new CustomException("INVALID APPLICATIONNUMBER", "Demand cannot be generated for applicationNumber " +
                        calculation.getBirthCertificateNo() + " BirthCertificate with this number does not exist ");

            String tenantId = calculation.getTenantId();
            String consumerCode = calculation.getBirthCertificate().getBirthCertificateNo();

            User owner = birthCertificate.getCitizen();

            List<DemandDetail> demandDetails = new LinkedList<>();

            calculation.getTaxHeadEstimates().forEach(taxHeadEstimate ->
                demandDetails.add(DemandDetail.builder().taxAmount(taxHeadEstimate.getEstimateAmount())
                        .taxHeadMasterCode(taxHeadEstimate.getTaxHeadCode())
                        .collectionAmount(BigDecimal.ZERO)
                        .tenantId(tenantId)
                        .build())
            );
            Long taxPeriodFrom = birthCertificate.getTaxPeriodFrom();
            Long taxPeriodTo = birthCertificate.getTaxPeriodTo();
            String businessService = birthCertificate.getBusinessService();
            addRoundOffTaxHead(calculation.getTenantId(), demandDetails,businessService);
            Demand singleDemand = Demand.builder()
                    .consumerCode(consumerCode)
                    .demandDetails(demandDetails)
                    .payer(owner)
                    .tenantId(tenantId)
                    .taxPeriodFrom(taxPeriodFrom)
                    .taxPeriodTo(taxPeriodTo)
                    .consumerType("BirthCertificate")
                    .businessService(businessService)
                    .build();
            demands.add(singleDemand);
        }
        return demandRepository.saveDemand(requestInfo,demands);
    }




    /**
     * Adds roundOff taxHead if decimal values exists
     * @param tenantId The tenantId of the org.bel.birthdeath.common.calculation.demand.models
     * @param demandDetails The list of demandDetail
     */
    private void addRoundOffTaxHead(String tenantId,List<DemandDetail> demandDetails,String businessService){
        BigDecimal totalTax = BigDecimal.ZERO;

        DemandDetail prevRoundOffDemandDetail = null;

        /*
        * Sum all taxHeads except RoundOff as new roundOff will be calculated
        * */
        for (DemandDetail demandDetail : demandDetails){
            if(!demandDetail.getTaxHeadMasterCode().equalsIgnoreCase(businessService+MDMS_ROUNDOFF_TAXHEAD))
                totalTax = totalTax.add(demandDetail.getTaxAmount());
            else prevRoundOffDemandDetail = demandDetail;
        }

        BigDecimal decimalValue = totalTax.remainder(BigDecimal.ONE);
        BigDecimal midVal = new BigDecimal(0.5);
        BigDecimal roundOff = BigDecimal.ZERO;

        /*
        * If the decimal amount is greater than 0.5 we subtract it from 1 and put it as roundOff taxHead
        * so as to nullify the decimal eg: If the tax is 12.64 we will add extra tax roundOff taxHead
        * of 0.36 so that the total becomes 13
        * */
        if(decimalValue.compareTo(midVal) >= 0)
            roundOff = BigDecimal.ONE.subtract(decimalValue);


        /*
         * If the decimal amount is less than 0.5 we put negative of it as roundOff taxHead
         * so as to nullify the decimal eg: If the tax is 12.36 we will add extra tax roundOff taxHead
         * of -0.36 so that the total becomes 12
         * */
        if(decimalValue.compareTo(midVal) < 0)
            roundOff = decimalValue.negate();

        /*
        * If roundOff already exists in previous org.bel.birthdeath.common.calculation.demand.models create a new roundOff taxHead with roundOff amount
        * equal to difference between them so that it will be balanced when bill is generated. eg: If the
        * previous roundOff amount was of -0.36 and the new roundOff excluding the previous roundOff is
        * 0.2 then the new roundOff will be created with 0.2 so that the net roundOff will be 0.2 -(-0.36)
        * */
        if(prevRoundOffDemandDetail!=null){
            roundOff = roundOff.subtract(prevRoundOffDemandDetail.getTaxAmount());
        }

        if(roundOff.compareTo(BigDecimal.ZERO)!=0){
                 DemandDetail roundOffDemandDetail = DemandDetail.builder()
                    .taxAmount(roundOff)
                    .taxHeadMasterCode(businessService+MDMS_ROUNDOFF_TAXHEAD)
                    .tenantId(tenantId)
                    .collectionAmount(BigDecimal.ZERO)
                    .build();

            demandDetails.add(roundOffDemandDetail);
        }
    }

}
