package org.egov.pgr.repository.rowmapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.pgr.contract.Address;
import org.egov.pgr.model.AuditDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Component
public class AddressRowMapper implements ResultSetExtractor<List<Address>> {

    @Autowired
    ObjectMapper objectMapper;

    public List<Address> extractData(ResultSet rs) throws SQLException, DataAccessException {

        List<Address> addressList = new ArrayList<>();

        while(rs.next()) {

            AuditDetails auditDetails = AuditDetails.builder()
                    .createdBy(rs.getString("createdby"))
                    .createdTime(rs.getLong("createdtime"))
                    .lastModifiedBy(rs.getString("lastmodifiedby"))
                    .lastModifiedTime(rs.getLong("lastmodifiedtime")).build();

            Address address = Address.builder()
                    .tenantId(rs.getString("tenantid"))
                    .uuid(rs.getString("uuid"))
                    .houseNoAndStreetName(rs.getString("housenoandstreetname"))
                    .mohalla(rs.getString("mohalla"))
                    .landmark(rs.getString("landmark"))
                    .city(rs.getString("city"))
                    .latitude(rs.getDouble("latitude"))
                    .longitude(rs.getDouble("longitude"))
                    .auditDetails(auditDetails)
                    .build();

            addressList.add(address);

        }
        return addressList;
    }
}
