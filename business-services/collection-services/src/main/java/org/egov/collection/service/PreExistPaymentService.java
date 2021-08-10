package org.egov.collection.service;

import org.apache.commons.lang3.StringUtils;
import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.repository.PaymentRepository;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PreExistPaymentService {

	@Autowired
	private ApplicationProperties applicationProperties;

	@Autowired
	private PaymentRepository paymentRepository;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private RestTemplate restTemplate;

	/**
	 * Fetch the Bank details from bank ifsccode
	 * 
	 * @param ifscCode
	 * @return
	 */
	private JsonNode populateBankBranch(String ifscCode) {
		JsonNode razorpayIfsccodeResponse = null;
		if (StringUtils.isNotEmpty(ifscCode)) {
			String response = null;
			try {
				response = restTemplate
						.exchange(applicationProperties.getRazorPayUrl() + ifscCode, HttpMethod.GET, null, String.class)
						.getBody();
			} catch (HttpClientErrorException e) {
				log.error("Razor pay throw Exception for IFSCCODE: " + ifscCode, e);
			} catch (Exception e) {
				log.error("Exception while fetching from searcher: ", e);
				throw new ServiceCallException(e.getMessage());
			}

			try {
				if (StringUtils.isNotEmpty(response))
					razorpayIfsccodeResponse = mapper.readTree(response);
			} catch (JsonProcessingException e) {
				log.error("Error in processing JSON", e);
				throw new CustomException("INVALID_PROCESS_EXCEPTION", e.getMessage());
			}
		}
		return razorpayIfsccodeResponse;
	}

	/**
	 * From the payment ifsccode get bank details from RazorPay api. Persists
	 * the bankdetails in payment additional details.
	 * 
	 * @param ifsccode
	 */
	@Transactional
	public void updatePaymentBankDetails(String ifsccode) {
		JsonNode bankdetails = populateBankBranch(ifsccode);
		if (null != bankdetails)
			paymentRepository.updatePaymentBankDetail(bankdetails, ifsccode);
	}

}