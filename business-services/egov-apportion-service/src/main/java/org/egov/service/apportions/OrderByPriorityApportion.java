package org.egov.service.apportions;


import org.egov.config.ApportionConfig;
import org.egov.service.Apportion;
import org.egov.service.TaxHeadMasterService;
import org.egov.tracer.model.CustomException;
import org.egov.web.models.Bill;
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
     * @return
     */
    @Override
    public List<BillDetail> apportionPaidAmount(Bill bill, Object masterData) {
        bill.getBillDetails().sort(Comparator.comparing(BillDetail::getFromPeriod));
        List<BillDetail> billDetails = bill.getBillDetails();
        BigDecimal remainingAmount = bill.getAmountPaid();
        BigDecimal amount;
        Boolean isAmountPositive;

        if(bill.getIsAdvanceAllowed()){
            BigDecimal requiredAdvanceAmount = apportionAndGetRequiredAdvance(bill);
            remainingAmount = remainingAmount.add(requiredAdvanceAmount);
        }

        if(!config.getApportionByValueAndOrder())
            validateOrder(billDetails);

        BigDecimal amountBeforeApportion = remainingAmount;

        for (BillDetail billDetail : billDetails){

            if(remainingAmount.compareTo(BigDecimal.ZERO)==0){
                billDetail.setAmountPaid(BigDecimal.ZERO);
                continue;
            }

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
                    // FIX ME
                    // advance should be checked from purpose
                    if(!billAccountDetail.getTaxHeadCode().contains("ADVANCE")) {
                        billAccountDetail.setAdjustedAmount(amount);
                        remainingAmount = remainingAmount.subtract(amount);
                    }
                }
            }

            if(billDetail.getAmountPaid()==null)
                billDetail.setAmountPaid(BigDecimal.ZERO);

            billDetail.setAmountPaid(billDetail.getAmountPaid().add(amountBeforeApportion.subtract(remainingAmount)));
            amountBeforeApportion = remainingAmount;
        }


        //If advance amount is available
        if(remainingAmount.compareTo(BigDecimal.ZERO)>0){
            addAdvanceBillAccountDetail(remainingAmount,bill,masterData);
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
     * @param bill The bill for which apportioning is done
     * @param masterData The required masterData for the TaxHeads
     */
    private void addAdvanceBillAccountDetail(BigDecimal advanceAmount,Bill bill,Object masterData){
        List<BillDetail> billDetails = bill.getBillDetails();
        String taxHead = taxHeadMasterService.getAdvanceTaxHead(bill.getBusinessService(),masterData);
        BillAccountDetail billAccountDetailForAdvance = new BillAccountDetail();
        billAccountDetailForAdvance.setAmount(advanceAmount.negate());
        billAccountDetailForAdvance.setPurpose(Purpose.ADVANCE_AMOUNT);
        billAccountDetailForAdvance.setTaxHeadCode(taxHead);
        billDetails.get(billDetails.size()-1).getBillAccountDetails().add(billAccountDetailForAdvance);
    }


    /**
     * Apportions the advance taxhead and returns the advance amount.
     * @param bill
     * @return
     */
    private BigDecimal apportionAndGetRequiredAdvance(Bill bill){

        List<BillDetail> billDetails = bill.getBillDetails();

        BigDecimal totalPositiveAmount = BigDecimal.ZERO;

        for (BillDetail billDetail : billDetails) {

            if(billDetail.getAmount().compareTo(BigDecimal.ZERO) > 0 )
                totalPositiveAmount = totalPositiveAmount.add(billDetail.getAmount());

        }

        /**
         * If net amount to be paid is zero for all billDetails no advance payment from
         * previous billing cycles is required for apportion
         *
         */

        if(totalPositiveAmount.compareTo(BigDecimal.ZERO) == 0)
            return BigDecimal.ZERO;


        /* net = Bill Account Detail amount  - Bill Account Detail adj amount
        *  In case when advance + net > total Positive:  200 + (100 - 20)  > 230
        *  Bill Account Detail amount     100
           Bill Account Detail adj amount 20
           current advance    200
           Total positive     230
           final adjusted amount = 20 + (230 - 200) = 50
        * */

        BigDecimal advance = BigDecimal.ZERO;
        for (BillDetail billDetail : billDetails) {

            if(billDetail.getAmountPaid()==null)
                billDetail.setAmountPaid(BigDecimal.ZERO);

            for(BillAccountDetail billAccountDetail : billDetail.getBillAccountDetails()) {

                // FIX ME
                // advance should be checked from purpose
                if(billAccountDetail.getTaxHeadCode().contains("ADVANCE")){

                    BigDecimal net = billAccountDetail.getAmount().subtract(billAccountDetail.getAdjustedAmount());
                    if(advance.add(net).abs().compareTo(totalPositiveAmount) > 0){
                        BigDecimal diff = totalPositiveAmount.subtract(advance);
                        BigDecimal adjustedAmount = billAccountDetail.getAdjustedAmount();
                        billAccountDetail.setAdjustedAmount(adjustedAmount.add(diff).negate());
                        advance = totalPositiveAmount.negate();
                        billDetail.setAmountPaid(billDetail.getAmountPaid().add(diff.negate()));
                        break;
                    }
                    else {
                        advance = advance.add(net);
                        billAccountDetail.setAdjustedAmount(billAccountDetail.getAmount());
                        billDetail.setAmountPaid(billDetail.getAmountPaid().add(net));
                    }
                }

            }

        }
        return advance.negate();
    }





}
