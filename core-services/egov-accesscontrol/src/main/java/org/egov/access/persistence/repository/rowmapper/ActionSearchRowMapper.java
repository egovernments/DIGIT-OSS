package org.egov.access.persistence.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.access.domain.model.Action;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class ActionSearchRowMapper implements RowMapper<Action> {

	public Map<String, List<Action>> actionMap = new HashMap<String, List<Action>>();

	@Override
	public Action mapRow(final ResultSet rs, final int rowNum) throws SQLException {

		if (!actionMap.containsKey(rs.getString("servicecode"))) {

			List<Action> actionList = new ArrayList<Action>();

			actionMap.put(rs.getString("servicecode"), prepareActionObject(rs, actionList));

		} else if (actionMap.containsKey(rs.getString("servicecode"))) {

			List<Action> actionList = actionMap.get(rs.getString("servicecode"));

			prepareActionObject(rs, actionList);
		}

		return null;
	}

	private List<Action> prepareActionObject(ResultSet rs, List<Action> actionList) throws SQLException {
		Action action = new Action();
		action.setId(rs.getLong("id"));
		action.setUrl(rs.getString("url"));
		action.setName(rs.getString("name"));
		action.setServiceCode(rs.getString("servicecode"));
		action.setDisplayName(rs.getString("displayname"));
		action.setEnabled(rs.getBoolean("enabled"));
		action.setParentModule(rs.getString("parentmodule"));
		action.setQueryParams(rs.getString("queryparams"));
		action.setOrderNumber(rs.getInt("ordernumber"));
		actionList.add(action);
		return actionList;
	}
}