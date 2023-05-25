package org.egov.infra.indexer.web.contract;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class indexMap {
	
	private String inJsonPath;
	private String outJsonPath;
	private TypeEnum indexDatatype;

}
