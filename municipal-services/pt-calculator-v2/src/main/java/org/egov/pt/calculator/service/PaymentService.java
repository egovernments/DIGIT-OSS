package org.egov.pt.calculator.service;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.pt.calculator.repository.Repository;
import org.egov.pt.calculator.util.CalculatorUtils;
import org.egov.pt.calculator.web.models.collections.Payment;
import org.egov.pt.calculator.web.models.collections.PaymentResponse;
import org.egov.pt.calculator.web.models.collections.PaymentSearchCriteria;
import org.egov.pt.calculator.web.models.demand.Demand;
import org.egov.pt.calculator.web.models.property.Property;
import org.egov.pt.calculator.web.models.property.RequestInfoWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;

@Service
public class PaymentService {


    private Repository repository;

    private CalculatorUtils utils;

    private ObjectMapper mapper;

    private JdbcTemplate jdbcTemplate;


    @Autowired
    public PaymentService(Repository repository, CalculatorUtils utils, ObjectMapper mapper, JdbcTemplate jdbcTemplate) {
        this.repository = repository;
        this.utils = utils;
        this.mapper = mapper;
        this.jdbcTemplate = jdbcTemplate;
    }



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
        StringBuilder url = utils.getPaymentSearchUrl(criteria);
        return mapper.convertValue(repository.fetchResult(url, requestInfoWrapper), PaymentResponse.class).getPayments();
    }




}
