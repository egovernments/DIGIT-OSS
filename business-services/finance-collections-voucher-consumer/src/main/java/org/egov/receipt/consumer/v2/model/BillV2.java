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

package org.egov.receipt.consumer.v2.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.receipt.consumer.model.AuditDetails;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class BillV2 {
    // TODO some of the fields are mandatory in yml, lets discuss billdetail and billaccountdetail also for more clarity

          @JsonProperty("id")
          private String id = null;

          @JsonProperty("mobileNumber")
          private String mobileNumber = null;

          @JsonProperty("paidBy")
          private String paidBy = null;

          @JsonProperty("payerName")
          private String payerName = null;

          @JsonProperty("payerAddress")
          private String payerAddress = null;

          @JsonProperty("payerEmail")
          private String payerEmail = null;

          @JsonProperty("payerId")
          private String payerId = null;

          @JsonProperty("status")
          private StatusEnum status = null;

          @JsonProperty("reasonForCancellation")
          private String reasonForCancellation = null;

          @JsonProperty("isCancelled")
          private Boolean isCancelled = null;

          @JsonProperty("additionalDetails")
          private JsonNode additionalDetails = null;

          @JsonProperty("billDetails")
          @Valid
          private List<BillDetailV2> billDetails = null;

          @JsonProperty("tenantId")
          private String tenantId = null;

          @JsonProperty("auditDetails")
          private AuditDetails auditDetails = null;

          @JsonProperty("collectionModesNotAllowed")
          private List<String> collectionModesNotAllowed = null;

          @JsonProperty("partPaymentAllowed")
          private Boolean partPaymentAllowed = null;

          @JsonProperty("isAdvanceAllowed")
          private Boolean isAdvanceAllowed;

          @JsonProperty("minimumAmountToBePaid")
          private BigDecimal minimumAmountToBePaid = null;

          @JsonProperty("businessService")
          private String businessService = null;

          @JsonProperty("totalAmount")
          private BigDecimal totalAmount = null;

          @JsonProperty("consumerCode")
          private String consumerCode = null;

          @JsonProperty("billNumber")
          private String billNumber = null;

          @JsonProperty("billDate")
          private Long billDate = null;

          @JsonProperty("amountPaid")
          private BigDecimal amountPaid;



        public enum StatusEnum {
          ACTIVE("ACTIVE"),

          CANCELLED("CANCELLED"),

          PAID("PAID"),

          EXPIRED("EXPIRED");

          private String value;

          StatusEnum(String value) {
          this.value = value;
        }


        @Override
        @JsonValue
        public String toString() {
                return String.valueOf(value);
        }

        public static boolean contains(String test) {
                for (StatusEnum val : StatusEnum.values()) {
                        if (val.name().equalsIgnoreCase(test)) {
                                return true;
                        }
                }
                return false;
        }

        @JsonCreator
        public static StatusEnum fromValue(String text) {
                for (StatusEnum b : StatusEnum.values()) {
                        if (String.valueOf(b.value).equals(text)) {
                                return b;
                        }
                }
                return null;
        }

  }

        public Boolean addBillDetail(BillDetailV2 billDetail) {

                if (CollectionUtils.isEmpty(billDetails)) {

                        billDetails = new ArrayList<>();
                        return billDetails.add(billDetail);
                } else {

                        if (!billDetails.contains(billDetail))
                                return billDetails.add(billDetail);
                        else
                                return false;
                }
        }


}
