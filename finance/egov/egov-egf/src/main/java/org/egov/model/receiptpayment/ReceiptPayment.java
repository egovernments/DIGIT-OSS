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

package org.egov.model.receiptpayment;

import java.math.BigDecimal;
import java.util.Date;

import org.egov.commons.CFinancialYear;
import org.egov.commons.Fund;
import org.egov.enums.FinancialPeriodEnum;
import org.egov.infra.persistence.validator.annotation.Required;
import org.hibernate.validator.constraints.SafeHtml;

public class ReceiptPayment {

    @Required
    private CFinancialYear financialYear;

    private Date fromDate;

    private Date toDate;

    @Required
    private Fund fund;

    @Required
    private FinancialPeriodEnum period;
    @SafeHtml
    private String glcode;
    @SafeHtml
    private String minorCode;
    @SafeHtml
    private String name;

    private BigDecimal creditAmount = BigDecimal.ZERO;

    private BigDecimal debitAmount = BigDecimal.ZERO;

    private BigDecimal openingBalance = BigDecimal.ZERO;

    private BigDecimal closingBalance = BigDecimal.ZERO;

    public CFinancialYear getFinancialYear() {
        return financialYear;
    }

    public void setFinancialYear(final CFinancialYear financialYear) {
        this.financialYear = financialYear;
    }

    public Date getFromDate() {
        return fromDate;
    }

    public void setFromDate(final Date fromDate) {
        this.fromDate = fromDate;
    }

    public Date getToDate() {
        return toDate;
    }

    public void setToDate(final Date toDate) {
        this.toDate = toDate;
    }

    public Fund getFund() {
        return fund;
    }

    public void setFund(final Fund fund) {
        this.fund = fund;
    }

    public FinancialPeriodEnum getPeriod() {
        return period;
    }

    public void setPeriod(final FinancialPeriodEnum period) {
        this.period = period;
    }

    public String getGlcode() {
        return glcode;
    }

    public void setGlcode(final String glcode) {
        this.glcode = glcode;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public BigDecimal getCreditAmount() {
        return creditAmount;
    }

    public void setCreditAmount(final BigDecimal creditAmount) {
        this.creditAmount = creditAmount;
    }

    public BigDecimal getDebitAmount() {
        return debitAmount;
    }

    public void setDebitAmount(final BigDecimal debitAmount) {
        this.debitAmount = debitAmount;
    }

    public String getMinorCode() {
        return minorCode;
    }

    public void setMinorCode(final String minorCode) {
        this.minorCode = minorCode;
    }

    public BigDecimal getOpeningBalance() {
        return openingBalance;
    }

    public void setOpeningBalance(final BigDecimal openingBalance) {
        this.openingBalance = openingBalance;
    }

    public BigDecimal getClosingBalance() {
        return closingBalance;
    }

    public void setClosingBalance(final BigDecimal closingBalance) {
        this.closingBalance = closingBalance;
    }
}