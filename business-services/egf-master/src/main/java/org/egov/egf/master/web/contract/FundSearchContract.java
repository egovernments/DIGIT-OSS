package org.egov.egf.master.web.contract;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data

public class FundSearchContract extends FundContract {

	private String sortBy;

	private Integer pageSize;

	private Integer offset;

	private List<Long> ids = new ArrayList<Long>();

}
