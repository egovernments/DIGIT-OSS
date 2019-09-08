package egov.infra.persist.web.contract;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class TableInfo {

	private String query;
	private List<Column> columns;
}
