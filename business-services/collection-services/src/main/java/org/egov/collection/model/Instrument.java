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
package org.egov.collection.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;
import org.egov.collection.model.enums.InstrumentStatusEnum;
import org.egov.collection.web.contract.BankAccountContract;
import org.egov.collection.web.contract.BankContract;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class Instrument{

	/*
	 * id is the unique reference to Instrument Header entered in the system.
	 */
	private String id;

	/*
	 * transactionNumber unique number of the instrument. For cheque type this
	 * is cheque date. For DD type it is DD number
	 *
	 */
	private String transactionNumber;

	/*
	 * transactionDate is the date of instrument . For cheque type it is cheque
	 * date. for DD it is DD date
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
	private Date transactionDate;

    /**
     * Transaction date as long comes from UI in case of cheque and DD
     */
    private Long transactionDateInput;

	/*
	 * amount is the instrument amount. For cheque type it is cheque amount.
	 */
	@NotNull
	@Min(value = 0)
	@Max(value = 999999999)
	private BigDecimal amount;

	/*
	 * instrumentType specifies the type of the instrument - The folowing are
	 * the different types Cash,Cheque,DD,POC
	 *
	 */
	@NotNull	
	private InstrumentType instrumentType;
	
	private Long instrumentDate;
	
	private String instrumentNumber;

	/*
	 * bank references to the bank from which the payment/Receipt is made.
	 */
	private BankContract bank;

	/*
	 * branchName is the branch name entered in the collection Receipt.
	 */

	@Size(max = 50)
	private String branchName;

	/*
	 * bankAccount is the reference of the Bank account from which the payment
	 * instrument is assigned
	 */
	private BankAccountContract bankAccount;

	/**
	 * IFSC Code of the bank branch
	 */
	private String ifscCode;


	/*
	 * transactionType are of two kinds -Debit and Credit. When its a receipt
	 * instrument it is Debit and in case of payment instrument its credit.
	 */
	private TransactionType transactionType;

	/**
	 * Status of the instrument, newly added
	 */
	private InstrumentStatusEnum instrumentStatus;

	/*
	 * payee is the entity who is making the payment via instrument
	 */
	@Size(max = 50)
	private String payee;

	/*
	 * drawer is the entity to which the payment is made.
	 */
	@Size(max = 100)
	private String drawer;

	/*
	 * surrenderReason is the reason from the defined list seleted while
	 * surrendering a payment cheque. Depending on the reason, the cheque can be
	 * re-used or not is decided.
	 */
	private SurrenderReason surrenderReason;

	/*
	 * serialNo is the series of the cheque numbers from which the instrument is
	 * assigned from. The cheque numbers in an account is defined based on Year,
	 * Bank account and tagged to a department.
	 */
	//@NotBlank
	@Size(max = 50, min = 2)
	private String serialNo;

	/*
	 * instrumentVouchers is the reference to the payment vouchers for which the
	 * instrument is attached.
	 */
	// @DrillDownTable
	private Set<InstrumentVoucher> instrumentVouchers = new HashSet<InstrumentVoucher>(0);

    private AuditDetails auditDetails;

    private JsonNode additionalDetails;

    @NotNull
	private String tenantId;

}
