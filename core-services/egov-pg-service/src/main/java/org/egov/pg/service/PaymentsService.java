package org.egov.pg.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.databind.JsonNode;
import org.egov.pg.config.AppProperties;
import org.egov.pg.models.CollectionPayment;
import org.egov.pg.models.CollectionPaymentDetail;
import org.egov.pg.models.CollectionPaymentRequest;
import org.egov.pg.models.CollectionPaymentResponse;
import org.egov.pg.models.TaxAndPayment;
import org.egov.pg.models.enums.CollectionPaymentModeEnum;
import org.egov.pg.repository.ServiceCallRepository;
import org.egov.pg.web.models.TransactionRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PaymentsService {
	
	@Autowired
	private ServiceCallRepository repository;
	
	@Autowired
	private AppProperties props;
	
	@Autowired
	private ObjectMapper mapper;
	
	public CollectionPayment registerPayment(TransactionRequest request) {
		CollectionPayment payment = getPaymentFromTransaction(request);
		payment.setInstrumentDate(request.getTransaction().getAuditDetails().getCreatedTime());
		payment.setInstrumentNumber(request.getTransaction().getTxnId());
		payment.setTransactionNumber(request.getTransaction().getTxnId());
		payment.setAdditionalDetails((JsonNode) request.getTransaction().getAdditionalDetails());

		CollectionPaymentRequest paymentRequest = CollectionPaymentRequest.builder()
				.requestInfo(request.getRequestInfo()).payment(payment).build();
		String uri = props.getCollectionServiceHost() + props.getPaymentCreatePath();
		Optional<Object> response =  repository.fetchResult(uri, paymentRequest);
		if(response.isPresent()) {
			try {
				CollectionPaymentResponse paymentResponse = mapper.convertValue(response.get(), CollectionPaymentResponse.class);
				if(!CollectionUtils.isEmpty(paymentResponse.getPayments()))
					return paymentResponse.getPayments().get(0);
				else
					throw new CustomException("PAYMENT_REGISTRATION_FAILED", "Failed to register this payment at collection-service");						
			}catch(Exception e) {
				log.error("Failed to parse the payment response: ",e);
				throw new CustomException("RESPONSE_PARSE_ERROR", "Failed to parse the payment response");
			}

		}else {
			throw new CustomException("PAYMENT_REGISTRATION_FAILED", "Failed to register this payment at collection-service");
		}
		
	}
	
	
	public CollectionPayment validatePayment(TransactionRequest request) {
		CollectionPayment payment = getPaymentFromTransaction(request);
		CollectionPaymentRequest paymentRequest = CollectionPaymentRequest.builder()
				.requestInfo(request.getRequestInfo()).payment(payment).build();
		String uri = props.getCollectionServiceHost() + props.getPaymentValidatePath();
		Optional<Object> response =  repository.fetchResult(uri, paymentRequest);
		if(response.isPresent()) {
			try {
				CollectionPaymentResponse paymentResponse = mapper.convertValue(response.get(), CollectionPaymentResponse.class);
				if(!CollectionUtils.isEmpty(paymentResponse.getPayments()))
					return paymentResponse.getPayments().get(0);
				else
					throw new CustomException("PAYMENT_VALIDATION_FAILED", "Failed to validate this payment at collection-service");						
			}catch(Exception e) {
				log.error("Failed to parse the payment response: ",e);
				throw new CustomException("RESPONSE_PARSE_ERROR", "Failed to parse the payment response");
			}

		}else {
			throw new CustomException("PAYMENT_VALIDATION_FAILED", "Failed to validate this payment at collection-service");						
		}
		
	}
	
	
	
	public CollectionPayment getPaymentFromTransaction(TransactionRequest request) {
		List<CollectionPaymentDetail> paymentDetails = new ArrayList<>();
		for(TaxAndPayment taxAndPayment: request.getTransaction().getTaxAndPayments()) {
			CollectionPaymentDetail detail = CollectionPaymentDetail.builder()
					.tenantId(request.getTransaction().getTenantId())
					.billId(taxAndPayment.getBillId())
					.totalAmountPaid(taxAndPayment.getAmountPaid())
					.build();
			paymentDetails.add(detail);
		}
				
		return CollectionPayment.builder().paymentDetails(paymentDetails)
				.tenantId(request.getTransaction().getTenantId())
				.totalAmountPaid(new BigDecimal(request.getTransaction().getTxnAmount()))
				.paymentMode(CollectionPaymentModeEnum.ONLINE)
				.paidBy(request.getTransaction().getUser().getName())
				.mobileNumber(request.getTransaction().getUser().getMobileNumber())
				.instrumentDate(System.currentTimeMillis())
				.instrumentNumber("PROV_PAYMENT_VALIDATION")
				.transactionNumber("PROV_PAYMENT_VALIDATION")
				.payerName(request.getTransaction().getUser().getName())
				.build();
	}

}
