package org.egov.util;

import org.egov.web.models.BillDetail;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class ApportionUtil {


    /**
     * Groups the list of BillDetail by BusinessService
     * @param billDetails The BillDetails to be aggregated
     * @return Map of BusinessService to List of BillDetails
     */
    public Map<String,List<BillDetail>> groupByBusinessService(List<BillDetail> billDetails){

        Map<String,List<BillDetail>> businessServiceToBillDetails = new LinkedHashMap<>();

        for(BillDetail billDetail : billDetails){
            if(businessServiceToBillDetails.containsKey(billDetail.getBusinessService()))
                businessServiceToBillDetails.get(billDetail.getBusinessService()).add(billDetail);
            else {
                businessServiceToBillDetails.put(billDetail.getBusinessService(),new LinkedList<>(Arrays.asList(billDetail)));
            }
        }

         return businessServiceToBillDetails;
    }



    /**
     * Groups the list of BillDetail by ConsumerCode
     * @param billDetails The BillDetails to be aggregated
     * @return Map of ConsumerCode to List of BillDetails
     */
    public Map<String,List<BillDetail>> groupByConsumerCode(List<BillDetail> billDetails){

        Map<String,List<BillDetail>> consumerCodeToBillDetails = new LinkedHashMap<>();

        for(BillDetail billDetail : billDetails){
            if(consumerCodeToBillDetails.containsKey(billDetail.getConsumerCode()))
                consumerCodeToBillDetails.get(billDetail.getConsumerCode()).add(billDetail);
            else {
                consumerCodeToBillDetails.put(billDetail.getConsumerCode(),new LinkedList<>(Arrays.asList(billDetail)));
            }
        }

        return consumerCodeToBillDetails;
    }




}
