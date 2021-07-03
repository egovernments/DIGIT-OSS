package org.egov.echallancalculation.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.echallancalculation.config.ChallanConfiguration;
import org.egov.echallancalculation.model.AuditDetails;
import org.egov.echallancalculation.model.Challan;
import org.egov.echallancalculation.model.ChallanResponse;
import org.egov.echallancalculation.model.RequestInfoWrapper;
import org.egov.echallancalculation.repository.ServiceRequestRepository;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

@Component
public class CalculationUtils {


    @Autowired
    private ChallanConfiguration config;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private ObjectMapper mapper;


    /**
     * Creates tradeLicense search url based on tenantId and applicationNumber
     * @return tradeLicense search url
     */
  private String getChallanSearchURL(){
      StringBuilder url = new StringBuilder(config.getChallanHost());
      url.append(config.getChallanContextPath());
      url.append(config.getChallansearchEndPoint());
      url.append("?");
      url.append("tenantId=");
      url.append("{1}");
      url.append("&");
      url.append("applicationNumber=");
      url.append("{2}");
      return url.toString();
  }


    /**
     * Creates demand Search url based on tenanatId,businessService and ConsumerCode
     * @return demand search url
     */
    public String getDemandSearchURL(){
        StringBuilder url = new StringBuilder(config.getBillingHost());
        url.append(config.getDemandSearchEndpoint());
        url.append("?");
        url.append("tenantId=");
        url.append("{1}");
        url.append("&");
        url.append("businessService=");
        url.append("{2}");
        url.append("&");
        url.append("consumerCode=");
        url.append("{3}");
        return url.toString();
    }


    /**
     * Creates generate bill url using tenantId,consumerCode and businessService
     * @return Bill Generate url
     */
    public String getBillGenerateURI(){
        StringBuilder url = new StringBuilder(config.getBillingHost());
        url.append(config.getFetchBillEndpoint());
        url.append("?");
        url.append("tenantId=");
        url.append("{1}");
        url.append("&");
        url.append("consumerCode=");
        url.append("{2}");
        url.append("&");
        url.append("businessService=");
        url.append("{3}");

        return url.toString();
    }

    public AuditDetails getAuditDetails(String by, Boolean isCreate) {
        Long time = System.currentTimeMillis();
        if(isCreate)
            return AuditDetails.builder().createdBy(by).lastModifiedBy(by).createdTime(time).lastModifiedTime(time).build();
        else
            return AuditDetails.builder().lastModifiedBy(by).lastModifiedTime(time).build();
    }

    public Challan getChallan(RequestInfo requestInfo, String challanNo, String tenantId){
        String url = getChallanSearchURL();
        url = url.replace("{1}",tenantId).replace("{2}",challanNo);

        Object result =serviceRequestRepository.fetchResult(new StringBuilder(url),RequestInfoWrapper.builder().
                requestInfo(requestInfo).build());

        ChallanResponse response =null;
        try {
                response = mapper.convertValue(result,ChallanResponse.class);
        }
        catch (IllegalArgumentException e){
            throw new CustomException("PARSING ERROR","Error while parsing response of challan Search");
        }

        if(response==null || CollectionUtils.isEmpty(response.getChallans()))
            return null;

        return response.getChallans().get(0);
    }

}
