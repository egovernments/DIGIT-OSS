package org.egov.egf.master.persistence.entity;

import java.util.Date;

import org.egov.common.domain.model.Auditable;
import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.model.FinancialYear;
import org.egov.egf.master.domain.model.FiscalPeriod;

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
public class FiscalPeriodEntity extends AuditableEntity {
	public static final String TABLE_NAME = "egf_fiscalperiod";
	public static final String SEQUENCE_NAME = "seq_egf_fiscalperiod";
	private String id;
	private String name;
	private String financialYearId;
	private Date startingDate;
	private Date endingDate;
	private Boolean active;
	private Boolean isActiveForPosting;
	private Boolean isClosed;

	public FiscalPeriod toDomain() {
		FiscalPeriod fiscalPeriod = new FiscalPeriod();
		super.toDomain(fiscalPeriod);
		fiscalPeriod.setId(this.id);
		fiscalPeriod.setName(this.name);
		fiscalPeriod.setFinancialYear(FinancialYear.builder().id(financialYearId).build());
		fiscalPeriod.setStartingDate(this.startingDate);
		fiscalPeriod.setEndingDate(this.endingDate);
		fiscalPeriod.setActive(this.active);
		fiscalPeriod.setIsActiveForPosting(this.isActiveForPosting);
		fiscalPeriod.setIsClosed(this.isClosed);
		return fiscalPeriod;
	}

	public FiscalPeriodEntity toEntity(FiscalPeriod fiscalPeriod) {
		super.toEntity((Auditable) fiscalPeriod);
		this.id = fiscalPeriod.getId();
		this.name = fiscalPeriod.getName();
		this.financialYearId = fiscalPeriod.getFinancialYear() != null ? fiscalPeriod.getFinancialYear().getId() : null;
		this.startingDate = fiscalPeriod.getStartingDate();
		this.endingDate = fiscalPeriod.getEndingDate();
		this.active = fiscalPeriod.getActive();
		this.isActiveForPosting = fiscalPeriod.getIsActiveForPosting();
		this.isClosed = fiscalPeriod.getIsClosed();
		return this;
	}

}
