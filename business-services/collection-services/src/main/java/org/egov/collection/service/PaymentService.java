package org.egov.collection.service;

import org.apache.commons.lang3.StringUtils;
import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentRequest;
import org.egov.collection.producer.CollectionProducer;
import org.egov.collection.repository.PaymentRepository;
import org.egov.collection.util.PaymentEnricher;
import org.egov.collection.util.PaymentValidator;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.Receipt;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;


@Service
public class PaymentService {


    private ApportionerService apportionerService;

    private PaymentEnricher paymentEnricher;

    private ApplicationProperties applicationProperties;

    private UserService userService;

    private PaymentValidator paymentValidator;

    private PaymentRepository paymentRepository;

    private CollectionProducer producer;


    @Autowired
    public PaymentService(ApportionerService apportionerService, PaymentEnricher paymentEnricher, ApplicationProperties applicationProperties,
                          UserService userService, PaymentValidator paymentValidator, PaymentRepository paymentRepository, CollectionProducer producer) {
        this.apportionerService = apportionerService;
        this.paymentEnricher = paymentEnricher;
        this.applicationProperties = applicationProperties;
        this.userService = userService;
        this.paymentValidator = paymentValidator;
        this.paymentRepository = paymentRepository;
        this.producer = producer;
    }





    /**
     * Handles creation of a receipt, including multi-service, involves the following steps, - Enrich receipt from billing service
     * using bill id - Validate the receipt object - Enrich receipt with receipt numbers, coll type etc - Apportion paid amount -
     * Persist the receipt object - Create instrument
     *
     * @param paymentRequest payment request for which receipt has to be created
     * @return Created receipt
     */
    @Transactional
    public Payment createPayment(PaymentRequest paymentRequest) {
        paymentEnricher.enrichPaymentPreValidate(paymentRequest);
        paymentValidator.validatePaymentForCreate(paymentRequest);
        paymentEnricher.enrichPaymentPostValidate(paymentRequest);

        Payment payment = paymentRequest.getPayment();
        Map<String, Bill> billIdToApportionedBill = apportionerService.apportionBill(paymentRequest);
        paymentEnricher.enrichAdvanceTaxHead(new LinkedList<>(billIdToApportionedBill.values()));
        setApportionedBillsToPayment(billIdToApportionedBill,payment);

        String payerId = createUser(paymentRequest);
        if(!StringUtils.isEmpty(payerId))
            payment.setPayerId(payerId);
        paymentRepository.savePayment(payment);

        producer.producer(applicationProperties.getCreateReceiptTopicName(), applicationProperties
                .getCreatePaymentTopicName(), paymentRequest);


        return payment;
    }



    public String createUser(PaymentRequest paymentRequest) {
        String id = null;
        if(paymentRequest.getRequestInfo().getUserInfo().getType().equals("CITIZEN")) {
            id = paymentRequest.getRequestInfo().getUserInfo().getUuid();
        }else {
            if(applicationProperties.getIsUserCreateEnabled()) {
                Payment payment = paymentRequest.getPayment();
                Map<String, String> res = userService.getUser(paymentRequest.getRequestInfo(), payment.getMobileNumber(), payment.getTenantId());
                if(CollectionUtils.isEmpty(res.keySet())) {
                    id = userService.createUser(paymentRequest);
                }else {
                    id = res.get("id");
                }
            }
        }
        return id;
    }


    private void setApportionedBillsToPayment(Map<String, Bill> billIdToApportionedBill,Payment payment){
        Map<String,String> errorMap = new HashMap<>();
        payment.getPaymentDetails().forEach(paymentDetail -> {
            if(billIdToApportionedBill.get(paymentDetail.getBillId())!=null)
                paymentDetail.setBill(billIdToApportionedBill.get(paymentDetail.getBillId()));
            else errorMap.put("APPORTIONING_ERROR","The bill id: "+paymentDetail.getBillId()+" not present in apportion response");
        });
        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }



}
