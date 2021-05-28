/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) <2015>  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */
package org.egov.infra.microservice.models;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.validator.constraints.SafeHtml;

import com.fasterxml.jackson.annotation.JsonFormat;

public class Instrument {

    @SafeHtml
    private String id;

    @SafeHtml
    private String transactionNumber;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private Date transactionDate;

    private Long transactionDateInput;

    private BigDecimal amount;

    private InstrumentType instrumentType;

    private Long instrumentDate;

    @SafeHtml
    private String instrumentNumber;

    private FinancialStatus financialStatus;

    private Bank bank;
    @SafeHtml
    private String branchName;

    private BankAccount bankAccount;

    private String ifscCode;

    private TransactionType transactionType;

    @SafeHtml
    private String payee;
    @SafeHtml
    private String drawer;
    @SafeHtml
    private String tenantId;
    @SafeHtml
    private String serialNo;
    @SafeHtml
    private String payinSlipId;

    private BigDecimal reconciledAmount;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private Date reconciledOn;
    @SafeHtml
    private String instrumentStatus;

    private List<InstrumentVoucher> instrumentVouchers = new ArrayList<>();
    
    private DishonorReasonContract dishonor;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public Long getTransactionDateInput() {
        return transactionDateInput;
    }

    public void setTransactionDateInput(Long transactionDateInput) {
        this.transactionDateInput = transactionDateInput;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public InstrumentType getInstrumentType() {
        return instrumentType;
    }

    public void setInstrumentType(InstrumentType instrumentType) {
        this.instrumentType = instrumentType;
    }

    public Long getInstrumentDate() {
        return instrumentDate;
    }

    public void setInstrumentDate(Long instrumentDate) {
        this.instrumentDate = instrumentDate;
    }

    public String getInstrumentNumber() {
        return instrumentNumber;
    }

    public void setInstrumentNumber(String instrumentNumber) {
        this.instrumentNumber = instrumentNumber;
    }

    public FinancialStatus getFinancialStatus() {
        return financialStatus;
    }

    public void setFinancialStatus(FinancialStatus financialStatus) {
        this.financialStatus = financialStatus;
    }

    public Bank getBank() {
        return bank;
    }

    public void setBank(Bank bank) {
        this.bank = bank;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public BankAccount getBankAccount() {
        return bankAccount;
    }

    public void setBankAccount(BankAccount bankAccount) {
        this.bankAccount = bankAccount;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public String getPayee() {
        return payee;
    }

    public void setPayee(String payee) {
        this.payee = payee;
    }

    public String getDrawer() {
        return drawer;
    }

    public void setDrawer(String drawer) {
        this.drawer = drawer;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public List<InstrumentVoucher> getInstrumentVouchers() {
        return instrumentVouchers;
    }

    public void setInstrumentVouchers(List<InstrumentVoucher> instrumentVouchers) {
        this.instrumentVouchers = instrumentVouchers;
    }

    public String getSerialNo() {
        return serialNo;
    }

    public void setSerialNo(String serialNo) {
        this.serialNo = serialNo;
    }

    public String getPayinSlipId() {
        return payinSlipId;
    }

    public void setPayinSlipId(String payinSlipId) {
        this.payinSlipId = payinSlipId;
    }

    public BigDecimal getReconciledAmount() {
        return reconciledAmount;
    }

    public void setReconciledAmount(BigDecimal reconciledAmount) {
        this.reconciledAmount = reconciledAmount;
    }

    public Date getReconciledOn() {
        return reconciledOn;
    }

    public void setReconciledOn(Date reconciledOn) {
        this.reconciledOn = reconciledOn;
    }

    public String getInstrumentStatus() {
        return instrumentStatus;
    }

    public void setInstrumentStatus(String instrumentStatus) {
        this.instrumentStatus = instrumentStatus;
    }

    public DishonorReasonContract getDishonor() {
        return dishonor;
    }

    public void setDishonor(DishonorReasonContract dishonor) {
        this.dishonor = dishonor;
    }

}
