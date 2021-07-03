package org.egov.egf.es.integration.service;

import org.python.icu.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
@JsonSerialize
@JsonIgnoreProperties(ignoreUnknown = true)
public class RollOutAdoptionData {

    private String id;
    @JsonProperty("ulbname")
    private String ulbName;
    @JsonProperty("regionname")
    private String regionName;
    @JsonProperty("districtname")
    private String districtName;
    @JsonProperty("ulbcode")
    private String ulbCode;
    @JsonProperty("ulbgrade")
    private String grade;
    @JsonProperty("numberofbills")
    private Integer numberOfBills;
    @JsonProperty("numberofbankaccounts")
    private Integer numberOfbankAccounts;
    @JsonProperty("numberofcontractorsuppliers")
    private Integer numberOfContractorSuppliers;
    @JsonProperty("totalamountofmiscreceipt")
    private BigDecimal totalAmountOfMiscReceipt;
    @JsonProperty("numberofmiscreceipts")
    private Integer numberOfMiscReceipts;
    @JsonProperty("totalreceiptvoucheramounts")
    private BigDecimal totalReceiptVoucherAmounts;
    @JsonProperty("numberofreceiptvoucher")
    private Integer numberOfReceiptVoucher;
    @JsonProperty("totalpaymentamounts")
    private BigDecimal totalPaymentAmounts;
    @JsonProperty("billamountpaid")
    private BigDecimal billAmountPaid;
    @JsonProperty("totalbillamounts")
    private BigDecimal totalBillAmounts;
    @JsonProperty("numberofpayments")
    private Integer numberOfPayments;
    @JsonProperty("numberofvouchersforbill")
    private Integer numberOfVouchersForBill;
    @JsonProperty("numberofbillspaid")
    private Integer numberOfBillsPaid;
    @JsonProperty("timestamp")
    private Long timeStamp;
    
    public RollOutAdoptionData() {
        // TODO Auto-generated constructor stub
    }

    public RollOutAdoptionData(String id, String ulbName, String ulbcode, String districtname, String regionname,
            String grade, Integer numberOfbills, Integer numberofvouchersforbill, Integer numberofpayments,
            BigDecimal totalbillamounts, BigDecimal billamountpaid, BigDecimal totalpaymentamounts, Integer numberOfReceiptVoucher,
            BigDecimal totalReceiptVoucherAmounts, Integer numberofmiscreceipts, BigDecimal totalamountofmiscreceipt,
            Integer numberofcontractorsuppliers, Integer numberofbankaccounts, Integer numberOfBillsPaid, Long timeStamp) {
        this.id=id;
        this.ulbName=ulbName;
        this.ulbCode=ulbcode;
        this.districtName=districtname;
        this.regionName=regionname;
        this.grade=grade;
        this.numberOfBills=numberOfbills;
        this.numberOfVouchersForBill=numberofvouchersforbill;
        this.numberOfPayments=numberofpayments;
        this.totalBillAmounts=totalbillamounts;
        this.billAmountPaid=billamountpaid;
        this.totalPaymentAmounts=totalpaymentamounts;
        this.numberOfReceiptVoucher=numberOfReceiptVoucher;
        this.totalReceiptVoucherAmounts=totalReceiptVoucherAmounts;
        this.numberOfMiscReceipts=numberofmiscreceipts;
        this.totalAmountOfMiscReceipt=totalamountofmiscreceipt;
        this.numberOfContractorSuppliers=numberofcontractorsuppliers;
        this.numberOfbankAccounts=numberofbankaccounts;
        this.numberOfBillsPaid=numberOfBillsPaid;
        this.timeStamp=timeStamp;
    }

