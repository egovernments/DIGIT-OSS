/*
package org.egov.collection.service;

import static java.util.Objects.isNull;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.model.PaymentRequest;
import org.egov.collection.model.ReceiptSearchCriteria;
import org.egov.collection.producer.CollectionProducer;
import org.egov.collection.repository.BillingServiceRepository;
import org.egov.collection.repository.CollectionRepository;
import org.egov.collection.repository.InstrumentRepository;
import org.egov.collection.util.ReceiptEnricher;
import org.egov.collection.util.ReceiptValidator;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.Receipt;
import org.egov.collection.web.contract.ReceiptReq;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CollectionService {

    private CollectionRepository collectionRepository;
    private InstrumentRepository instrumentRepository;
    private BillingServiceRepository billingServiceRepository;
    private ReceiptEnricher receiptEnricher;
    private ReceiptValidator receiptValidator;
    private CollectionProducer collectionProducer;
    private ApplicationProperties applicationProperties;

    @Autowired
    private ApportionerService apportionerService;
    
    @Autowired
    private UserService userService;

    @Autowired
    public CollectionService(CollectionRepository collectionRepository, InstrumentRepository instrumentRepository,
                             BillingServiceRepository billingServiceRepository, ReceiptEnricher receiptEnricher,
                             ReceiptValidator receiptValidator, CollectionProducer collectionProducer,
                             ApplicationProperties applicationProperties) {
        this.collectionRepository = collectionRepository;
        this.instrumentRepository = instrumentRepository;
        this.billingServiceRepository = billingServiceRepository;
        this.receiptEnricher = receiptEnricher;
        this.receiptValidator = receiptValidator;
        this.collectionProducer = collectionProducer;
        this.applicationProperties = applicationProperties;
    }

    */
/**
     * Fetch all receipts matching the given criteria, enrich receipts with instruments
     *
     * @param requestInfo           Request info of the search
     * @param receiptSearchCriteria Criteria against which search has to be performed
     * @return List of matching receipts
     *//*

    public List<Receipt> getReceipts(RequestInfo requestInfo, ReceiptSearchCriteria receiptSearchCriteria) {
    	ReceiptReq receiptReq = ReceiptReq.builder().requestInfo(requestInfo).build();
    	Map<String, String> errorMap = new HashMap<>();
    	receiptValidator.validateUserInfo(receiptReq, errorMap);
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
		
        if (applicationProperties.isReceiptsSearchPaginationEnabled()) {
            receiptSearchCriteria.setOffset(isNull(receiptSearchCriteria.getOffset()) ? 0 : receiptSearchCriteria.getOffset());
            receiptSearchCriteria.setLimit(isNull(receiptSearchCriteria.getLimit()) ? applicationProperties.getReceiptsSearchDefaultLimit() :
                    receiptSearchCriteria.getLimit());
        } else {
            receiptSearchCriteria.setOffset(0);
            receiptSearchCriteria.setLimit(applicationProperties.getReceiptsSearchDefaultLimit());
        }
        if(requestInfo.getUserInfo().getType().equals("CITIZEN")) {
        	List<String> payerIds = new ArrayList<>();
        	payerIds.add(requestInfo.getUserInfo().getUuid());
        	receiptSearchCriteria.setPayerIds(payerIds);
        }
        List<Receipt> receipts = collectionRepository.fetchReceipts(receiptSearchCriteria);

        return receipts;
    }

    */
/**
     * Handles creation of a receipt, including multi-service, involves the following steps, - Enrich receipt from billing service
     * using bill id - Validate the receipt object - Enrich receipt with receipt numbers, coll type etc - Apportion paid amount -
     * Persist the receipt object - Create instrument
     *
     * @param receiptReq Receipt request for which receipt has to be created
     * @return Created receipt
     *//*

    @Transactional
    public Receipt createReceipt(ReceiptReq receiptReq) {
        receiptEnricher.enrichReceiptPreValidate(receiptReq);
        receiptValidator.validateReceiptForCreate(receiptReq);
        receiptEnricher.enrichReceiptPostValidate(receiptReq);

        Receipt receipt = receiptReq.getReceipt().get(0); // Why get(0)?
        Bill bill = receipt.getBill().get(0); // Why get(0)?
        List<Bill> bills = new ArrayList<>();
        bills.add(bill);
        Map<String, List<Bill>> apportionedBills = apportionerService.apportionBill(receiptReq.getRequestInfo(), bills);
        receiptEnricher.enrichAdvanceTaxHead(apportionedBills);
        bill = apportionedBills.get(bill.getTenantId()).get(0); //Will be changed if get(0) is removed from the top 2 lines
        String payerId = createUser(receiptReq);
        if(!StringUtils.isEmpty(payerId))
        	bill.setPayerId(payerId);
        receipt.getBill().set(0, bill);
        collectionRepository.saveReceipt(receipt);

        collectionProducer.producer(applicationProperties.getCreateReceiptTopicName(), applicationProperties
                .getCreateReceiptTopicKey(), receiptReq);
        
        //Pushing for notification to the user on payment
        collectionProducer.producer(applicationProperties.getPaymentReceiptLinkTopic(), applicationProperties
                .getPaymentReceiptLinkTopicKey(), receiptReq);

        return receipt;
    }

    */
