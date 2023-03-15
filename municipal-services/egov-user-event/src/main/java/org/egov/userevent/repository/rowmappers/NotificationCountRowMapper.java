package org.egov.userevent.repository.rowmappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.egov.userevent.web.contract.NotificationCountResponse;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Service;

@Service
public class NotificationCountRowMapper implements ResultSetExtractor <NotificationCountResponse>  {

	@Override
	public NotificationCountResponse extractData(ResultSet rs) throws SQLException, DataAccessException {
		NotificationCountResponse response = null;
		while(rs.next()) {
			response = NotificationCountResponse.builder()
					.totalCount(rs.getLong("total"))
					.unreadCount(rs.getLong("unread")).build();
		}
		return response;
	}
	

}
