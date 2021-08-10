/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
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
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact@egovernments.org
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
 *
 */
package org.egov.collection.entity;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

 
import org.egov.infra.persistence.validator.annotation.DateFormat;
import org.hibernate.validator.constraints.Length;
public class DishonoredChequeBean {
    private String voucherNumber;
    private String receiptNumber;
    private Long receiptDate;
    @Length(min = 6,max=6)
    private String instrumentNumber;
    private String instrumentDate;
    private String bankName;
    private String accountNumber;
    private String payTo;
    private String description;
    private BigDecimal instrumentAmount;
    private Long receiptHeaderid;
    private Long instrumentHeaderid;
    private Long voucherHeaderId;
    private String receiptHeaderIds;
    private String glcodeId;
    private String functionId;
    private String glcode;
    private String debitAmount;
    private String creditAmount;
    private String detailKeyId;
    private String detailTypeId;
    private String amount;
    @DateFormat
    private Date transactionDate;
    private String dishonorReason;
    private String remarks;
    private String referenceNo;
    private String instHeaderIds;
    private String voucherHeaderIds;
    private String receiptGLDetails;
    private String remittanceGLDetails;
    private String instrumentMode;
    private String receiptSourceUrl;
    private List<AccountCode> receiptVoucherGLDetails;
    private List<AccountCode> payInSlipVoucherGLDetails;
    @DateFormat
    private Date dishonorDate;
    private String bankBranch;
    @DateFormat
    private Date fromDate;
    @DateFormat
    private Date toDate;
    private String service;

    public Date getFromDate() {
        return fromDate;
    }

    public void setFromDate(Date fromDate) {
        this.fromDate = fromDate;
    }

    public Date getToDate() {
        return toDate;
    }

