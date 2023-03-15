package org.egov.egf.master.domain.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FundSearch extends Fund {
	
	private Date fromDate;
	
	private Integer pageSize;
	
	private Integer offset;
	
	private String sortBy;

	private List<Long> ids = new ArrayList<Long>();

	private Integer fromIndex;

	public boolean isPaginationCriteriaPresent() {
		return fromIndex != null && pageSize != null;
	}
}
