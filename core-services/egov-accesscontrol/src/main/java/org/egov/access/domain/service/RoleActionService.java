package org.egov.access.domain.service;

import java.util.List;

import org.egov.access.domain.model.RoleAction;
import org.egov.access.persistence.repository.RoleActionRepository;
import org.egov.access.web.contract.action.RoleActionsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleActionService {

	private RoleActionRepository roleActionRepository;

	@Autowired
	public RoleActionService(RoleActionRepository roleActionRepository) {
		this.roleActionRepository = roleActionRepository;

	}

	public List<RoleAction> createRoleActions(final RoleActionsRequest rolActionRequest) {

		return roleActionRepository.createRoleActions(rolActionRequest);
	}

	public boolean checkActionNamesAreExistOrNot(final RoleActionsRequest roleActionRequest) {

		return roleActionRepository.checkActionNamesAreExistOrNot(roleActionRequest);
	}

	public boolean addUniqueValidationForTenantAndRoleAndAction(final RoleActionsRequest rolActionRequest) {

		return roleActionRepository.addUniqueValidationForTenantAndRoleAndAction(rolActionRequest);
	}
}
