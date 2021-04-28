package org.egov.service;

import static org.egov.util.ApportionConstants.DEFAULT;

import java.math.BigDecimal;
import java.util.*;

import org.egov.config.ApportionConfig;
import org.egov.producer.Producer;
import org.egov.web.models.*;
import org.egov.web.models.enums.DemandApportionRequest;
import org.egov.web.models.enums.Purpose;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;


@Service
public class ApportionServiceV2 {

    private final List<ApportionV2> apportions;
    private Map<String, ApportionV2> APPORTION_MAP = new HashMap<>();

    private Producer producer;
    private ApportionConfig config;
    private MDMSService mdmsService;
    private TranslationService translationService;


    @Autowired
    public ApportionServiceV2(List<ApportionV2> apportions, Producer producer,
                              ApportionConfig config, MDMSService mdmsService,
                              TranslationService translationService) {
        this.apportions = Collections.unmodifiableList(apportions);
        this.producer = producer;
        this.config = config;
        this.mdmsService = mdmsService;
        this.translationService = translationService;
        initialize();
    }

    private void initialize() {
        if (Objects.isNull(apportions))
            throw new IllegalStateException("No Apportion found, spring initialization failed.");

        if (APPORTION_MAP.isEmpty() && !apportions.isEmpty()) {
            apportions.forEach(apportion -> {
                APPORTION_MAP.put(apportion.getBusinessService(), apportion);
            });
        }
        APPORTION_MAP = Collections.unmodifiableMap(APPORTION_MAP);
    }


    /**
     * Apportions the paid amount for the given list of bills
     *
     * @param request The apportion request
     * @return Apportioned Bills
     */
    public List<Bill> apportionBills(ApportionRequest request) {
        List<Bill> bills = request.getBills();
        ApportionV2 apportion;

        //Save the request through persister
        producer.push(config.getBillRequestTopic(), request);

        //Fetch the required MDMS data
        Object masterData = mdmsService.mDMSCall(request.getRequestInfo(), request.getTenantId());

        for (Bill bill : bills) {
        	
            // Create a map of businessService to list of billDetails belonging to that businessService
         //   Map<String, List<BillDetail>> businessServiceToBillDetails = util.groupByBusinessService(billInfo.getBillDetails());

            bill.getBillDetails().sort(Comparator.comparing(BillDetail::getFromPeriod));


            String businessKey = bill.getBusinessService();
            BigDecimal amountPaid = bill.getAmountPaid();

            List<BillDetail> billDetails = bill.getBillDetails();

            if (CollectionUtils.isEmpty(billDetails))
                continue;

            // Get the appropriate implementation of Apportion
            if (isApportionPresent(businessKey))
                apportion = getApportion(businessKey);
            else
                apportion = getApportion(DEFAULT);

            /*
             * Apportion the paid amount among the given list of billDetail
             */

            ApportionRequestV2 apportionRequestV2 = translationService.translate(bill);
            List<TaxDetail> taxDetails = apportion.apportionPaidAmount(apportionRequestV2, masterData);
            updateAdjustedAmountInBills(bill,taxDetails);
            addAdvanceIfExistForBill(billDetails,taxDetails);
        }

        //Save the response through persister
        producer.push(config.getBillResponseTopic(), request);
        return bills;
    }


    /**
     * Retrives the apportion for the given businessService
     *
     * @param businessService The businessService of the billDetails
     * @return Apportion object for the given businessService
     */
    private ApportionV2 getApportion(String businessService) {
        return APPORTION_MAP.get(businessService);
    }


    /**
     * Checks if the apportion is present for the given businessService
     *
     * @param businessService The businessService of the billDetails
     * @return True if the apportion is present else false
     */
    private Boolean isApportionPresent(String businessService) {
        return APPORTION_MAP.containsKey(businessService);
    }



    /**
     * Apportions the paid amount for the given list of demands
     *
     * @param request The apportion request
     * @return Apportioned Bills
     */
    public List<Demand> apportionDemands(DemandApportionRequest request) {
        List<Demand> demands = request.getDemands();
        ApportionV2 apportion;

        //Save the request through persister
        producer.push(config.getDemandRequestTopic(), request);

        //Fetch the required MDMS data
        Object masterData = mdmsService.mDMSCall(request.getRequestInfo(), request.getTenantId());

        demands.sort(Comparator.comparing(Demand::getTaxPeriodFrom));

        ApportionRequestV2 apportionRequestV2 = translationService.translate(demands,masterData);


        /*
        * Need to validate that all demands that come for apportioning
        * has same businessService and consumerCode
        * */
        String businessKey = demands.get(0).getBusinessService();

        if (isApportionPresent(businessKey))
            apportion = getApportion(businessKey);
        else
            apportion = getApportion(DEFAULT);

        List<TaxDetail> taxDetails = apportion.apportionPaidAmount(apportionRequestV2, masterData);
        updateAdjustedAmountInDemands(demands,taxDetails);
        addAdvanceIfExistForDemand(demands,taxDetails);



        //Save the response through persister
        producer.push(config.getDemandResponseTopic(), request);
        return demands;
    }


