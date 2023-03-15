package org.egov.pg.service.gateways.payu;

import lombok.Data;

@Data
public class PayuResponse {
    private String mihpayid;
    private String request_id;
    private String bank_ref_num;
    private String amt;
    private String amount;
    private String transaction_amount;
    private String txnid;
    private String additional_charges;
    private String productinfo;
    private String firstname;
    private String email;
    private String bankcode;
    private String udf1;
    private String udf3;
    private String udf4;
    private String udf5;
    private String error_code;
    private String addedon;
    private String payment_source;
    private String card_type;
    private String error_Message;
    private String net_amount_debit;
    private String disc;
    private String mode;
    private String PG_TYPE;
    private String card_no;
    private String name_on_card;
    private String udf2;
    private String status;
    private String unmappedstatus;
    private String Merchant_UTR;
    private String Settled_At;
    private String hash;
    private String field1;
    private String field2;
    private String field3;
    private String field4;
    private String field5;
    private String field6;
    private String field7;
    private String field8;
    private String field9;
}
