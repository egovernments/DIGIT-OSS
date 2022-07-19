package digit.repository.rowmapper;

import digit.web.models.Address;
import digit.web.models.Applicant;
import digit.web.models.AuditDetails;
import digit.web.models.VoterRegistrationApplication;
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
public class VoterApplicationRowMapper implements ResultSetExtractor<List<VoterRegistrationApplication>> {
    public List<VoterRegistrationApplication> extractData(ResultSet rs) throws SQLException, DataAccessException {
        Map<String,VoterRegistrationApplication> voterRegistrationApplicationMap = new LinkedHashMap<>();

        while (rs.next()){
            String uuid = rs.getString("vapplicationnumber");
            VoterRegistrationApplication voterRegistrationApplication = voterRegistrationApplicationMap.get(uuid);

            if(voterRegistrationApplication == null) {

                Long lastModifiedTime = rs.getLong("vlastModifiedTime");
                if (rs.wasNull()) {
                    lastModifiedTime = null;
                }

                Applicant applicant = Applicant.builder().id(rs.getString("vapplicantid")).build();

                AuditDetails auditdetails = AuditDetails.builder()
                        .createdBy(rs.getString("vcreatedBy"))
                        .createdTime(rs.getLong("vcreatedTime"))
                        .lastModifiedBy(rs.getString("vlastModifiedBy"))
                        .lastModifiedTime(lastModifiedTime)
                        .build();

                voterRegistrationApplication = VoterRegistrationApplication.builder()
                        .applicationNumber(rs.getString("vapplicationnumber"))
                        .tenantId(rs.getString("vtenantid"))
                        .id(rs.getString("vid"))
                        .assemblyConstituency(rs.getString("vassemblyconstituency"))
                        .dateSinceResidence(rs.getInt("vdatesinceresidence"))
                        .applicant(applicant)
                        .auditDetails(auditdetails)
                        .build();
            }
            addChildrenToProperty(rs, voterRegistrationApplication);
            voterRegistrationApplicationMap.put(uuid, voterRegistrationApplication);
        }
        return new ArrayList<>(voterRegistrationApplicationMap.values());
    }

    private void addChildrenToProperty(ResultSet rs, VoterRegistrationApplication voterRegistrationApplication)
            throws SQLException {
        addAddressToApplication(rs, voterRegistrationApplication);
    }

    private void addAddressToApplication(ResultSet rs, VoterRegistrationApplication voterRegistrationApplication) throws SQLException {
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


        voterRegistrationApplication.setAddress(address);

    }

}
