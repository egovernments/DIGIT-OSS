package org.egov.pg.service.gateways.nic;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.egov.pg.models.Transaction;
import org.egov.pg.service.Gateway;
import org.egov.pg.service.gateways.paytm.PaytmResponse;
import org.egov.pg.utils.Utils;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paytm.pg.merchant.CheckSumServiceHelper;

import lombok.Getter;
import lombok.Setter;

public class NicGateway implements Gateway {

	private static final String GATEWAY_NAME = "NIC";
	private String DTO;
	private String STO;
	private String DDO;
	private String DeptCode;
	

	private String Bank;

	
	private String UUrl_Debit;
	private String UUrl_Status;

	//private String UUrl;

	private final RestTemplate restTemplate;
	private ObjectMapper objectMapper;
	private final boolean ACTIVE;

	@Autowired
	public NicGateway(RestTemplate restTemplate, Environment environment, ObjectMapper objectMapper) {
		this.restTemplate = restTemplate;
		this.objectMapper = objectMapper;

		ACTIVE = Boolean.valueOf(environment.getRequiredProperty("nic.active"));
		DTO = environment.getRequiredProperty("nic.DTO");
		STO = environment.getRequiredProperty("nic.STO");
		DDO = environment.getRequiredProperty("nic.DDO");
		DeptCode = environment.getRequiredProperty("nic.DeptCode");
		//ApplicationNumber = environment.getRequiredProperty("nic.ApplicationNumber");
		Bank = environment.getRequiredProperty("nic.Bank");
		
		UUrl_Debit = environment.getRequiredProperty("nic.UUrl_Debit");
		

	}

	@Override
	public URI generateRedirectURI(Transaction transaction) {

		TreeMap<String, String> paramMap = new TreeMap<>();
		paramMap.put("DTO", DTO);
		paramMap.put("STO", STO);
		paramMap.put("DDO", DDO);
		paramMap.put("DeptCode", DeptCode);
		paramMap.put("ApplicationNumber",transaction.getApplicationNumber());
		paramMap.put("FullName", transaction.getUser().getUserName());
		paramMap.put("CityName", transaction.getUser().getCityName());
		paramMap.put("Address", transaction.getUser().getAddress());
		paramMap.put("pinCode",transaction.getUser().getPinCode());
		paramMap.put("OfficeName",transaction.getOfficeName());
		paramMap.put("emailId", transaction.getUser().getEmailId());
		paramMap.put("TXN_AMOUNT", Utils.formatAmtAsRupee(transaction.getTxnAmount()));
		paramMap.put("challanYear", transaction.getChallanYear());
	    paramMap.put("CALLBACK_URL", transaction.getCallbackUrl());
	    paramMap.put("gatewayPaymentMode", transaction.getGatewayPaymentMode());
	    paramMap.put("bankname", Bank);
	    paramMap.put("remarks", transaction.getRemarks());
	    paramMap.put("securityEmail", transaction.getSecurityEmail());
	    paramMap.put("securityPhone", transaction.getSecurityPhone());
	    paramMap.put("validUpto", transaction.getValidUpto());
	    paramMap.put("schemeCount", transaction.getSchemeCount());
	  
	  		   try {

	            String checkSum = CheckSumServiceHelper.getCheckSumServiceHelper().genrateCheckSum(DeptCode, paramMap);
	            paramMap.put("CHECKSUMHASH", checkSum);

	            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
	            paramMap.forEach((key, value) -> params.put(key, Collections.singletonList(value)));


	            UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(UUrl_Debit).queryParams
	                    (params).build().encode();

	            return uriComponents.toUri();
	        } catch (Exception e) {
	          //  log.error("Paytm Checksum generation failed", e);
	            throw new CustomException("CHECKSUM_GEN_FAILED", "Hash generation failed, gateway redirect URI cannot be generated");
	        }
	}

	@Override
	public Transaction fetchStatus(Transaction currentStatus, Map<String, String> params) {
		  TreeMap<String, String> treeMap = new TreeMap<String, String>();
	       // treeMap.put("ApplicationNumber", ApplicationNumber);
	        treeMap.put("ApplicationNumber", currentStatus.getApplicationNumber());

	        try {
	            String checkSum = CheckSumServiceHelper.getCheckSumServiceHelper().genrateCheckSum(DeptCode, treeMap);
	            treeMap.put("CHECKSUMHASH", checkSum);

	            HttpHeaders httpHeaders = new HttpHeaders();
	            httpHeaders.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString());

	            HttpEntity<Map<String, String>> httpEntity = new HttpEntity<>(treeMap, httpHeaders);

	            ResponseEntity<NicResponse> response = restTemplate.postForEntity(UUrl_Status, httpEntity,
	            		NicResponse.class);

	            return transformRawResponse(response.getBody(), currentStatus);

	        } catch (RestClientException e) {
	            //log.error("Unable to fetch status from Paytm gateway", e);
	            throw new CustomException("UNABLE_TO_FETCH_STATUS", "Unable to fetch status from Paytm gateway");
	        } catch (Exception e) {
	            //log.error("Paytm Checksum generation failed", e);
	            throw new CustomException("CHECKSUM_GEN_FAILED", "Hash generation failed, gateway redirect URI cannot be generated");
	        }
	}

	@Override
	public boolean isActive() {
		// TODO Auto-generated method stub
		return ACTIVE;
	}

	@Override
	public String gatewayName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String transactionIdKeyInResponse() {
		// TODO Auto-generated method stub
		return "ApplicationNumber";
	}
	 private Transaction transformRawResponse(NicResponse resp, Transaction currentStatus) {


	        Transaction.TxnStatusEnum status = Transaction.TxnStatusEnum.PENDING;

	        if (resp.getStatus().equalsIgnoreCase("TXN_SUCCESS"))
	            status = Transaction.TxnStatusEnum.SUCCESS;
	        else if (resp.getStatus().equalsIgnoreCase("TXN_FAILURE"))
	            status = Transaction.TxnStatusEnum.FAILURE;

	        return Transaction.builder()
	                .txnId(currentStatus.getTxnId())
	                .txnAmount(Utils.formatAmtAsRupee(resp.getTxnAmount()))
	                .txnStatus(status)
	                .gatewayPaymentMode(resp.getPaymentMode())
	                .gatewayStatusCode(resp.getRespCode())
	                .gatewayStatusMsg(resp.getRespMsg())
	                .responseJson(resp)
	                .build();


	    }

}
