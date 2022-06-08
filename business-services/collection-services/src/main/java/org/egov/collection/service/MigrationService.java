package org.egov.collection.service;

import static org.egov.collection.model.enums.InstrumentTypesEnum.CARD;
import static org.egov.collection.model.enums.InstrumentTypesEnum.ONLINE;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.model.AuditDetails;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.PaymentResponse;
import org.egov.collection.model.RequestInfoWrapper;
import org.egov.collection.model.enums.InstrumentStatusEnum;
import org.egov.collection.model.enums.PaymentModeEnum;
import org.egov.collection.model.enums.PaymentStatusEnum;
import org.egov.collection.model.enums.ReceiptStatus;
import org.egov.collection.model.v1.AuditDetails_v1;
import org.egov.collection.model.v1.BillAccountDetail_v1;
import org.egov.collection.model.v1.BillDetail_v1;
import org.egov.collection.model.v1.Bill_v1;
import org.egov.collection.model.v1.ReceiptSearchCriteria_v1;
import org.egov.collection.model.v1.Receipt_v1;
import org.egov.collection.producer.CollectionProducer;
import org.egov.collection.repository.ServiceRequestRepository;
import org.egov.collection.service.v1.CollectionService_v1;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.Bill.StatusEnum;
import org.egov.collection.web.contract.BillAccountDetail;
import org.egov.collection.web.contract.BillDetail;
import org.egov.collection.web.contract.BillResponse;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MigrationService {


    private ApplicationProperties properties;

    private ServiceRequestRepository serviceRequestRepository;

    private CollectionProducer producer;

    @Autowired
    private CollectionService_v1 collectionService;

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private ObjectMapper mapper;

    @Autowired
    public MigrationService(ApplicationProperties properties, ServiceRequestRepository serviceRequestRepository,CollectionProducer producer) {
        this.properties = properties;
        this.serviceRequestRepository = serviceRequestRepository;
        this.producer = producer;
    }

    public static final String TENANT_QUERY = "select distinct tenantid from egcl_receiptheader_v1 order by tenantid;";

    public void migrate(RequestInfo requestInfo, Integer offsetFromApi,  Integer batchSize, String tenantId) throws JsonProcessingException {
    	
        List<String> tenantIdList =jdbcTemplate.queryForList(TENANT_QUERY,String.class);
        for(String tenantIdEntry : tenantIdList){
        
        	Integer offset = offsetFromApi;
        	
			if (tenantId != null && !tenantIdEntry.equalsIgnoreCase(tenantId)) {
				continue;
			} else {
				tenantId = null;
				offsetFromApi = 0;
			}
        	
                while(true){
                    long startTime = System.currentTimeMillis();
                    ReceiptSearchCriteria_v1 criteria_v1 = ReceiptSearchCriteria_v1.builder()
                            .offset(offset).limit(batchSize).tenantId(tenantIdEntry).build();
                    List<Receipt_v1> receipts = collectionService.fetchReceipts(criteria_v1);
                    if(CollectionUtils.isEmpty(receipts))
                        break;
                    migrateReceipt(requestInfo, receipts);
                    
                    log.info("Total receipts migrated: " + offset + "for tenantId : " + tenantIdEntry);
                    offset += batchSize;
                    
                    long endtime = System.currentTimeMillis();
                    long elapsetime = endtime - startTime;
                    System.out.println("\n\nBatch Elapsed Time--->"+elapsetime+"\n\n");
                }
        }

    }

    public void migrateReceipt(RequestInfo requestInfo, List<Receipt_v1> receipts){
    	
        List<Payment> paymentList = new ArrayList<Payment>();
        
		for (Receipt_v1 receipt : receipts) {

			Bill newBill = convertBillToNew(receipt.getBill().get(0), receipt.getAuditDetails());

			Payment payment = transformToPayment(requestInfo, receipt, newBill);
			paymentList.add(payment);
		}
        
        PaymentResponse paymentResponse = new PaymentResponse(new ResponseInfo(), paymentList);
        producer.producer(properties.getCollectionMigrationTopicName(), paymentResponse);
    }

	private Bill convertBillToNew(Bill_v1 bill_v1, AuditDetails_v1 oldAuditDetails) {
		
		BigDecimal AmountPaid = bill_v1.getBillDetails().stream().map(detail -> detail.getAmountPaid()).reduce(BigDecimal.ZERO, BigDecimal::add);
		BigDecimal totalAmount = bill_v1.getBillDetails().stream().map(detail -> detail.getTotalAmount()).reduce(BigDecimal.ZERO, BigDecimal::add);
		StatusEnum status = StatusEnum.fromValue(bill_v1.getBillDetails().get(0).getStatus()); 
		status =  status != null ? status : StatusEnum.EXPIRED;
		
		AuditDetails auditDetails = AuditDetails.builder()
				.lastModifiedTime(oldAuditDetails.getLastModifiedDate())
				.lastModifiedBy(oldAuditDetails.getLastModifiedBy())
				.createdTime(oldAuditDetails.getCreatedDate())
				.createdBy(oldAuditDetails.getCreatedBy())
				.build();
		
		JsonNode jsonNode = null;
		
		try {
			if (null != bill_v1.getAdditionalDetails())
				jsonNode = mapper.readTree(bill_v1.getAdditionalDetails().toString());
		} catch (IOException e) {

		}

		List<BillDetail> billdetails = getNewBillDetails(bill_v1.getBillDetails(), auditDetails, bill_v1.getId()); 
		
		return Bill.builder()
				.reasonForCancellation(bill_v1.getBillDetails().get(0).getCancellationRemarks())
				.businessService(bill_v1.getBillDetails().get(0).getBusinessService())
				.consumerCode(bill_v1.getBillDetails().get(0).getConsumerCode())
				.billNumber(bill_v1.getBillDetails().get(0).getBillNumber())
				.billDate(bill_v1.getBillDetails().get(0).getBillDate())
				.payerAddress(bill_v1.getPayerAddress())
				.mobileNumber(bill_v1.getMobileNumber())
				.auditDetails(auditDetails)
				.payerEmail(bill_v1.getPayerEmail())
				.payerName(bill_v1.getPayerName())
				.tenantId(bill_v1.getTenantId())
				.payerId(bill_v1.getPayerId())
				.paidBy(bill_v1.getPaidBy())
				.additionalDetails(jsonNode)
				.totalAmount(totalAmount)
				.billDetails(billdetails)
				.amountPaid(AmountPaid)
				.id(bill_v1.getId())
				.status(status)	
				.build();
		
		
	}

	private List<BillDetail> getNewBillDetails(List<BillDetail_v1> billDetails, AuditDetails auditdetails, String billId) {

		List<BillDetail> newDetails = new ArrayList<>();
		
		for (BillDetail_v1 oldDetail : billDetails) {
			
			List<BillAccountDetail> accDetails = getNewAccDetails(oldDetail.getBillAccountDetails(), auditdetails);
			Long expiryDate = oldDetail.getExpiryDate() != null ? oldDetail.getExpiryDate() : 0l;
			String demandId = oldDetail.getDemandId() != null ? oldDetail.getDemandId() : "";
			String dId = oldDetail.getId() != null ? oldDetail.getId() : UUID.randomUUID().toString();
			
			BillDetail detail = BillDetail.builder()
				.manualReceiptNumber(oldDetail.getManualReceiptNumber())
				.cancellationRemarks(oldDetail.getCancellationRemarks())
				.manualReceiptDate(oldDetail.getManualReceiptDate())
				.billDescription(oldDetail.getBillDescription())
				.collectionType(oldDetail.getCollectionType())
				.displayMessage(oldDetail.getDisplayMessage())
				.voucherHeader(oldDetail.getVoucherHeader())
				.amountPaid(oldDetail.getAmountPaid())
				.fromPeriod(oldDetail.getFromPeriod())
				.amount(oldDetail.getTotalAmount())
				.boundary(oldDetail.getBoundary())
				.demandId(demandId)
				.toPeriod(oldDetail.getToPeriod())
				.tenantId(oldDetail.getTenantId())
				.channel(oldDetail.getChannel())
				.billAccountDetails(accDetails)
				.auditDetails(auditdetails)
				.expiryDate(expiryDate)
				.billId(billId)
				.id(dId)
				.build();

			newDetails.add(detail);
		}
		
		return newDetails;
	}

	private List<BillAccountDetail> getNewAccDetails(List<BillAccountDetail_v1> billAccountDetails, AuditDetails auditdetails) {

		 List<BillAccountDetail> newAccDetails = new ArrayList<>();
	
		for (BillAccountDetail_v1 oldAccDetail : billAccountDetails) {
			
			String DDId = oldAccDetail.getDemandDetailId() != null ? oldAccDetail.getDemandDetailId() : "";
			String bADID = oldAccDetail.getId() != null ? oldAccDetail.getId() : UUID.randomUUID().toString();
			String taxHeadCode = oldAccDetail.getTaxHeadCode() != null ? oldAccDetail.getTaxHeadCode() : "ADVANCE_ADJUSTMENT";
			
			BillAccountDetail accDetail = BillAccountDetail.builder()
					.adjustedAmount(oldAccDetail.getAdjustedAmount())
					.isActualDemand(oldAccDetail.getIsActualDemand())
					.billDetailId(oldAccDetail.getBillDetail())
					.tenantId(oldAccDetail.getTenantId())
					.purpose(oldAccDetail.getPurpose())
					.amount(oldAccDetail.getAmount())
					.order(oldAccDetail.getOrder())
					.auditDetails(auditdetails)
					.taxHeadCode(taxHeadCode)
					.demandDetailId(DDId)
					.id(bADID)
					.build();
			
			newAccDetails.add(accDetail);
		}
		
		return newAccDetails;
	}

	private Payment transformToPayment(RequestInfo requestInfo, Receipt_v1 receipt, Bill newBill) {

		if (null == newBill.getBillNumber()) {
			newBill.setBillNumber("NA");
		}

		return getPayment(requestInfo, receipt, newBill);
	}
    

    private Payment getPayment(RequestInfo requestInfo, Receipt_v1 receipt, Bill newBill){

        Payment payment = new Payment();

        newBill.setStatus(StatusEnum.ACTIVE);
        BigDecimal totalAmount = newBill.getTotalAmount();
        BigDecimal totalAmountPaid = receipt.getInstrument().getAmount();
        newBill.setAmountPaid(totalAmountPaid);
        
        for(BillDetail billDetail : newBill.getBillDetails()) {
        	billDetail.setAmountPaid(totalAmountPaid);
        }
        
        payment.setId(UUID.randomUUID().toString());
        payment.setTenantId(receipt.getTenantId());
        payment.setTotalDue(totalAmount.subtract(totalAmountPaid));
        payment.setTotalAmountPaid(totalAmountPaid);
        payment.setTransactionNumber(receipt.getInstrument().getTransactionNumber());
        payment.setTransactionDate(receipt.getReceiptDate());
        payment.setPaymentMode(PaymentModeEnum.fromValue(receipt.getInstrument().getInstrumentType().getName()));
        payment.setInstrumentDate(receipt.getInstrument().getInstrumentDate());
        payment.setInstrumentNumber(receipt.getInstrument().getInstrumentNumber());
        payment.setInstrumentStatus(receipt.getInstrument().getInstrumentStatus());
        payment.setIfscCode(receipt.getInstrument().getIfscCode());
        payment.setPaidBy(receipt.getBill().get(0).getPaidBy());
        payment.setPayerName(receipt.getBill().get(0).getPayerName());
        payment.setPayerAddress(receipt.getBill().get(0).getPayerAddress());
        payment.setPayerEmail(receipt.getBill().get(0).getPayerEmail());
        payment.setPayerId(receipt.getBill().get(0).getPayerId());
        
        if(receipt.getBill().get(0).getMobileNumber() == null){
            payment.setMobileNumber("NA");
        }else{
            payment.setMobileNumber(receipt.getBill().get(0).getMobileNumber());
        }

		String receiptHeaderStatus = receipt.getBill().get(0).getBillDetails().get(0).getStatus();
		
		if (receiptHeaderStatus.equalsIgnoreCase(PaymentStatusEnum.CANCELLED.toString())) {

			payment.setPaymentStatus(PaymentStatusEnum.CANCELLED);
			payment.setInstrumentStatus(InstrumentStatusEnum.CANCELLED);
            
		} else {

			payment.setInstrumentStatus(InstrumentStatusEnum.APPROVED);
			if ((payment.getPaymentMode().toString()).equalsIgnoreCase(ONLINE.name())
					|| payment.getPaymentMode().toString().equalsIgnoreCase(CARD.name())
					|| (receiptHeaderStatus.equalsIgnoreCase(ReceiptStatus.REMITTED.toString()))) {

				payment.setPaymentStatus(PaymentStatusEnum.DEPOSITED);
				payment.setInstrumentStatus(InstrumentStatusEnum.REMITTED);
			} else {
				payment.setPaymentStatus(PaymentStatusEnum.NEW);
				payment.setInstrumentStatus(InstrumentStatusEnum.APPROVED);
			}
		}

        AuditDetails auditDetails = getAuditDetail(receipt.getAuditDetails());
        payment.setAuditDetails(auditDetails);
        payment.setAdditionalDetails((JsonNode)receipt.getBill().get(0).getAdditionalDetails());

        PaymentDetail paymentDetail = getPaymentDetail(receipt, auditDetails, requestInfo);
    	
        paymentDetail.setBill(newBill);
        paymentDetail.setPaymentId(payment.getId());
    	paymentDetail.setBillId(newBill.getId());
        paymentDetail.setTotalDue(totalAmount.subtract(totalAmountPaid));
        paymentDetail.setTotalAmountPaid(totalAmountPaid);
        payment.setPaymentDetails(Arrays.asList(paymentDetail));
	    
		Bill bill = payment.getPaymentDetails().get(0).getBill();
		if (payment.getPaymentStatus().equals(PaymentStatusEnum.CANCELLED)) {

			bill.setStatus(Bill.StatusEnum.CANCELLED);
			bill.setIsCancelled(true);
		} else {
			bill.setStatus(Bill.StatusEnum.ACTIVE);
			bill.setIsCancelled(false);
		}

        return payment;

    }

    private PaymentDetail getPaymentDetail(Receipt_v1 receipt, AuditDetails auditDetails, RequestInfo requestInfo){
        
        PaymentDetail paymentDetail = new PaymentDetail();

        paymentDetail.setId(UUID.randomUUID().toString());
        paymentDetail.setTenantId(receipt.getTenantId());
        paymentDetail.setReceiptNumber(receipt.getReceiptNumber());
        paymentDetail.setManualReceiptNumber(receipt.getBill().get(0).getBillDetails().get(0).getManualReceiptNumber());

        Long manualRcptDate = receipt.getBill().get(0).getBillDetails().get(0).getManualReceiptDate();
		if (null != manualRcptDate && manualRcptDate == 0) {
			paymentDetail.setManualReceiptDate(null);
		} else {
			paymentDetail.setManualReceiptDate(manualRcptDate);
		}
        
		paymentDetail.setReceiptDate(receipt.getReceiptDate());
        paymentDetail.setReceiptType(receipt.getBill().get(0).getBillDetails().get(0).getReceiptType());
        paymentDetail.setBusinessService(receipt.getBill().get(0).getBillDetails().get(0).getBusinessService());

        paymentDetail.setAuditDetails(auditDetails);
        paymentDetail.setAdditionalDetails((JsonNode)receipt.getBill().get(0).getAdditionalDetails());

        return paymentDetail;

    }

    private AuditDetails getAuditDetail(AuditDetails_v1 oldAuditDetails){
        AuditDetails newAuditDetails = new AuditDetails();
        newAuditDetails.setCreatedBy(oldAuditDetails.getCreatedBy());
        newAuditDetails.setCreatedTime(oldAuditDetails.getCreatedDate());
        newAuditDetails.setLastModifiedBy(oldAuditDetails.getLastModifiedBy());
        newAuditDetails.setLastModifiedTime(oldAuditDetails.getLastModifiedDate());
        return newAuditDetails;
    }

    
    private Map<String, Bill> getBillsForReceipts(List<Receipt_v1> receipts, RequestInfo requestInfo){
    	
		Map<String, Bill> BillIdMap = new HashMap<>();
		String tenantId = receipts.get(0).getTenantId();
    	
    	Map<String, Set<String>> businesssAndBillIdsMap = receipts.stream()
				.flatMap(receipt -> receipt.getBill().stream().flatMap(bill -> bill.getBillDetails().stream()))
				.collect(Collectors.groupingBy(BillDetail_v1::getBusinessService,
						Collectors.mapping(BillDetail_v1::getBillNumber, Collectors.toSet())));
    	
		for (Entry<String, Set<String>> entry : businesssAndBillIdsMap.entrySet()) {

			List<Bill> fetchedBills = getBillFromV2(entry.getValue(), entry.getKey(), tenantId, requestInfo);
			if(!CollectionUtils.isEmpty(fetchedBills))
				BillIdMap.putAll(fetchedBills.stream().collect(Collectors.toMap(Bill::getId, Function.identity())));
		}
		
    	return BillIdMap;
    	
    }
    
    private List<Bill> getBillFromV2(Set<String> billids, String businessService, String tenantId, RequestInfo requestInfo){
    	
//            String billDetailId = bill.getBillDetails().get(0).getBillNumber();
//            //String billId = getBillIdFromBillDetail(billDetailId);
//            String billId = billDetailId;
//            String tenantId = bill.getBillDetails().get(0).getTenantId();
//            String service = bill.getBillDetails().get(0).getBusinessService();
//            String status = bill.getBillDetails().get(0).getStatus();

            StringBuilder url = getBillSearchURI(tenantId,billids,businessService);

            RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(requestInfo).build();

            Object response = serviceRequestRepository.fetchResult(url,requestInfoWrapper);
            ObjectMapper mapper = new ObjectMapper();
            try{
                BillResponse billResponse = mapper.convertValue(response, BillResponse.class);
                if(billResponse.getBill().size() > 0){

                        billResponse.getBill().forEach(newBill -> {
                        	
                        	 if(null == newBill.getStatus())
                                 newBill.setStatus(Bill.StatusEnum.EXPIRED);
                        });
                }
                return billResponse.getBill();
                
            }catch(Exception e) {
                log.error("bill fetch failed : ",e);
                return null;
            }
    }


	private StringBuilder getBillSearchURI(String tenantId, Set<String> billIds, String service) {
		
		StringBuilder builder = new StringBuilder(properties.getBillingServiceHostName());
		builder.append(properties.getSearchBill()).append("?");
		builder.append("tenantId=").append(tenantId);
		builder.append("&service=").append(service);
		builder.append("&billId=").append(billIds.toString().replace("[","").replace("]",""));

		return builder;

	}

}