    /**
     * Updates adjusted amount in demand from mao returned after apportion
     * @param demands
     * @param taxDetails
     */
    private void updateAdjustedAmountInDemands(List<Demand> demands,List<TaxDetail> taxDetails){

        Map<String,BigDecimal> idToAdjustedAmount = new HashMap<>();
        taxDetails.forEach(taxDetail -> {
            taxDetail.getBuckets().forEach(bucket -> {
                idToAdjustedAmount.put(bucket.getEntityId(),bucket.getAdjustedAmount());
            });
        });

        demands.forEach(demand -> {
            demand.getDemandDetails().forEach(demandDetail -> {
                demandDetail.setCollectionAmount(idToAdjustedAmount.get(demandDetail.getId()));
            });
        });

    }

    /**
     * Updates adjusted amount in bill from mao returned after apportion
     * @param bill
     * @param taxDetails
     */
    private void updateAdjustedAmountInBills(Bill bill,List<TaxDetail> taxDetails){

        Map<String,Bucket> idToBucket = new HashMap<>();
        Map<String,BigDecimal> idToAmountPaid = new HashMap<>();

        taxDetails.forEach(taxDetail -> {
            idToAmountPaid.put(taxDetail.getEntityId(),taxDetail.getAmountPaid());
            taxDetail.getBuckets().forEach(bucket -> {
                idToBucket.put(bucket.getEntityId(),bucket);
            });
        });

        bill.getBillDetails().forEach(billDetail -> {
            billDetail.setAmountPaid(idToAmountPaid.get(billDetail.getId()));
            billDetail.getBillAccountDetails().forEach(billAccountDetail -> {
                billAccountDetail.setAdjustedAmount(idToBucket.get(billAccountDetail.getId()).getAdjustedAmount());
                if(billAccountDetail.getTaxHeadCode().contains("ADVANCE")){
                    billAccountDetail.setAmount(idToBucket.get(billAccountDetail.getId()).getAmount());
                }

            });
        });
    }


    private void addAdvanceIfExistForDemand(List<Demand> demands,List<TaxDetail> taxDetails){

        Bucket advanceBucket = null;
        TaxDetail taxDetail = taxDetails.get(taxDetails.size()-1);

        for(Bucket bucket : taxDetail.getBuckets()){
            if(bucket.getEntityId()==null && bucket.getPurpose().equals(Purpose.ADVANCE_AMOUNT)){
                advanceBucket = bucket;
                break;
            }
        }

        if(advanceBucket != null){
            DemandDetail demandDetailForAdvance = new DemandDetail();
            demandDetailForAdvance.setTaxAmount(advanceBucket.getAmount());
            demandDetailForAdvance.setTaxHeadMasterCode(advanceBucket.getTaxHeadCode());
            demands.get(demands.size()-1).getDemandDetails().add(demandDetailForAdvance);
        }

    }


    private void addAdvanceIfExistForBill(List<BillDetail> billDetails,List<TaxDetail> taxDetails){

        Bucket advanceBucket = null;
        TaxDetail taxDetail = taxDetails.get(taxDetails.size()-1);

        for(Bucket bucket : taxDetail.getBuckets()){
            if(bucket.getEntityId()==null && bucket.getPurpose().equals(Purpose.ADVANCE_AMOUNT)){
                advanceBucket = bucket;
                break;
            }
        }

        if(advanceBucket != null){
            BillAccountDetail billAccountDetailForAdvance = new BillAccountDetail();
            billAccountDetailForAdvance.setAmount(advanceBucket.getAmount());
            billAccountDetailForAdvance.setPurpose(Purpose.ADVANCE_AMOUNT);
            billAccountDetailForAdvance.setTaxHeadCode(advanceBucket.getTaxHeadCode());
            billDetails.get(billDetails.size()-1).getBillAccountDetails().add(billAccountDetailForAdvance);
        }

    }



}
