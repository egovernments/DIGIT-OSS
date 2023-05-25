package org.egov.infra.microservice.models;

import java.util.Date;

import org.hibernate.validator.constraints.SafeHtml;

public class InstrumentSearchContract {
    @SafeHtml
    private String ids;
    @SafeHtml
    private String sortBy;
    private Integer pageSize;
    private Integer offset;
    @SafeHtml
    private String instrumentTypes;
    @SafeHtml
    private String receiptIds;
    @SafeHtml
    private String financialStatuses;
    private Date transactionFromDate;
    private Date transactionToDate;
    @SafeHtml
    private String transactionNumber;
    private Date transactionDate;
    @SafeHtml
    private String bankAccountNumber;
    private TransactionType transactionType;
    @SafeHtml
    private String bankId;
    public InstrumentSearchContract() {
        // TODO Auto-generated constructor stub
    }
    public InstrumentSearchContract(String ids, String sortBy, Integer pageSize, Integer offset, String instrumentTypes,
            String receiptIds, String financialStatuses, Date transactionFromDate, Date transactionToDate,
            String transactionNumber, Date transactionDate, String bankAccountNumber, String bankId) {
        this.ids = ids;
        this.sortBy = sortBy;
        this.pageSize = pageSize;
        this.offset = offset;
        this.instrumentTypes = instrumentTypes;
        this.receiptIds = receiptIds;
        this.financialStatuses = financialStatuses;
        this.transactionFromDate = transactionFromDate;
        this.transactionToDate = transactionToDate;
        this.transactionNumber = transactionNumber;
        this.transactionDate = transactionDate;
        this.bankAccountNumber = bankAccountNumber;
        this.setBankId(bankId);
    }
    public String getIds() {
        return ids;
    }
    public void setIds(String ids) {
        this.ids = ids;
    }
    public String getSortBy() {
        return sortBy;
    }
    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }
    public Integer getPageSize() {
        return pageSize;
    }
    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
    public Integer getOffset() {
        return offset;
    }
    public void setOffset(Integer offset) {
        this.offset = offset;
    }
    public String getInstrumentTypes() {
        return instrumentTypes;
    }
    public void setInstrumentTypes(String instrumentTypes) {
        this.instrumentTypes = instrumentTypes;
    }
    public String getReceiptIds() {
        return receiptIds;
    }
    public void setReceiptIds(String receiptIds) {
        this.receiptIds = receiptIds;
    }
    public String getFinancialStatuses() {
        return financialStatuses;
    }
    public void setFinancialStatuses(String financialStatuses) {
        this.financialStatuses = financialStatuses;
    }
    public Date getTransactionFromDate() {
        return transactionFromDate;
    }
    public void setTransactionFromDate(Date transactionFromDate) {
        this.transactionFromDate = transactionFromDate;
    }
    public Date getTransactionToDate() {
        return transactionToDate;
    }
    public void setTransactionToDate(Date transactionToDate) {
        this.transactionToDate = transactionToDate;
    }
    public String getTransactionNumber() {
        return transactionNumber;
    }
    public void setTransactionNumber(String transactionNumber) {
        this.transactionNumber = transactionNumber;
    }
    public Date getTransactionDate() {
        return transactionDate;
    }
    public void setTransactionDate(Date transactionDate) {
        this.transactionDate = transactionDate;
    }
    public String getBankAccountNumber() {
        return bankAccountNumber;
    }
    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }
    public TransactionType getTransactionType() {
        return transactionType;
    }
    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }
    public String getBankId() {
        return bankId;
    }
    public void setBankId(String bankId) {
        this.bankId = bankId;
    }
    
}
