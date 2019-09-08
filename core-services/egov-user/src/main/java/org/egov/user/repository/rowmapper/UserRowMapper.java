package org.egov.user.repository.rowmapper;

import org.egov.user.domain.model.User;
import org.egov.user.domain.model.enums.BloodGroup;
import org.egov.user.domain.model.enums.Gender;
import org.egov.user.domain.model.enums.GuardianRelation;
import org.egov.user.domain.model.enums.UserType;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserRowMapper implements RowMapper<User> {

	@Override
	public User mapRow(final ResultSet rs, final int rowNum) throws SQLException {
		final User user = User.builder().id(rs.getLong("id")).tenantId(rs.getString("tenantid")).title(rs.getString("title")).salutation(rs.getString("salutation"))
				.dob(rs.getDate("dob")).locale(rs.getString("locale")).username(rs.getString("username"))
				.password(rs.getString("password")).passwordExpiryDate(rs.getTimestamp("pwdexpirydate"))
				.mobileNumber(rs.getString("mobilenumber")).altContactNumber(rs.getString("altcontactnumber"))
				.emailId(rs.getString("emailid")).active(rs.getBoolean("active")).name(rs.getString("name")).lastModifiedBy(rs.getLong("lastmodifiedby")).lastModifiedDate(rs.getTimestamp("lastmodifieddate"))
				.pan(rs.getString("pan")).aadhaarNumber(rs.getString("aadhaarnumber")).createdBy(rs.getLong("createdby")).createdDate(rs.getTimestamp("createddate"))
				.guardian(rs.getString("guardian")).signature(rs.getString("signature"))
				.accountLocked(rs.getBoolean("accountlocked")).photo(rs.getString("photo")).identificationMark(rs.getString("identificationmark")).uuid(rs.getString("uuid")).build();
		
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
		
		if(rs.getInt("gender") == 1) {
			user.setGender(Gender.FEMALE);
		}else if(rs.getInt("gender") == 2){
			user.setGender(Gender.MALE);
		}else if(rs.getInt("gender") == 3){
			user.setGender(Gender.OTHERS);
		}
		for (GuardianRelation guardianRelation : GuardianRelation.values()) {
			if (guardianRelation.toString().equals(rs.getString("guardianrelation"))) {
				user.setGuardianRelation(guardianRelation);
			}
		}
		return user;
	}
}
