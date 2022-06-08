package org.egov.pg.service.gateways.ccavenue;

import java.io.IOException;
import java.net.URI;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.egov.pg.models.Transaction;
import org.egov.pg.service.Gateway;
import org.egov.pg.utils.Utils;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CCAvenueGateway implements Gateway {

    private static final String GATEWAY_NAME = "CCAVENUE";
    private final String GATEWAY_URL;
    private final String GATEWAY_TRANSACTION_STATUS_URL;
    private final boolean ACTIVE;
    private final String MERCHANT_ID;
    private final String REDIRECT_ACCESS_CODE;
    private final String STATUS_ACCESS_CODE;
    private final String CURRENCY;
    private final String REDIRECT_URL;
    private final String CANCEL_URL;
    private final String LANGUAGE;
    private final String ORIGINAL_RETURN_URL_KEY;

    private final String MERCHANT_ID_KEY = "merchant_id";
    private final String ORDER_ID_KEY = "order_id";
    private final String CURRENCY_KEY = "currency";
    private final String AMOUNT_KEY = "amount";
    private final String REDIRECT_URL_KEY = "redirect_url";
    private final String CANCEL_URL_KEY = "cancel_url";
    private final String LANGUAGE_KEY = "language";
    private final String SUB_ACCOUNT_ID_KEY = "sub_account_id";
    private final String ACCESS_CODE_KEY = "access_code";
    private final String ENCREQUEST_KEY = "encRequest";
    private final String MERCHANT_PARAM1 = "merchant_param1";

    private RestTemplate restTemplate;
    private CCAvenueCryptUtil redirectCCavenueUtil;
    private CCAvenueCryptUtil statusCCavenueUtil;

    @Autowired
    public CCAvenueGateway(RestTemplate restTemplate, Environment environment) {
        this.restTemplate = restTemplate;

        this.redirectCCavenueUtil = new CCAvenueCryptUtil(environment.getRequiredProperty("ccavenue.redirect.working.key"));
        this.statusCCavenueUtil = new CCAvenueCryptUtil(environment.getRequiredProperty("ccavenue.status.working.key"));
        REDIRECT_ACCESS_CODE = environment.getRequiredProperty("ccavenue.redirect.access.code");
        STATUS_ACCESS_CODE = environment.getRequiredProperty("ccavenue.status.access.code");
        ACTIVE = Boolean.valueOf(environment.getRequiredProperty("ccavenue.active"));
        MERCHANT_ID = environment.getRequiredProperty("ccavenue.merchant.id");
        CURRENCY = environment.getRequiredProperty("ccavenue.currency");
        REDIRECT_URL = environment.getRequiredProperty("ccavenue.redirect.url");
        CANCEL_URL = environment.getRequiredProperty("ccavenue.cancel.url");
        LANGUAGE = environment.getRequiredProperty("ccavenue.language");
        GATEWAY_URL = environment.getRequiredProperty("ccavenue.gateway.url");
        GATEWAY_TRANSACTION_STATUS_URL = environment.getRequiredProperty("ccavenue.gateway.status.url");
        ORIGINAL_RETURN_URL_KEY = environment.getRequiredProperty("ccavenue.original.return.url.key");
    }

    @Override
    public URI generateRedirectURI(Transaction transaction) {

        TreeMap<String, String> encRequestMap = new TreeMap<>();
        encRequestMap.put(MERCHANT_ID_KEY, MERCHANT_ID);
        encRequestMap.put(ORDER_ID_KEY, transaction.getTxnId());
        encRequestMap.put(CURRENCY_KEY, CURRENCY);
        encRequestMap.put(AMOUNT_KEY, transaction.getTxnAmount());
        encRequestMap.put(REDIRECT_URL_KEY, getReturnUrl(transaction.getCallbackUrl(), REDIRECT_URL));
        encRequestMap.put(CANCEL_URL_KEY, getReturnUrl(transaction.getCallbackUrl(), CANCEL_URL));
        encRequestMap.put(LANGUAGE_KEY, LANGUAGE);
        encRequestMap.put(SUB_ACCOUNT_ID_KEY, transaction.getTenantId().replace(".",""));
        encRequestMap.put(MERCHANT_PARAM1, transaction.getModule());
        StringBuilder encRequest = new StringBuilder("");

        encRequestMap.forEach((key, value) -> encRequest.append(key).append("=").append(value).append("&"));
        log.info("Request before Encryption: " + encRequest.toString());

        try {
            TreeMap<String, String> paramMap = new TreeMap<>();
            paramMap.put(ACCESS_CODE_KEY, REDIRECT_ACCESS_CODE);
            paramMap.put(ENCREQUEST_KEY, redirectCCavenueUtil.encrypt(encRequest.toString()));

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            paramMap.forEach((key, value) -> params.put(key, Collections.singletonList(value)));

            UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(GATEWAY_URL).queryParams(params).build()
                    .encode();

            log.info("Encrypted URI: " + uriComponents.toUri());

            return uriComponents.toUri();

        } catch (Exception e) {
            log.error("URL generating failed ", e);
            throw new CustomException("URL_GEN_FAILED",
                    "URL generation failed, gateway redirect URI cannot be generated");
        }
    }

    private String getReturnUrl(String callbackUrl, String baseurl) {

        return UriComponentsBuilder.fromHttpUrl(baseurl).queryParam(ORIGINAL_RETURN_URL_KEY, callbackUrl).build()
                .encode().toUriString();
    }

    @Override
    public Transaction fetchStatus(Transaction currentStatus, Map<String, String> param) {

        try {

            String jsonRequest = statusCCavenueUtil.encrypt("{\"order_no\" : \"" + currentStatus.getTxnId() + "\"}");
            HashMap<String, String> params = new HashMap<>();
            params.put("enc_request", jsonRequest);
            params.put("access_code", STATUS_ACCESS_CODE);
            UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(GATEWAY_TRANSACTION_STATUS_URL)
                    .buildAndExpand(params).encode();
            ResponseEntity<String> response = restTemplate.postForEntity(uriComponents.toUri(),"", String.class);
            Transaction transaction = transformRawResponse(response.getBody(), currentStatus);
            log.info("Updated transaction : " + transaction.toString());
            return transaction;
        } catch (RestClientException e) {
            log.error("Unable to fetch status from ccavenue gateway", e);
            throw new CustomException("UNABLE_TO_FETCH_STATUS", "Unable to fetch status from ccavenue gateway");
        } catch (Exception e) {
            log.error("ccavenue Checksum generation failed", e);
            throw new CustomException("CHECKSUM_GEN_FAILED",
                    "Hash generation failed, gateway redirect URI cannot be generated");
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
        return "Pgreferenceno";
    }

    private Transaction transformRawResponse(String resp, Transaction currentStatus)
            throws JsonParseException, JsonMappingException, IOException {

        String decyJsonString= "";
        Transaction.TxnStatusEnum status = Transaction.TxnStatusEnum.PENDING;
        CCAvenueStatusResponse statusResponse;
        Map<String, String> respMap = new HashMap<String, String>();
        Arrays.asList(resp.split("&")).forEach(
                param -> respMap.put(param.split("=")[0], param.split("=").length > 1 ? param.split("=")[1] : ""));

        if (respMap.get("status").equals("0")) {
            decyJsonString = statusCCavenueUtil.decrypt(respMap.get("enc_response").replace("\r\n", ""));
            statusResponse = new ObjectMapper().readValue(decyJsonString,CCAvenueStatusResponse.class);

            if (statusResponse.getOrderStatus().equalsIgnoreCase("Successful") || 
                statusResponse.getOrderStatus().equalsIgnoreCase("Shipped"))
                status = Transaction.TxnStatusEnum.SUCCESS;
            else if (statusResponse.getOrderStatus().equalsIgnoreCase("Unsuccessful"))
                status = Transaction.TxnStatusEnum.FAILURE;

            return Transaction.builder().txnId(currentStatus.getTxnId())
                    .txnAmount(Utils.formatAmtAsRupee(statusResponse.getOrderGrossAmt()))
                    .txnStatus(status).gatewayTxnId(statusResponse.getReferenceNo())
                    .gatewayPaymentMode(statusResponse.getOrderOptionType())
                    .gatewayStatusCode(statusResponse.getOrderStatus())
                    .responseJson(decyJsonString).build();

        } else {
            log.error("Received error response from status call : " + respMap.get("enc_response"));
            throw new CustomException("UNABLE_TO_FETCH_STATUS", "Unable to fetch status from ccavenue gateway");
        }
    }
}
