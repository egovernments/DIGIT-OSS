package org.egov.auditservice.persisterauditclient.models.contract;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class JsonMap {
	
	private String jsonPath;
	private TypeEnum type;
	private TypeEnum dbType;
	private String parentPath;
	private String format;

}
