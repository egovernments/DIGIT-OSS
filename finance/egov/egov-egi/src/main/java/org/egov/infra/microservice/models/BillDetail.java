/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */
package org.egov.infra.microservice.models;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

public class BillDetail {
    @SafeHtml
    @JsonProperty("id")
    private String id = null;

    @SafeHtml
    @JsonProperty("tenantId")
    private String tenantId = null;

    @SafeHtml
    @JsonProperty("demandId")
    private String demandId = null;

    @SafeHtml
    @JsonProperty("bill")
    private String bill = null;

    @SafeHtml
    @JsonProperty("businessService")
    private String businessService = null;

    @SafeHtml
    @JsonProperty("billNumber")
    private String billNumber = null;
    
    @JsonProperty("billDate")
    private Long billDate = null;

    @SafeHtml
    @JsonProperty("consumerCode")
    private String consumerCode = null;

    @SafeHtml
    @JsonProperty("consumerType")
    private String consumerType = null;

    @JsonProperty("minimumAmount")
    private BigDecimal minimumAmount = null;

    @JsonProperty("totalAmount")
    @NotNull
    private BigDecimal totalAmount = null;

    @JsonProperty("amountPaid")
    private BigDecimal amountPaid = null;

    @JsonProperty("fromPeriod")
    private Long fromPeriod = null;

    @JsonProperty("toPeriod")
    private Long toPeriod = null;

    @JsonProperty("collectedAmount")
    private BigDecimal collectedAmount = null;

    @JsonProperty("collectionModesNotAllowed")
    private List<String> collectionModesNotAllowed = null;

    @JsonProperty("partPaymentAllowed")
    private Boolean partPaymentAllowed = null;

    @JsonProperty("additionalDetails")
    private JsonNode additionalDetails = null;

    @SafeHtml
    @JsonProperty("receiptNumber")
    private String receiptNumber = null;

    @JsonProperty("receiptDate")
    private Long receiptDate = null;

    @SafeHtml
    @JsonProperty("receiptType")
    private String receiptType = null;

    @SafeHtml
    @JsonProperty("channel")
    private String channel = null;

    @SafeHtml
    @JsonProperty("voucherHeader")
    private String voucherHeader = null;

    @SafeHtml
    @JsonProperty("boundary")
    private String boundary = null;

    @SafeHtml
    @JsonProperty("reasonForCancellation")
    private String reasonForCancellation = null;

    @SafeHtml
    @JsonProperty("manualReceiptNumber")
    private String manualReceiptNumber = null;

    @JsonProperty("manualReceiptDate")
    private Long manualReceiptDate = null;

    @SafeHtml
    @JsonProperty("stateId")
    private String stateId = null;

    @SafeHtml
    @JsonProperty("fund")
    private String fund = null;

    @SafeHtml
    @JsonProperty("function")
    private String function = null;

    @SafeHtml
    @JsonProperty("department")
    private String department = null;

    @JsonProperty("billAccountDetails")
    private List<BillAccountDetail> billAccountDetails = null;

    @SafeHtml
    @JsonProperty("status")
    private String status = null;

    @NotNull
    @JsonProperty("collectionType")
    private CollectionType collectionType = null;

    @JsonProperty("isAdvanceAllowed")
    private Boolean isAdvanceAllowed;

    @SafeHtml
    private String billDescription;

    private Long expiryDate;

    @SafeHtml
    private String displayMessage;

    private Boolean callBackForApportioning;
    @SafeHtml
    private String cancellationRemarks;

