package org.egov.egf.master.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecoverySearch extends Recovery {
	
	private Integer pageSize;
	
	private Integer offset;
	
	private String sortBy;

	private List<Long> ids = new ArrayList<Long>();

}
