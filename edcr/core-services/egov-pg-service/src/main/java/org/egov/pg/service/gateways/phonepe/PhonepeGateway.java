package org.egov.pg.service.gateways.phonepe;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.pg.models.Transaction;
import org.egov.pg.service.Gateway;
import org.egov.pg.utils.Utils;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Collections;
import java.util.Map;
import java.util.TreeMap;

@Service
@Slf4j
public class PhonepeGateway implements Gateway {

    private static final String GATEWAY_NAME = "PHONEPE";
    private final String MERCHANT_HOST;
    private final String MERCHANT_PATH_DEBIT;
    private final String MERCHANT_PATH_STATUS;
    private final String MERCHANT_ID;
    private final String SALT;
    private final String SALT_INDEX;
    private final String CALLBACK_SERVER_URL = "http://2a91377b.ngrok.io/egov-pay/payments/v1/_update";
    private final boolean ACTIVE;
    private ObjectMapper objectMapper;

    private RestTemplate restTemplate;

    @Autowired
    public PhonepeGateway(RestTemplate restTemplate, ObjectMapper objectMapper, Environment environment) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;

        ACTIVE = Boolean.valueOf(environment.getRequiredProperty("phonepe.active"));
        MERCHANT_ID = environment.getRequiredProperty("phonepe.merchant.id");
        SALT = environment.getRequiredProperty("phonepe.merchant.secret.key");
        SALT_INDEX = environment.getRequiredProperty("phonepe.merchant.secret.index");
        MERCHANT_HOST = environment.getRequiredProperty("phonepe.merchant.host");
        MERCHANT_PATH_DEBIT = environment.getRequiredProperty("phonepe.url.debit");
        MERCHANT_PATH_STATUS = environment.getRequiredProperty("phonepe.url.status");
    }


    @Override
    public URI generateRedirectURI(Transaction transaction) {
        Map<String, Object> map = new TreeMap<>();
        map.put("merchantId", MERCHANT_ID);
        map.put("transactionId", transaction.getTxnId());
        map.put("merchantUserId", transaction.getUser().getUserName());
        map.put("amount", Long.valueOf(Utils.formatAmtAsPaise(transaction.getTxnAmount())));
        map.put("merchantOrderId", transaction.getBillId());
        map.put("mobileNumber", transaction.getUser().getMobileNumber());
        map.put("message", transaction.getProductInfo());

        try {

            String encodedPayload = new String(Base64.getEncoder().encode(objectMapper.writeValueAsString(map).getBytes()));
            String payload = encodedPayload + MERCHANT_PATH_DEBIT + SALT;

            String xVerify = PhonepeUtils.buildHash(payload) + "###" + SALT_INDEX;

            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString());
            httpHeaders.add("X-VERIFY", xVerify);
            httpHeaders.add("X-REDIRECT-URL", transaction.getCallbackUrl());
            httpHeaders.add("X-REDIRECT-MODE", "POST");
//            httpHeaders.add("X-CALLBACK-URL", CALLBACK_SERVER_URL);
//            httpHeaders.add("X-CALLBACK-MODE", "POST");

            String uri = UriComponentsBuilder.newInstance().scheme("https").host(MERCHANT_HOST).path(MERCHANT_PATH_DEBIT)
                    .build()
                    .toUriString();

            HttpEntity<Map<String, String>> httpEntity = new HttpEntity<>(Collections.singletonMap("request",
                    encodedPayload),
                    httpHeaders);

            URI redirectPath = restTemplate.postForLocation(uri, httpEntity);


            return new URI("https", MERCHANT_HOST, redirectPath.getPath(), redirectPath.getQuery(), null);

        } catch (JsonProcessingException | URISyntaxException | NoSuchAlgorithmException e) {
            log.error("Phonepe Checksum generation failed", e);
            throw new CustomException("CHECKSUM_GEN_FAILED", "Hash generation failed, gateway redirect URI cannot be generated");
        } catch (RestClientException e){
            log.error("Phonepe fetching redirect URI from gateway failed", e);
            throw new ServiceCallException( "Redirect URI generation failed, invalid response received from gateway");
        }

    }

    @Override
    public Transaction fetchStatus(Transaction currentStatus, Map<String, String> params) {
        StringBuilder path = new StringBuilder();
        path.append(MERCHANT_PATH_STATUS).append("/").append(MERCHANT_ID).append("/").append(currentStatus
                .getTxnId()
        ).append("/status");

        try {
            String xVerify = PhonepeUtils.buildHash(path.toString() + SALT) + "###" + SALT_INDEX;

            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString());
            httpHeaders.add("X-VERIFY", xVerify);

            HttpEntity<String> httpEntity = new HttpEntity<>("", httpHeaders);

            String uri = UriComponentsBuilder.newInstance().scheme("https").host(MERCHANT_HOST).path(path.toString())
                    .build()
                    .toUriString();

            ResponseEntity<PhonepeResponse> response = restTemplate.exchange(uri, HttpMethod.GET, httpEntity, PhonepeResponse.class);

            log.info(response.getBody().toString());

            return transformRawResponse(response.getBody(), currentStatus);
        } catch (NoSuchAlgorithmException e) {
            log.error("Phonepe Checksum generation failed", e);
            throw new CustomException("CHECKSUM_GEN_FAILED", "Hash generation failed, unable to fetch status");
        } catch (RestClientException e){
            log.error("Unable to fetch status from payment gateway for txnid: "+ currentStatus.getTxnId(), e);
            throw new ServiceCallException("Error occurred while fetching status from payment gateway");
        }
    }

    @Override
    public boolean isActive() {
        return ACTIVE;
    }

    @Override
    public String gatewayName() {
        return GATEWAY_NAME;
    }

    @Override
    public String transactionIdKeyInResponse() {
        return "transactionId";
    }

    private Transaction transformRawResponse(PhonepeResponse resp, Transaction currentStatus) {
        Transaction.TxnStatusEnum status;

        if (resp.getSuccess()) {
            status = Transaction.TxnStatusEnum.SUCCESS;

            return Transaction.builder()
                    .txnId(currentStatus.getTxnId())
                    .txnAmount(Utils.convertPaiseToRupee(resp.getAmount()))
                    .txnStatus(status)
                    .gatewayTxnId(resp.getProviderReferenceId())
                    .gatewayStatusCode(resp.getCode())
                    .gatewayStatusMsg(resp.getMessage())
                    .responseJson(resp)
                    .build();
        } else {
            if (resp.getCode().equalsIgnoreCase("PAYMENT_PENDING"))
                status = Transaction.TxnStatusEnum.PENDING;
            else
                status = Transaction.TxnStatusEnum.FAILURE;
            return Transaction.builder()
                    .txnId(currentStatus.getTxnId())
                    .txnStatus(status)
                    .gatewayTxnId(resp.getProviderReferenceId())
                    .gatewayStatusCode(resp.getCode())
                    .gatewayStatusMsg(resp.getMessage())
                    .responseJson(resp)
                    .build();
        }

    }

}
