package org.egov.echallan.repository.rowmapper;


import org.egov.echallan.model.Address;
import org.egov.echallan.model.AuditDetails;
import org.egov.echallan.model.Boundary;
import org.egov.echallan.model.Challan;
import org.egov.echallan.model.Challan.StatusEnum;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;



@Component
public class ChallanRowMapper  implements ResultSetExtractor<List<Challan>> {
	@Autowired
    private ObjectMapper mapper;

    public List<Challan> extractData(ResultSet rs) throws SQLException, DataAccessException {
        Map<String, Challan> challanMap = new LinkedHashMap<>();
       
        while (rs.next()) {
            String id = rs.getString("challan_id");
            Challan currentChallan = challanMap.get(id);

            if(currentChallan == null){
                Long lastModifiedTime = rs.getLong("challan_lastModifiedTime");
                if(rs.wasNull()){lastModifiedTime = null;}

                Long taxPeriodFrom = (Long) rs.getObject("taxperiodfrom");
                Long taxPeriodto = (Long) rs.getObject("taxperiodto");
                PGobject pgObj = (PGobject) rs.getObject("additionaldetail");
                AuditDetails auditdetails = AuditDetails.builder()
                        .createdBy(rs.getString("challan_createdBy"))
                        .createdTime(rs.getLong("challan_createdTime"))
                        .lastModifiedBy(rs.getString("challan_lastModifiedBy"))
                        .lastModifiedTime(lastModifiedTime)
                        .build();
                try {
                currentChallan = Challan.builder().auditDetails(auditdetails)
                		.accountId(rs.getString("uuid"))
                		.challanNo(rs.getString("challanno"))
                		.businessService(rs.getString("businessservice"))
                		.tenantId(rs.getString("tenantid"))
                		.referenceId(rs.getString("referenceid"))
                		.taxPeriodFrom(taxPeriodFrom)
                		.taxPeriodTo(taxPeriodto)
                		.description(rs.getString("description"))
                		.applicationStatus(StatusEnum.valueOf(rs.getString("applicationstatus")))
                        .receiptNumber(rs.getString("receiptnumber"))
                		.filestoreid(rs.getString("filestoreid"))
                        .id(id)
                        .build();
                if(pgObj!=null){
                    JsonNode additionalDetail = mapper.readTree(pgObj.getValue());
                    currentChallan.setAdditionalDetail(additionalDetail);
                }
                }
                catch (IOException e){
                    throw new CustomException("PARSING ERROR","Error while parsing additionalDetail json");
                }
                challanMap.put(id,currentChallan);
            }
            addAddressToChallan(rs, currentChallan);

        }
       
        return new ArrayList<>(challanMap.values());

    }



    private void addAddressToChallan(ResultSet rs, Challan challan) throws SQLException {

        String tenantId = challan.getTenantId();

        //if(challan.getTradeLicenseDetail()==null){

            Boundary locality = Boundary.builder().code(rs.getString("locality"))
                    .build();

            Double latitude = (Double) rs.getObject("latitude");
            Double longitude = (Double) rs.getObject("longitude");

            Address address = Address.builder()
                    .buildingName(rs.getString("buildingName"))
                    .city(rs.getString("city"))
                    .detail(rs.getString("detail"))
                    .id(rs.getString("chaladdr_id"))
                    .landmark(rs.getString("landmark"))
                    .latitude(latitude)
                    .locality(locality)
                    .longitude(longitude)
                    .pincode(rs.getString("pincode"))
                    .doorNo(rs.getString("doorno"))
                    .street(rs.getString("street"))
                    .tenantId(tenantId)
                    .build();

            challan.setAddress(address);
      
    }




}