    public Boolean addBillAccountDetail(BillAccountDetail billAccountDetail) {

            if (CollectionUtils.isEmpty(billAccountDetails)) {

                    billAccountDetails = new ArrayList<>();
                    return billAccountDetails.add(billAccountDetail);
            } else {

                    if (!billAccountDetails.contains(billAccountDetail))
                            return billAccountDetails.add(billAccountDetail);
                    else
                            return false;
            }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getDemandId() {
        return demandId;
    }

    public void setDemandId(String demandId) {
        this.demandId = demandId;
    }

    public String getBill() {
        return bill;
    }

    public void setBill(String bill) {
        this.bill = bill;
    }

    public String getBusinessService() {
        return businessService;
    }

    public void setBusinessService(String businessService) {
        this.businessService = businessService;
    }

    public String getBillNumber() {
        return billNumber;
    }

    public void setBillNumber(String billNumber) {
        this.billNumber = billNumber;
    }

    public Long getBillDate() {
        return billDate;
    }

    public void setBillDate(Long billDate) {
        this.billDate = billDate;
    }

    public String getConsumerCode() {
        return consumerCode;
    }

    public void setConsumerCode(String consumerCode) {
        this.consumerCode = consumerCode;
    }

    public String getConsumerType() {
        return consumerType;
    }

    public void setConsumerType(String consumerType) {
        this.consumerType = consumerType;
    }

    public BigDecimal getMinimumAmount() {
        return minimumAmount;
    }

    public void setMinimumAmount(BigDecimal minimumAmount) {
        this.minimumAmount = minimumAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(BigDecimal amountPaid) {
        this.amountPaid = amountPaid;
    }

    public Long getFromPeriod() {
        return fromPeriod;
    }

    public void setFromPeriod(Long fromPeriod) {
        this.fromPeriod = fromPeriod;
    }

    public Long getToPeriod() {
        return toPeriod;
    }

    public void setToPeriod(Long toPeriod) {
        this.toPeriod = toPeriod;
    }

    public BigDecimal getCollectedAmount() {
        return collectedAmount;
    }

    public void setCollectedAmount(BigDecimal collectedAmount) {
        this.collectedAmount = collectedAmount;
    }

    public List<String> getCollectionModesNotAllowed() {
        return collectionModesNotAllowed;
    }

    public void setCollectionModesNotAllowed(List<String> collectionModesNotAllowed) {
        this.collectionModesNotAllowed = collectionModesNotAllowed;
    }

    public Boolean getPartPaymentAllowed() {
        return partPaymentAllowed;
    }

    public void setPartPaymentAllowed(Boolean partPaymentAllowed) {
        this.partPaymentAllowed = partPaymentAllowed;
    }

    public JsonNode getAdditionalDetails() {
        return additionalDetails;
    }

    public void setAdditionalDetails(JsonNode additionalDetails) {
        this.additionalDetails = additionalDetails;
    }

    public String getReceiptNumber() {
        return receiptNumber;
    }

    public void setReceiptNumber(String receiptNumber) {
        this.receiptNumber = receiptNumber;
    }

    public Long getReceiptDate() {
        return receiptDate;
    }

    public void setReceiptDate(Long receiptDate) {
        this.receiptDate = receiptDate;
    }

    public String getReceiptType() {
        return receiptType;
    }

    public void setReceiptType(String receiptType) {
        this.receiptType = receiptType;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getVoucherHeader() {
        return voucherHeader;
    }

    public void setVoucherHeader(String voucherHeader) {
        this.voucherHeader = voucherHeader;
    }

    public String getBoundary() {
        return boundary;
    }

    public void setBoundary(String boundary) {
        this.boundary = boundary;
    }

    public String getReasonForCancellation() {
        return reasonForCancellation;
    }

    public void setReasonForCancellation(String reasonForCancellation) {
        this.reasonForCancellation = reasonForCancellation;
    }

    public String getManualReceiptNumber() {
        return manualReceiptNumber;
    }

    public void setManualReceiptNumber(String manualReceiptNumber) {
        this.manualReceiptNumber = manualReceiptNumber;
    }

    public Long getManualReceiptDate() {
        return manualReceiptDate;
    }

    public void setManualReceiptDate(Long manualReceiptDate) {
        this.manualReceiptDate = manualReceiptDate;
    }

    public String getStateId() {
        return stateId;
    }

    public void setStateId(String stateId) {
        this.stateId = stateId;
    }

    public String getFund() {
        return fund;
    }

    public void setFund(String fund) {
        this.fund = fund;
    }

    public String getFunction() {
        return function;
    }

    public void setFunction(String function) {
        this.function = function;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public List<BillAccountDetail> getBillAccountDetails() {
        return billAccountDetails;
    }

    public void setBillAccountDetails(List<BillAccountDetail> billAccountDetails) {
        this.billAccountDetails = billAccountDetails;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public CollectionType getCollectionType() {
        return collectionType;
    }

    public void setCollectionType(CollectionType collectionType) {
        this.collectionType = collectionType;
    }

    public Boolean getIsAdvanceAllowed() {
        return isAdvanceAllowed;
    }

    public void setIsAdvanceAllowed(Boolean isAdvanceAllowed) {
        this.isAdvanceAllowed = isAdvanceAllowed;
    }

    public String getBillDescription() {
        return billDescription;
    }

    public void setBillDescription(String billDescription) {
        this.billDescription = billDescription;
    }

    public Long getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(Long expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getDisplayMessage() {
        return displayMessage;
    }

    public void setDisplayMessage(String displayMessage) {
        this.displayMessage = displayMessage;
    }

    public Boolean getCallBackForApportioning() {
        return callBackForApportioning;
    }

    public void setCallBackForApportioning(Boolean callBackForApportioning) {
        this.callBackForApportioning = callBackForApportioning;
    }

    public String getCancellationRemarks() {
        return cancellationRemarks;
    }

    public void setCancellationRemarks(String cancellationRemarks) {
        this.cancellationRemarks = cancellationRemarks;
    }
    
}