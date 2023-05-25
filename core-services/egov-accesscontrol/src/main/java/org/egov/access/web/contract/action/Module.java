package org.egov.access.web.contract.action;

import java.util.List;

import org.egov.access.domain.model.Action;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Module {
	private Long id;
	private String name;
	private List<Module> subModules;
	private List<Action> actionList;
	private String code;
	private String contextRoot;
	private String displayName;
	private String parentModule;
	private String tenant;
	private String orderNumber;
	private String tenantId;
	private boolean enabled;

}
