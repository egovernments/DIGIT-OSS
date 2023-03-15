package egov.infra.persist.web.contract;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class ObjectInfo {
	
	private String objName;
	private TableInfo tableInfo;
}
