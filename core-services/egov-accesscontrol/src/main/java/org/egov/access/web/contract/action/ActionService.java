package org.egov.access.web.contract.action;

import java.util.List;

import org.egov.access.domain.model.Action;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Setter
public class ActionService {

	List<Module> modules;

	List<Action> actions;
}
