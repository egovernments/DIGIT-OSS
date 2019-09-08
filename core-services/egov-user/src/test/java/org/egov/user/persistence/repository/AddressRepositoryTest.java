package org.egov.user.persistence.repository;

import org.egov.user.domain.model.Address;
import org.egov.user.domain.model.enums.AddressType;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
public class AddressRepositoryTest {

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@InjectMocks
	private AddressRepository addressRepository;
	
	@Before
	public void before() {
		addressRepository = new AddressRepository(namedParameterJdbcTemplate, jdbcTemplate);
	}

	@Test
	@Sql(scripts = { "/sql/clearAddresses.sql","/sql/clearUserRoles.sql","/sql/clearUsers.sql","/sql/createUsers.sql"})
	public void test_should_save_new_address() {
		final Address domainAddress = Address.builder()
				.city("city")
				.userId(1l)
				.tenantId("ap.public")
				.address("address")
				.pinCode("pinCode")
				.type(AddressType.CORRESPONDENCE)
				.build();

		final Address createdAddress = addressRepository.create(domainAddress, 1L, "ap.public");

		assertNotNull(createdAddress);
		assertEquals("address", createdAddress.getAddress());
		assertEquals("city", createdAddress.getCity());
		assertEquals("pinCode", createdAddress.getPinCode());
		assertEquals(AddressType.CORRESPONDENCE, createdAddress.getType());
	}
	
	@Test
	@Sql(scripts = { "/sql/clearAddresses.sql","/sql/clearUserRoles.sql","/sql/clearUsers.sql","/sql/createUsers.sql","/sql/createAddresses.sql"})
	public void test_should_return_addresses_for_given_user_id_and_tenant() {
		final List<Address> actualAddresses = addressRepository.find(1L, "ap.public");

		assertNotNull(actualAddresses);
		assertEquals(2, actualAddresses.size());
	}
	
	@Test
	@Sql(scripts = { "/sql/clearAddresses.sql","/sql/clearUserRoles.sql","/sql/clearUsers.sql","/sql/createUsers.sql","/sql/createAddresses.sql"})
	public void test_should_delete_all_associated_addresses() {
		final List<Address> domainAddresses = Collections.emptyList();
		addressRepository.update(domainAddresses, 1L, "ap.public");
	}
	
	@Test
	@Sql(scripts = { "/sql/clearAddresses.sql","/sql/clearUserRoles.sql","/sql/clearUsers.sql","/sql/createUsers.sql","/sql/createAddresses.sql"})
	public void test_should_delete_addresses_that_are_not_specified() {
		final Address domainAddress1 = Address.builder()
				.type(AddressType.CORRESPONDENCE)
				.build();
		final List<Address> domainAddresses = Collections.singletonList(domainAddress1);
		addressRepository.update(domainAddresses, 1L, "ap.public");
	}
	
	@Test
	@Sql(scripts = { "/sql/clearAddresses.sql","/sql/clearUserRoles.sql","/sql/clearUsers.sql","/sql/createUsers.sql","/sql/createAddresses.sql"})
	public void test_should_save_new_addresses() {
		final Address domainAddress1 = Address.builder()
				.type(AddressType.CORRESPONDENCE)
				.pinCode("pinCode")
				.city("city")
				.address("address")
				.build();
		final Address domainAddress2 = Address.builder()
				.type(AddressType.PERMANENT)
				.address("address1")
				.city("city1")
				.pinCode("pin1")
				.build();
		final List<Address> domainAddresses = Arrays.asList(domainAddress1, domainAddress2);
		addressRepository.update(domainAddresses, 1L, "ap.public");

	}

	@Test
	@Sql(scripts = { "/sql/clearAddresses.sql","/sql/clearUserRoles.sql","/sql/clearUsers.sql","/sql/createUsers.sql","/sql/createAddresses.sql"})
	public void test_should_update_existing_addresses() {
		final Address domainAddress1 = Address.builder()
				.type(AddressType.PERMANENT)
				.pinCode("pin2")
				.city("new city")
				.address("new address")
				.build();
		final List<Address> domainAddresses = Collections.singletonList(domainAddress1);
		addressRepository.update(domainAddresses, 1L, "ap.public");
	}


}