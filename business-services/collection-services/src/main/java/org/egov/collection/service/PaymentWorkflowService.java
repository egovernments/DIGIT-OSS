package org.egov.collection.service;


import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentSearchCriteria;
import org.egov.collection.model.enums.InstrumentStatusEnum;
import org.egov.collection.producer.CollectionProducer;
import org.egov.collection.repository.PaymentRepository;
import org.egov.collection.util.PaymentWorkflowValidator;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.PaymentWorkflow;
import org.egov.collection.web.contract.PaymentWorkflowRequest;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static java.util.Collections.reverseOrder;
import static java.util.Collections.singleton;
import static org.egov.collection.util.Utils.jsonMerge;

@Service
public class PaymentWorkflowService {



    private PaymentRepository paymentRepository;
    private PaymentWorkflowValidator paymentWorkflowValidator;
    private CollectionProducer collectionProducer;
    private ApplicationProperties applicationProperties;

    @Autowired
    public PaymentWorkflowService(PaymentRepository paymentRepository, PaymentWorkflowValidator
            paymentWorkflowValidator, CollectionProducer collectionProducer, ApplicationProperties applicationProperties) {
        this.paymentRepository = paymentRepository;
        this.paymentWorkflowValidator = paymentWorkflowValidator;
        this.collectionProducer = collectionProducer;
        this.applicationProperties = applicationProperties;

    }

    /**
     * Processes all workflow related requests
     *  - Verify that all workflow actions in the request are same
     *  - Handover processing of actions to sub methods
     *  - Persist the updated receipts
     *
     * @param paymentWorkflowRequest multiple actions
     * @return updated receipts
     */
    @Transactional
    public List<Payment> performWorkflow(PaymentWorkflowRequest paymentWorkflowRequest){

        // Basic validations

        PaymentWorkflow.PaymentAction action = paymentWorkflowRequest.getPaymentWorkflows().get(0).getAction();
        String tenantId = paymentWorkflowRequest.getPaymentWorkflows().get(0).getTenantId();

        Set<String> paymentIds = new HashSet<>();
        Map<String, PaymentWorkflow> workflowRequestByPaymentId = new HashMap<>();

        for(PaymentWorkflow workflow : paymentWorkflowRequest.getPaymentWorkflows()){
            if(!workflow.getAction().equals(action))
                throw new CustomException("PAYMENT_WORKFLOW_SINGLE_ACTION_ALLOWED", "All workflow requests should be " +
                        "of the same action");

            if(!workflow.getTenantId().equalsIgnoreCase(tenantId))
                throw new CustomException("CROSS_TENANT_OP_NOT_ALLOWED", "All requests should act on a single tenant ");

            paymentIds.add(workflow.getPaymentId());
            workflowRequestByPaymentId.put(workflow.getPaymentId(), workflow);
        }

        // Fetch consumer codes of receipts

        List<Payment> payments = paymentRepository.fetchPayments(PaymentSearchCriteria.builder()
                .ids(paymentIds)
                .tenantId(tenantId)
                .build());

        Set<String> consumerCodes = new HashSet<>();

        payments.forEach(payment -> {
            payment.getPaymentDetails().forEach(paymentDetail -> {
                consumerCodes.add(paymentDetail.getBill().getConsumerCode());
            });
        });

        List<Payment> processedPayments = new ArrayList<>();

        switch (action){
            case CANCEL:
                processedPayments = cancel(workflowRequestByPaymentId, consumerCodes,
                        paymentWorkflowRequest.getRequestInfo(), tenantId);
                break;
            case DISHONOUR:
                processedReceipts = dishonour(workflowRequestByReceiptNumber, consumerCodes,
                        receiptWorkflowRequest.getRequestInfo(), tenantId);
                break;
            case REMIT:
                processedReceipts = remit(workflowRequestByReceiptNumber, consumerCodes,
                        receiptWorkflowRequest.getRequestInfo(), tenantId);
                break;
        }

        return processedPayments;
    }


    private List<Payment> cancel(Map<String, PaymentWorkflow> workflowRequestByPaymentId, Set<String> consumerCodes,
                                 RequestInfo requestInfo, String tenantId){
        PaymentSearchCriteria paymentSearchCriteria = PaymentSearchCriteria
                .builder()
                .consumerCodes(consumerCodes)
                .status(singleton(InstrumentStatusEnum.APPROVED.toString()))
                .tenantId(tenantId)
                .build();

        List<Payment> payments = paymentRepository.fetchPayments(paymentSearchCriteria);
        payments.sort(reverseOrder(Comparator.comparingLong(Payment::getTransactionDate)));

        List<Payment> validatedPayments = paymentWorkflowValidator.validateForCancel(new ArrayList<>
                (workflowRequestByPaymentId.values()), payments);


        for(Payment payment : validatedPayments) {
            payment.setInstrumentStatus(InstrumentStatusEnum.CANCELLED);
            payment.getPaymentDetails().forEach(paymentDetail -> {
                Bill bill = paymentDetail.getBill();
                bill.setStatus(Bill.StatusEnum.CANCELLED);
                bill.setIsCancelled(true);
                bill.setReasonForCancellation(workflowRequestByPaymentId.get(payment.getId()).getReason());
                bill.setAdditionalDetails(jsonMerge(bill.getAdditionalDetails(),
                        workflowRequestByPaymentId.get(payment.getId()).getAdditionalDetails());
            });
            updateAuditDetails(payment, requestInfo);
        }

        collectionRepository.updateStatus(validatedReceipts);

        collectionProducer.producer(applicationProperties.getCancelReceiptTopicName(), applicationProperties
                .getCancelReceiptTopicKey(), new ReceiptReq(requestInfo, validatedReceipts));

        return validatedReceipts;
    }



    /**
     * Update audit details as per request
     *
     * @param payment which is being modified
     * @param requestInfo info about the request
     */
    public static void updateAuditDetails(Payment payment, RequestInfo requestInfo){
        Long currentTime = System.currentTimeMillis();
        payment.getAuditDetails().setLastModifiedBy(requestInfo.getUserInfo().getId().toString());
        payment.getAuditDetails().setLastModifiedDate(currentTime);

        payment.getPaymentDetails().forEach(paymentDetail -> {
            paymentDetail.getAuditDetails().setLastModifiedBy(requestInfo.getUserInfo().getId().toString());
            paymentDetail.getAuditDetails().setLastModifiedDate(currentTime);
            paymentDetail.getBill().getAuditDetails().setLastModifiedBy(requestInfo.getUserInfo().getId().toString());
            paymentDetail.getBill().getAuditDetails().setLastModifiedDate(currentTime);
        });

    }

}
