package org.egov.user.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.egov.user.domain.model.Address;
import org.egov.user.domain.model.enums.AddressType;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class AddressRowMapper implements RowMapper<Address> {

	@Override
	public Address mapRow(final ResultSet rs, final int rowNum) throws SQLException {
		
		final Address address = Address.builder().id(rs.getLong("id")).addressType(rs.getString("type")).address(rs.getString("address"))
				.city(rs.getString("city")).pinCode(rs.getString("pincode")).userId(rs.getLong("userid")).tenantId(rs.getString("tenantid")).build();

		for (AddressType addressType : AddressType.values()) {
			if (addressType.toString().equals(rs.getString("type"))) {
				address.setType(addressType);
			}
		}
		return address;
	}
}


