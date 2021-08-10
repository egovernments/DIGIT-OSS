package org.egov.service.apportions;

import org.egov.config.ApportionConfig;
import org.egov.service.ApportionV2;
import org.egov.service.TaxHeadMasterService;
import org.egov.tracer.model.CustomException;
import org.egov.web.models.ApportionRequestV2;
import org.egov.web.models.Bucket;
import org.egov.web.models.TaxDetail;
import org.egov.web.models.enums.Purpose;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.egov.util.ApportionConstants.DEFAULT;

@Service
public class OrderByPriority implements ApportionV2 {


    private TaxHeadMasterService taxHeadMasterService;

    private ApportionConfig config;


    @Autowired
    public OrderByPriority(TaxHeadMasterService taxHeadMasterService, ApportionConfig config) {
        this.taxHeadMasterService = taxHeadMasterService;
        this.config = config;
    }


    @Override
    public String getBusinessService() {
        return DEFAULT;
    }

    @Override
    public List<TaxDetail> apportionPaidAmount(ApportionRequestV2 apportionRequestV2, Object masterData) {
        List<TaxDetail> taxDetails = apportionRequestV2.getTaxDetails();
        taxDetails.sort(Comparator.comparing(TaxDetail::getFromPeriod));
        BigDecimal remainingAmount = apportionRequestV2.getAmountPaid();
        BigDecimal amount;
        Boolean isAmountPositive;

        /*
        * If zero amount payment is done and the total amount of bill or demands is zero. We will
        * set the collection amount to the taxamount for all taxHeads
        * */
        if(apportionRequestV2.getAmountPaid().compareTo(BigDecimal.ZERO) == 0
                && getTotalAmount(taxDetails).compareTo(BigDecimal.ZERO) == 0){
            apportionZeroPaymentAndZeroAmountToBePaid(taxDetails);
            return taxDetails;
        }

        if(apportionRequestV2.getIsAdvanceAllowed()){
            BigDecimal requiredAdvanceAmount = apportionAndGetRequiredAdvance(apportionRequestV2);
            remainingAmount = remainingAmount.add(requiredAdvanceAmount);
        }

        if(!config.getApportionByValueAndOrder())
            validateOrder(taxDetails);

        BigDecimal amountBeforeApportion = remainingAmount;

        for (TaxDetail taxDetail : taxDetails){

            if(remainingAmount.compareTo(BigDecimal.ZERO)==0){
                taxDetail.setAmountPaid(BigDecimal.ZERO);
                continue;
            }

            if(!config.getApportionByValueAndOrder())
                taxDetail.getBuckets().sort(Comparator.comparing(Bucket::getAmount));
            else
                taxDetail.getBuckets().sort(Comparator.comparing(Bucket::getAmount).thenComparing(Bucket::getPriority));


            for(Bucket bucket : taxDetail.getBuckets()) {

                amount = bucket.getAmount().subtract(bucket.getAdjustedAmount());
                isAmountPositive = amount.compareTo(BigDecimal.ZERO) >= 0;

                if (isAmountPositive) {

                    if (remainingAmount.equals(BigDecimal.ZERO)) {
                        bucket.setAdjustedAmount(bucket.getAdjustedAmount().add(BigDecimal.ZERO));
                        continue;
                    }

                    if (remainingAmount.compareTo(amount) <= 0) {
                        bucket.setAdjustedAmount(bucket.getAdjustedAmount().add(remainingAmount));
                        remainingAmount = BigDecimal.ZERO;
                    }

                    if (remainingAmount.compareTo(amount) > 0) {
                        bucket.setAdjustedAmount(bucket.getAdjustedAmount().add(amount));
                        remainingAmount = remainingAmount.subtract(amount);
                    }
                }
                else {
                    // FIX ME
                    // advance should be checked from purpose
                    if(!bucket.getTaxHeadCode().contains("ADVANCE")) {
                        bucket.setAdjustedAmount(amount);
                        remainingAmount = remainingAmount.subtract(amount);
                    }
                }
            }

            if(taxDetail.getAmountPaid()==null)
                taxDetail.setAmountPaid(BigDecimal.ZERO);

            taxDetail.setAmountPaid(taxDetail.getAmountPaid().add(amountBeforeApportion.subtract(remainingAmount)));
            amountBeforeApportion = remainingAmount;
        }


        //If advance amount is available
        if(remainingAmount.compareTo(BigDecimal.ZERO)>0){
            addAdvanceBillAccountDetail(remainingAmount,apportionRequestV2,masterData);
        }


        return taxDetails;
    }



