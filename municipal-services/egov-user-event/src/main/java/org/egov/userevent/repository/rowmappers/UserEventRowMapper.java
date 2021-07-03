package org.egov.userevent.repository.rowmappers;

import java.lang.reflect.Type;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.egov.userevent.model.AuditDetails;
import org.egov.userevent.model.enums.Source;
import org.egov.userevent.model.enums.Status;
import org.egov.userevent.web.contract.Action;
import org.egov.userevent.web.contract.Event;
import org.egov.userevent.web.contract.EventDetails;
import org.egov.userevent.web.contract.Recepient;
import org.postgresql.util.PGobject;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserEventRowMapper implements ResultSetExtractor <List<Event>> {

	@Override
	public List<Event> extractData(ResultSet resultSet) throws SQLException, DataAccessException {
		List<Event> events = new ArrayList<>();
		while(resultSet.next()) {
			Event event = Event.builder()
					.id(resultSet.getString("id"))
					.tenantId(resultSet.getString("tenantid"))
					.eventType(resultSet.getString("eventtype"))
					.eventCategory(resultSet.getString("category"))
					.source(Source.valueOf(resultSet.getString("source")))
					.description(resultSet.getString("description"))
					.name(resultSet.getString("name"))
					.referenceId(resultSet.getString("referenceid"))
					.postedBy(resultSet.getString("postedby"))
					.status(Status.valueOf(resultSet.getString("status"))).build();
			try {
				PGobject obj = (PGobject) resultSet.getObject("eventdetails");
				if(null != obj) {
					if(!obj.getValue().equalsIgnoreCase("null")) {
					    Type type = new TypeToken<EventDetails>() {}.getType();
						Gson gson = new Gson();
						EventDetails data = gson.fromJson(obj.getValue(), type);			
						event.setEventDetails(data);
					}
				}
					
				obj = (PGobject) resultSet.getObject("actions");
				if(null != obj) {
					if(!obj.getValue().equalsIgnoreCase("null")) {
					    Type type = new TypeToken<Action>() {}.getType();
						Gson gson = new Gson();
						Action data = gson.fromJson(obj.getValue(), type);
						event.setActions(data);
					}
				}
				
				obj = (PGobject) resultSet.getObject("recepient");
				if(null != obj) {
					if(!obj.getValue().equalsIgnoreCase("null")) {
					    Type type = new TypeToken<Recepient>() {}.getType();
						Gson gson = new Gson();
						Recepient data = gson.fromJson(obj.getValue(), type);
						event.setRecepient(data);
					}
				}
				
			}catch(Exception e) {
				log.error("Error while adding jsonb fields: ", e);
				continue;
			}
			AuditDetails audit = AuditDetails.builder()
					.createdBy(resultSet.getString("createdby"))
					.createdTime(resultSet.getLong("createdtime"))
					.lastModifiedBy(resultSet.getString("lastmodifiedby"))
					.lastModifiedTime(resultSet.getLong("lastmodifiedtime")).build();
			
			event.setAuditDetails(audit);
			
			events.add(event);		
		}
		
		return events;
	}

}
