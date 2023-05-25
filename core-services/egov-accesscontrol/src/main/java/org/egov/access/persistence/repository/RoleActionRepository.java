package org.egov.access.persistence.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.access.domain.model.Action;
import org.egov.access.domain.model.Role;
import org.egov.access.domain.model.RoleAction;
import org.egov.access.web.contract.action.RoleActionsRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

@Repository
public class RoleActionRepository {

	public static final Logger LOGGER = LoggerFactory.getLogger(RoleActionRepository.class);

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	final static String GET_ACTIONS_BASEDON_IDS = "select id from eg_action where name IN (:sqlStringifiedCodes)";

	final static String CHECK_UNIQUE_VALIDATION_FOR_ROLEACTIONS = "select rolecode from eg_roleaction where actionid IN (:actionid) and tenantid =:tenantid and rolecode =:rolecode";

	public List<RoleAction> createRoleActions(final RoleActionsRequest actionRequest) {

		LOGGER.info("Create Role Actions Repository::" + actionRequest);
		final String roleActionsInsert = "insert into eg_roleaction(rolecode,actionid,tenantid) values (:rolecode,:actionid,:tenantid)";

		List<Integer> actionList = getActionsBasedOnIds(actionRequest);

		Role role = actionRequest.getRole();

		List<RoleAction> roleActionList = new ArrayList<RoleAction>();

		List<Map<String, Object>> batchValues = new ArrayList<>(actionList.size());
		for (Integer actionid : actionList) {
			batchValues.add(new MapSqlParameterSource("rolecode", role.getCode()).addValue("actionid", actionid)
					.addValue("tenantid", actionRequest.getTenantId()).getValues());

			RoleAction roleAction = new RoleAction();

			roleAction.setActionId(actionid);
			roleAction.setRoleCode(role.getCode());
			roleAction.setTenantId(actionRequest.getTenantId());

			roleActionList.add(roleAction);
		}

		namedParameterJdbcTemplate.batchUpdate(roleActionsInsert, batchValues.toArray(new Map[actionList.size()]));

		return roleActionList;
	}

	private List<Integer> getActionsBasedOnIds(final RoleActionsRequest actionRequest) {

		List<String> sqlStringifiedCodes = new ArrayList<>();
		for (Action actionName : actionRequest.getActions())
			sqlStringifiedCodes.add(actionName.getName());

		final Map<String, Object> parametersMap = new HashMap<String, Object>();

		parametersMap.put("sqlStringifiedCodes", sqlStringifiedCodes);

		SqlRowSet sqlrowset = namedParameterJdbcTemplate.queryForRowSet(GET_ACTIONS_BASEDON_IDS, parametersMap);

		List<Integer> actionList = new ArrayList<Integer>();

		while (sqlrowset.next()) {

			actionList.add(sqlrowset.getInt("id"));
		}

		return actionList;

	}

	public boolean checkActionNamesAreExistOrNot(final RoleActionsRequest actionRequest) {

		LOGGER.info("checkActionNamesAreExistOrNot::" + actionRequest);

		if (actionRequest.getActions().size() > 0) {

			List<String> sqlStringifiedCodes = new ArrayList<>();
			for (Action actionName : actionRequest.getActions())
				sqlStringifiedCodes.add(actionName.getName());

			final Map<String, Object> parametersMap = new HashMap<String, Object>();

			parametersMap.put("sqlStringifiedCodes", sqlStringifiedCodes);

			final String getActionIdsBasedOnName = "select id from eg_action where name IN (:sqlStringifiedCodes)";

			SqlRowSet sqlrowset = namedParameterJdbcTemplate.queryForRowSet(getActionIdsBasedOnName, parametersMap);

			List<Integer> actionList = new ArrayList<Integer>();

			while (sqlrowset.next()) {

				actionList.add(sqlrowset.getInt("id"));
			}

			if (actionList.size() == actionRequest.getActions().size()) {

				return true;
			}

		}

		return false;
	}

	public boolean addUniqueValidationForTenantAndRoleAndAction(final RoleActionsRequest actionRequest) {

		List<Integer> actionList = getActionsBasedOnIds(actionRequest);

		if (actionList.size() > 0) {

			final Map<String, Object> parametersMap = new HashMap<String, Object>();

			parametersMap.put("rolecode", actionRequest.getRole().getCode());
			parametersMap.put("tenantid", actionRequest.getTenantId());
			parametersMap.put("actionid", actionList);

			SqlRowSet sqlrowset = namedParameterJdbcTemplate.queryForRowSet(CHECK_UNIQUE_VALIDATION_FOR_ROLEACTIONS,
					parametersMap);

			if (sqlrowset != null && sqlrowset.next()) {

				String rolecode = sqlrowset.getString("rolecode");

				if (rolecode != null && rolecode != "") {

					return false;
				}
			}

		}

		return true;
	}

}
