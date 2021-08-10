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
 *         3) This license does not grant any rights to any Long of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */
package org.egov.receipt.consumer.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class BillDetail {
	private String id;

    private String bill;

    private Long billDate;

    private String billDescription;

    private String billNumber; // refNo

    private String consumerCode;

    private String consumerType;

    private BigDecimal minimumAmount;

    private BigDecimal totalAmount;

    private BigDecimal collectedAmount;

    private List<String> collectionModesNotAllowed = new ArrayList<>();

    private String tenantId;

    private String businessService; // buisnessDetailsCode

    private String displayMessage;

    private Boolean callBackForApportioning;

    private String receiptNumber;

    private Long receiptDate;

    private String receiptType;

    private String channel;

    private String voucherHeader;

    private CollectionType collectionType;

    private String boundary;

    private String reasonForCancellation;

    private BigDecimal amountPaid;

    private String cancellationRemarks;

    private String status;

    @JsonProperty("billAccountDetails")
    private List<BillAccountDetail> billAccountDetails = new ArrayList<>();

    private String manualReceiptNumber;

    private Long manualReceiptDate;

    private Long stateId;

    private Boolean partPaymentAllowed;
    
    @JsonProperty("additionalDetails")
    private JsonNode additionalDetails = null;
    
    @NotNull
    @JsonProperty("expiryDate")
    private Long expiryDate;
    
    @JsonProperty("demandId")
    private String demandId = null;
    
    @NotNull
    @JsonProperty("fromPeriod")
    private Long fromPeriod = null;

    @NotNull
    @JsonProperty("toPeriod")
    private Long toPeriod = null;
    
    @JsonProperty("isAdvanceAllowed")
    private Boolean isAdvanceAllowed;
}
