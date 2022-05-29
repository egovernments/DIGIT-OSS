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
import org.egov.vendor.web.model.Vendor;
import org.egov.vendor.web.model.Vendor.StatusEnum;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class DriverRowMapper implements ResultSetExtractor<List<Driver>>  {

	@Autowired
	private ObjectMapper mapper;

	@SuppressWarnings("rawtypes")
	@Override
	public List<Driver> extractData(ResultSet rs) throws SQLException, DataAccessException {
		Map<String, Driver> driverMap = new LinkedHashMap<String, Driver>();

		while (rs.next()) {
			Driver currentvendor = new Driver();
			String id = rs.getString("vendor_id");
			String name = rs.getString("name");
			currentvendor = driverMap.get(id);
			String tenantId = rs.getString("tenantid");
			Object additionalDetail = getAdditionalDetail("additionaldetails",rs);
			String owner_id = rs.getString("owner_id");
			String description = rs.getString("description");
			String source = rs.getString("source");
			String status = rs.getString("status");
			String agencytype = rs.getString("agencytype");
			String paymentpreference = rs.getString("paymentpreference");
			if (currentvendor == null) {
				if(status==null) {
					status="ACTIVE";
				}
//				currentvendor = Driver.builder().id(id).name(name).tenantId(tenantId).agencyType(agencytype).paymentPreference(paymentpreference).additionalDetails(additionalDetail)
//						.description(description).source(source).status(StatusEnum.valueOf(status)).ownerId(owner_id).build();

			//	vendorMap.put(id, currentvendor);
			}
			//addChildrenToProperty(rs, currentvendor);
		}

		return new ArrayList<>(driverMap.values());
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
