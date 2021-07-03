package org.egov.collection.util;

import lombok.extern.slf4j.Slf4j;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.web.contract.PaymentWorkflow;
import org.egov.tracer.model.CustomException;
import org.springframework.stereotype.Component;

import java.util.*;

import static java.util.Collections.reverseOrder;

@Component
@Slf4j
public class PaymentWorkflowValidator {




    public List<Payment> validateForRemit(List<PaymentWorkflow> paymentWorkflows, List<Payment> payments){

        Map<String, Payment> paymentsById = new HashMap<>();

        for (Payment payment : payments){
            paymentsById.put(payment.getId(), payment);
        }

        return doPaymentsExist(paymentWorkflows, paymentsById);

    }


    public List<Payment> validateForCancel(List<PaymentWorkflow> paymentWorkflows, List<Payment> payments){
        payments.sort(reverseOrder(Comparator.comparingLong(Payment::getTransactionDate)));

        Map<String, String> errorMap = new HashMap<>();
        Map<String, Payment> paymentById = new HashMap<>();
        Map<String, LinkedList<Payment>> paymentsByConsumerCode = new HashMap<>();

        for (Payment payment : payments){

            paymentById.put(payment.getId(), payment);

            payment.getPaymentDetails().forEach(paymentDetail -> {
                if (paymentsByConsumerCode.containsKey(paymentDetail.getBill().getConsumerCode())){
                    paymentsByConsumerCode.get(paymentDetail.getBill().getConsumerCode()).add(payment);
                }
                else{
                    LinkedList<Payment> temp = new LinkedList<>();
                    temp.add(payment);
                    paymentsByConsumerCode.put(paymentDetail.getBill().getConsumerCode(), temp);
                }
            });

        }
        List<Payment> paymentsToProcess = doPaymentsExist(paymentWorkflows, paymentById);

        paymentsToProcess.sort(Collections.reverseOrder(Comparator.comparingLong(Payment::getTransactionDate)));

        for (Payment payment: paymentsToProcess){
            for(PaymentDetail paymentDetail : payment.getPaymentDetails())
                if(paymentsByConsumerCode.containsKey(paymentDetail.getBill().getConsumerCode()) &&
                        paymentsByConsumerCode.get(paymentDetail.getBill().getConsumerCode()).getFirst().getId()
                                .equalsIgnoreCase(payment.getId())){
                    paymentsByConsumerCode.get(paymentDetail.getBill().getConsumerCode()).removeFirst();
                }
                else {
                    log.error("Payment not the latest payment for the consumer code {} , perform operation for {} first ",
                            paymentDetail.getBill().getConsumerCode(),  paymentsByConsumerCode.get(paymentDetail.getBill().getConsumerCode()).getFirst()
                                    .getId());
                    errorMap.put("RECEIPT_WORKFLOW_ACTION_NOT_APPLICABLE", "Can only cancel / dishonour latest receipt " +
                            "for a consumer code. Dishonour of receipt possible only after deposited! ");
                }

        }

        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);

        return paymentsToProcess;
    }

    private List<Payment> doPaymentsExist(List<PaymentWorkflow> paymentWorkflows, Map<String, Payment> paymentById){
        Map<String, String> errorMap = new HashMap<>();
        List<Payment> paymentsToProcess = new ArrayList<>();

        for(PaymentWorkflow current : paymentWorkflows){
            if(!paymentById.containsKey(current.getPaymentId())){
                log.error("Payment not found with paymentId {} or not in editable status ", current.getPaymentId());
                errorMap.put("RECEIPT_WORKFLOW_INVALID_RECEIPT",
                        "Payment not found in the system or not in editable state, "+current.getPaymentId());
            } else {
                paymentsToProcess.add(paymentById.get(current.getPaymentId()));
            }
        }

        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
        else
            return paymentsToProcess;
    }


}
