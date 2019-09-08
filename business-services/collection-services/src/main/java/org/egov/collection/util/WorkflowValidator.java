package org.egov.collection.util;

import lombok.extern.slf4j.Slf4j;
import org.egov.collection.web.contract.Receipt;
import org.egov.collection.web.contract.ReceiptWorkflow;
import org.egov.tracer.model.CustomException;
import org.springframework.stereotype.Component;

import java.util.*;

@Slf4j
@Component
public class WorkflowValidator {

    /**
     * Validate receipts for remittance
     * Validation fails even if any one of the requests fails to pass validation
     *
     *  - Checks if receipts to be validated exist
     *
     * @param receiptWorkflows Workflow requests
     * @param receipts Receipts from database
     * @return validated or throw exception if validation fails
     */
    public List<Receipt> validateForRemit(List<ReceiptWorkflow> receiptWorkflows, List<Receipt> receipts){

        Map<String, Receipt> receiptsByReceiptNumber = new HashMap<>();

        for (Receipt receipt : receipts){
            receiptsByReceiptNumber.put(receipt.getReceiptNumber(), receipt);
        }

        return doReceiptsExist(receiptWorkflows, receiptsByReceiptNumber);

    }

    /**
     * Validate receipts for cancellation
     * Validation fails even if any one of the requests fails to pass validation
     *
     *  - Checks if receipts to be validated exist
     *  - Ensures that only the latest receipt of a consumer code is being cancelled
     *
     * @param receiptWorkflows Workflow requests
     * @param receipts Receipts from database
     * @return validated or throw exception if validation fails
     */
    public List<Receipt> validateForCancel(List<ReceiptWorkflow> receiptWorkflows, List<Receipt> receipts){
        Map<String, String> errorMap = new HashMap<>();


        Map<String, Receipt> receiptsByReceiptNumber = new HashMap<>();
        Map<String, LinkedList<Receipt>> receiptsByConsumerCode = new HashMap<>();

        for (Receipt receipt : receipts){

            receiptsByReceiptNumber.put(receipt.getReceiptNumber(), receipt);

            if(receiptsByConsumerCode.containsKey(receipt.getConsumerCode())){
                receiptsByConsumerCode.get(receipt.getConsumerCode())
                        .add(receipt);
            }
            else{
                LinkedList<Receipt> temp = new LinkedList<>();
                temp.add(receipt);
                receiptsByConsumerCode.put(receipt.getConsumerCode(), temp);
            }
        }

        List<Receipt> receiptsToProcess = doReceiptsExist(receiptWorkflows, receiptsByReceiptNumber);

        receiptsToProcess.sort(Collections.reverseOrder(Comparator.comparingLong(Receipt::getReceiptDate)));

        for (Receipt current: receiptsToProcess){
            if(receiptsByConsumerCode.containsKey(current.getConsumerCode()) &&
                    receiptsByConsumerCode.get(current.getConsumerCode()).getFirst().getReceiptNumber()
                            .equalsIgnoreCase(current.getReceiptNumber())){
                receiptsByConsumerCode.get(current.getConsumerCode()).removeFirst();
            }
            else {
                log.error("Receipt not the latest receipt for the consumer code {} , perform operation for {} first ",
                        current.getReceiptNumber(), receiptsByConsumerCode.get(current.getConsumerCode()).getFirst()
                                .getReceiptNumber());
                errorMap.put("RECEIPT_WORKFLOW_ACTION_NOT_APPLICABLE", "Can only cancel / dishonour latest receipt " +
                        "for a consumer code. Dishonour of receipt possible only after deposited! ");
            }

        }

        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);

        return receiptsToProcess;
    }

    private List<Receipt> doReceiptsExist(List<ReceiptWorkflow> receiptWorkflows, Map<String, Receipt>
            receiptsByReceiptNumber){
        Map<String, String> errorMap = new HashMap<>();
        List<Receipt> receiptsToProcess = new ArrayList<>();

        for(ReceiptWorkflow current : receiptWorkflows){
            if(!receiptsByReceiptNumber.containsKey(current.getReceiptNumber())){
                log.error("Receipt not found with receipt number {} or not in editable status ", current.getReceiptNumber());
                errorMap.put("RECEIPT_WORKFLOW_INVALID_RECEIPT",
                        "Receipt not found in the system or not in editable state, "+current.getReceiptNumber());
            } else {
                receiptsToProcess.add(receiptsByReceiptNumber.get(current.getReceiptNumber()));
            }
        }

        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);
        else
            return receiptsToProcess;
    }

}
