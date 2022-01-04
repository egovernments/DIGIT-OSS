package egov.infra.persist.web.contract;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class ObjectCollection {
	private List<ObjectInfo> objectInfos;
}
