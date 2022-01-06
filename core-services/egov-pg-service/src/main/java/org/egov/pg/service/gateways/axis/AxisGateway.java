package org.egov.pg.service.gateways.axis;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.pg.models.Transaction;
import org.egov.pg.service.Gateway;
import org.egov.pg.utils.Utils;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static org.egov.pg.constants.TransactionAdditionalFields.BANK_ACCOUNT_NUMBER;

/**
 * AXIS Gateway implementation
 */
@Component
@Slf4j
public class AxisGateway implements Gateway {


    private static final String GATEWAY_NAME = "AXIS";

    private final String MERCHANT_URL_PAY;
    private final String MERCHANT_URL_STATUS;
    private final String MERCHANT_ID;
    private final String SECURE_SECRET;
    private final String AMA_USER;
    private final String AMA_PWD;

    private final String VPC_ACCESS_CODE;
    private final String VPC_VERSION;
    private final String VPC_COMMAND_PAY;
    private final String VPC_COMMAND_STATUS;

    private final String LOCALE;
    private final String CURRENCY;

    private final RestTemplate restTemplate;
    private ObjectMapper objectMapper;

    private final boolean ACTIVE;

    /**
     * Initialize by populating all required config parameters
     *
     * @param restTemplate rest template instance to be used to make REST calls
     * @param environment containing all required config parameters
     */
    @Autowired
    public AxisGateway(RestTemplate restTemplate, Environment environment, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;

        ACTIVE = Boolean.valueOf(environment.getRequiredProperty("axis.active"));
        CURRENCY = environment.getRequiredProperty("axis.currency");
        LOCALE = environment.getRequiredProperty("axis.locale");
        MERCHANT_ID = environment.getRequiredProperty("axis.merchant.id");
        SECURE_SECRET = environment.getRequiredProperty("axis.merchant.secret.key");
        AMA_USER = environment.getRequiredProperty("axis.merchant.user");
        AMA_PWD = environment.getRequiredProperty("axis.merchant.pwd");
        VPC_ACCESS_CODE = environment.getRequiredProperty("axis.merchant.access.code");
        VPC_VERSION = environment.getRequiredProperty("axis.merchant.vpc.version");
        VPC_COMMAND_PAY = environment.getRequiredProperty("axis.merchant.vpc.command.pay");
        VPC_COMMAND_STATUS = environment.getRequiredProperty("axis.merchant.vpc.command.status");
        MERCHANT_URL_PAY = environment.getRequiredProperty("axis.url.debit");
        MERCHANT_URL_STATUS = environment.getRequiredProperty("axis.url.status");
    }

    @Override
    public URI generateRedirectURI(Transaction transaction) {

        Map<String, String> fields = new HashMap<>();
        fields.put("vpc_Version", VPC_VERSION);
        fields.put("vpc_Command", VPC_COMMAND_PAY);
        fields.put("vpc_AccessCode", VPC_ACCESS_CODE);
        fields.put("vpc_Merchant", MERCHANT_ID);
        fields.put("vpc_Locale", LOCALE);
        fields.put("vpc_Currency", CURRENCY);
        fields.put("vpc_ReturnURL", transaction.getCallbackUrl());
        fields.put("vpc_MerchTxnRef", transaction.getTxnId());
        fields.put("vpc_OrderInfo", (String) transaction.getAdditionalFields().get(BANK_ACCOUNT_NUMBER));
        fields.put("vpc_Amount", String.valueOf(Utils.formatAmtAsPaise(transaction.getTxnAmount())));

        String secureHash = AxisUtils.SHAhashAllFields(fields, SECURE_SECRET);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        fields.forEach(params::add);

        params.add("vpc_SecureHash", secureHash);
        String ENCRYPTION_TYPE = "SHA256";
        params.add("vpc_SecureHashType", ENCRYPTION_TYPE);

        UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(MERCHANT_URL_PAY).queryParams
                (params).build().encode();

        return uriComponents.toUri();
    }

