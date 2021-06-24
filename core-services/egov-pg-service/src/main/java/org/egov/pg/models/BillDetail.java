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

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotNull;

import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.type.CollectionType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = {"id"})
public class BillDetail {

	@JsonProperty("id")
	private String id = null;

	@JsonProperty("tenantId")
	private String tenantId = null;

	@JsonProperty("demandId")
	private String demandId = null;

	@JsonProperty("billId")
	private String billId = null;

	@JsonProperty("amount")
	@NotNull
	private BigDecimal amount = null;

	@JsonProperty("amountPaid")
	private BigDecimal amountPaid = null;

	@NotNull
	@JsonProperty("fromPeriod")
	private Long fromPeriod = null;

	@NotNull
	@JsonProperty("toPeriod")
	private Long toPeriod = null;

	@JsonProperty("additionalDetails")
	private JsonNode additionalDetails = null;

	@JsonProperty("channel")
	private String channel = null;

	@JsonProperty("voucherHeader")
	private String voucherHeader = null;

	@JsonProperty("boundary")
	private String boundary = null;

	@JsonProperty("manualReceiptNumber")
	private String manualReceiptNumber = null;

	@JsonProperty("manualReceiptDate")
	private Long manualReceiptDate = null;


	@JsonProperty("billAccountDetails")
	private List<BillAccountDetail> billAccountDetails = null;

	@NotNull
	@JsonProperty("collectionType")
	private CollectionType collectionType = null;

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails = null;


	private String billDescription;

	@NotNull
	@JsonProperty("expiryDate")
	private Long expiryDate;

	private String displayMessage;

	private Boolean callBackForApportioning;

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

}
