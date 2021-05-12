package org.egov.echallancalculation.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.echallancalculation.model.Challan;
import org.egov.echallancalculation.model.RequestInfoWrapper;
import org.egov.echallancalculation.repository.DemandRepository;
import org.egov.echallancalculation.repository.ServiceRequestRepository;
import org.egov.echallancalculation.util.CalculationUtils;
import org.egov.echallancalculation.web.models.calculation.Calculation;
import org.egov.echallancalculation.web.models.demand.*;
import org.egov.echallancalculation.web.models.demand.Demand.StatusEnum;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;



@Service
public class DemandService {

    @Autowired
    private CalculationUtils utils;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private DemandRepository demandRepository;

    public static final String MDMS_ROUNDOFF_TAXHEAD= "_ROUNDOFF";
    /**
     * Creates or updates Demand
     * @param requestInfo The RequestInfo of the calculation request
     * @param calculations The Calculation Objects for which demand has to be generated or updated
     */
    public void generateDemand(RequestInfo requestInfo,List<Calculation> calculations,String businessService){

        List<Calculation> createCalculations = new LinkedList<>();

        List<Calculation> updateCalculations = new LinkedList<>();

        if(!CollectionUtils.isEmpty(calculations)){

            String tenantId = calculations.get(0).getTenantId();
            Set<String> applicationNumbers = calculations.stream().map(calculation -> calculation.getChallan().getChallanNo()).collect(Collectors.toSet());
            List<Demand> demands = searchDemand(tenantId,applicationNumbers,requestInfo,businessService);
            Set<String> applicationNumbersFromDemands = new HashSet<>();
            if(!CollectionUtils.isEmpty(demands))
                applicationNumbersFromDemands = demands.stream().map(Demand::getConsumerCode).collect(Collectors.toSet());

            for(Calculation calculation : calculations)
            {      if(!applicationNumbersFromDemands.contains(calculation.getChallan().getChallanNo()))
                        createCalculations.add(calculation);
                    else
                        updateCalculations.add(calculation);
            }
        }

        if(!CollectionUtils.isEmpty(createCalculations))
            createDemand(requestInfo,createCalculations);

        if(!CollectionUtils.isEmpty(updateCalculations))
            updateDemand(requestInfo,updateCalculations,businessService);
            //Calling fetchbill service after demand creation/updation to handle duplicate bill generation issue
        for (Calculation calculation : calculations) {
            if(calculation.getChallan().getApplicationStatus()!=null && !calculation.getChallan().getApplicationStatus().equals(StatusEnum.CANCELLED.toString())) {
                String tenantId = calculation.getTenantId();
                String consumerCode = calculation.getChallan().getChallanNo();
                GenerateBillCriteria billCriteria = GenerateBillCriteria.builder().
                        tenantId(tenantId).
                        consumerCode(consumerCode).
                        businessService(businessService)
                        .build();
                generateBill(requestInfo,billCriteria);
            }
        }
    }



