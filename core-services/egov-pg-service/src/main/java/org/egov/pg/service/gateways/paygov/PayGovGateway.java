package org.egov.pg.service.gateways.paygov;

import java.io.IOException;
import java.net.URI;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.pg.constants.PgConstants;
import org.egov.pg.models.PgDetail;
import org.egov.pg.models.Transaction;
import org.egov.pg.repository.PgDetailRepository;
import org.egov.pg.service.Gateway;
import org.egov.pg.utils.Utils;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

/**
 * PayGov Gateway implementation
 */
@Component
@Slf4j
public class PayGovGateway implements Gateway {

    private static final String GATEWAY_NAME = "paygov";
    private final String MESSAGE_TYPE;

    private final String CURRENCY_CODE;

    private final RestTemplate restTemplate;

    private final boolean ACTIVE;

    private final String REDIRECT_URL;
    private final String ORIGINAL_RETURN_URL_KEY;

    private final String MESSAGE_TYPE_KEY = "messageType";
    private final String MERCHANT_ID_KEY = "merchantId";

    private final String SERVICE_ID_KEY = "serviceId";
    private final String ORDER_ID_KEY = "orderId";
    private final String CUSTOMER_ID_KEY = "customerId";
    private final String TRANSACTION_AMOUNT_KEY = "transactionAmount";
    private final String CURRENCY_CODE_KEY = "currencyCode";
    private final String REQUEST_DATE_TIME_KEY = "requestDateTime";
    private final String SUCCESS_URL_KEY = "successUrl";
    private final String FAIL_URL_KEY = "failUrl";
    private final String ADDITIONAL_FIELD1_KEY = "additionalField1";
    private final String ADDITIONAL_FIELD2_KEY = "additionalField2";
    private final String ADDITIONAL_FIELD3_KEY = "additionalField3";
    private final String ADDITIONAL_FIELD4_KEY = "additionalField4";
    private final String ADDITIONAL_FIELD5_KEY = "additionalField5";
    private final String ADDITIONAL_FIELD_VALUE = "111111";
    private final String GATEWAY_TRANSACTION_STATUS_URL;
    private final String GATEWAY_URL;
    private final String CITIZEN_URL;
    private static final String SEPERATOR ="|";
    private String TX_DATE_FORMAT;
    private  final RequestInfo requestInfo;
    private PgDetailRepository pgDetailRepository;
    private final String PAYGOV_MERCHENT_ID;
    private final String PAYGOV_MERCHENT_SECERET_KEY;
    private final String PAYGOV_MERCHENT_USER;
    private final String PAYGOV_MERCHENT_PASSWORD;
    
    /**
     * Initialize by populating all required config parameters
     *
     * @param restTemplate rest template instance to be used to make REST calls
     * @param environment containing all required config parameters
     */
    @Autowired
    public PayGovGateway(RestTemplate restTemplate, Environment environment, ObjectMapper objectMapper,PgDetailRepository pgDetailRepository) {
        this.restTemplate = restTemplate;
        ACTIVE = Boolean.valueOf(environment.getRequiredProperty("paygov.active"));
        MESSAGE_TYPE = environment.getRequiredProperty("paygov.messagetype");
        CURRENCY_CODE = environment.getRequiredProperty("paygov.currency");
        PAYGOV_MERCHENT_ID = environment.getRequiredProperty("paygov.merchant.id");
        PAYGOV_MERCHENT_SECERET_KEY = environment.getRequiredProperty("paygov.merchant.secret.key");
        PAYGOV_MERCHENT_USER = environment.getRequiredProperty("paygov.merchant.user");
        PAYGOV_MERCHENT_PASSWORD = environment.getRequiredProperty("paygov.merchant.pwd");
        
        REDIRECT_URL = environment.getRequiredProperty("paygov.redirect.url");
        ORIGINAL_RETURN_URL_KEY = environment.getRequiredProperty("paygov.original.return.url.key");
        GATEWAY_TRANSACTION_STATUS_URL = environment.getRequiredProperty("paygov.gateway.status.url");
        CITIZEN_URL = environment.getRequiredProperty("egov.default.citizen.url");
        GATEWAY_URL = environment.getRequiredProperty("paygov.gateway.url");
        TX_DATE_FORMAT =environment.getRequiredProperty("paygov.dateformat");
        User userInfo = User.builder()
                .uuid("PG_DETAIL_GET")
                .type("SYSTEM")
                .roles(Collections.emptyList()).id(0L).build();

        requestInfo = new RequestInfo("", "", 0L, "", "", "", "", "", "", userInfo);
        this.pgDetailRepository=pgDetailRepository;
    }

