package org.egov.service.apportions;


import org.egov.config.ApportionConfig;
import org.egov.service.Apportion;
import org.egov.service.TaxHeadMasterService;
import org.egov.tracer.model.CustomException;
import org.egov.web.models.enums.Purpose;
import org.egov.web.models.BillAccountDetail;
import org.egov.web.models.BillDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.egov.util.ApportionConstants.*;

@Service
public class OrderByPriorityApportion implements Apportion {


    private TaxHeadMasterService taxHeadMasterService;

    private ApportionConfig config;


    @Autowired
    public OrderByPriorityApportion(TaxHeadMasterService taxHeadMasterService, ApportionConfig config) {
        this.taxHeadMasterService = taxHeadMasterService;
        this.config = config;
    }



    @Override
    public String getBusinessService() {
        return DEFAULT;
    }


    /**
     * 1. Sort the billDetails based on fromPeriod
     * 2. For each billDetail sort the BillAccountDetails by order
     * 3. Start apportioning by assigning positive adjustedAmount for negative amounts
     *    and negative adjustmentAmount for postive amounts
     * 4. If any advance amount is remaining new BillAccountDetail is created for it
     *    and assigned to last BillDetail
     * @param billDetails The list of BillDetail to be apportioned
     * @param amountPaid The total amount paid against the list of billDetails
     * @return
     */
    @Override
    public List<BillDetail> apportionPaidAmount(List<BillDetail> billDetails,BigDecimal amountPaid,Object masterData) {
        billDetails.sort(Comparator.comparing(BillDetail::getFromPeriod));
        BigDecimal remainingAmount = amountPaid;
        BigDecimal amount;
        Boolean isAmountPositive;

        if(!config.getApportionByValueAndOrder())
            validateOrder(billDetails);


        for (BillDetail billDetail : billDetails){
        	
            if(!config.getApportionByValueAndOrder())
                billDetail.getBillAccountDetails().sort(Comparator.comparing(BillAccountDetail::getAmount));
            else
                billDetail.getBillAccountDetails().sort(Comparator.comparing(BillAccountDetail::getAmount).thenComparing(BillAccountDetail::getOrder));


            for(BillAccountDetail billAccountDetail : billDetail.getBillAccountDetails()) {
            	
                amount = billAccountDetail.getAmount();
                isAmountPositive = amount.compareTo(BigDecimal.ZERO) >= 0;

                if (isAmountPositive) {

                    if (remainingAmount.equals(BigDecimal.ZERO)) {
                        billAccountDetail.setAdjustedAmount(BigDecimal.ZERO);
                        continue;
                    }

                    if (remainingAmount.compareTo(amount) <= 0) {
                        billAccountDetail.setAdjustedAmount(remainingAmount);
                        remainingAmount = BigDecimal.ZERO;
                    }

                    if (remainingAmount.compareTo(amount) > 0) {
                        billAccountDetail.setAdjustedAmount(amount);
                        remainingAmount = remainingAmount.subtract(amount);
                    }
                }
                else {
                    billAccountDetail.setAdjustedAmount(amount);
                    remainingAmount = remainingAmount.subtract(amount);
                }
            }
            billDetail.setAmountPaid(amountPaid.subtract(remainingAmount));
        }

        //If advance amount is available
        if(remainingAmount.compareTo(BigDecimal.ZERO)>0){
            addAdvanceBillAccountDetail(remainingAmount,billDetails,masterData);
        }


        return billDetails;
    }


    /**
     * Validates if order is not null in each BillAccountDetail in the given list of billDetails
     *  and all positive taxHeadOrder come after negative taxHeadOrder
     * @param billDetails List of billDetails to be validated
     */
    private void validateOrder(List<BillDetail> billDetails){
        Map<String,String> errorMap = new HashMap<>();
        billDetails.forEach(billDetail -> {

            if(billDetail.getFromPeriod()==null || billDetail.getToPeriod()==null)
                errorMap.put("INVALID PERIOD","The fromPeriod and toPeriod in BillDetail cannot be null");

            List<BillAccountDetail> billAccountDetails = billDetail.getBillAccountDetails();

            int maxOrderOfNegativeTaxHead = Integer.MIN_VALUE;
            int minOrderOfPositiveTaxHead = Integer.MAX_VALUE;

            for(int i=0;i<billAccountDetails.size();i++){
                if(billAccountDetails.get(i).getOrder()==null){
                    errorMap.put("INVALID ORDER","Order is null for: "+billAccountDetails.get(i).getId());
                    continue;
                }

                 if(billAccountDetails.get(i).getAmount().compareTo(BigDecimal.ZERO)>0 &&
                         minOrderOfPositiveTaxHead > billAccountDetails.get(i).getOrder()){
                     minOrderOfPositiveTaxHead = billAccountDetails.get(i).getOrder();
                }
                else if(billAccountDetails.get(i).getAmount().compareTo(BigDecimal.ZERO)<0 &&
                         maxOrderOfNegativeTaxHead < billAccountDetails.get(i).getOrder()){
                     maxOrderOfNegativeTaxHead = billAccountDetails.get(i).getOrder();
                 }
            }
            if(minOrderOfPositiveTaxHead < maxOrderOfNegativeTaxHead)
                throw new CustomException("INVALID ORDER","Positive TaxHeads should be after Negative TaxHeads");
        });
        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }


    /**
     * Creates a advance BillAccountDetail and adds it to the latest billDetail
     * @param advanceAmount The advance amount paid
     * @param billDetails The list of BillDetatils for which apportioning is done
     * @param masterData The required masterData for the TaxHeads
     */
    private void addAdvanceBillAccountDetail(BigDecimal advanceAmount,List<BillDetail> billDetails,Object masterData){
        String taxHead = taxHeadMasterService.getAdvanceTaxHead(billDetails.get(0).getBusinessService(),masterData);
        BillAccountDetail billAccountDetailForAdvance = new BillAccountDetail();
        billAccountDetailForAdvance.setAmount(advanceAmount.negate());
        billAccountDetailForAdvance.setPurpose(Purpose.ADVANCE_AMOUNT);
        billAccountDetailForAdvance.setTaxHeadCode(taxHead);
        billDetails.get(billDetails.size()-1).getBillAccountDetails().add(billAccountDetailForAdvance);
    }





}
