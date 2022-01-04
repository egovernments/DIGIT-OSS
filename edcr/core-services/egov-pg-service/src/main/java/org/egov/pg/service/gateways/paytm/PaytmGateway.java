package org.egov.pg.service.gateways.paytm;

import com.paytm.pg.merchant.CheckSumServiceHelper;
import lombok.extern.slf4j.Slf4j;
import org.egov.pg.models.Transaction;
import org.egov.pg.service.Gateway;
import org.egov.pg.utils.Utils;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Collections;
import java.util.Map;
import java.util.TreeMap;

@Service
@Slf4j
public class PaytmGateway implements Gateway {

    private static final String GATEWAY_NAME = "PAYTM";
    private final String MID;
    private final String MERCHANT_KEY;
    private final String MERCHANT_URL_DEBIT;
    private final String MERCHANT_URL_STATUS;
    private final String INDUSTRY_TYPE_ID;
    private final String CHANNEL_ID;
    private final String WEBSITE;

    private final boolean ACTIVE;

    private RestTemplate restTemplate;

    @Autowired
    public PaytmGateway(RestTemplate restTemplate, Environment environment) {
        this.restTemplate = restTemplate;

        ACTIVE = Boolean.valueOf(environment.getRequiredProperty("paytm.active"));
        MID = environment.getRequiredProperty("paytm.merchant.id");
        MERCHANT_KEY = environment.getRequiredProperty("paytm.merchant.secret.key");
        INDUSTRY_TYPE_ID = environment.getRequiredProperty("paytm.merchant.industry.type");
        CHANNEL_ID = environment.getRequiredProperty("paytm.merchant.channel.id");
        WEBSITE = environment.getRequiredProperty("paytm.merchant.website");
        MERCHANT_URL_DEBIT = environment.getRequiredProperty("paytm.url.debit");
        MERCHANT_URL_STATUS = environment.getRequiredProperty("paytm.url.status");

    }

    @Override
    public URI generateRedirectURI(Transaction transaction) {
        TreeMap<String, String> paramMap = new TreeMap<>();
        paramMap.put("MID", MID);
        paramMap.put("ORDER_ID", transaction.getTxnId());
        paramMap.put("CUST_ID", transaction.getUser().getUserName());
        paramMap.put("INDUSTRY_TYPE_ID", INDUSTRY_TYPE_ID);
        paramMap.put("CHANNEL_ID", CHANNEL_ID);
        paramMap.put("TXN_AMOUNT", Utils.formatAmtAsRupee(transaction.getTxnAmount()));
        paramMap.put("WEBSITE", WEBSITE);
        paramMap.put("EMAIL", transaction.getUser().getEmailId());
        paramMap.put("MOBILE_NO", transaction.getUser().getMobileNumber());
        paramMap.put("CALLBACK_URL", transaction.getCallbackUrl());

        try {

            String checkSum = CheckSumServiceHelper.getCheckSumServiceHelper().genrateCheckSum(MERCHANT_KEY, paramMap);
            paramMap.put("CHECKSUMHASH", checkSum);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            paramMap.forEach((key, value) -> params.put(key, Collections.singletonList(value)));


            UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(MERCHANT_URL_DEBIT).queryParams
                    (params).build().encode();

            return uriComponents.toUri();
        } catch (Exception e) {
            log.error("Paytm Checksum generation failed", e);
            throw new CustomException("CHECKSUM_GEN_FAILED", "Hash generation failed, gateway redirect URI cannot be generated");
        }
    }

    @Override
    public Transaction fetchStatus(Transaction currentStatus, Map<String, String> params) {
        TreeMap<String, String> treeMap = new TreeMap<String, String>();
        treeMap.put("MID", MID);
        treeMap.put("ORDER_ID", currentStatus.getTxnId());

        try {
            String checkSum = CheckSumServiceHelper.getCheckSumServiceHelper().genrateCheckSum(MERCHANT_KEY, treeMap);
            treeMap.put("CHECKSUMHASH", checkSum);

            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString());

            HttpEntity<Map<String, String>> httpEntity = new HttpEntity<>(treeMap, httpHeaders);

            ResponseEntity<PaytmResponse> response = restTemplate.postForEntity(MERCHANT_URL_STATUS, httpEntity,
                    PaytmResponse.class);

            return transformRawResponse(response.getBody(), currentStatus);

        } catch (RestClientException e) {
            log.error("Unable to fetch status from Paytm gateway", e);
            throw new CustomException("UNABLE_TO_FETCH_STATUS", "Unable to fetch status from Paytm gateway");
        } catch (Exception e) {
            log.error("Paytm Checksum generation failed", e);
            throw new CustomException("CHECKSUM_GEN_FAILED", "Hash generation failed, gateway redirect URI cannot be generated");
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
        return "ORDERID";
    }

    private Transaction transformRawResponse(PaytmResponse resp, Transaction currentStatus) {

        Transaction.TxnStatusEnum status = Transaction.TxnStatusEnum.PENDING;

        if (resp.getStatus().equalsIgnoreCase("TXN_SUCCESS"))
            status = Transaction.TxnStatusEnum.SUCCESS;
        else if (resp.getStatus().equalsIgnoreCase("TXN_FAILURE"))
            status = Transaction.TxnStatusEnum.FAILURE;

        return Transaction.builder()
                .txnId(currentStatus.getTxnId())
                .txnAmount(Utils.formatAmtAsRupee(resp.getTxnAmount()))
                .txnStatus(status)
                .gatewayTxnId(resp.getTxnId())
                .gatewayPaymentMode(resp.getPaymentMode())
                .gatewayStatusCode(resp.getRespCode())
                .gatewayStatusMsg(resp.getRespMsg())
                .responseJson(resp)
                .build();


    }
}