    @Override
    public URI generateRedirectURI(Transaction transaction) {
    	//PgDetail pgDetail = pgDetailRepository.getPgDetailByTenantId(requestInfo, transaction.getTenantId());

    	/*
		 *
		 messageType|merchantId|serviceId|orderId|customerId|transactionAmount|currencyCode|r
		equestDateTime|successUrl|failUrl|additionalField1| additionalField2| additionalField3|
		additionalField4| additionalField5
		 */
        String urlData =null;
        HashMap<String, String> queryMap = new HashMap<>();
        queryMap.put(MESSAGE_TYPE_KEY, MESSAGE_TYPE);
        queryMap.put(MERCHANT_ID_KEY, PAYGOV_MERCHENT_ID);
        queryMap.put(SERVICE_ID_KEY, PAYGOV_MERCHENT_USER);
        queryMap.put(ORDER_ID_KEY, transaction.getTxnId());
        queryMap.put(CUSTOMER_ID_KEY, transaction.getUser().getUuid());
        queryMap.put(TRANSACTION_AMOUNT_KEY, String.valueOf( transaction.getTxnAmount()));
        queryMap.put(CURRENCY_CODE_KEY,CURRENCY_CODE);
        SimpleDateFormat format = new SimpleDateFormat(TX_DATE_FORMAT);
        queryMap.put(REQUEST_DATE_TIME_KEY, format.format(new Date()));
        String returnUrl = transaction.getCallbackUrl().replace(CITIZEN_URL, "");


        String moduleCode ="------";
        if(!StringUtils.isEmpty(transaction.getModule())) {
            if(transaction.getModule().length() < 6) {
                moduleCode= transaction.getModule() + moduleCode.substring(transaction.getModule().length()-1);
            }else {
                moduleCode =transaction.getModule();
            }
        }



        queryMap.put(SUCCESS_URL_KEY, getReturnUrl(returnUrl, REDIRECT_URL));
        queryMap.put(FAIL_URL_KEY, getReturnUrl(returnUrl, REDIRECT_URL));
        StringBuffer userDetail = new StringBuffer();
        if( transaction.getUser()!=null) {
            if(!StringUtils.isEmpty(transaction.getUser().getMobileNumber())) {
                userDetail.append(transaction.getUser().getMobileNumber());
            }

            if(!StringUtils.isEmpty(transaction.getUser().getEmailId())) {
                if(userDetail.length()>0) {
                    userDetail.append("^");
                }
                userDetail.append(transaction.getUser().getEmailId());
            }
        }
        if(userDetail.length() == 0) {
            userDetail.append(ADDITIONAL_FIELD_VALUE);
        }
        queryMap.put(ADDITIONAL_FIELD1_KEY, userDetail.toString());
        queryMap.put(ADDITIONAL_FIELD2_KEY, ADDITIONAL_FIELD_VALUE); //Not in use
        queryMap.put(ADDITIONAL_FIELD3_KEY, ADDITIONAL_FIELD_VALUE); //Not in use
        queryMap.put(ADDITIONAL_FIELD4_KEY, transaction.getConsumerCode());
        queryMap.put(ADDITIONAL_FIELD5_KEY, moduleCode);



        //Generate Checksum for params
        ArrayList<String> fields = new ArrayList<String>();
        fields.add(queryMap.get(MESSAGE_TYPE_KEY));
        fields.add(queryMap.get(MERCHANT_ID_KEY));
        fields.add(queryMap.get(SERVICE_ID_KEY));
        fields.add(queryMap.get(ORDER_ID_KEY));
        fields.add(queryMap.get(CUSTOMER_ID_KEY));
        fields.add(queryMap.get(TRANSACTION_AMOUNT_KEY));
        fields.add(queryMap.get(CURRENCY_CODE_KEY));
        fields.add(queryMap.get(REQUEST_DATE_TIME_KEY));
        fields.add(queryMap.get(SUCCESS_URL_KEY));
        fields.add(queryMap.get(FAIL_URL_KEY));
        fields.add(queryMap.get(ADDITIONAL_FIELD1_KEY));
        fields.add(queryMap.get(ADDITIONAL_FIELD2_KEY));
        fields.add(queryMap.get(ADDITIONAL_FIELD3_KEY));
        fields.add(queryMap.get(ADDITIONAL_FIELD4_KEY));
        fields.add(queryMap.get(ADDITIONAL_FIELD5_KEY));

        String message = String.join("|", fields);
        queryMap.put("checksum", PayGovUtils.generateCRC32Checksum(message, PAYGOV_MERCHENT_SECERET_KEY));
        queryMap.put("txURL",GATEWAY_URL);
        ObjectMapper mapper = new ObjectMapper();
        try {
            urlData= mapper.writeValueAsString(queryMap);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            log.error("PAYGOV URL generation failed", e);
            throw new CustomException("URL_GEN_FAILED",
                    "PAYGOV URL generation failed, gateway redirect URI cannot be generated");
        }
        
        
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        queryMap.forEach(params::add);
        UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(GATEWAY_URL).queryParams(params)
                .build().encode();

        return uriComponents.toUri();
        
        //return urlData;
    }

