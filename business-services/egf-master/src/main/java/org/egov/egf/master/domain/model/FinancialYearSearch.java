package org.egov.egf.master.domain.model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class FinancialYearSearch extends FinancialYear {
	private Integer pageSize;
	private Integer offset;
	private String sortBy;
	private Date asOnDate;
}