    /**
     * Creates demand for the given list of calculations
     * @param requestInfo The RequestInfo of the calculation request
     * @param calculations List of calculation object
     * @return Demands that are created
     */
    private List<Demand> createDemand(RequestInfo requestInfo,List<Calculation> calculations){
        List<Demand> demands = new LinkedList<>();
        for(Calculation calculation : calculations) {
            Challan challan = null;

            if(calculation.getChallan()!=null)
            	challan = calculation.getChallan();

            else if(calculation.getChallanNo()!=null)
            	challan = utils.getChallan(requestInfo, calculation.getChallanNo()
                        , calculation.getTenantId());


            if (challan == null)
                throw new CustomException("INVALID APPLICATIONNUMBER", "Demand cannot be generated for applicationNumber " +
                        calculation.getChallanNo() + " challan with this number does not exist ");

            String tenantId = calculation.getTenantId();
            String consumerCode = calculation.getChallan().getChallanNo();

            User owner = challan.getCitizen().toCommonUser();

            List<DemandDetail> demandDetails = new LinkedList<>();

            calculation.getTaxHeadEstimates().forEach(taxHeadEstimate -> {
                demandDetails.add(DemandDetail.builder().taxAmount(taxHeadEstimate.getEstimateAmount())
                        .taxHeadMasterCode(taxHeadEstimate.getTaxHeadCode())
                        .collectionAmount(BigDecimal.ZERO)
                        .tenantId(tenantId)
                        .build());
            });
            Long taxPeriodFrom = challan.getTaxPeriodFrom();
            Long taxPeriodTo = challan.getTaxPeriodTo();
            String businessService = challan.getBusinessService();
            addRoundOffTaxHead(calculation.getTenantId(), demandDetails,businessService);
            Demand singleDemand = Demand.builder()
                    .consumerCode(consumerCode)
                    .demandDetails(demandDetails)
                    .payer(owner)
                    .tenantId(tenantId)
                    .taxPeriodFrom(taxPeriodFrom)
                    .taxPeriodTo(taxPeriodTo)
                    .consumerType("challan")
                    .businessService(businessService)
                    .build();
            demands.add(singleDemand);
        }
        return demandRepository.saveDemand(requestInfo,demands);
    }



    /**
     * Updates demand for the given list of calculations
     * @param requestInfo The RequestInfo of the calculation request
     * @param calculations List of calculation object
     * @return Demands that are updated
     */
    private List<Demand> updateDemand(RequestInfo requestInfo,List<Calculation> calculations,String businessService){
        List<Demand> demands = new LinkedList<>();
        for(Calculation calculation : calculations) {

            List<Demand> searchResult = searchDemand(calculation.getTenantId(),Collections.singleton(calculation.getChallan().getChallanNo())
                    , requestInfo,businessService);

            if(CollectionUtils.isEmpty(searchResult))
                throw new CustomException("INVALID UPDATE","No demand exists for applicationNumber: "+calculation.getChallan().getChallanNo());
            
            Demand demand = searchResult.get(0);
            if(calculation.getChallan().getApplicationStatus()!=null && calculation.getChallan().getApplicationStatus().equals(StatusEnum.CANCELLED.toString()))
            	demand.setStatus(StatusEnum.CANCELLED);
            List<DemandDetail> demandDetails = demand.getDemandDetails();
            List<DemandDetail> updatedDemandDetails = getUpdatedDemandDetails(calculation,demandDetails);
            demand.setDemandDetails(updatedDemandDetails);
            demands.add(demand);
        }
         return demandRepository.updateDemand(requestInfo,demands);
    }


    /**
     * Searches demand for the given consumerCode and tenantIDd
     * @param tenantId The tenantId of the tradeLicense
     * @param consumerCodes The set of consumerCode of the demands
     * @param requestInfo The RequestInfo of the incoming request
     * @return Lis to demands for the given consumerCode
     */
    private List<Demand> searchDemand(String tenantId,Set<String> consumerCodes,RequestInfo requestInfo, String businessService){
        String uri = utils.getDemandSearchURL();
        uri = uri.replace("{1}",tenantId);
        uri = uri.replace("{2}",businessService);
        uri = uri.replace("{3}",StringUtils.join(consumerCodes, ','));

        Object result = serviceRequestRepository.fetchResult(new StringBuilder(uri),RequestInfoWrapper.builder()
                                                      .requestInfo(requestInfo).build());

        DemandResponse response;
        try {
             response = mapper.convertValue(result,DemandResponse.class);
        }
        catch (IllegalArgumentException e){
            throw new CustomException("PARSING ERROR","Failed to parse response from Demand Search");
        }

        if(CollectionUtils.isEmpty(response.getDemands()))
            return null;

        else return response.getDemands();

    }


