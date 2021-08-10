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
package org.egov.model.recoveries;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.commons.Bank;
import org.egov.commons.CChartOfAccounts;
import org.egov.commons.EgPartytype;
import org.egov.infra.persistence.entity.AbstractAuditable;
import org.egov.infra.persistence.validator.annotation.OptionalPattern;
import org.egov.infra.persistence.validator.annotation.Unique;
import org.egov.infra.validation.regex.Constants;
import org.egov.utils.FinancialConstants;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.SafeHtml;

@Entity
@Table(name = "TDS")
@SequenceGenerator(name = Recovery.SEQ_RECOVERY, sequenceName = Recovery.SEQ_RECOVERY, allocationSize = 1)
@Unique(id = "id", tableName = "TDS", fields = { "type" }, columnName = { "type" }, enableDfltMsg = true)
public class Recovery extends AbstractAuditable {

	private static final long serialVersionUID = 6136656142691290863L;
	public static final String SEQ_RECOVERY = "SEQ_TDS";

	@Id
	@GeneratedValue(generator = SEQ_RECOVERY, strategy = GenerationType.SEQUENCE)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "glcodeid")
	private CChartOfAccounts chartofaccounts;

	@Length(max = 20)
	@SafeHtml
	@NotNull
	private String type;

	private Boolean isactive;

	private BigDecimal rate;

	@Length(max = 100)
	@SafeHtml
	@NotNull
	private String remitted;

	@Length(max = 200)
	@SafeHtml
	private String description;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "partytypeid")
	private EgPartytype egPartytype;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bankid")
	private Bank bank;

	private BigDecimal caplimit;

	@Length(max = 50)
	@SafeHtml
	@NotNull
	private String recoveryName;

	@Length(max = 50)
	@SafeHtml
	private String calculationType;

	@SafeHtml
	@Length(min = 11, max = 11, message = "Maximum of 11 Characters allowed for IFSC Code")
	@OptionalPattern(regex = Constants.ALPHANUMERIC, message = "Special Characters are not allowed in IFSC Code")
	private String ifscCode;

	@Length(max = 32)
	@SafeHtml
	@OptionalPattern(regex = FinancialConstants.numericwithoutspecialchar, message = "Special Characters are not allowed in accountNumber")
	private String accountNumber;

	@NotNull
	@Column(name = "recovery_mode")
	private Character recoveryMode;

	@Column(name = "remittance_mode")
	private Character remittanceMode;

	@Transient
	private Boolean bankLoan;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public CChartOfAccounts getChartofaccounts() {
		return chartofaccounts;
	}

	public void setChartofaccounts(CChartOfAccounts chartofaccounts) {
		this.chartofaccounts = chartofaccounts;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Boolean getIsactive() {
		return isactive;
	}

	public void setIsactive(Boolean isactive) {
		this.isactive = isactive;
	}

	public BigDecimal getRate() {
		return rate;
	}

	public void setRate(BigDecimal rate) {
		this.rate = rate;
	}

	public String getRemitted() {
		return remitted;
	}

	public void setRemitted(String remitted) {
		this.remitted = remitted;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public EgPartytype getEgPartytype() {
		return egPartytype;
	}

	public void setEgPartytype(EgPartytype egPartytype) {
		this.egPartytype = egPartytype;
	}

	public Bank getBank() {
		return bank;
	}

	public void setBank(Bank bank) {
		this.bank = bank;
	}

	public BigDecimal getCaplimit() {
		return caplimit;
	}

	public void setCaplimit(BigDecimal caplimit) {
		this.caplimit = caplimit;
	}

	public String getRecoveryName() {
		return recoveryName;
	}

	public void setRecoveryName(String recoveryName) {
		this.recoveryName = recoveryName;
	}

	public String getCalculationType() {
		return calculationType;
	}

	public void setCalculationType(String calculationType) {
		this.calculationType = calculationType;
	}

	public String getIfscCode() {
		return ifscCode;
	}

	public void setIfscCode(String ifscCode) {
		this.ifscCode = ifscCode;
	}

	public String getAccountNumber() {
		return accountNumber;
	}

	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}

	public Character getRecoveryMode() {
		return recoveryMode;
	}

	public void setRecoveryMode(Character recoveryMode) {
		this.recoveryMode = recoveryMode;
	}

	public Character getRemittanceMode() {
		return remittanceMode;
	}

	public void setRemittanceMode(Character remittanceMode) {
		this.remittanceMode = remittanceMode;
	}

	public Boolean getBankLoan() {
		return bankLoan;
	}

	public void setBankLoan(Boolean bankLoan) {
		this.bankLoan = bankLoan;
	}

}
