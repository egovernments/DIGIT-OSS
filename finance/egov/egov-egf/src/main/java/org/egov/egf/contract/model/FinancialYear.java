package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.Date;

import org.hibernate.validator.constraints.SafeHtml;

public class FinancialYear implements Serializable {

	private static final long serialVersionUID = 9192921109551518752L;

	private Long id;
	@SafeHtml
	private String finYearRange;
	private Date startingDate;
	private Date endingDate;
	private Boolean active;
	private Boolean isActiveForPosting;
	private Boolean isClosed;
	private Boolean transferClosingBalance;

	private AuditDetails auditDetails;

	public FinancialYear() {
	}

	public FinancialYear(Long id, String finYearRange, Date startingDate, Date endingDate, Boolean active,
			Boolean isActiveForPosting, Boolean isClosed, Boolean transferClosingBalance, AuditDetails auditDetails) {
		this.id = id;
		this.finYearRange = finYearRange;
		this.startingDate = startingDate;
		this.endingDate = endingDate;
		this.active = active;
		this.isActiveForPosting = isActiveForPosting;
		this.isClosed = isClosed;
		this.transferClosingBalance = transferClosingBalance;
		this.auditDetails = auditDetails;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFinYearRange() {
		return finYearRange;
	}

	public void setFinYearRange(String finYearRange) {
		this.finYearRange = finYearRange;
	}

	public Date getStartingDate() {
		return startingDate;
	}

	public void setStartingDate(Date startingDate) {
		this.startingDate = startingDate;
	}

	public Date getEndingDate() {
		return endingDate;
	}

	public void setEndingDate(Date endingDate) {
		this.endingDate = endingDate;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public Boolean getIsActiveForPosting() {
		return isActiveForPosting;
	}

	public void setIsActiveForPosting(Boolean isActiveForPosting) {
		this.isActiveForPosting = isActiveForPosting;
	}

	public Boolean getIsClosed() {
		return isClosed;
	}

	public void setIsClosed(Boolean isClosed) {
		this.isClosed = isClosed;
	}

	public Boolean getTransferClosingBalance() {
		return transferClosingBalance;
	}

	public void setTransferClosingBalance(Boolean transferClosingBalance) {
		this.transferClosingBalance = transferClosingBalance;
	}

	public AuditDetails getAuditDetails() {
		return auditDetails;
	}

	public void setAuditDetails(AuditDetails auditDetails) {
		this.auditDetails = auditDetails;
	}
	
}