    @Override
    public String generateRedirectFormData(Transaction transaction) {
        PgDetail pgDetail = pgDetailRepository.getPgDetailByTenantId(requestInfo, transaction.getTenantId());

    	/*
		 *
		 messageType|merchantId|serviceId|orderId|customerId|transactionAmount|currencyCode|r
		equestDateTime|successUrl|failUrl|additionalField1| additionalField2| additionalField3|
		additionalField4| additionalField5
		 */
        String urlData =null;
        HashMap<String, String> queryMap = new HashMap<>();
        queryMap.put(MESSAGE_TYPE_KEY, MESSAGE_TYPE);
        queryMap.put(MERCHANT_ID_KEY, PAYGOV_MERCHENT_ID);
        queryMap.put(SERVICE_ID_KEY, PAYGOV_MERCHENT_USER);
        queryMap.put(ORDER_ID_KEY, transaction.getTxnId());
        queryMap.put(CUSTOMER_ID_KEY, transaction.getUser().getUuid());
        queryMap.put(TRANSACTION_AMOUNT_KEY, String.valueOf( transaction.getTxnAmount()));
        queryMap.put(CURRENCY_CODE_KEY,CURRENCY_CODE);
        SimpleDateFormat format = new SimpleDateFormat(TX_DATE_FORMAT);
        queryMap.put(REQUEST_DATE_TIME_KEY, format.format(new Date()));
        String returnUrl = transaction.getCallbackUrl().replace(CITIZEN_URL, "");


        String moduleCode ="------";
        if(!StringUtils.isEmpty(transaction.getModule())) {
            if(transaction.getModule().length() < 6) {
                moduleCode= transaction.getModule() + moduleCode.substring(transaction.getModule().length()-1);
            }else {
                moduleCode =transaction.getModule();
            }
        }



        queryMap.put(SUCCESS_URL_KEY, getReturnUrl(returnUrl, REDIRECT_URL));
        queryMap.put(FAIL_URL_KEY, getReturnUrl(returnUrl, REDIRECT_URL));
        StringBuffer userDetail = new StringBuffer();
        if( transaction.getUser()!=null) {
            if(!StringUtils.isEmpty(transaction.getUser().getMobileNumber())) {
                userDetail.append(transaction.getUser().getMobileNumber());
            }

            if(!StringUtils.isEmpty(transaction.getUser().getEmailId())) {
                if(userDetail.length()>0) {
                    userDetail.append("^");
                }
                userDetail.append(transaction.getUser().getEmailId());
            }
        }
        if(userDetail.length() == 0) {
            userDetail.append(ADDITIONAL_FIELD_VALUE);
        }
        queryMap.put(ADDITIONAL_FIELD1_KEY, userDetail.toString());
        queryMap.put(ADDITIONAL_FIELD2_KEY, ADDITIONAL_FIELD_VALUE); //Not in use
        queryMap.put(ADDITIONAL_FIELD3_KEY, ADDITIONAL_FIELD_VALUE); //Not in use
        queryMap.put(ADDITIONAL_FIELD4_KEY, transaction.getConsumerCode());
        queryMap.put(ADDITIONAL_FIELD5_KEY, moduleCode);



        //Generate Checksum for params
        ArrayList<String> fields = new ArrayList<String>();
        fields.add(queryMap.get(MESSAGE_TYPE_KEY));
        fields.add(queryMap.get(MERCHANT_ID_KEY));
        fields.add(queryMap.get(SERVICE_ID_KEY));
        fields.add(queryMap.get(ORDER_ID_KEY));
        fields.add(queryMap.get(CUSTOMER_ID_KEY));
        fields.add(queryMap.get(TRANSACTION_AMOUNT_KEY));
        fields.add(queryMap.get(CURRENCY_CODE_KEY));
        fields.add(queryMap.get(REQUEST_DATE_TIME_KEY));
        fields.add(queryMap.get(SUCCESS_URL_KEY));
        fields.add(queryMap.get(FAIL_URL_KEY));
        fields.add(queryMap.get(ADDITIONAL_FIELD1_KEY));
        fields.add(queryMap.get(ADDITIONAL_FIELD2_KEY));
        fields.add(queryMap.get(ADDITIONAL_FIELD3_KEY));
        fields.add(queryMap.get(ADDITIONAL_FIELD4_KEY));
        fields.add(queryMap.get(ADDITIONAL_FIELD5_KEY));

        String message = String.join("|", fields);
        queryMap.put("checksum", PayGovUtils.generateCRC32Checksum(message, PAYGOV_MERCHENT_SECERET_KEY));
        queryMap.put("txURL",GATEWAY_URL);
        ObjectMapper mapper = new ObjectMapper();
        try {
            urlData= mapper.writeValueAsString(queryMap);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            log.error("PAYGOV URL generation failed", e);
            throw new CustomException("URL_GEN_FAILED",
                    "PAYGOV URL generation failed, gateway redirect URI cannot be generated");
        }
        return urlData;
    }



