package org.egov.pg.service.gateways.ccavenue;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonPropertyOrder({ "reference_no", "order_no", "order_currncy", "order_amt", "order_date_time", "order_bill_name",
        "order_bill_address", "order_bill_zip", "order_bill_tel", "order_bill_email", "order_bill_country",
        "order_ship_name", "order_ship_address", "order_ship_country", "order_ship_tel", "order_bill_city",
        "order_bill_state", "order_ship_city", "order_ship_state", "order_ship_zip", "order_notes", "order_ip",
        "order_status", "order_fraud_status", "order_status_date_time", "order_capt_amt", "order_card_name",
        "order_fee_perc", "order_fee_perc_value", "order_fee_flat", "order_gross_amt", "order_discount", "order_tax",
        "order_bank_ref_no", "order_gtw_id", "order_bank_response", "order_option_type", "order_TDS",
        "order_device_type", "status", "error_desc", "error_code" })

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CCAvenueStatusResponse {

    @JsonProperty("reference_no")
    private String referenceNo;

    @JsonProperty("order_no")
    private String orderNo;

    @JsonProperty("order_currncy")
    private String orderCurrncy;

    @JsonProperty("order_amt")
    private String orderAmt;

    @JsonProperty("order_date_time")
    private String orderDateTime;

    @JsonProperty("order_bill_name")
    private String orderBillName;

    @JsonProperty("order_bill_address")
    private String orderBillAddress;

    @JsonProperty("order_bill_zip")
    private String orderBillZip;

    @JsonProperty("order_bill_tel")
    private String orderBillTel;

    @JsonProperty("order_bill_email")
    private String orderBillEmail;

    @JsonProperty("order_bill_country")
    private String orderBillCountry;

    @JsonProperty("order_ship_name")
    private String orderShipName;

    @JsonProperty("order_ship_address")
    private String orderShipAddress;

    @JsonProperty("order_ship_country")
    private String orderShipCountry;

    @JsonProperty("order_ship_tel")
    private String orderShipTel;

    @JsonProperty("order_bill_city")
    private String orderBillCity;

    @JsonProperty("order_bill_state")
    private String orderBillState;

    @JsonProperty("order_ship_city")
    private String orderShipCity;

    @JsonProperty("order_ship_state")
    private String orderShipState;

    @JsonProperty("order_ship_zip")
    private String orderShipZip;

    @JsonProperty("order_notes")
    private String orderNotes;

    @JsonProperty("order_ip")
    private String orderIp;

    @JsonProperty("order_status")
    private String orderStatus;

    @JsonProperty("order_fraud_status")
    private String orderFraudStatus;

    @JsonProperty("order_status_date_time")
    private String orderStatusDateTime;

    @JsonProperty("order_capt_amt")
    private String orderCaptAmt;

    @JsonProperty("order_card_name")
    private String orderCardName;

    @JsonProperty("order_fee_perc")
    private String orderFeePerc;

    @JsonProperty("order_fee_perc_value")
    private String orderFeePercValue;

    @JsonProperty("order_fee_flat")
    private String orderFeeFlat;

    @JsonProperty("order_gross_amt")
    private String orderGrossAmt;

    @JsonProperty("order_discount")
    private String orderDiscount;

    @JsonProperty("order_tax")
    private String orderTax;

    @JsonProperty("order_bank_ref_no")
    private String orderBankRefNo;

    @JsonProperty("order_gtw_id")
    private String orderGtwId;

    @JsonProperty("order_bank_response")
    private String orderBankResponse;

    @JsonProperty("order_option_type")
    private String orderOptionType;

    @JsonProperty("order_TDS")
    private String orderTDS;

    @JsonProperty("order_device_type")
    private String orderDeviceType;

    @JsonProperty("status")
    private String status;

    @JsonProperty("error_desc")
    private String errorDesc;

    @JsonProperty("error_code")
    private String errorCode;

}