    @Override
    public String toString() {
        return "RollOutAdoptionDataWrapper [id=" + id + ", ulbName=" + ulbName + ", regionname=" + regionName + ", districtname="
                + districtName + ", ulbcode=" + ulbCode + ", grade=" + grade + ", numberOfbills=" + numberOfBills
                + ", numberofbankaccounts=" + numberOfbankAccounts + ", numberofcontractorsuppliers="
                + numberOfContractorSuppliers + ", totalamountofmiscreceipt=" + totalAmountOfMiscReceipt
                + ", numberofmiscreceipts=" + numberOfMiscReceipts + ", totalReceiptVoucherAmounts=" + totalReceiptVoucherAmounts
                + ", numberOfReceiptVoucher=" + numberOfReceiptVoucher + ", totalpaymentamounts=" + totalPaymentAmounts
                + ", billamountpaid=" + billAmountPaid + ", totalbillamounts=" + totalBillAmounts + ", numberofpayments="
                + numberOfPayments + ", numberofvouchersforbill=" + numberOfVouchersForBill + ", numberOfBillsPaid=" + numberOfBillsPaid +", timeStamp=" + timeStamp + "]";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUlbName() {
        return ulbName;
    }

    public void setUlbName(String ulbName) {
        this.ulbName = ulbName;
    }

    public String getRegionName() {
        return regionName;
    }

    public void setRegionName(String regionName) {
        this.regionName = regionName;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    public String getUlbCode() {
        return ulbCode;
    }

    public void setUlbCode(String ulbCode) {
        this.ulbCode = ulbCode;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public Integer getNumberOfBills() {
        return numberOfBills;
    }

    public void setNumberOfBills(Integer numberOfBills) {
        this.numberOfBills = numberOfBills;
    }

    public Integer getNumberOfbankAccounts() {
        return numberOfbankAccounts;
    }

    public void setNumberOfbankAccounts(Integer numberOfbankAccounts) {
        this.numberOfbankAccounts = numberOfbankAccounts;
    }

    public Integer getNumberOfContractorSuppliers() {
        return numberOfContractorSuppliers;
    }

    public void setNumberOfContractorSuppliers(Integer numberOfContractorSuppliers) {
        this.numberOfContractorSuppliers = numberOfContractorSuppliers;
    }

    public BigDecimal getTotalAmountOfMiscReceipt() {
        return totalAmountOfMiscReceipt;
    }

    public void setTotalAmountOfMiscReceipt(BigDecimal totalAmountOfMiscReceipt) {
        this.totalAmountOfMiscReceipt = totalAmountOfMiscReceipt;
    }

    public Integer getNumberOfMiscReceipts() {
        return numberOfMiscReceipts;
    }

    public void setNumberOfMiscReceipts(Integer numberOfMiscReceipts) {
        this.numberOfMiscReceipts = numberOfMiscReceipts;
    }

    public BigDecimal getTotalPaymentAmounts() {
        return totalPaymentAmounts;
    }

    public void setTotalPaymentAmounts(BigDecimal totalPaymentAmounts) {
        this.totalPaymentAmounts = totalPaymentAmounts;
    }

    public BigDecimal getBillAmountPaid() {
        return billAmountPaid;
    }

    public void setBillAmountPaid(BigDecimal billAmountPaid) {
        this.billAmountPaid = billAmountPaid;
    }

    public BigDecimal getTotalBillAmounts() {
        return totalBillAmounts;
    }

    public void setTotalBillAmounts(BigDecimal totalBillAmounts) {
        this.totalBillAmounts = totalBillAmounts;
    }

    public Integer getNumberOfPayments() {
        return numberOfPayments;
    }

    public void setNumberOfPayments(Integer numberOfPayments) {
        this.numberOfPayments = numberOfPayments;
    }

    public Integer getNumberOfVouchersForBill() {
        return numberOfVouchersForBill;
    }

    public void setNumberOfVouchersForBill(Integer numberOfVouchersForBill) {
        this.numberOfVouchersForBill = numberOfVouchersForBill;
    }

    public Long getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(Long timeStamp) {
        this.timeStamp = timeStamp;
    }

    public BigDecimal getTotalReceiptVoucherAmounts() {
        return totalReceiptVoucherAmounts;
    }

    public void setTotalReceiptVoucherAmounts(BigDecimal totalReceiptVoucherAmounts) {
        this.totalReceiptVoucherAmounts = totalReceiptVoucherAmounts;
    }

    public Integer getNumberOfReceiptVoucher() {
        return numberOfReceiptVoucher;
    }

    public void setNumberOfReceiptVoucher(Integer numberOfReceiptVoucher) {
        this.numberOfReceiptVoucher = numberOfReceiptVoucher;
    }

    public Integer getNumberOfBillsPaid() {
        return numberOfBillsPaid;
    }

    public void setNumberOfBillsPaid(Integer numberOfBillsPaid) {
        this.numberOfBillsPaid = numberOfBillsPaid;
    }
    

}