    private String getReturnUrl(String callbackUrl, String baseurl) {
        return UriComponentsBuilder.fromHttpUrl(baseurl).queryParam(ORIGINAL_RETURN_URL_KEY, callbackUrl).build()
                .encode().toUriString();
    }

    class RequestMsg{
        private String requestMsg;
        public RequestMsg() {

        }
        public RequestMsg(String msg) {
            this.requestMsg= msg;
        }
        public String getRequestMsg() {
            return requestMsg;
        }
        public void setRequestMsg(String requestMsg) {
            this.requestMsg = requestMsg;
        }
        @Override
        public String toString() {
            return "RequestMsg [requestMsg=" + requestMsg + "]";
        }


    }


    class QueryApiRequest{
        List<RequestMsg> queryApiRequest= new ArrayList<RequestMsg>();

        public List<RequestMsg> getQueryApiRequest() {
            return queryApiRequest;
        }

        public void setQueryApiRequest(List<RequestMsg> queryApiRequest) {
            this.queryApiRequest = queryApiRequest;
        }

        @Override
        public String toString() {
            return "QueryApiRequest [queryApiRequest=" + queryApiRequest + "]";
        }


    }

    @Override
    public Transaction fetchStatus(Transaction currentStatus, Map<String, String> param) {
        PgDetail pgDetail = pgDetailRepository.getPgDetailByTenantId(requestInfo, currentStatus.getTenantId());
        log.debug("tx input "+ currentStatus);
        try {
            // create auth credentials
            String authStr = PAYGOV_MERCHENT_USER+":"+PAYGOV_MERCHENT_PASSWORD;
            String base64Creds = Base64.getEncoder().encodeToString(authStr.getBytes());

            // create headers
            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "Basic " + base64Creds);

            // create request
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            String requestmsg =SEPERATOR+ PAYGOV_MERCHENT_ID +SEPERATOR+currentStatus.getTxnId();
            params.add("requestMsg", requestmsg);
            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);
            log.debug("Auth Info : "+ authStr);
            log.debug("requestmsg : "+ requestmsg);
            // make a request
            ResponseEntity<String> response = new RestTemplate().exchange(GATEWAY_TRANSACTION_STATUS_URL, HttpMethod.POST, entity, String.class);
            HttpStatus statusCode = response.getStatusCode();
            if(statusCode.equals(HttpStatus.OK)) {
                Transaction resp = transformRawResponse(response.getBody(), currentStatus, PAYGOV_MERCHENT_SECERET_KEY);
                log.debug("RESPONSE ON SUCCESS "+resp);
                return resp;
            }else {
                log.error("tx input "+ currentStatus);
                log.error("NOT A SUCCESSFUL TX "+response);
                throw new CustomException("UNABLE_TO_FETCH_STATUS", "Unable to fetch status from PayGov gateway");
            }
        }catch (HttpStatusCodeException ex) {
            log.error("tx input "+ currentStatus);
            log.error("Error code "+ex.getStatusCode());
            log.error("Error getResponseBodyAsString code "+ex.getResponseBodyAsString());
            try {
                PayGovGatewayStatusResponse errorResponse = new ObjectMapper().readValue(ex.getResponseBodyAsString(),PayGovGatewayStatusResponse.class);
                //Error 404 --> No Data Found for given Request and 408 --> Session Time Out Error if not transaction has been initiated for 15 min
                if(errorResponse.getErrorCode().equals("404")||errorResponse.getErrorCode().equals("408")) {
                    Transaction txStatus = Transaction.builder().txnId(currentStatus.getTxnId())
                            .txnStatus(Transaction.TxnStatusEnum.FAILURE)
                            .txnStatusMsg(PgConstants.TXN_FAILURE_GATEWAY)
                            .gatewayStatusCode(errorResponse.getErrorCode()).gatewayStatusMsg(errorResponse.getErrorMessage())
                            .responseJson(ex.getResponseBodyAsString()).build();
                    return txStatus;
                }
            } catch (Exception e) {
                log.error("Error in response transform",e);
            }

            log.error("Unable to fetch status from PayGov gateway ", ex);
            throw new CustomException("UNABLE_TO_FETCH_STATUS", "Unable to fetch status from PayGov gateway");
        } catch (RestClientException e) {
            log.error("Unable to fetch status from PayGov gateway ", e);
            throw new CustomException("UNABLE_TO_FETCH_STATUS", "Unable to fetch status from PayGov gateway");
        } catch (Exception e) {
            log.error("PayGov Checksum validation failed ", e);
            throw new CustomException("CHECKSUM_GEN_FAILED","Checksum generation failed, gateway redirect URI cannot be generated");
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
        return "vpc_MerchTxnRef";
    }



    /**
     * Transform the Response string into PayGovGatewayStatusResponse object and return the transaction detail
     * @param resp
     * @param currentStatus
     * @param secretKey
     * @return
     * @throws JsonParseException
     * @throws JsonMappingException
     * @throws IOException
     */
    private Transaction transformRawResponse(String resp, Transaction currentStatus, String secretKey)
            throws JsonParseException, JsonMappingException, IOException {
        log.debug("Response Data "+resp);
        if (resp!=null) {

            //Validate the response against the checksum
            PayGovUtils.validateTransaction(resp, secretKey);

            String[] splitArray = resp.split("[|]");
            Transaction txStatus=null;
            PayGovGatewayStatusResponse statusResponse = new PayGovGatewayStatusResponse(splitArray[0]);
            int index =0;
            switch (statusResponse.getTxFlag()) {
                case "S":
    			/*For Success :
    			SuccessFlag|MessageType|SurePayMerchantId|ServiceId|OrderId|CustomerId|TransactionAmount|
    			CurrencyCode|PaymentMode|ResponseDateTime|SurePayTxnId|
    			BankTransactionNo|TransactionStatus|AdditionalInfo1|AdditionalInfo2|AdditionalInfo3|
    			AdditionalInfo4|AdditionalInfo5|ErrorCode|ErrorDescription|CheckSum*/
                    /*
                     * Sample Response :
                     * S|0100|UATSCBSG0000000207|SecuChhawani|PB_PG_2020_07_20_000153_16|
                     * 9eb6f880-c22f-4c1e-8f99-106bb3e0e60a|600.00|INR|UPI|20-07-2020|13557|pay_FGkHC8M8edSAmW|A|111111|111111|111111|111111|111111|||
                     */

                    statusResponse.setMessageType(splitArray[++index]);
                    statusResponse.setSurePayMerchantId(splitArray[++index]);
                    statusResponse.setServiceId(splitArray[++index]);
                    statusResponse.setOrderId(splitArray[++index]);
                    statusResponse.setCustomerId(splitArray[++index]);
                    statusResponse.setTransactionAmount(splitArray[++index]);
                    statusResponse.setCurrencyCode(splitArray[++index]);
                    statusResponse.setPaymentMode(splitArray[++index]);
                    statusResponse.setResponseDateTime(splitArray[++index]);
                    statusResponse.setSurePayTxnId(splitArray[++index]);
                    statusResponse.setBankTransactionNo(splitArray[++index]);
                    statusResponse.setTransactionStatus(splitArray[++index]);
                    statusResponse.setAdditionalInfo1(splitArray[++index]);
                    statusResponse.setAdditionalInfo2(splitArray[++index]);
                    statusResponse.setAdditionalInfo3(splitArray[++index]);
                    statusResponse.setAdditionalInfo4(splitArray[++index]);
                    statusResponse.setAdditionalInfo5(splitArray[++index]);
                    statusResponse.setErrorCode(splitArray[++index]);
                    statusResponse.setErrorDescription(splitArray[++index]);
                    statusResponse.setCheckSum(splitArray[++index]);
                    //Build tx Response object
                    txStatus = Transaction.builder().txnId(currentStatus.getTxnId())
                            .txnAmount(Utils.formatAmtAsRupee(statusResponse.getTransactionAmount()))
                            .txnStatus(Transaction.TxnStatusEnum.SUCCESS)
                            .txnStatusMsg(PgConstants.TXN_SUCCESS)
                            .gatewayTxnId(statusResponse.getSurePayTxnId())
                            .bankTransactionNo(statusResponse.getBankTransactionNo())
                            .gatewayPaymentMode(statusResponse.getPaymentMode())
                            .gatewayStatusCode(statusResponse.getTransactionStatus()).gatewayStatusMsg(statusResponse.getTransactionStatus())
                            .responseJson(resp).build();

                    break;
                case "F":
    			/*
    			 * FailureFlag|SurePayMerchantId|OrderId|ServiceId|PaymentMode|BankTransactionNo|
    			 ErrorCode|ErrorMessage|ErrorDescription|ResponseDateTime|CheckSum

    			 F|UATSCBSG0000000207|PB_PG_2020_07_22_000183_35|SecuChhawani|Wallet|
    			 pay_FHWjr1cdBNUt7y|400|PAYMENT_DECLINED_A|Payment failed|2020-07-22 17:06:06.366|1326393779
    			 */
                    statusResponse.setSurePayMerchantId(splitArray[++index]);
                    statusResponse.setOrderId(splitArray[++index]);
                    statusResponse.setServiceId(splitArray[++index]);
                    statusResponse.setPaymentMode(splitArray[++index]);
                    statusResponse.setBankTransactionNo(splitArray[++index]);
                    statusResponse.setErrorCode(splitArray[++index]);
                    statusResponse.setErrorMessage(splitArray[++index]);
                    statusResponse.setErrorDescription(splitArray[++index]);
                    statusResponse.setResponseDateTime(splitArray[++index]);
                    statusResponse.setCheckSum(splitArray[++index]);
                    String txStatusMsg =PgConstants.TXN_FAILURE_GATEWAY;
                    if(statusResponse.getErrorMessage().equalsIgnoreCase("PAYMENT_DECLINED_A")) {
                        txStatusMsg="Transaction Failed At Aggregator";
                    }else if(statusResponse.getErrorMessage().equalsIgnoreCase("PAYMENT_DECLINED_M")) {
                        txStatusMsg="Transaction Failed At Merchant ";
                    }else if(statusResponse.getErrorMessage().equalsIgnoreCase("PAYMENT_DECLINED_S")) {
                        txStatusMsg="Transaction Failed At Surepay";
                    }

                    //Build tx Response object
                    txStatus = Transaction.builder().txnId(currentStatus.getTxnId())
                            .txnStatus(Transaction.TxnStatusEnum.FAILURE)
                            .txnStatusMsg(txStatusMsg)
                            .gatewayTxnId(statusResponse.getSurePayTxnId())
                            .gatewayPaymentMode(statusResponse.getPaymentMode())
                            .bankTransactionNo(statusResponse.getBankTransactionNo())
                            .gatewayStatusCode(statusResponse.getErrorCode()).gatewayStatusMsg(statusResponse.getErrorMessage())
                            .responseJson(resp).build();
                    break;

                case "D":
                    index =0;
    			/*For Failure :
    			 FailureFlag|SurePayMerchantId|OrderId|ServiceId|PaymentMode|BankTransactionNo|
    			 ErrorCode|ErrorMessage|ErrorDescription|ResponseDateTime|CheckSum

    			 D|UATCBLSG0000000205|PB_PG_2020_07_22_000167_61|
    			 LuckChhawani||PAYMENT_DECLINED_M|2020-07-22 09:55:56.236|1250432021

    			 */
                    statusResponse.setSurePayMerchantId(splitArray[++index]);
                    statusResponse.setOrderId(splitArray[++index]);
                    statusResponse.setServiceId(splitArray[++index]);
                    statusResponse.setPaymentMode(splitArray[++index]);
                    //statusResponse.setBankTransactionNo(splitArray[++index]);
                    //statusResponse.setErrorCode(splitArray[++index]);
                    statusResponse.setErrorMessage(splitArray[++index]);
                    //statusResponse.setErrorDescription(splitArray[++index]);
                    statusResponse.setResponseDateTime(splitArray[++index]);
                    statusResponse.setCheckSum(splitArray[++index]);
                    //Build tx Response object
                    String txStatusMsgDecline =PgConstants.TXN_FAILURE_GATEWAY;
                    if(statusResponse.getErrorMessage().equalsIgnoreCase("PAYMENT_DECLINED_A")) {
                        txStatusMsgDecline="Transaction Failed At Aggregator";
                    }else if(statusResponse.getErrorMessage().equalsIgnoreCase("PAYMENT_DECLINED_M")) {
                        txStatusMsgDecline="Transaction Failed At Merchant ";
                    }else if(statusResponse.getErrorMessage().equalsIgnoreCase("PAYMENT_DECLINED_S")) {
                        txStatusMsgDecline="Transaction Failed At Surepay";
                    }
                    txStatus = Transaction.builder().txnId(currentStatus.getTxnId())
                            .txnStatus(Transaction.TxnStatusEnum.FAILURE)
                            .txnStatusMsg(txStatusMsgDecline)
                            .gatewayTxnId(statusResponse.getSurePayTxnId())
                            .gatewayPaymentMode(statusResponse.getPaymentMode())
                            .bankTransactionNo(statusResponse.getBankTransactionNo())
                            .gatewayStatusCode(statusResponse.getTxFlag()).gatewayStatusMsg(statusResponse.getErrorMessage())
                            .responseJson(resp).build();
                    break;
                case "I":
    			/* For Initiated :
    			 InitiatedFlag|SurePayMerchantId|OrderId|ServiceId|PaymentMode|ErrorDescription|
    			 ResponseDateTime|CheckSum

    			 I|UATSCBSG0000000207|PB_PG_2020_07_22_000168_45|SecuChhawani||
    			 ORDER_INITIATED|2020-07-22 10:27:28.312|481313839
    			 */
                    statusResponse.setSurePayMerchantId(splitArray[++index]);
                    statusResponse.setOrderId(splitArray[++index]);
                    statusResponse.setServiceId(splitArray[++index]);
                    statusResponse.setPaymentMode(splitArray[++index]);
                    statusResponse.setErrorDescription(splitArray[++index]);
                    statusResponse.setResponseDateTime(splitArray[++index]);
                    statusResponse.setCheckSum(splitArray[++index]);
                    //Build tx Response object
                    txStatus = Transaction.builder().txnId(currentStatus.getTxnId())
                            .txnStatus(Transaction.TxnStatusEnum.PENDING)
                            .gatewayPaymentMode(statusResponse.getPaymentMode())
                            .gatewayStatusCode(statusResponse.getTxFlag())
                            .gatewayStatusMsg(statusResponse.getErrorDescription())
                            .responseJson(resp).build();
                    break;
                default :
                    throw new CustomException("UNABLE_TO_FETCH_STATUS", "Unable to fetch Status of transaction");
            }
            log.info("Encoded value "+resp);
            log.info("PayGovGatewayStatusResponse --> "+statusResponse);
            log.info("Transaction --> "+txStatus);
            return txStatus;
        } else {
            log.error("Received error response from status call : " + resp);
            throw new CustomException("UNABLE_TO_FETCH_STATUS", "Unable to fetch status from PayGov gateway");
        }
    }

}
