package org.egov.pg.service.gateways.easypay;

import java.net.URI;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

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
public class EasyPayGateway implements Gateway {

    private static final String GATEWAY_NAME = "EASYPAY";
    private final String GATEWAY_URL;
    private final String GATEWAY_TRANSACTION_STATUS_URL ;
    private final boolean ACTIVE;
    private final String MERCHANT_ID;
    private final String OPTIONAL_FIELDS;
    private final String SUB_MERCHANT_ID;
    private final String PAYMENT_MODE;

    private final String MERCHANT_ID_KEY = "merchantid";
    private final String MANDATORY_FIELDS_KEY = "mandatory fields";
    private final String OPTIONAL_FIELDS_KEY = "optional fields";
    private final String RETURN_URL_KEY = "returnurl";
    private final String REFERENCE_NO_KEY = "Reference No";
    private final String SUB_MERCHANT_ID_KEY = "submerchantid";
    private final String TRANSACTION_AMOUNT_KEY = "transaction amount";
    private final String PAY_MODE_KEY = "paymode";

    private final String EASY_PAY_TRAN_ID_KEY =  "ezpaytranid";
    private final String AMOUNT_KEY =  "amount";
    private final String PAYMENT_MODE_KEY =  "paymentmode";
    private final String TRAN_DATE_KEY =  "trandate";
    private final String PG_REFERENCE_NO_KEY =  "pgreferenceno";

    private RestTemplate restTemplate;
    private EasyPayUtil easypayUtil;

    @Autowired
    public EasyPayGateway(RestTemplate restTemplate, EasyPayUtil util, Environment environment) {
        this.restTemplate = restTemplate;
        this.easypayUtil = util;

        ACTIVE = Boolean.valueOf(environment.getRequiredProperty("easypay.active"));
        MERCHANT_ID = environment.getRequiredProperty("easypay.merchant.id");
        OPTIONAL_FIELDS = environment.getRequiredProperty("easypay.optional.fields");
        SUB_MERCHANT_ID = environment.getRequiredProperty("easypay.sub.merchant.id");
        PAYMENT_MODE = environment.getRequiredProperty("easypay.payment.mode");
        GATEWAY_URL = environment.getRequiredProperty("easypay.gateway.url");
        GATEWAY_TRANSACTION_STATUS_URL = environment.getRequiredProperty("easypay.gateway.status.url");
    }


    @Override
    public URI generateRedirectURI(Transaction transaction) {

        TreeMap<String, String> treeMap = new TreeMap<>();
        treeMap.put(MERCHANT_ID_KEY, MERCHANT_ID);
        treeMap.put(MANDATORY_FIELDS_KEY, transaction.getTxnId() +"|"+ 
                SUB_MERCHANT_ID+"|"+ 
                Utils.formatAmtAsRupee(transaction.getTxnAmount()));
        treeMap.put(OPTIONAL_FIELDS_KEY, (OPTIONAL_FIELDS));
        treeMap.put(RETURN_URL_KEY, transaction.getCallbackUrl());
        treeMap.put(REFERENCE_NO_KEY, (transaction.getTxnId()));
        treeMap.put(SUB_MERCHANT_ID_KEY, (SUB_MERCHANT_ID));
        treeMap.put(TRANSACTION_AMOUNT_KEY, (Utils.formatAmtAsRupee(transaction.getTxnAmount())));
        treeMap.put(PAY_MODE_KEY, (PAYMENT_MODE));

        MultiValueMap<String, String> encrtyParams = new LinkedMultiValueMap<>();
        treeMap.forEach((key, value) -> encrtyParams.put(key, Collections.singletonList(value)));

        UriComponents encrytURIComponents = UriComponentsBuilder.fromHttpUrl(GATEWAY_URL).queryParams(encrtyParams)
                .build().encode();

        log.info("Unencrypted URI: " + encrytURIComponents.toUri());


        try {
            TreeMap<String, String> paramMap = new TreeMap<>();
            paramMap.put(MERCHANT_ID_KEY, MERCHANT_ID);
            paramMap.put(MANDATORY_FIELDS_KEY, easypayUtil.getEncryptedMandatoryFields(transaction.getTxnId(), 
                    SUB_MERCHANT_ID,
                    Utils.formatAmtAsRupee(transaction.getTxnAmount())));
            paramMap.put(RETURN_URL_KEY, easypayUtil.encrypt(transaction.getCallbackUrl()));
            paramMap.put(OPTIONAL_FIELDS_KEY, easypayUtil.encrypt(OPTIONAL_FIELDS));
            paramMap.put(REFERENCE_NO_KEY, easypayUtil.encrypt(transaction.getTxnId()));
            paramMap.put(SUB_MERCHANT_ID_KEY, easypayUtil.encrypt(SUB_MERCHANT_ID));
            paramMap.put(TRANSACTION_AMOUNT_KEY, easypayUtil.encrypt(Utils.formatAmtAsRupee(transaction.getTxnAmount())));
            paramMap.put(PAY_MODE_KEY, easypayUtil.encrypt(PAYMENT_MODE));

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            paramMap.forEach((key, value) -> params.put(key, Collections.singletonList(value)));

            UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(GATEWAY_URL).queryParams(params)
                    .build().encode();

            log.info("Encrypted URI: " + uriComponents.toUri());

            return uriComponents.toUri();

        } catch (Exception e) {
            log.error("URL generating failed ", e);
            throw new CustomException("URL_GEN_FAILED",
                    "URL generation failed, gateway redirect URI cannot be generated");
        }
    }

