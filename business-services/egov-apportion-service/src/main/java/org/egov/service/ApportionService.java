package org.egov.service;

import static org.egov.util.ApportionConstants.DEFAULT;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.egov.config.ApportionConfig;
import org.egov.producer.Producer;
import org.egov.util.ApportionUtil;
import org.egov.web.models.ApportionRequest;
import org.egov.web.models.AuditDetails;
import org.egov.web.models.BillDetail;
import org.egov.web.models.BillInfo;
import org.egov.web.models.TaxAndPayment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;


@Service
public class ApportionService {

    private final List<Apportion> apportions;
    private Map<String, Apportion> APPORTION_MAP = new HashMap<>();

    private ApportionUtil util;
    private Producer producer;
    private ApportionConfig config;
    private MDMSService mdmsService;


    @Autowired
    public ApportionService(List<Apportion> apportions, ApportionUtil util, Producer producer,
                            ApportionConfig config, MDMSService mdmsService) {
        this.apportions = Collections.unmodifiableList(apportions);
        this.util = util;
        this.producer = producer;
        this.config = config;
        this.mdmsService = mdmsService;
        initialize();
    }

    private void initialize() {
        if (Objects.isNull(apportions))
            throw new IllegalStateException("No Apportion found, spring initialization failed.");

        if (APPORTION_MAP.isEmpty() && !apportions.isEmpty()) {
            apportions.forEach(apportion -> {
                APPORTION_MAP.put(apportion.getBusinessService(), apportion);
            });
        }
        APPORTION_MAP = Collections.unmodifiableMap(APPORTION_MAP);
    }


    /**
     * Apportions the paid amount for the given list of bills
     *
     * @param request The apportion request
     * @return Apportioned Bills
     */
    public List<BillInfo> apportionBills(ApportionRequest request) {
        List<BillInfo> billInfos = request.getBills();
        Apportion apportion;

        //Save the request through persister
        producer.push(config.getRequestTopic(), request);

        //Fetch the required MDMS data
        Object masterData = mdmsService.mDMSCall(request);

        AuditDetails auditDetails = AuditDetails.builder().createdBy(request.getRequestInfo().getUserInfo()
                .getUuid()).createdTime(System.currentTimeMillis()).build();

        for (BillInfo billInfo : billInfos) {
        	
            // Create a map of businessService to list of billDetails belonging to that businessService
            Map<String, List<BillDetail>> businessServiceToBillDetails = util.groupByBusinessService(billInfo.getBillDetails());

			for (TaxAndPayment taxAndPayment : billInfo.getTaxAndPayments()) {

				String businessKey = taxAndPayment.getBusinessService();
				BigDecimal amountPaid = taxAndPayment.getAmountPaid();

				List<BillDetail> billDetails = businessServiceToBillDetails.get(businessKey);

				if (CollectionUtils.isEmpty(billDetails))
					continue;

				// Get the appropriate implementation of Apportion
				if (isApportionPresent(businessKey))
					apportion = getApportion(businessKey);
				else
					apportion = getApportion(DEFAULT);

				/*
				 * Apportion the paid amount among the given list of billDetail
				 */
				apportion.apportionPaidAmount(billDetails, amountPaid, masterData);
				billInfo.setAuditDetails(auditDetails);
			}
		}



        //Save the response through persister
        producer.push(config.getResponseTopic(), request);
        return billInfos;
    }


    /**
     * Retrives the apportion for the given businessService
     *
     * @param businessService The businessService of the billDetails
     * @return Apportion object for the given businessService
     */
    private Apportion getApportion(String businessService) {
        return APPORTION_MAP.get(businessService);
    }


    /**
     * Checks if the apportion is present for the given businessService
     *
     * @param businessService The businessService of the billDetails
     * @return True if the apportion is present else false
     */
    private Boolean isApportionPresent(String businessService) {
        return APPORTION_MAP.containsKey(businessService);
    }


}