    /**
     * Creates a advance BillAccountDetail and adds it to the latest billDetail
     * @param advanceAmount The advance amount paid
     * @param apportionRequestV2 The bill for which apportioning is done
     * @param masterData The required masterData for the TaxHeads
     */
    private void addAdvanceBillAccountDetail(BigDecimal advanceAmount, ApportionRequestV2 apportionRequestV2, Object masterData){
        List<TaxDetail> taxDetails = apportionRequestV2.getTaxDetails();
        String taxHead = taxHeadMasterService.getAdvanceTaxHead(apportionRequestV2.getBusinessService(),masterData);

        TaxDetail latestTaxDetail = taxDetails.get(taxDetails.size()-1);
        Bucket bucketForAdvance = null;


        // Search if advance bucket already exist
        for(Bucket bucket : latestTaxDetail.getBuckets()){
            if(bucket.getTaxHeadCode().contains("ADVANCE")){
                bucketForAdvance = bucket;
                break;
            }
        }

        // If advance bucket is not present add new one else update existing one
        if(bucketForAdvance == null){
            // Creating the advance bucket
            bucketForAdvance = new Bucket();
            bucketForAdvance.setAmount(advanceAmount.negate());
            bucketForAdvance.setPurpose(Purpose.ADVANCE_AMOUNT);
            bucketForAdvance.setTaxHeadCode(taxHead);

            // Setting the advance bucket in the latest taxDetail
            taxDetails.get(taxDetails.size()-1).getBuckets().add(bucketForAdvance);
        }

        else {
            bucketForAdvance.setAmount(bucketForAdvance.getAmount().add(advanceAmount.negate()));
        }


        // Updating the amountPaid in the taxDetail
        BigDecimal amountPaid = taxDetails.get(taxDetails.size()-1).getAmountPaid();
        taxDetails.get(taxDetails.size()-1).setAmountPaid(amountPaid.add(advanceAmount));
    }


    private void validateOrder(List<TaxDetail> taxDetails){
        Map<String,String> errorMap = new HashMap<>();
        taxDetails.forEach(taxDetail -> {

            if(taxDetail.getFromPeriod()==null)
                errorMap.put("INVALID PERIOD","The fromPeriod cannot be null");

            List<Bucket> buckets = taxDetail.getBuckets();

            int maxOrderOfNegativeTaxHead = Integer.MIN_VALUE;
            int minOrderOfPositiveTaxHead = Integer.MAX_VALUE;

            for(int i=0;i<buckets.size();i++){
                if(buckets.get(i).getPriority()==null){
                    errorMap.put("INVALID ORDER","Order is null for: "+buckets.get(i));
                    continue;
                }

                if(buckets.get(i).getAmount().compareTo(BigDecimal.ZERO)>0 &&
                        minOrderOfPositiveTaxHead > buckets.get(i).getPriority()){
                    minOrderOfPositiveTaxHead = buckets.get(i).getPriority();
                }
                else if(buckets.get(i).getAmount().compareTo(BigDecimal.ZERO)<0 &&
                        maxOrderOfNegativeTaxHead < buckets.get(i).getPriority()){
                    maxOrderOfNegativeTaxHead = buckets.get(i).getPriority();
                }
            }
            if(minOrderOfPositiveTaxHead < maxOrderOfNegativeTaxHead)
                throw new CustomException("INVALID ORDER","Positive TaxHeads should be after Negative TaxHeads");
        });
        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }


    /**
     * Apportions the advance taxhead and returns the advance amount.
     * @param apportionRequestV2
     * @return
     */
    private BigDecimal apportionAndGetRequiredAdvance(ApportionRequestV2 apportionRequestV2){

        List<TaxDetail> taxDetails = apportionRequestV2.getTaxDetails();

        BigDecimal totalPositiveAmount = BigDecimal.ZERO;

        for (TaxDetail taxDetail : taxDetails) {

            if(taxDetail.getAmountToBePaid().compareTo(BigDecimal.ZERO) > 0 )
                totalPositiveAmount = totalPositiveAmount.add(taxDetail.getAmountToBePaid());

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
        for (TaxDetail taxDetail : taxDetails) {

            if(taxDetail.getAmountPaid()==null)
                taxDetail.setAmountPaid(BigDecimal.ZERO);

            for(Bucket bucket : taxDetail.getBuckets()) {

                // FIX ME
                // advance should be checked from purpose
                if(bucket.getTaxHeadCode().contains("ADVANCE")){

                    BigDecimal net = bucket.getAmount().subtract(bucket.getAdjustedAmount());
                    if(advance.add(net).abs().compareTo(totalPositiveAmount) > 0){
                        // Advance heads whose amount is partially getting used
                        BigDecimal diff = totalPositiveAmount.subtract(advance.abs());
                        BigDecimal adjustedAmount = bucket.getAdjustedAmount();
                        bucket.setAdjustedAmount(adjustedAmount.add(diff.negate()));
                        advance = totalPositiveAmount.negate();
                        taxDetail.setAmountPaid(taxDetail.getAmountPaid().add(diff.negate()));
                        break;
                    }
                    else {
                        // Advance heads whose amount is completely getting used
                        advance = advance.add(net);
                        bucket.setAdjustedAmount(bucket.getAmount());
                        taxDetail.setAmountPaid(taxDetail.getAmountPaid().add(net));
                    }
                }

            }

        }
        return advance.negate();
    }


    private BigDecimal getTotalAmount(List<TaxDetail> taxDetails){

        BigDecimal totalAmount = BigDecimal.ZERO;

        for(TaxDetail taxDetail : taxDetails){

            totalAmount = totalAmount.add(taxDetail.getAmountToBePaid());

        }
        return totalAmount;
    }

    /**
     * In case of zero payment and total amount to be paid equal to zero
     * we set adjusted amount equal to tax amount for all buckets
     * @param taxDetails
     */
    private void apportionZeroPaymentAndZeroAmountToBePaid(List<TaxDetail> taxDetails){

        for(TaxDetail taxDetail : taxDetails){

            List<Bucket> buckets = taxDetail.getBuckets();

            buckets.forEach(bucket -> {
                bucket.setAdjustedAmount(bucket.getAmount());
            });

        }

    }







}
