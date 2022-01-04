package org.egov.egf.master.web.contract;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class FinancialYearSearchContract extends FinancialYearContract {
	private String ids;
	private String sortBy;
	private Integer pageSize;
	private Integer offset;
	private Date asOnDate;
}