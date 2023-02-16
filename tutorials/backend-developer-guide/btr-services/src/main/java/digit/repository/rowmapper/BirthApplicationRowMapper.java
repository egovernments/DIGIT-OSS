package digit.repository.rowmapper;

import digit.web.models.*;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class BirthApplicationRowMapper implements ResultSetExtractor<List<BirthRegistrationApplication>> {
    public List<BirthRegistrationApplication> extractData(ResultSet rs) throws SQLException, DataAccessException {
        Map<String,BirthRegistrationApplication> birthRegistrationApplicationMap = new LinkedHashMap<>();

        while (rs.next()){
            String uuid = rs.getString("bapplicationnumber");
            BirthRegistrationApplication birthRegistrationApplication = birthRegistrationApplicationMap.get(uuid);

            if(birthRegistrationApplication == null) {

                Long lastModifiedTime = rs.getLong("blastModifiedTime");
                if (rs.wasNull()) {
                    lastModifiedTime = null;
                }


                FatherApplicant father = FatherApplicant.builder().id(rs.getString("bfatherid")).build();
                MotherApplicant mother = MotherApplicant.builder().id(rs.getString("bmotherid")).build();

                AuditDetails auditdetails = AuditDetails.builder()
                        .createdBy(rs.getString("bcreatedBy"))
                        .createdTime(rs.getLong("bcreatedTime"))
                        .lastModifiedBy(rs.getString("blastModifiedBy"))
                        .lastModifiedTime(lastModifiedTime)
                        .build();

                birthRegistrationApplication = BirthRegistrationApplication.builder()
                        .applicationNumber(rs.getString("bapplicationnumber"))
                        .tenantId(rs.getString("btenantid"))
                        .id(rs.getString("bid"))
                        .babyFirstName(rs.getString("bbabyfirstname"))
                        .babyLastName(rs.getString("bbabylastname"))
                        .father(father)
                        .mother(mother)
                        .doctorName(rs.getString("bdoctorname"))
                        .hospitalName(rs.getString("bhospitalname"))
                        .placeOfBirth(rs.getString("bplaceofbirth"))
                        .timeOfBirth(rs.getInt("btimeofbirth"))
                        .auditDetails(auditdetails)
                        .build();
            }
            addChildrenToProperty(rs, birthRegistrationApplication);
            birthRegistrationApplicationMap.put(uuid, birthRegistrationApplication);
        }
        return new ArrayList<>(birthRegistrationApplicationMap.values());
    }

    private void addChildrenToProperty(ResultSet rs, BirthRegistrationApplication birthRegistrationApplication)
            throws SQLException {
        addAddressToApplication(rs, birthRegistrationApplication);
    }

    private void addAddressToApplication(ResultSet rs, BirthRegistrationApplication birthRegistrationApplication) throws SQLException {
        Address address = Address.builder()
                .id(rs.getString("aid"))
                .tenantId(rs.getString("atenantid"))
                .doorNo(rs.getString("adoorno"))
                .latitude(rs.getDouble("alatitude"))
                .longitude(rs.getDouble("alongitude"))
                .buildingName(rs.getString("abuildingname"))
                .addressId(rs.getString("aaddressid"))
                .addressNumber(rs.getString("aaddressnumber"))
                .type(rs.getString("atype"))
                .addressLine1(rs.getString("aaddressline1"))
                .addressLine2(rs.getString("aaddressline2"))
                .landmark(rs.getString("alandmark"))
                .street(rs.getString("astreet"))
                .city(rs.getString("acity"))
                .pincode(rs.getString("apincode"))
                .detail("adetail")
                .registrationId("aregistrationid")
                .build();

        birthRegistrationApplication.setAddress(address);

    }

}
