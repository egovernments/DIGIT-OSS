package org.egov.rn.repository.Registration;

import org.egov.rn.web.models.RegistrationData;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Component
public class RegistrationDataRowsMapper implements ResultSetExtractor<List<RegistrationData>> {
    @Override
    public List<RegistrationData> extractData(ResultSet rs) throws SQLException, DataAccessException {
        List<RegistrationData> registrationDataList=new ArrayList<RegistrationData>();
        while(rs.next()){
            RegistrationData registrationData =new RegistrationData();
            registrationData.setId(rs.getString("id"));
            registrationData.setName(rs.getString("name"));
            registrationData.setTenantId(rs.getString("tenantid"));
            registrationData.setGender(rs.getString("gender"));
            registrationData.setDateOfRegistration(rs.getString("dateofregistration"));
            registrationData.setHouseHoldId(rs.getString("householdid"));
            registrationData.setDateOfBirth(rs.getString("dateofbirth"));
            registrationData.setCreatedBy(rs.getString("createdby"));
            registrationData.setLastModifiedBy(rs.getString("lastmodifiedby"));
            registrationData.setCreatedTime(rs.getLong("createdtime"));
            registrationData.setLastModifiedTime(rs.getLong("lastmodifiedtime"));
            registrationData.setIsHead(rs.getBoolean("ishead"));

            registrationDataList.add(registrationData);
        }
        return registrationDataList;
    }
}
