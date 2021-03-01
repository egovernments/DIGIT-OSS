package org.egov.pgr.repository.rowmapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.pgr.web.models.*;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Repository
public class PGRRowMapper implements ResultSetExtractor<List<Service>> {


    @Autowired
    private ObjectMapper mapper;



    public List<Service> extractData(ResultSet rs) throws SQLException, DataAccessException {

        Map<String, Service> serviceMap = new LinkedHashMap<>();

        while (rs.next()) {

            String id = rs.getString("ser_id");
            Service currentService = serviceMap.get(id);
            String tenantId = rs.getString("ser_tenantId");
            Boolean active = rs.getBoolean("active");

            if(currentService == null){

                id = rs.getString("ser_id");
                String serviceCode = rs.getString("serviceCode");
                String serviceRequestId = rs.getString("serviceRequestId");
                String description = rs.getString("description");
                String accountId = rs.getString("accountId");
                String applicationStatus = rs.getString("applicationStatus");
                String source = rs.getString("source");
                String createdby = rs.getString("ser_createdby");
                Long createdtime = rs.getLong("ser_createdtime");
                String lastmodifiedby = rs.getString("ser_lastmodifiedby");
                Long lastmodifiedtime = rs.getLong("ser_lastmodifiedtime");
                Integer rating = rs.getInt("rating");
                if(rs.wasNull()){rating = null;}

                AuditDetails auditDetails = AuditDetails.builder().createdBy(createdby).createdTime(createdtime)
                                                .lastModifiedBy(lastmodifiedby).lastModifiedTime(lastmodifiedtime).build();

                currentService = Service.builder().id(id).active(active)
                        .serviceCode(serviceCode)
                        .serviceRequestId(serviceRequestId)
                        .description(description)
                        .accountId(accountId)
                        .applicationStatus(applicationStatus)
                        .source(source)
                        .tenantId(tenantId)
                        .rating(rating)
                        .auditDetails(auditDetails)
                        .build();

                JsonNode additionalDetails = getAdditionalDetail("ser_additionaldetails",rs);

                if(additionalDetails != null)
                    currentService.setAdditionalDetail(additionalDetails);

                serviceMap.put(currentService.getId(),currentService);

            }
            addChildrenToProperty(rs, currentService);

        }

        return new ArrayList<>(serviceMap.values());


    }

    private void addChildrenToProperty(ResultSet rs, Service service) throws SQLException {

        if(service.getAddress() == null){

            Double latitude =  rs.getDouble("latitude");
            Double longitude = rs.getDouble("longitude");
            Boundary locality = Boundary.builder().code(rs.getString("locality")).build();

            GeoLocation geoLocation = GeoLocation.builder().latitude(latitude).longitude(longitude).build();

            Address address = Address.builder()
                    .tenantId(rs.getString("ads_tenantId"))
                    .id(rs.getString("ads_id"))
                    .plotNo(rs.getString("plotNo"))
                    .doorNo(rs.getString("doorno"))
                    .buildingName(rs.getString("buildingName"))
                    .street(rs.getString("street"))
                    .landmark(rs.getString("landmark"))
                    .locality(locality)
                    .city(rs.getString("city"))
                    .district(rs.getString("district"))
                    .region(rs.getString("region"))
                    .state(rs.getString("state"))
                    .country(rs.getString("country"))
                    .pincode(rs.getString("pincode"))
                    .geoLocation(geoLocation)
                    .build();

            JsonNode additionalDetails = getAdditionalDetail("ads_additionaldetails",rs);

            if(additionalDetails != null)
                address.setAdditionDetails(additionalDetails);

            service.setAddress(address);

        }

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
            throw new CustomException("PARSING_ERROR","Failed to parse additionalDetail object");
        }
        return additionalDetail;
    }


}