    public void setToDate(Date toDate) {
        this.toDate = toDate;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getReceiptNumber() {
        return receiptNumber;
    }

    public void setReceiptNumber(final String receiptNumber) {
        this.receiptNumber = receiptNumber;
    }

    public Long getReceiptDate() {
        return receiptDate;
    }

    public void setReceiptDate(final Long receiptDate) {
        this.receiptDate = receiptDate;
    }

    public String getInstrumentNumber() {
        return instrumentNumber;
    }

    public void setInstrumentNumber(final String instrumentNumber) {
        this.instrumentNumber = instrumentNumber;
    }

    public String getInstrumentDate() {
        return instrumentDate;
    }

    public void setInstrumentDate(final String instrumentDate) {
        this.instrumentDate = instrumentDate;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(final String bankName) {
        this.bankName = bankName;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(final String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getPayTo() {
        return payTo;
    }

    public void setPayTo(final String payTo) {
        this.payTo = payTo;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public BigDecimal getInstrumentAmount() {
        return instrumentAmount;
    }

    public void setInstrumentAmount(final BigDecimal instrumentAmount) {
        this.instrumentAmount = instrumentAmount;
    }

    public Long getInstrumentHeaderid() {
        return instrumentHeaderid;
    }

    public void setInstrumentHeaderid(final Long instrumentHeaderid) {
        this.instrumentHeaderid = instrumentHeaderid;
    }

    public Long getReceiptHeaderid() {
        return receiptHeaderid;
    }

    public void setReceiptHeaderid(final Long receiptHeaderid) {
        this.receiptHeaderid = receiptHeaderid;
    }

    public String getVoucherNumber() {
        return voucherNumber;
    }

    public void setVoucherNumber(String voucherNumber) {
        this.voucherNumber = voucherNumber;
    }

    public Long getVoucherHeaderId() {
        return voucherHeaderId;
    }

    public void setVoucherHeaderId(Long voucherHeaderId) {
        this.voucherHeaderId = voucherHeaderId;
    }

    public String getReceiptHeaderIds() {
        return receiptHeaderIds;
    }

    public void setReceiptHeaderIds(String receiptHeaderIds) {
        this.receiptHeaderIds = receiptHeaderIds;
    }

    public String getGlcodeId() {
        return glcodeId;
    }

    public void setGlcodeId(String glcodeId) {
        this.glcodeId = glcodeId;
    }

    public String getFunctionId() {
        return functionId;
    }

    public void setFunctionId(String functionId) {
        this.functionId = functionId;
    }

    public String getGlcode() {
        return glcode;
    }

    public void setGlcode(String glcode) {
        this.glcode = glcode;
    }

    public String getDebitAmount() {
        return debitAmount;
    }

    public void setDebitAmount(String debitAmount) {
        this.debitAmount = debitAmount;
    }

    public String getCreditAmount() {
        return creditAmount;
    }

    public void setCreditAmount(String creditAmount) {
        this.creditAmount = creditAmount;
    }

    public String getDetailKeyId() {
        return detailKeyId;
    }

    public void setDetailKeyId(String detailKeyId) {
        this.detailKeyId = detailKeyId;
    }

    public String getDetailTypeId() {
        return detailTypeId;
    }

    public void setDetailTypeId(String detailTypeId) {
        this.detailTypeId = detailTypeId;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public Date getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(Date transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getDishonorReason() {
        return dishonorReason;
    }

    public void setDishonorReason(String dishonorReason) {
        this.dishonorReason = dishonorReason;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getReferenceNo() {
        return referenceNo;
    }

    public void setReferenceNo(String referenceNo) {
        this.referenceNo = referenceNo;
    }

    public String getInstHeaderIds() {
        return instHeaderIds;
    }

    public void setInstHeaderIds(String instHeaderIds) {
        this.instHeaderIds = instHeaderIds;
    }

    public String getVoucherHeaderIds() {
        return voucherHeaderIds;
    }

    public void setVoucherHeaderIds(String voucherHeaderIds) {
        this.voucherHeaderIds = voucherHeaderIds;
    }

    public String getReceiptGLDetails() {
        return receiptGLDetails;
    }

    public void setReceiptGLDetails(String receiptGLDetails) {
        this.receiptGLDetails = receiptGLDetails;
    }

    public String getRemittanceGLDetails() {
        return remittanceGLDetails;
    }

    public void setRemittanceGLDetails(String remittanceGLDetails) {
        this.remittanceGLDetails = remittanceGLDetails;
    }

    public String getInstrumentMode() {
        return instrumentMode;
    }

    public void setInstrumentMode(String instrumentMode) {
        this.instrumentMode = instrumentMode;
    }

    public String getReceiptSourceUrl() {
        return receiptSourceUrl;
    }

    public void setReceiptSourceUrl(String receiptSourceUrl) {
        this.receiptSourceUrl = receiptSourceUrl;
    }

    public List<AccountCode> getReceiptVoucherGLDetails() {
        return receiptVoucherGLDetails;
    }

    public void setReceiptVoucherGLDetails(List<AccountCode> receiptVoucherGLDetails) {
        this.receiptVoucherGLDetails = receiptVoucherGLDetails;
    }

    public List<AccountCode> getPayInSlipVoucherGLDetails() {
        return payInSlipVoucherGLDetails;
    }

    public void setPayInSlipVoucherGLDetails(List<AccountCode> payInSlipVoucherGLDetails) {
        this.payInSlipVoucherGLDetails = payInSlipVoucherGLDetails;
    }

    public Date getDishonorDate() {
        return dishonorDate;
    }

    public void setDishonorDate(Date dishonorDate) {
        this.dishonorDate = dishonorDate;
    }

    public String getBankBranch() {
        return bankBranch;
    }

    public void setBankBranch(String bankBranch) {
        this.bankBranch = bankBranch;
    }

    public static class AccountCode {
        private String glcode;
        private String accounthead;
        private Double debitamount;
        private Double creditamount;

        public AccountCode() {
            // TODO Auto-generated constructor stub
        }

        public AccountCode(String glcode, String accounthead, Double debitamount, Double creditamount) {
            this.glcode = glcode;
            this.accounthead = accounthead;
            this.debitamount = debitamount;
            this.creditamount = creditamount;
        }

        public String getGlcode() {
            return glcode;
        }

        public void setGlcode(String glcode) {
            this.glcode = glcode;
        }

        public String getAccounthead() {
            return accounthead;
        }

        public void setAccounthead(String accounthead) {
            this.accounthead = accounthead;
        }

        public Double getDebitamount() {
            return debitamount;
        }

        public void setDebitamount(Double debitamount) {
            this.debitamount = debitamount;
        }

        public Double getCreditamount() {
            return creditamount;
        }

        public void setCreditamount(Double creditamount) {
            this.creditamount = creditamount;
        }
    }

}
