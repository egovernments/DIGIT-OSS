package org.egov.pg.service.gateways.paygov;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PayGovGatewayStatusResponse {
    //Message Format
	/*For Success :
	SuccessFlag|MessageType|SurePayMerchantId|ServiceId|OrderId|CustomerId|TransactionAmount|
	CurrencyCode|PaymentMode|ResponseDateTime|SurePayTxnId|
	BankTransactionNo|TransactionStatus|AdditionalInfo1|AdditionalInfo2|AdditionalInfo3|
	AdditionalInfo4|AdditionalInfo5|ErrorCode|ErrorDescription|CheckSum*/

	/*For Failure :
	 FailureFlag|SurePayMerchantId|OrderId|ServiceId|PaymentMode|BankTransactionNo|
	 ErrorCode|ErrorMessage|ErrorDescription|ResponseDateTime|CheckSum
	 */
	/* For Initiated :
	 InitiatedFlag|SurePayMerchantId|OrderId|ServiceId|PaymentMode|ErrorDescription|
	 ResponseDateTime|CheckSum
	 */


    public PayGovGatewayStatusResponse(String status) {
        txFlag = status;
    }

    private String txFlag;
    private String messageType;
    private String surePayMerchantId;
    private String serviceId;
    private String orderId;
    private String customerId;
    private String transactionAmount;
    private String currencyCode;
    private String paymentMode;
    @JsonProperty("timeStamp")
    private String responseDateTime;
    private String surePayTxnId;
    private String bankTransactionNo;
    private String transactionStatus;
    private String additionalInfo1;
    private String additionalInfo2;
    private String additionalInfo3;
    private String additionalInfo4;
    private String additionalInfo5;
    private String errorCode;
    private String errorMessage;
    @JsonProperty("errorDetails")
    private String errorDescription;
    private String checkSum;



}
