package org.egov.service;

import com.jayway.jsonpath.JsonPath;
import org.egov.tracer.model.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.egov.util.ApportionConstants.*;

@Service
public class TaxHeadMasterService {


    /**
     * Fetches the advance amount taxHead for the given businessService from MDMSData
     * @param businessService The businessService for which taxhead is to be fetched
     * @param mdmsData The master data received from MDMS Service
     * @return The code of the TaxHead
     */
   public String getAdvanceTaxHead(String businessService,Object mdmsData){

       String jsonpath = ADVANCE_TAXHEAD_JSONPATH_CODE;
       jsonpath = jsonpath.replace("{}",businessService);


       List<String> taxHeads = JsonPath.read(mdmsData,jsonpath);

       if(CollectionUtils.isEmpty(taxHeads))
           throw new CustomException("NO TAXHEAD FOUND","No Advance taxHead found for businessService: "+businessService);

       return taxHeads.get(0);
   }


    /**
     * Creates a map of taxHeadCode to priority for taxHeads of given businessService
     * @param businessService
     * @param mdmsData
     * @return
     */
   public Map<String,Integer> getCodeToOrderMap(String businessService,Object mdmsData){

       String jsonpath = TAXHEAD_JSONPATH_CODE;
       jsonpath = jsonpath.replace("{}",businessService);

       List<Map<String,String>> taxHeads = JsonPath.read(mdmsData,jsonpath);

       if(CollectionUtils.isEmpty(taxHeads))
           throw new CustomException("NO TAXHEAD FOUND","No taxHeads found for businessService: "+businessService);

       Map<String,Integer> codeToOrderMap = new HashMap<>();

       taxHeads.forEach(taxHead -> {
           String taxHeadCode = taxHead.get(MDMS_TAXHEADCODE_KEY);
           Integer order = Integer.valueOf(taxHead.get(MDMS_ORDER_KEY));
           codeToOrderMap.put(taxHeadCode,order);
       });

       return codeToOrderMap;
   }


    /**
     * Fetches the isAdvanceAllowed flag from the MDMS data for the given businessService
     * @param businessService BusinessService for which advance flag has to be returned
     * @param mdmsData MDMS data for Billing
     * @return boolean flag indicating whether advance payment is allowed for the given businessService
     */
   public Boolean isAdvanceAllowed(String businessService, Object mdmsData){

       String jsonpath = ADVANCE_BUSINESSSERVICE_JSONPATH_CODE;
       jsonpath = jsonpath.replace("{}",businessService);

       List<Boolean> isAdvanceAllowedList = JsonPath.read(mdmsData,jsonpath);

       if(CollectionUtils.isEmpty(isAdvanceAllowedList))
           throw new CustomException("NO BUSINESSSERVICE FOUND","No businessService or isAdvanceAllowed flag found for code: "+businessService);

       return isAdvanceAllowedList.get(0);
   }


}
