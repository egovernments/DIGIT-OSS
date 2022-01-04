package org.egov.access.domain.service;

import java.io.UnsupportedEncodingException;
import java.util.List;

import org.egov.access.domain.criteria.RoleSearchCriteria;
import org.egov.access.domain.model.Role;
import org.egov.access.persistence.repository.BaseRepository;
import org.egov.access.persistence.repository.RoleRepository;
import org.egov.access.persistence.repository.querybuilder.RoleFinderQueryBuilder;
import org.egov.access.persistence.repository.rowmapper.RoleRowMapper;
import org.egov.access.web.contract.role.RoleRequest;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService {

	private BaseRepository repository;

	private RoleRepository roleRepository;

	@Autowired
	public RoleService(BaseRepository repository, RoleRepository roleRepository) {
		this.repository = repository;
		this.roleRepository = roleRepository;
	}

	public List<Role> getRoles(RoleSearchCriteria roleSearchCriteria) {
		RoleFinderQueryBuilder queryBuilder = new RoleFinderQueryBuilder(roleSearchCriteria);
		return (List<Role>) (List<?>) repository.run(queryBuilder, new RoleRowMapper());
	}
	public List<Role> getRolesfromMDMS(RoleSearchCriteria roleSearchCriteria) throws UnsupportedEncodingException, JSONException {
		List<Role> roles = roleRepository.getAllMDMSRoles(roleSearchCriteria);
		return roles;
	}

	public List<Role> createRole(RoleRequest roleRequest) {

		return roleRepository.createRole(roleRequest);
	}

	public List<Role> updateRole(RoleRequest roleRequest) {

		return roleRepository.updateRole(roleRequest);
	}

	public boolean checkRoleNameDuplicationValidationErrors(String roleName) {

		return roleRepository.checkRoleNameDuplicationValidationErrors(roleName);
	}

}
