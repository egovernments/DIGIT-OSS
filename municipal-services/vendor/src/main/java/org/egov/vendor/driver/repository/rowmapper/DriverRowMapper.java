package org.egov.vendor.driver.repository.rowmapper;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.tracer.model.CustomException;
import org.egov.vendor.driver.web.model.Driver;
import org.egov.vendor.driver.web.model.Driver.StatusEnum;
import org.egov.vendor.web.model.AuditDetails;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class DriverRowMapper implements ResultSetExtractor<List<Driver>> {

	@Autowired
	private ObjectMapper mapper;
	
	private int fullCount=0;

	public int getFullCount() {
		return fullCount;
	}

	public void setFullCount(int fullCount) {
		this.fullCount = fullCount;
	}
	
	@SuppressWarnings("rawtypes")
	@Override
	public List<Driver> extractData(ResultSet rs) throws SQLException, DataAccessException {
		Map<String, Driver> driverMap = new LinkedHashMap<String, Driver>();
		this.setFullCount(0);
		
		while (rs.next()) {
			Driver currentDriver = new Driver();
			String id = rs.getString("id");
			String tenantId = rs.getString("tenantid");
			String name = rs.getString("name");
			String owner_id = rs.getString("owner_id");
			String description = rs.getString("description");
			String status = rs.getString("status");
			Object additionalDetail = getAdditionalDetail("additionaldetails",rs);
			currentDriver = driverMap.get(id);
			this.setFullCount(rs.getInt("full_count"));
			String licenseNumber = rs.getString("licensenumber");
			
			if (currentDriver == null) {
				currentDriver = Driver.builder().id(id).name(name).tenantId(tenantId).additionalDetails(additionalDetail)
						.description(description).status(StatusEnum.valueOf(status)).ownerId(owner_id).licenseNumber(licenseNumber).build();

				driverMap.put(id, currentDriver);
			}
			addChildrenToProperty(rs, currentDriver);
		}

		return new ArrayList<>(driverMap.values());
	}

	@SuppressWarnings("unused")
	private void addChildrenToProperty(ResultSet rs, Driver driver) throws SQLException {
		AuditDetails auditdetails = AuditDetails.builder().createdBy(rs.getString("createdBy"))
				.createdTime(rs.getLong("createdTime")).lastModifiedBy(rs.getString("lastModifiedBy"))
				.lastModifiedTime(rs.getLong("lastModifiedTime")).build();

		driver.setAuditDetails(auditdetails);
		
	}
	
	  private JsonNode getAdditionalDetail(String columnName, ResultSet rs){

	        JsonNode additionalDetail = null;
	        try {
	            PGobject pgObj = (PGobject) rs.getObject(columnName);
	            if(pgObj!=null){
	                 additionalDetail = mapper.readTree(pgObj.getValue());
	            }
	        }
	        catch (IOException | SQLException e){
	            e.printStackTrace();
	            throw new CustomException("PARSING_ERROR","Failed to parse additionalDetail object");
	        }
	        return additionalDetail;
	    }


}