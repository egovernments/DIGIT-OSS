package org.egov.pg.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pg.models.*;
import org.egov.pg.models.enums.CollectionType;
import org.egov.pg.repository.CollectionsRepository;
import org.egov.pg.web.models.TransactionRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
public class CollectionService {

    private CollectionsRepository collectionsRepository;

    CollectionService(CollectionsRepository collectionsRepository) {
        this.collectionsRepository = collectionsRepository;
    }

    public List<Receipt> generateReceipt(RequestInfo requestInfo, Transaction transaction) {


        List<BillDetail> billDetails = new ArrayList<>();

        for(TaxAndPayment taxAndPayment : transaction.getTaxAndPayments()){
            BillDetail billDetail = BillDetail.builder()
                    .amountPaid(taxAndPayment.getAmountPaid())
                    .totalAmount(taxAndPayment.getTaxAmount())
                    .businessService(taxAndPayment.getBusinessService())
                    .collectionType(CollectionType.ONLINE)
                    .billAccountDetails(Collections.singletonList(new BillAccountDetail()))
                    .build();

            billDetails.add(billDetail);
        }

        Bill bill = Bill.builder()
                .payerName(transaction.getUser().getName())
                .tenantId(transaction.getTenantId())
                .mobileNumber(transaction.getUser().getMobileNumber())
                .paidBy(transaction.getUser().getName())
                .id(transaction.getBillId())
                .taxAndPayments(transaction.getTaxAndPayments())
                .billDetails(billDetails)
                .build();

            Instrument instrument = Instrument.builder()
                    .amount(new BigDecimal(transaction.getTxnAmount()))
                    .instrumentType(InstrumentType.builder().name("Online").build())
                    .transactionType(TransactionType.Debit)
                    .transactionDateInput(transaction.getAuditDetails().getCreatedTime())
                    .transactionNumber(transaction.getTxnId())
                    .payee(transaction.getUser().getName())
                    .tenantId(transaction.getTenantId())
                    .build();

            Receipt receipt = Receipt.builder()
                    .bill(Collections.singletonList(bill))
                    .instrument(instrument)
                    .tenantId(transaction.getTenantId())
                    .build();

            ReceiptReq receiptReq = ReceiptReq.builder()
                    .receipt(Collections.singletonList(receipt))
                    .requestInfo(requestInfo)
                    .build();

            List<Receipt> receipts = collectionsRepository.generateReceipt(receiptReq).getReceipts();
            if (receipts.isEmpty()) {
                log.error("Unable to generate receipt");
                throw new CustomException("RECEIPT_GEN_COLLECTION_ERROR", "Receipt generation failed");
            } else
                return receipts;
    }

    public List<Receipt> validateProvisionalReceipt(TransactionRequest transactionRequest){
        Transaction transaction = transactionRequest.getTransaction();

        List<BillDetail> billDetails = new ArrayList<>();

        for(TaxAndPayment taxAndPayment : transaction.getTaxAndPayments()){
            BillDetail billDetail = BillDetail.builder()
                    .amountPaid(taxAndPayment.getAmountPaid())
                    .totalAmount(taxAndPayment.getTaxAmount())
                    .businessService(taxAndPayment.getBusinessService())
                    .collectionType(CollectionType.ONLINE)
                    .billAccountDetails(Collections.singletonList(new BillAccountDetail()))
                    .build();

            billDetails.add(billDetail);
        }

        Bill bill = Bill.builder()
                .payerName(transactionRequest.getRequestInfo().getUserInfo().getName())
                .tenantId(transaction.getTenantId())
                .mobileNumber(transactionRequest.getRequestInfo().getUserInfo().getMobileNumber())
                .paidBy(transactionRequest.getRequestInfo().getUserInfo().getName())
                .id(transaction.getBillId())
                .taxAndPayments(transaction.getTaxAndPayments())
                .billDetails(billDetails)
                .build();


        Instrument instrument = Instrument.builder()
                .amount(new BigDecimal(transaction.getTxnAmount()))
                .instrumentType(InstrumentType.builder().name("Online").build())
                .transactionType(TransactionType.Debit)
                .transactionDateInput(System.currentTimeMillis())
                .transactionNumber("PROV_RECEIPT_VALIDATE")
                .payee(transactionRequest.getRequestInfo().getUserInfo().getName())
                .tenantId(transaction.getTenantId())
                .build();

        Receipt receipt = Receipt.builder()
                .bill(Collections.singletonList(bill))
                .instrument(instrument)
                .tenantId(transaction.getTenantId())
                .build();

        ReceiptReq receiptReq = ReceiptReq.builder()
                .receipt(Collections.singletonList(receipt))
                .requestInfo(transactionRequest.getRequestInfo())
                .build();

        List<Receipt> receipts = collectionsRepository.validateReceipt(receiptReq).getReceipts();
        if (receipts.isEmpty()) {
            log.error("Unable to validate receipt");
            throw new CustomException("RECEIPT_VALIDATE_COLLECTION_ERROR", "Receipt validation failed");
        } else
            return receipts;

    }
}
