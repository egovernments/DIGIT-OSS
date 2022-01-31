package org.egov.pt.calculator.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.calculator.producer.Producer;
import org.egov.pt.calculator.repository.PTCalculatorDBRepository;
import org.egov.pt.calculator.util.BillingSlabUtils;
import org.egov.pt.calculator.util.Configurations;
import org.egov.pt.calculator.util.ResponseInfoFactory;
import org.egov.pt.calculator.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j

public class MutationBillingSlabService {
    @Autowired
    private BillingSlabUtils billingSlabUtils;

    @Autowired
    private Producer producer;

    @Autowired
    private Configurations configurations;

    @Autowired
    private PTCalculatorDBRepository dbRepository;

    @Autowired
    private ResponseInfoFactory factory;

    @Value("${billingslab.max.marketValue}")
    private Double maxMarketValue;

    public MutationBillingSlabRes createBillingSlab(MutationBillingSlabReq billingSlabReq) {
        enrichBillingSlabForCreate(billingSlabReq);
        String tenantId = billingSlabReq.getBillingSlab().get(0).getTenantId();
        producer.push(tenantId,configurations.getMutationbillingSlabSavePersisterTopic(), billingSlabReq);
        return billingSlabUtils.getMutationBillingSlabResponse(billingSlabReq);
    }

    public MutationBillingSlabRes updateBillingSlab(MutationBillingSlabReq billingSlabReq) {
        enrichBillingSlabForUpdate(billingSlabReq);
        String tenantId = billingSlabReq.getBillingSlab().get(0).getTenantId();
        producer.push(tenantId,configurations.getMutationbillingSlabUpdatePersisterTopic(), billingSlabReq);
        return billingSlabUtils.getMutationBillingSlabResponse(billingSlabReq);
    }

    public void enrichBillingSlabForCreate(MutationBillingSlabReq billingSlabReq) {
        for(MutationBillingSlab billingSlab: billingSlabReq.getBillingSlab()) {
            billingSlab.setId(UUID.randomUUID().toString());
            if(null == billingSlab.getMaxMarketValue()) {
                billingSlab.setMaxMarketValue((null == maxMarketValue) ? Double.POSITIVE_INFINITY : maxMarketValue);
            }
        }
    }

    public void enrichBillingSlabForUpdate(MutationBillingSlabReq billingSlabReq) {
        for(MutationBillingSlab billingSlab: billingSlabReq.getBillingSlab()) {
            if(null == billingSlab.getMaxMarketValue()) {
                billingSlab.setMaxMarketValue((null == maxMarketValue) ? Double.POSITIVE_INFINITY : maxMarketValue);
            }
        }
    }

    public MutationBillingSlabRes searchBillingSlabs(RequestInfo requestInfo, MutationBillingSlabSearchCriteria billingSlabSearcCriteria) {
        List<MutationBillingSlab> billingSlabs = null;
        try {
            billingSlabs = dbRepository.searchMutationBillingSlab(billingSlabSearcCriteria);
        } catch (Exception e) {
            log.error("Exception while fetching billing slabs from db: " + e);
            billingSlabs = new ArrayList<>();
        }
        return MutationBillingSlabRes.builder().responseInfo(factory.createResponseInfoFromRequestInfo(requestInfo, true))
                .billingSlab(billingSlabs).build();
    }
}
