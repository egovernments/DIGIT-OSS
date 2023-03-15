package egov.infra.persist.web.contract;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class Column extends ObjectInfo{

	private String colName;
	private String jsonPath;
	private String type;
	private String defaultValue;

}
