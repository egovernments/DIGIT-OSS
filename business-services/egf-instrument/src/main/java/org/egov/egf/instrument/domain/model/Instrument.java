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
package org.egov.egf.instrument.domain.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.egov.common.domain.model.Auditable;
import org.egov.egf.master.web.contract.BankAccountContract;
import org.egov.egf.master.web.contract.BankContract;
import org.egov.egf.master.web.contract.FinancialStatusContract;
import org.hibernate.validator.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Instrument extends Auditable {

    /*
     * id is the unique reference to Instrument Header entered in the system.
     */
    private String id;

    /*
     * transactionNumber unique number of the instrument. For cheque type this is cheque date. For DD type it is DD number
     */
    @NotBlank
    @Size(max = 50)
    private String transactionNumber;

    /*
     * transactionDate is the date of instrument . For cheque type it is cheque date. for DD it is DD date
     */
    @NotNull
    private Date transactionDate;

    /*
     * amount is the instrument amount. For cheque type it is cheque amount.
     */
    @NotNull
    @Min(value = 1)
    @Max(value = 999999999)
    private BigDecimal amount;

    /*
     * instrumentType specifies the type of the instrument - The folowing are the different types Cash,Cheque,DD,POC
     */
    @NotNull
    private InstrumentType instrumentType;

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
     * bankAccount is the reference of the Bank account from which the payment instrument is assigned
     */
    private BankAccountContract bankAccount;

    /*
     * instrumentStatus gives the current status of the instrument.
     */
    private FinancialStatusContract financialStatus;

    private String remittanceVoucherId;

    /*
     * transactionType are of two kinds -Debit and Credit. When its a receipt instrument it is Debit and in case of payment
     * instrument its credit.
     */
    @NotNull
    private TransactionType transactionType;

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
     * surrendarReason is the reason from the defined list seleted while surrendering a payment cheque. Depending on the reason,
     * the cheque can be re-used or not is decided.
     */
    private SurrenderReason surrenderReason;

    /*
     * serialNo is the series of the cheque numbers from which the instrument is assigned from. The cheque numbers in an account
     * is defined based on Year, Bank account and tagged to a department.
     */
    // @NotBlank
    @Size(max = 50, min = 2)
    private String serialNo;

    @Size(max = 256)
    private String payinSlipId;

    @Min(value = 1)
    @Max(value = 999999999)
    private BigDecimal reconciledAmount;

    private Date reconciledOn;

    /*
     * instrumentVouchers is the reference to the payment vouchers for which the instrument is attached.
     */
    // @DrillDownTable
    private List<InstrumentVoucher> instrumentVouchers = new ArrayList<>();

}