    @Override
    public Transaction fetchStatus(Transaction currentStatus, Map<String, String> param) {
        TreeMap<String, String> treeMap = new TreeMap<String, String>();
        treeMap.put(MERCHANT_ID_KEY, MERCHANT_ID);
        treeMap.put(EASY_PAY_TRAN_ID_KEY, "");
        treeMap.put(AMOUNT_KEY, "");
        treeMap.put(PAYMENT_MODE_KEY, "");
        treeMap.put(TRAN_DATE_KEY, "");
        treeMap.put(PG_REFERENCE_NO_KEY, currentStatus.getTxnId());

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        treeMap.forEach((key, value) -> params.put(key, Collections.singletonList(value)));

        UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(GATEWAY_TRANSACTION_STATUS_URL).queryParams(params)
                .build().encode();

        try {

            // HttpHeaders httpHeaders = new HttpHeaders();
            // httpHeaders.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString());

            ResponseEntity<String> response = restTemplate.getForEntity(uriComponents.toUri(), String.class);

            return transformRawResponse(response.getBody(), currentStatus);

        } catch (RestClientException e) {
            log.error("Unable to fetch status from Paytm gateway", e);
            throw new CustomException("UNABLE_TO_FETCH_STATUS", "Unable to fetch status from Paytm gateway");
        } catch (Exception e) {
            log.error("Paytm Checksum generation failed", e);
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

    private Transaction transformRawResponse(String resp, Transaction currentStatus) {

        Transaction.TxnStatusEnum status = Transaction.TxnStatusEnum.PENDING;

        Map<String, String> respMap = new HashMap<String, String>();
        Arrays.asList(resp.split("&")).forEach(
                param -> respMap.put(param.split("=")[0], param.split("=").length > 1 ? param.split("=")[1] : ""));

        if (respMap.get("status").equals("Success"))
            status = Transaction.TxnStatusEnum.SUCCESS;
        else if (respMap.get("status").equalsIgnoreCase("FAILED") || respMap.get("status").equalsIgnoreCase("TIMEOUT") )
            status = Transaction.TxnStatusEnum.FAILURE;


       //status=NotInitiated&ezpaytranid=NA&amount=NA&trandate=NA&pgreferenceno=PB_PG_2019_11_08_000035_17&sdt=&BA=null&PF=null&TAX=null&PaymentMode=null

        return Transaction.builder()
                .txnId(currentStatus.getTxnId())
                .txnAmount(Utils.formatAmtAsRupee(respMap.get("amount").equals("NA")? "0.00" : respMap.get("amount")))
                .txnStatus(status)
                .gatewayTxnId(respMap.get("ezpaytranid"))
                .gatewayPaymentMode(respMap.get("PaymentMode"))
                .gatewayStatusCode(respMap.get("status"))
                .responseJson(resp)
                .build();

    }
}
