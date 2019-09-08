package org.egov.service;

import com.jayway.jsonpath.JsonPath;
import org.egov.tracer.model.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.List;

import static org.egov.util.ApportionConstants.ADVANCE_TAXHEAD_JSONPATH_CODE;

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

}