/**
     * Handles creation of a receipt, including multi-service, involves the following steps, - Enrich receipt from billing service
     * using bill id - Validate the receipt object - Enrich receipt with receipt numbers, coll type etc - Apportion paid amount -
     * Persist the receipt object - Create instrument
     *
     * @param receiptReq Receipt request for which receipt has to be created
     * @return Created receipt
     *//*

    @Transactional
    public Receipt createPayment(PaymentRequest paymentRequest) {
        receiptEnricher.enrichPaymentPreValidate(paymentRequest);
        receiptValidator.validateReceiptForCreate(receiptReq);
        receiptEnricher.enrichReceiptPostValidate(receiptReq);

        Receipt receipt = receiptReq.getReceipt().get(0); // Why get(0)?
        Bill bill = receipt.getBill().get(0); // Why get(0)?
        List<Bill> bills = new ArrayList<>();
        bills.add(bill);
        Map<String, List<Bill>> apportionedBills = apportionerService.apportionBill(receiptReq.getRequestInfo(), bills);
        receiptEnricher.enrichAdvanceTaxHead(apportionedBills);
        bill = apportionedBills.get(bill.getTenantId()).get(0); //Will be changed if get(0) is removed from the top 2 lines
        String payerId = createUser(receiptReq);
        if(!StringUtils.isEmpty(payerId))
            bill.setPayerId(payerId);
        receipt.getBill().set(0, bill);
        collectionRepository.saveReceipt(receipt);

        collectionProducer.producer(applicationProperties.getCreateReceiptTopicName(), applicationProperties
                .getCreateReceiptTopicKey(), receiptReq);

        //Pushing for notification to the user on payment
        collectionProducer.producer(applicationProperties.getPaymentReceiptLinkTopic(), applicationProperties
                .getPaymentReceiptLinkTopicKey(), receiptReq);

        return receipt;
    }


    */
/**
     * If the receipt is being generated by -
     * employee: the user to whom the bill belongs to will be created in the sytem. and id is attached to the receipt.
     * citizen: id of the citizen is attached to the receipt. 
     * 
     * @param receiptReq
     * @return
     *//*

    public String createUser(ReceiptReq receiptReq) {
    	String id = null;
    	if(receiptReq.getRequestInfo().getUserInfo().getType().equals("CITIZEN")) {
    		id = receiptReq.getRequestInfo().getUserInfo().getUuid();
    	}else {
        	if(applicationProperties.getIsUserCreateEnabled()) {
        		Receipt receipt = receiptReq.getReceipt().get(0);
        		Bill bill = receipt.getBill().get(0);
        		Map<String, String> res = userService.getUser(receiptReq.getRequestInfo(), bill.getMobileNumber(), bill.getTenantId());
        		if(CollectionUtils.isEmpty(res.keySet())) {
        			id = userService.createUser(receiptReq.getRequestInfo(), bill);
        		}else {
        			id = res.get("id");
        		}
        	}
    	}
    	return id;
    }

    */
/**
     * Performs update of eligible receipts
     * Allows update of payee details, manual receipt number & date, additionalDetails
     * <p>
     * - If validated, update receipts as per the request
     * else, throws exception and exit
     *
     * @param receiptReq receipts to be updated
     * @return updated receipts
     *//*

    @Transactional
    public List<Receipt> updateReceipt(ReceiptReq receiptReq) {

        List<Receipt> validatedReceipts = receiptValidator.validateAndEnrichReceiptsForUpdate(receiptReq.getReceipt(),
                receiptReq.getRequestInfo());

        collectionRepository.updateReceipt(validatedReceipts);
        collectionProducer.producer(applicationProperties.getUpdateReceiptTopicName(), applicationProperties
                .getUpdateReceiptTopicKey(), new ReceiptReq(receiptReq.getRequestInfo(), validatedReceipts));

        return validatedReceipts;
    }

    */
/**
     * Validates a provisional receipt, - Enriches receipt from billing service using bill id - Validates the receipt object
     *
     * @param receiptReq Receipt request for which receipt has to be validated
     * @return Validated receipt
     *//*

    public List<Receipt> validateReceipt(ReceiptReq receiptReq) {
        receiptEnricher.enrichReceiptPreValidate(receiptReq);
        receiptValidator.validateReceiptForCreate(receiptReq);

        return receiptReq.getReceipt();
    }

}
*/
