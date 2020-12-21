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
package org.egov.pt.calculator.web.models.demand;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import org.egov.common.contract.request.User;
import org.egov.pt.calculator.web.models.property.AuditDetails;
import org.egov.pt.calculator.web.models.property.OwnerInfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Demand   {

	@JsonProperty("id")
	private String id;

	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("consumerCode")
	private String consumerCode;

	@JsonProperty("consumerType")
	private String consumerType;

	@JsonProperty("businessService")
	private String businessService;

	@Valid
	@JsonProperty("payer")
	private User payer;

	@JsonProperty("taxPeriodFrom")
	private Long taxPeriodFrom;

	@JsonProperty("taxPeriodTo")
	private Long taxPeriodTo;

	@Builder.Default
	@JsonProperty("demandDetails")
	@Valid
	private List<DemandDetail> demandDetails = new ArrayList<>();

	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;

	@JsonProperty("additionalDetails")
	private Object additionalDetails;

	@Builder.Default
	@JsonProperty("minimumAmountPayable")
	private BigDecimal minimumAmountPayable = BigDecimal.ZERO;

	/**
	 * Gets or Sets status
	 */
	public enum DemandStatusEnum {

		ACTIVE("ACTIVE"),

		CANCELLED("CANCELLED"),

		ADJUSTED("ADJUSTED");

		private String value;

		DemandStatusEnum(String value) {
			this.value = value;
		}

		@Override
		@JsonValue
		public String toString() {
			return String.valueOf(value);
		}

		@JsonCreator
		public static DemandStatusEnum fromValue(String text) {
			for (DemandStatusEnum b : DemandStatusEnum.values()) {
				if (String.valueOf(b.value).equalsIgnoreCase(text)) {
					return b;
				}
			}
			return null;
		}
	}

	@JsonProperty("status")
	private DemandStatusEnum status;


	public Demand addDemandDetailsItem(DemandDetail demandDetailsItem) {
		this.demandDetails.add(demandDetailsItem);
		return this;
	}

}
