package org.egov.pg.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.egov.pg.config.AppProperties;
import org.egov.pg.models.Payment;
import org.egov.pg.models.PaymentDetail;
import org.egov.pg.models.PaymentRequest;
import org.egov.pg.models.PaymentResponse;
import org.egov.pg.models.TaxAndPayment;
import org.egov.pg.models.TransactionRequest;
import org.egov.pg.models.enums.PaymentModeEnum;
import org.egov.pg.repository.ServiceCallRepository;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class PaymentsService {
	
	@Autowired
	private ServiceCallRepository repository;
	
	@Autowired
	private AppProperties props;
	
	public Payment registerPayment(TransactionRequest request) {
		Payment payment = getPaymentFromTransaction(request);
		PaymentRequest paymentRequest = PaymentRequest.builder()
				.requestInfo(request.getRequestInfo()).payment(payment).build();
		StringBuilder builder = new StringBuilder();
		builder.append(props.getCollectionServiceHost()).append(props.getPaymentCreatePath());
		Optional<Object> response =  repository.fetchResult(builder, paymentRequest);
		if(response.isPresent()) {
			try {
				ObjectMapper mapper = new ObjectMapper();
				PaymentResponse paymentResponse = mapper.convertValue(response, PaymentResponse.class);
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
	
	
	public Payment validatePayment(TransactionRequest request) {
		Payment payment = getPaymentFromTransaction(request);
		PaymentRequest paymentRequest = PaymentRequest.builder()
				.requestInfo(request.getRequestInfo()).payment(payment).build();
		StringBuilder builder = new StringBuilder();
		builder.append(props.getCollectionServiceHost()).append(props.getPaymentValidatePath());
		Optional<Object> response =  repository.fetchResult(builder, paymentRequest);
		if(response.isPresent()) {
			try {
				ObjectMapper mapper = new ObjectMapper();
				PaymentResponse paymentResponse = mapper.convertValue(response, PaymentResponse.class);
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
	
	
	
	public Payment getPaymentFromTransaction(TransactionRequest request) {
		List<PaymentDetail> paymentDetails = new ArrayList<>();
		for(TaxAndPayment taxAndPayment: request.getTransaction().getTaxAndPayments()) {
			PaymentDetail detail = PaymentDetail.builder()
					.tenantId(request.getTransaction().getTenantId())
					.businessService(taxAndPayment.getBusinessService())
					.billId(taxAndPayment.getBillId())
					.totalAmountPaid(taxAndPayment.getAmountPaid())
					.build();
			paymentDetails.add(detail);
		}
		
		return Payment.builder().paymentDetails(paymentDetails)
				.tenantId(request.getTransaction().getTenantId())
				.totalAmountPaid(new BigDecimal(request.getTransaction().getTxnAmount()))
				.paymentMode(PaymentModeEnum.ONLINE)
				.paidBy(request.getTransaction().getUser().getName())
				.mobileNumber(request.getTransaction().getUser().getMobileNumber())
				.build();
	}

}
