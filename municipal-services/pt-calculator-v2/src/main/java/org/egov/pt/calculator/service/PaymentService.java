package org.egov.pt.calculator.service;


import static org.egov.pt.calculator.util.CalculatorConstants.ALLOWED_RECEIPT_STATUS;
import static org.egov.pt.calculator.util.CalculatorConstants.CONSUMER_CODE_SEARCH_FIELD_NAME_PAYMENT;
import static org.egov.pt.calculator.util.CalculatorConstants.SEPARATER;
import static org.egov.pt.calculator.util.CalculatorConstants.STATUS_FIELD_FOR_SEARCH_URL;
import static org.egov.pt.calculator.util.CalculatorConstants.TENANT_ID_FIELD_FOR_SEARCH_URL;
import static org.egov.pt.calculator.util.CalculatorConstants.URL_PARAMS_SEPARATER;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.egov.pt.calculator.repository.Repository;
import org.egov.pt.calculator.util.CalculatorConstants;
import org.egov.pt.calculator.util.Configurations;
import org.egov.pt.calculator.web.models.collections.Payment;
import org.egov.pt.calculator.web.models.collections.PaymentResponse;
import org.egov.pt.calculator.web.models.collections.PaymentSearchCriteria;
import org.egov.pt.calculator.web.models.demand.Demand;
import org.egov.pt.calculator.web.models.property.Property;
import org.egov.pt.calculator.web.models.property.RequestInfoWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class PaymentService {


	@Autowired
    private Repository repository;

	@Autowired
    private ObjectMapper mapper;

    @Autowired
    private Configurations configurations;


    /**
     * Gets all payments corresponding to the given demand
     * @param demand
     * @param requestInfoWrapper
     * @return
     */
    public List<Payment> getPaymentsFromDemand(Demand demand, RequestInfoWrapper requestInfoWrapper) {
        PaymentSearchCriteria criteria = new PaymentSearchCriteria();
        criteria.setTenantId(demand.getTenantId());
        criteria.setConsumerCodes(Collections.singleton(demand.getConsumerCode()));
        List<Payment> payments = getPayments(criteria, requestInfoWrapper);
        if(!CollectionUtils.isEmpty(payments))
            payments.sort(Comparator.comparing(payment -> payment.getTransactionDate()));
        return payments;
    }


    /**
     * Gets all payments corresponding to the given demand
     * @param property
     * @param requestInfoWrapper
     * @return
     */
    public List<Payment> getPaymentsFromProperty(Property property, RequestInfoWrapper requestInfoWrapper) {
        PaymentSearchCriteria criteria = new PaymentSearchCriteria();
        criteria.setTenantId(property.getTenantId());
        criteria.setConsumerCodes(Collections.singleton(property.getPropertyId()));
        List<Payment> payments = getPayments(criteria, requestInfoWrapper);
        if(!CollectionUtils.isEmpty(payments))
            payments.sort(Comparator.comparing(payment -> payment.getTransactionDate()));
        return payments;
    }




    /**
     * Fetches the payments for the given params
     * @param criteria
     * @param requestInfoWrapper
     * @return
     */
    public List<Payment> getPayments(PaymentSearchCriteria criteria, RequestInfoWrapper requestInfoWrapper) {
        StringBuilder url = getPaymentSearchUrl(criteria);
        return mapper.convertValue(repository.fetchResult(url, requestInfoWrapper), PaymentResponse.class).getPayments();
    }
    
    /**
     * Returns the Receipt search Url with tenantId, cosumerCode,service name and tax period
     * parameters
     *
     * @param criteria
     * @return
     */
    public StringBuilder getPaymentSearchUrl(PaymentSearchCriteria criteria) {


        return new StringBuilder().append(configurations.getCollectionServiceHost())
                .append(configurations.getPaymentSearchEndpoint()).append(URL_PARAMS_SEPARATER)
                .append(TENANT_ID_FIELD_FOR_SEARCH_URL).append(criteria.getTenantId())
                .append(SEPARATER).append(CONSUMER_CODE_SEARCH_FIELD_NAME_PAYMENT)
                .append(StringUtils.join(criteria.getConsumerCodes(),","))
                .append(CalculatorConstants.SEPARATER).append(STATUS_FIELD_FOR_SEARCH_URL)
                .append(ALLOWED_RECEIPT_STATUS);
    }

}
