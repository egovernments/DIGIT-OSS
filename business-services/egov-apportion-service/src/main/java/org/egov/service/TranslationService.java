package org.egov.service;

import org.egov.tracer.model.CustomException;
import org.egov.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TranslationService {


    private TaxHeadMasterService taxHeadMasterService;


    @Autowired
    public TranslationService(TaxHeadMasterService taxHeadMasterService) {
        this.taxHeadMasterService = taxHeadMasterService;
    }


    public ApportionRequestV2 translate(Bill bill){

        String businessService = bill.getBusinessService();
        BigDecimal amountPaid = bill.getAmountPaid();
        Boolean isAdvanceAllowed = bill.getIsAdvanceAllowed();

        ApportionRequestV2 apportionRequestV2 = ApportionRequestV2.builder().amountPaid(amountPaid).businessService(businessService)
                                                .isAdvanceAllowed(isAdvanceAllowed).build();

        List<BillDetail> billDetails = bill.getBillDetails();

        for(BillDetail billDetail : billDetails){

            TaxDetail taxDetail = TaxDetail.builder().fromPeriod(billDetail.getFromPeriod()).amountToBePaid(billDetail.getAmount())
                                  .amountPaid((billDetail.getAmountPaid() == null) ? BigDecimal.ZERO : billDetail.getAmountPaid())
                                  .entityId(billDetail.getId())
                                  .build();

            billDetail.getBillAccountDetails().forEach(billAccountDetail -> {
                Bucket bucket = Bucket.builder().amount(billAccountDetail.getAmount())
                                .adjustedAmount((billAccountDetail.getAdjustedAmount()==null) ? BigDecimal.ZERO : billAccountDetail.getAdjustedAmount())
                                .taxHeadCode(billAccountDetail.getTaxHeadCode())
                                .priority(billAccountDetail.getOrder())
                                .entityId(billAccountDetail.getId())
                                .build();
                taxDetail.addBucket(bucket);
            });

            apportionRequestV2.addTaxDetail(taxDetail);
        }

        return apportionRequestV2;

    }



    public ApportionRequestV2 translate(List<Demand> demands,Object mdmsData) {

        // Group by businessService before calling this function
        String businessService = demands.get(0).getBusinessService();


        Map<String,Integer> codeToOrderMap = taxHeadMasterService.getCodeToOrderMap(businessService,mdmsData);

        // FIX ME
        BigDecimal amountPaid = BigDecimal.ZERO;
        Boolean isAdvanceAllowed = taxHeadMasterService.isAdvanceAllowed(businessService,mdmsData);


        ApportionRequestV2 apportionRequestV2 = ApportionRequestV2.builder().amountPaid(amountPaid).businessService(businessService)
                .isAdvanceAllowed(isAdvanceAllowed).build();

        Map<String,String> errorMap = new HashMap<>();

        for(Demand demand : demands){

            TaxDetail taxDetail = TaxDetail.builder().fromPeriod(demand.getTaxPeriodFrom()).entityId(demand.getId()).build();

            BigDecimal amountToBePaid = BigDecimal.ZERO;
            BigDecimal collectedAmount = BigDecimal.ZERO;

            for(DemandDetail demandDetail : demand.getDemandDetails()){

                Integer priority = codeToOrderMap.get(demandDetail.getTaxHeadMasterCode());

                if(priority == null)
                    errorMap.put("INVALID_TAXHEAD_CODE","Order is null or taxHead is not found for code: "+demandDetail.getTaxHeadMasterCode());

                Bucket bucket = Bucket.builder().amount(demandDetail.getTaxAmount())
                        .adjustedAmount((demandDetail.getCollectionAmount()==null) ? BigDecimal.ZERO : demandDetail.getCollectionAmount())
                        .taxHeadCode(demandDetail.getTaxHeadMasterCode())
                        .priority(priority)
                        .entityId(demandDetail.getId())
                        .build();
                taxDetail.addBucket(bucket);


                amountToBePaid = amountToBePaid.add(demandDetail.getTaxAmount());
                collectedAmount = collectedAmount.add(demandDetail.getCollectionAmount());
            }

            taxDetail.setAmountPaid(collectedAmount);
            taxDetail.setAmountToBePaid(amountToBePaid);

            apportionRequestV2.addTaxDetail(taxDetail);

        }

        if(!CollectionUtils.isEmpty(errorMap))
            throw new CustomException(errorMap);

        return apportionRequestV2;
    }





    }
