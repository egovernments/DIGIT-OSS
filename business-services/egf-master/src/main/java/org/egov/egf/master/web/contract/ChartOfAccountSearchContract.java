package org.egov.egf.master.web.contract;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

//only sortby and ids is used
public class ChartOfAccountSearchContract extends ChartOfAccountContract {
	private String ids;
	private String sortBy;
	private Integer pageSize;
	private Integer offset;
	private String glcodes;
}