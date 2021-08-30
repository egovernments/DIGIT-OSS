package org.egov.tlcalculator.service;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.tlcalculator.utils.BillingslabConstants;
import org.egov.tlcalculator.utils.BillingslabUtils;
import org.egov.tlcalculator.utils.ResponseInfoFactory;
import org.egov.tlcalculator.web.models.BillingSlab;
import org.egov.tlcalculator.web.models.BillingSlabSearchCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class BPABillingSlabService {

    @Autowired
    BillingslabUtils billingslabUtils;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ResponseInfoFactory factory;

    public BillingSlab search(BillingSlabSearchCriteria billingSlabSearchCriteria, RequestInfo requestInfo) {
        StringBuilder uri = new StringBuilder();
        MdmsCriteriaReq request = billingslabUtils.prepareMDMSSearchReq(uri, billingSlabSearchCriteria.getTenantId(), BillingslabConstants.BPA_MDMS_MODULE_NAME, BillingslabConstants.BPA_MDMS_TRADETYPETOROLEMAPPING, "[?(@.tradeType=='" + billingSlabSearchCriteria.getTradeType() + "')]", requestInfo);
        try {
            Object response = restTemplate.postForObject(uri.toString(), request, Map.class);
            if (null != response) {
                String jsonPath = BillingslabConstants.BPA_MDMS_JSONPATH_FOR_MAPPING;

                List<Map<String, Object>> jsonOutput = JsonPath.read(response, jsonPath);
                Map<String, Object> billingProperties = jsonOutput.get(0);
                return BillingSlab.builder().id(String.valueOf(billingProperties.get("id"))).tradeType((String) billingProperties.get("tradeType")).rate(BigDecimal.valueOf((Integer) billingProperties.get("applicationFee"))).build();
            } else {
                throw new CustomException("BILLINGSEARCH_NULLRESPONSE", " Found empty response on billingslab search for BPA");
            }
        } catch (Exception e) {
            log.error("Couldn't fetch master: " + BillingslabConstants.BPA_MDMS_TRADETYPETOROLEMAPPING);
            log.error("Exception: " + e);
            throw new CustomException("BILLINGSEARCH_ERROR", " Error occured while searching billing slab for BPA");
        }
    }
}
