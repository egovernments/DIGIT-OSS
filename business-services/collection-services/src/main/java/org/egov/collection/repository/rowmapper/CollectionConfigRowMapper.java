package org.egov.collection.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

@Component
public class CollectionConfigRowMapper implements ResultSetExtractor<Map<String, List<String>>> {

	@Override
	public Map<String, List<String>> extractData(ResultSet rs) throws SQLException, DataAccessException {
		Map<String, List<String>> collectionConfigKeyValMap = new HashMap<>();

		while (rs.next()) {
			String collectionConfigKey = rs.getString("key");

			if(!collectionConfigKeyValMap.containsKey(collectionConfigKey)) {
				collectionConfigKeyValMap.put(collectionConfigKey, new ArrayList<>());
			}

			List<String> lamsConfKeyVal = collectionConfigKeyValMap.get(collectionConfigKey);
			lamsConfKeyVal.add(rs.getString("value"));
		}

		return collectionConfigKeyValMap;
	}
}
