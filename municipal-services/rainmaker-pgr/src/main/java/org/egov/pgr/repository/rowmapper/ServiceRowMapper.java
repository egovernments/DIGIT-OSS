package org.egov.pgr.repository.rowmapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.pgr.model.AuditDetails;
import org.egov.pgr.model.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Component
public class ServiceRowMapper implements ResultSetExtractor<List<Service>> {

    @Autowired
    private ObjectMapper objectMapper;

    public List<Service> extractData(ResultSet rs) throws SQLException, DataAccessException {

       List<Service> serviceList = new ArrayList<>();

        while (rs.next()) {

            AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("createdby")).createdTime(rs.getLong("createdtime"))
                    .lastModifiedBy(rs.getString("lastmodifiedby")).lastModifiedTime(rs.getLong("lastmodifiedtime")).build();

            Service currentService = Service.builder()
                    .tenantId(rs.getString("tenantid"))
                    .serviceCode(rs.getString("servicecode"))
                    .serviceRequestId(rs.getString("servicerequestid"))
                    .description(rs.getString("description"))
                    .lat(rs.getDouble("lat"))
                    .longitutde(rs.getDouble("long"))
                    .addressId(rs.getString("addressid"))
                    .email(rs.getString("email"))
                    .deviceId(rs.getString("deviceid"))
                    .accountId(rs.getString("accountid"))
                    .firstName(rs.getString("firstname"))
                    .lastName(rs.getString("lastname"))
                    .phone(rs.getString("phone"))
                    .status(Service.StatusEnum.fromValue(rs.getString("status")))
                    .source(Service.SourceEnum.fromValue(rs.getString("source")))
                    .expectedTime(rs.getLong("expectedtime"))
                    .feedback(rs.getString("feedback"))
                    .rating(rs.getString("rating"))
                    .landmark(rs.getString("landmark"))
                    .active(rs.getBoolean("active"))
                    .auditDetails(auditDetails)
                    .build();


            serviceList.add(currentService);
        }
        return serviceList;
    }
}