    @Override
    public Transaction fetchStatus(Transaction currentStatus, Map<String, String> params) {
        String checksum = params.get("vpc_SecureHash");
        params.remove("vpc_SecureHash");
        params.remove("vpc_SecureHashType");

        if (!StringUtils.isEmpty(checksum)) {
            if (checksum.equals(AxisUtils.SHAhashAllFields(params, SECURE_SECRET))) {
                MultiValueMap<String, String> resp = new LinkedMultiValueMap<>();
                params.forEach(resp::add);
                Transaction txn = transformRawResponse(resp, currentStatus);
                if (txn.getTxnStatus().equals(Transaction.TxnStatusEnum.PENDING) || txn.getTxnStatus().equals(Transaction.TxnStatusEnum.FAILURE)) {
                    return txn;
                }
            }
        }

        return fetchStatusFromGateway(currentStatus);

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

    private Transaction fetchStatusFromGateway(Transaction currentStatus) {
        Map<String, String> fields = new HashMap<>();

        String txnRef = StringUtils.isEmpty(currentStatus.getModule()) ? currentStatus.getTxnId() :
                currentStatus.getModule() + "-" +currentStatus.getTxnId();

        fields.put("vpc_Version", VPC_VERSION);
        fields.put("vpc_Command", VPC_COMMAND_STATUS);
        fields.put("vpc_AccessCode", VPC_ACCESS_CODE);
        fields.put("vpc_Merchant", MERCHANT_ID);
        fields.put("vpc_MerchTxnRef", txnRef);
        fields.put("vpc_User", AMA_USER);
        fields.put("vpc_Password", AMA_PWD);

        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        fields.forEach(queryParams::add);

        UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(MERCHANT_URL_STATUS).queryParams
                (queryParams).build().encode();

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(uriComponents.toUriString(), "", String.class);

            log.info(response.getBody());

            Map<String, List<String>> responseParams = AxisUtils.splitQuery(response.getBody());

            log.info(responseParams.toString());

            return transformRawResponse(responseParams, currentStatus);
        }catch (RestClientException e){
            log.error("Unable to fetch status from payment gateway for txnid: "+ currentStatus.getTxnId(), e);
            throw new ServiceCallException("Error occurred while fetching status from payment gateway");
        }
    }

    private Transaction transformRawResponse(Map<String, List<String>> resp, Transaction currentStatus) {

        Transaction.TxnStatusEnum status;


        String respMsg = "";
        List<String> respCodeList = resp.get("vpc_TxnResponseCode");
        if(Objects.isNull(respCodeList) || respCodeList.isEmpty()){
            log.error("Transaction not found in the payment gateway");
            return currentStatus;
        }

        String respCode = respCodeList.get(0);
        //TODO Handle error conditions where we dont have response codes?

        switch (respCode) {
            case "0":
                respMsg = "Transaction Successful";
                break;
            case "1":
                respMsg = "Transaction Declined";
                break;
            case "2":
                respMsg = "Bank Declined Transaction";
                break;
            case "3":
                respMsg = "No Reply from Bank";
                break;
            case "4":
                respMsg = "Expired Card";
                break;
            case "5":
                respMsg = "Insufficient Funds";
                break;
            case "6":
                respMsg = "Error Communicating with Bank";
                break;
            case "7":
                respMsg = "Payment Server detected an error";
                break;
            case "8":
                respMsg = "Transaction Type Not Supported";
                break;
            case "9":
                respMsg = "Bank declined transaction (Do not contact Bank)";
                break;
            case "A":
                respMsg = "Transaction Aborted";
                break;
            case "B":
                respMsg = "Transaction Declined - Contact the Bank";
                break;
            case "C":
                respMsg = "Transaction Cancelled";
                break;
            case "D":
                respMsg = "Deferred transaction has been received and is awaiting processing";
                break;
            case "E":
                respMsg = "Transaction Declined - Refer to card issuer";
                break;
            case "F":
                respMsg = "3-D Secure Authentication failed";
                break;
            case "I":
                respMsg = "Card Security Code verification failed";
                break;
            case "L":
                respMsg = "Shopping Transaction Locked (Please try the transaction again later)";
                break;
            case "M":
                respMsg = "Transaction Submitted (No response from acquirer)";
                break;
            case "N":
                respMsg = "Cardholder is not enrolled in Authentication scheme";
                break;
            case "P":
                respMsg = "Transaction has been received by the Payment Adaptor and is being processed";
                break;
            case "R":
                respMsg = "Transaction was not processed - Reached limit of retry attempts allowed";
                break;
            case "S":
                respMsg = "Duplicate SessionID";
                break;
            case "T":
                respMsg = "Address Verification Failed";
                break;
            case "U":
                respMsg = "Card Security Code Failed";
                break;
            case "V":
                respMsg = "Address Verification and Card Security Code Failed";
                break;
            case "?":
                respMsg = "Transaction status is unknown";
                break;
            default:
                respMsg = "Unable to be determined";
                break;
        }

        if (respCode.equalsIgnoreCase("0")) {
            status = Transaction.TxnStatusEnum.SUCCESS;
            return Transaction.builder()
                    .txnId(currentStatus.getTxnId())
                    .txnAmount(Utils.convertPaiseToRupee(resp.get("vpc_Amount").get(0)))
                    .txnStatus(status)
                    .gatewayTxnId(resp.get("vpc_TransactionNo").get(0))
                    .gatewayPaymentMode(resp.get("vpc_Card").get(0))
                    .gatewayStatusCode(respCode)
                    .gatewayStatusMsg(respMsg)
                    .responseJson(resp)
                    .build();
        } else {
            status = Transaction.TxnStatusEnum.FAILURE;
            return Transaction.builder()
                    .txnId(currentStatus.getTxnId())
                    .txnAmount(Utils.convertPaiseToRupee(resp.get("vpc_Amount").get(0)))
                    .txnStatus(status)
                    .gatewayTxnId(resp.get("vpc_TransactionNo").get(0))
                    .gatewayStatusCode(respCode)
                    .gatewayStatusMsg(respMsg)
                    .responseJson(resp)
                    .build();
        }


    }

}
