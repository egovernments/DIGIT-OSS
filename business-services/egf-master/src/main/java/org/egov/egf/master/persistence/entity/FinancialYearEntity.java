package org.egov.egf.master.persistence.entity;

import java.util.Date;

import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.model.FinancialYear;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Builder
public class FinancialYearEntity extends AuditableEntity {
	public static final String TABLE_NAME = "egf_financialyear";
	public static final String SEQUENCE_NAME = "seq_egf_financialyear";
	private String id;
	private String finYearRange;
	private Date startingDate;
	private Date endingDate;
	private Boolean active;
	private Boolean isActiveForPosting;
	private Boolean isClosed;
	private Boolean transferClosingBalance;

	public FinancialYear toDomain() {
		FinancialYear financialYear = new FinancialYear();
		super.toDomain(financialYear);
		financialYear.setId(this.id);
		financialYear.setFinYearRange(this.finYearRange);
		financialYear.setStartingDate(this.startingDate);
		financialYear.setEndingDate(this.endingDate);
		financialYear.setActive(this.active);
		financialYear.setIsActiveForPosting(this.isActiveForPosting);
		financialYear.setIsClosed(this.isClosed);
		financialYear.setTransferClosingBalance(this.transferClosingBalance);
		return financialYear;
	}

	public FinancialYearEntity toEntity(FinancialYear financialYear) {
		super.toEntity(financialYear);
		this.id = financialYear.getId();
		this.finYearRange = financialYear.getFinYearRange();
		this.startingDate = financialYear.getStartingDate();
		this.endingDate = financialYear.getEndingDate();
		this.active = financialYear.getActive();
		this.isActiveForPosting = financialYear.getIsActiveForPosting();
		this.isClosed = financialYear.getIsClosed();
		this.transferClosingBalance = financialYear.getTransferClosingBalance();
		return this;
	}

}
