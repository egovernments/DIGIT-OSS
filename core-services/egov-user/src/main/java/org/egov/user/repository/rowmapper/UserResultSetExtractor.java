package org.egov.user.repository.rowmapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.user.domain.model.Address;
import org.egov.user.domain.model.AuditAlternateNumber;
import org.egov.user.domain.model.AuditMobileNumber;
import org.egov.user.domain.model.Role;
import org.egov.user.domain.model.User;
import org.egov.user.domain.model.enums.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

import static java.util.Objects.isNull;
import static org.egov.user.domain.model.enums.AddressType.CORRESPONDENCE;
import static org.egov.user.domain.model.enums.AddressType.PERMANENT;

@Service
public class UserResultSetExtractor implements ResultSetExtractor<List<User>> {

    private ObjectMapper objectMapper;

    @Autowired
    UserResultSetExtractor(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public List<User> extractData(ResultSet rs) throws SQLException, DataAccessException {

        Map<Long, User> usersMap = new LinkedHashMap<>();

        while (rs.next()) {

            Long userId = rs.getLong("id");
            User user;

            if (!usersMap.containsKey(userId)) {

                user = User.builder().id(rs.getLong("id")).tenantId(rs.getString("tenantid")).title(rs.getString("title"))
                        .salutation(rs.getString("salutation"))
                        .dob(rs.getDate("dob")).locale(rs.getString("locale")).username(rs.getString("username"))
                        .password(rs.getString("password")).passwordExpiryDate(rs.getTimestamp("pwdexpirydate"))
                        .mobileNumber(rs.getString("mobilenumber")).altContactNumber(rs.getString("altcontactnumber"))
                        .emailId(rs.getString("emailid")).active(rs.getBoolean("active")).name(rs.getString("name")).
                                lastModifiedBy(rs.getLong("lastmodifiedby")).lastModifiedDate(rs.getTimestamp("lastmodifieddate"))
                        .pan(rs.getString("pan")).aadhaarNumber(rs.getString("aadhaarnumber")).createdBy(rs.getLong("createdby"))
                        .createdDate(rs.getTimestamp("createddate")).guardian(rs.getString("guardian")).signature(rs.getString("signature"))
                        .accountLocked(rs.getBoolean("accountlocked")).photo(rs.getString("photo"))
                        .identificationMark(rs.getString("identificationmark")).uuid(rs.getString("uuid"))
                        .accountLockedDate(rs.getLong("accountlockeddate")).alternateMobileNumber(rs.getString("alternatemobilenumber"))
                        .build();

                for (UserType type : UserType.values()) {
                    if (type.toString().equals(rs.getString("type"))) {
                        user.setType(type);
                    }
                }


                for (BloodGroup bloodGroup : BloodGroup.values()) {
                    if (bloodGroup.toString().equals(rs.getString("bloodgroup"))) {
                        user.setBloodGroup(bloodGroup);
                    }
                }

                if (rs.getInt("gender") == 1) {
                    user.setGender(Gender.FEMALE);
                } else if (rs.getInt("gender") == 2) {
                    user.setGender(Gender.MALE);
                } else if (rs.getInt("gender") == 3) {
                    user.setGender(Gender.OTHERS);
                } else if (rs.getInt("gender") == 4) {
                    user.setGender(Gender.TRANSGENDER);
                }
                for (GuardianRelation guardianRelation : GuardianRelation.values()) {
                    if (guardianRelation.toString().equals(rs.getString("guardianrelation"))) {
                        user.setGuardianRelation(guardianRelation);
                    }
                }

                usersMap.put(userId, user);

            } else {
                user = usersMap.get(userId);
            }

            Role role = populateRole(rs);
            Address address = populateAddress(rs, user);
            
            // UPDATE THE AUDIT MOBILE NUMBERS TABLE
            populateAuditHistory(rs,user);
            
            // UPDATE THE AUDIT ALTERNATE NUMBERS TABLE.
            populateAlternateAudit(rs,user);

            if (!isNull(role))
                user.addRolesItem(role);

            if (!isNull(address))
                user.addAddressItem(address);

        }

        return new ArrayList<>(usersMap.values());
    }

    private void populateAlternateAudit(ResultSet rs, User user) throws SQLException{
    	if(user.getAlternateAudittrail()==null) {
    		Set<AuditAlternateNumber> list = new HashSet<AuditAlternateNumber>();
    		user.setAlternateAudittrail(list);
    	}
    	
    	Set <AuditAlternateNumber> auditHistory = user.getAlternateAudittrail();
    	
    	if(rs.getString("aud_alt_uuid")!=null) {
    		
    		AuditAlternateNumber trail = AuditAlternateNumber.builder().uuid(rs.getString("aud_alt_uuid")).createdby(rs.getString("aud_alt_createdby")).createdtime(rs.getTimestamp("aud_alt_createdtime")).
    				lastmodifiedby(rs.getString("aud_alt_lastmodifiedby")).lastmodifiedtime(rs.getTimestamp("aud_alt_lastmodifiedtime")).mobilenumber(rs.getString("aud_alt_mobilenumber")).build();
    	
    		boolean isExists = false;
    		
    		// AVOID DUPLICATE ENTRIES IN THE AUDIT TABLE.
    		
    		for (AuditAlternateNumber existing : auditHistory) {
    			
    			if (existing.equals(trail)) {
    				isExists=true;
    				break;
    			}
    		}
    		
    		if(!isExists) {
    			auditHistory.add(trail);
    		}
    		
    		user.setAlternateAudittrail(auditHistory);
    	
    	}
    	
    	
    	
		
	}

	private void populateAuditHistory(ResultSet rs, User user) throws SQLException {
    	if(user.getAudittrail()==null) {
    		Set<AuditMobileNumber> list = new HashSet<AuditMobileNumber>();
    		user.setAudittrail(list);
    	}
    	
    	Set <AuditMobileNumber> auditHistory = user.getAudittrail();
    	
    	if(rs.getString("aud_uuid")!=null) {
    		
    		AuditMobileNumber trail = AuditMobileNumber.builder().uuid(rs.getString("aud_uuid")).createdby(rs.getString("aud_createdby")).createdtime(rs.getTimestamp("aud_createdtime")).
    				lastmodifiedby(rs.getString("aud_lastmodifiedby")).lastmodifiedtime(rs.getTimestamp("aud_lastmodifiedtime")).mobilenumber(rs.getString("aud_mobilenumber")).build();
    	
    		boolean isExists = false;
    		
    		// AVOID DUPLICATE ENTRIES
    		
    		for (AuditMobileNumber existing : auditHistory) {
    			
    			if (existing.equals(trail)) {
    				isExists=true;
    				break;
    			}
    		}
    		
    		if(!isExists) {
    			auditHistory.add(trail);
    		}
    		
    		user.setAudittrail(auditHistory);
    	
    	}
    	
		
	}

	private Role populateRole(ResultSet rs) throws SQLException {
        String code = rs.getString("role_code");
        if (code == null) {
            return null;
        }
        return Role.builder()
                .tenantId(rs.getString("role_tenantid"))
                .code(code)
                .build();
    }

    private Address populateAddress(ResultSet rs, User user) throws SQLException {
        long id = rs.getLong("addr_id");
        if (id == 0L) {
            return null;
        }

        Address address = Address.builder()
                .id(rs.getLong("addr_id"))
                .addressType(rs.getString("addr_type"))
                .type(AddressType.fromValue(rs.getString("addr_type")))
                .address(rs.getString("addr_address"))
                .city(rs.getString("addr_city"))
                .pinCode(rs.getString("addr_pincode"))
                .userId(rs.getLong("addr_userid"))
                .tenantId(rs.getString("addr_tenantid"))
                .build();

        if (address.getType().equals(PERMANENT) && isNull(user.getPermanentAddress()))
            user.setPermanentAddress(address);
        if (address.getType().equals(CORRESPONDENCE) && isNull(user.getCorrespondenceAddress()))
            user.setCorrespondenceAddress(address);

        return address;

    }
}