    /**
     * Generates bill by calling BillingService
     * @param requestInfo The RequestInfo of the getBill request
     * @param billCriteria The criteria for bill generation
     * @return The response of the bill generate
     */
    private BillResponse generateBill(RequestInfo requestInfo,GenerateBillCriteria billCriteria){

        String consumerCode = billCriteria.getConsumerCode();
        String tenantId = billCriteria.getTenantId();

        List<Demand> demands = searchDemand(tenantId,Collections.singleton(consumerCode),requestInfo,billCriteria.getBusinessService());


        if(CollectionUtils.isEmpty(demands))
            throw new CustomException("INVALID CONSUMERCODE","Bill cannot be generated.No demand exists for the given consumerCode");

        String uri = utils.getBillGenerateURI();
        uri = uri.replace("{1}",billCriteria.getTenantId());
        uri = uri.replace("{2}",billCriteria.getConsumerCode());
        uri = uri.replace("{3}",billCriteria.getBusinessService());

        Object result = serviceRequestRepository.fetchResult(new StringBuilder(uri),RequestInfoWrapper.builder()
                                                             .requestInfo(requestInfo).build());
        BillResponse response;
         try{
              response = mapper.convertValue(result,BillResponse.class);
         }
         catch (IllegalArgumentException e){
            throw new CustomException("PARSING ERROR","Unable to parse response of generate bill");
         }
         return response;
    }


    /**
     * Returns the list of new DemandDetail to be added for updating the demand
     * @param calculation The calculation object for the update tequest
     * @param demandDetails The list of demandDetails from the existing demand
     * @return The list of new DemandDetails
     */
    private List<DemandDetail> getUpdatedDemandDetails(Calculation calculation, List<DemandDetail> demandDetails){

        List<DemandDetail> newDemandDetails = new ArrayList<>();
        Map<String, List<DemandDetail>> taxHeadToDemandDetail = new HashMap<>();

        demandDetails.forEach(demandDetail -> {
            if(!taxHeadToDemandDetail.containsKey(demandDetail.getTaxHeadMasterCode())){
                List<DemandDetail> demandDetailList = new LinkedList<>();
                demandDetailList.add(demandDetail);
                taxHeadToDemandDetail.put(demandDetail.getTaxHeadMasterCode(),demandDetailList);
            }
            else
              taxHeadToDemandDetail.get(demandDetail.getTaxHeadMasterCode()).add(demandDetail);
        });

        BigDecimal diffInTaxAmount;
        List<DemandDetail> demandDetailList;
        BigDecimal total;

        for(TaxHeadEstimate taxHeadEstimate : calculation.getTaxHeadEstimates()){
            if(!taxHeadToDemandDetail.containsKey(taxHeadEstimate.getTaxHeadCode()))
                newDemandDetails.add(
                        DemandDetail.builder()
                                .taxAmount(taxHeadEstimate.getEstimateAmount())
                                .taxHeadMasterCode(taxHeadEstimate.getTaxHeadCode())
                                .tenantId(calculation.getTenantId())
                                .collectionAmount(BigDecimal.ZERO)
                                .build());
            else {
                 demandDetailList = taxHeadToDemandDetail.get(taxHeadEstimate.getTaxHeadCode());
                 total = demandDetailList.stream().map(DemandDetail::getTaxAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                 diffInTaxAmount = taxHeadEstimate.getEstimateAmount().subtract(total);
                 if(diffInTaxAmount.compareTo(BigDecimal.ZERO)!=0) {
                     newDemandDetails.add(
                             DemandDetail.builder()
                                     .taxAmount(diffInTaxAmount)
                                     .taxHeadMasterCode(taxHeadEstimate.getTaxHeadCode())
                                     .tenantId(calculation.getTenantId())
                                     .collectionAmount(BigDecimal.ZERO)
                                     .build());
                 }
            }
        }
        List<DemandDetail> combinedBillDetials = new LinkedList<>(demandDetails);
        combinedBillDetials.addAll(newDemandDetails);
        addRoundOffTaxHead(calculation.getTenantId(),combinedBillDetials,calculation.getChallan().getBusinessService());
        return combinedBillDetials;
    }



    /**
     * Adds roundOff taxHead if decimal values exists
     * @param tenantId The tenantId of the demand
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
        * If roundOff already exists in previous demand create a new roundOff taxHead with roundOff amount
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
