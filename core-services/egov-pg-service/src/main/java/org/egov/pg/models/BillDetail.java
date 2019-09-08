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
package org.egov.pg.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;
import org.egov.pg.models.enums.CollectionType;
import org.egov.pg.models.enums.ReceiptType;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

@Setter
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class BillDetail {

	  @JsonProperty("id")
	  private String id = null;

	  @JsonProperty("tenantId")
	  private String tenantId = null;

	  @JsonProperty("demandId")
	  private String demandId = null;

	  @JsonProperty("bill")
	  private String bill = null;

	  @JsonProperty("businessService")
	  private String businessService = null;

	  @JsonProperty("billNumber")
	  private String billNumber = null;

	  @JsonProperty("billDate")
	  private Long billDate = null;

	  @JsonProperty("consumerCode")
	  private String consumerCode = null;

	  @JsonProperty("consumerType")
	  private String consumerType = null;

	  @JsonProperty("minimumAmount")
	  private BigDecimal minimumAmount = null;

	  @JsonProperty("totalAmount")
	  @NotNull
	  private BigDecimal totalAmount = null;
	  
	  @JsonProperty("amountPaid")
	  @NotNull
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
	  
	  @JsonProperty("receiptNumber")
	  private String receiptNumber = null;
	  
	  @JsonProperty("receiptDate")
	  private Long receiptDate = null;
	  
	  @JsonProperty("receiptType")
	  private ReceiptType receiptType = null;
	  
	  @JsonProperty("channel")
	  private String channel = null;
	  
	  @JsonProperty("voucherHeader")
	  private String voucherHeader = null;
	  
	  @JsonProperty("boundary")
	  private String boundary = null;
	  
	  @JsonProperty("reasonForCancellation")
	  private String reasonForCancellation = null;
	  
	  @JsonProperty("manualReceiptNumber")
	  private String manualReceiptNumber = null;
	  
	  @JsonProperty("manualReceiptDate")
	  private Long manualReceiptDate = null;
	  
	  @JsonProperty("stateId")
	  private String stateId = null;
	  
	  @JsonProperty("fund")
	  private String fund = null;
	  
	  @JsonProperty("function")
	  private String function = null;
	  
	  @JsonProperty("department")
	  private String department = null;
	  
	  @JsonProperty("billAccountDetails")
	  private List<BillAccountDetail> billAccountDetails = null;

	  @JsonProperty("status")
	  private String status = null;
	  
	  @NotNull
	  @JsonProperty("collectionType")
	  private CollectionType collectionType = null;


}