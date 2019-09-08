package org.egov.user.persistence.repository;

import org.egov.tracer.model.CustomException;
import org.egov.user.Resources;
import org.egov.user.domain.exception.InvalidRoleCodeException;
import org.egov.user.domain.model.Address;
import org.egov.user.domain.model.Role;
import org.egov.user.domain.model.User;
import org.egov.user.domain.model.UserSearchCriteria;
import org.egov.user.domain.model.enums.AddressType;
import org.egov.user.domain.model.enums.BloodGroup;
import org.egov.user.domain.model.enums.Gender;
import org.egov.user.domain.model.enums.UserType;
import org.egov.user.repository.builder.UserTypeQueryBuilder;
import org.egov.user.repository.rowmapper.UserResultSetExtractor;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
public class UserRepositoryTest {

	@Autowired
	private AddressRepository addressRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private UserTypeQueryBuilder userTypeQueryBuilder;

	@Autowired
	private UserResultSetExtractor userResultSetExtractor;

	private UserRepository userRepository;

	private MockRestServiceServer server;

	@Autowired
	private RestTemplate restTemplate;

	@Before
	public void before() {

		server = MockRestServiceServer.bindTo(restTemplate).build();

		server.expect(once(), requestTo("http://localhost:8094/egov-mdms-service/v1/_search"))
				.andExpect(method(HttpMethod.POST))
				.andRespond(withSuccess(new Resources().getFileContents("roleSearchValidatedResponse.json"),
						MediaType.APPLICATION_JSON_UTF8));

		userRepository = new UserRepository(roleRepository, userTypeQueryBuilder,  addressRepository,
                userResultSetExtractor,
				jdbcTemplate, namedParameterJdbcTemplate);
	}

	@Test
	@Sql(scripts = { "/sql/clearUserRoles.sql","/sql/clearUsers.sql", "/sql/createUsers.sql" })
	public void test_should_return_true_when_user_exists_with_given_user_name_and_tenant() {
		boolean isPresent = userRepository.isUserPresent("bigcat399", "ap.public", UserType.EMPLOYEE);

		assertTrue(isPresent);
	}

	@Test
	public void test_should_return_false_when_user_does_not_exist_with_given_user_name_and_tenant() {
		boolean isPresent = userRepository.isUserPresent("userName", "ap.public", UserType.EMPLOYEE);

		assertFalse(isPresent);
	}

	@Test
	@Sql(scripts = { "/sql/clearUserRoles.sql","/sql/clearUsers.sql", "/sql/createUsers.sql", "/sql/createUserRoles" +
            ".sql" })
	public void test_get_user_by_userName() {
        User user = userRepository.findAll(UserSearchCriteria.builder().userName("bigcat399")
                .tenantId("ap.public").type(UserType.EMPLOYEE).build()).get(0);
		assertThat(user.getId().equals(1l));
		assertThat(user.getUsername().equals("bigcat399"));
		assertThat(user.getMobileNumber().equals("9731123456"));
		assertThat(user.getEmailId().equals("kay.alexander@example.com"));
		assertThat(user.getTenantId().equals("ap.public"));
	}


	@Test
	@Sql(scripts = { "/sql/clearUserRoles.sql", "/sql/clearUsers.sql", "/sql/clearRoles.sql", "/sql/createRoles.sql" })
	public void test_should_save_entity_user() {
		final Set<Role> roles = new HashSet<>();
		final String roleCode = "EMP";
		roles.add(Role.builder().code(roleCode).tenantId("ap.public").build());
		User domainUser = User.builder().roles(roles).name("test1").username("TestUserName").password("password")
				.emailId("Test@gmail.com").aadhaarNumber("AadharNumber").mobileNumber("1234567890").active(true)
				.gender(Gender.FEMALE).bloodGroup(BloodGroup.A_NEGATIVE).accountLocked(true).loggedInUserId(10l)
				.createdBy(10l).tenantId("ap.public").build();
		User actualUser = userRepository.create(domainUser);

		assertThat(actualUser != null);
		assertThat(actualUser.getId().equals(1l));
		assertThat(actualUser.getRoles().size() == 1l);
		assertThat(actualUser.getUsername().equals("TestUserName"));
		assertThat(actualUser.getEmailId().equals("Test@gmail.com"));
		assertThat(actualUser.getAadhaarNumber().equals("AadharNumber"));
		assertThat(actualUser.getMobileNumber().equals("1234567890"));
		assertThat(actualUser.getGender().toString().equals("FEMALE"));
		assertThat(actualUser.getCreatedBy().equals(10l));
		assertThat(actualUser.getLastModifiedBy().equals(10l));
		assertThat(actualUser.getTenantId().equals("ap.public"));
	}

	@Test
	@Sql(scripts = { "/sql/clearUserRoles.sql", "/sql/clearUsers.sql", "/sql/clearRoles.sql", "/sql/createRoles.sql",
			"/sql/clearAddresses.sql" })
	public void test_should_save_correspondence_address_on_creating_new_user() {
		Address correspondenceAddress = Address.builder().address("address").type(AddressType.CORRESPONDENCE)
				.addressType("CORRESPONDENCE").city("city").pinCode("123").build();
		final Set<Role> roles = new HashSet<>();
		final String roleCode = "EMP";
		roles.add(Role.builder().code(roleCode).tenantId("ap.public").build());
		User domainUser = User.builder().roles(roles)
				.username("TestUserName").password("password").tenantId("ap.public")
				.correspondenceAddress(correspondenceAddress).build();
		User actualUser = userRepository.create(domainUser);

		assertThat(actualUser != null);
		assertThat(actualUser.getId().equals(1l));
		assertThat(actualUser.getRoles().size() == 1l);
		assertThat(actualUser.getUsername().equals("TestUserName"));
		assertThat(actualUser.getTenantId().equals("ap.public"));
		assertThat(actualUser.getCorrespondenceAddress() != null);
		assertThat(actualUser.getCorrespondenceAddress().getAddressType().toString().equals("CORRESPONDENCE"));
		assertThat(actualUser.getCorrespondenceAddress().getCity().equals("city"));
		assertThat(actualUser.getCorrespondenceAddress().getAddress().equals("address"));
		assertThat(actualUser.getCorrespondenceAddress().getPinCode().equals("123"));
	}

	@Test
	@Sql(scripts = { "/sql/clearUserRoles.sql", "/sql/clearUsers.sql", "/sql/clearRoles.sql", "/sql/createRoles.sql",
			"/sql/clearAddresses.sql" })
	public void test_should_save_permanent_address_on_creating_new_user() {
		Address permanentAddress = Address.builder().address("address").type(AddressType.PERMANENT)
				.addressType("PERMANENT").city("city").pinCode("123").build();
		final Set<Role> roles = new HashSet<>();
		final String roleCode = "EMP";
		roles.add(Role.builder().code(roleCode).tenantId("ap.public").build());
		User domainUser = User.builder().roles(roles)
				.username("TestUserName").password("password").tenantId("ap.public").permanentAddress(permanentAddress)
				.build();
		User actualUser = userRepository.create(domainUser);

		assertThat(actualUser != null);
		assertThat(actualUser.getId().equals(1l));
		assertThat(actualUser.getRoles().size() == 1l);
		assertThat(actualUser.getUsername().equals("TestUserName"));
		assertThat(actualUser.getTenantId().equals("ap.public"));
		assertThat(actualUser.getPermanentAddress() != null);
		assertThat(actualUser.getPermanentAddress().getAddressType().toString().equals("PERMANENT"));
		assertThat(actualUser.getPermanentAddress().getCity().equals("city"));
		assertThat(actualUser.getPermanentAddress().getAddress().equals("address"));
		assertThat(actualUser.getPermanentAddress().getPinCode().equals("123"));
	}

	@Test(expected = CustomException.class)
	public void test_should_throw_exception_when_role_does_not_exist_for_given_role_code() {
		final String roleCode = "roleCode1";
		final org.egov.user.domain.model.Role domainRole = org.egov.user.domain.model.Role.builder().name(roleCode)
				.build();
		User domainUser = User.builder()
				.tenantId("ap.p")
				.roles(Collections.singleton(domainRole)).build();
		userRepository.create(domainUser);
	}

	@Test
	@Sql(scripts = { "/sql/clearUserRoles.sql", "/sql/clearUsers.sql", "/sql/clearRoles.sql", "/sql/createRoles.sql",
			"/sql/clearAddresses.sql" })
	public void test_should_set_encrypted_password_to_new_user() {
		final Set<Role> roles = new HashSet<>();
		final String roleCode = "EMP";
		roles.add(org.egov.user.domain.model.Role.builder().code(roleCode).tenantId("ap.public").build());
		final String rawPassword = "rawPassword";
		User domainUser = User.builder().roles(roles)
				.username("Test UserName").password(rawPassword).tenantId("ap.public").build();
		User actualUser = userRepository.create(domainUser);
		assertThat(actualUser != null);
		assertThat(actualUser.getId().equals(1l));
		assertThat(actualUser.getPassword().equals("$2a$10$begnxh5azaFpAv0yDe7sQ./uDzp2H4Xy7SrEmY/9JV2qB/cHFha5m"));
	}

	@Test
	@Sql(scripts = { "/sql/clearUserRoles.sql", "/sql/clearUsers.sql", "/sql/clearRoles.sql", "/sql/createRoles.sql",
			"/sql/clearAddresses.sql" })
	public void test_should_save_new_user_when_enriched_roles() {

		final Set<Role> roles = new HashSet<>();
		roles.add(Role.builder().code("EMP").tenantId("ap.public").build());
		roles.add(Role.builder().code("EADMIN").tenantId("ap.public").build());
		User domainUser = User.builder().roles(roles).username("Test UserName").password("pasword")
				.tenantId("ap.public").build();
		User actualUser = userRepository.create(domainUser);
		assertThat(actualUser != null);
		assertThat(actualUser.getId().equals(1l));
		assertThat(actualUser.getRoles().size() == 2);
	}

	@Test
	@Sql(scripts = { "/sql/clearUserRoles.sql", "/sql/clearUsers.sql", "/sql/clearRoles.sql", "/sql/createRoles.sql",
			"/sql/clearAddresses.sql", "/sql/createUsers.sql" })
	public void test_search_user_bytenant() {
		UserSearchCriteria userSearch = UserSearchCriteria.builder().tenantId("ap.public").build();
		List<User> actualList = userRepository.findAll(userSearch);
		assertThat(actualList.size() == 6);
	}
	
	@Test
	@Sql(scripts = { "/sql/clearUserRoles.sql", "/sql/clearUsers.sql", "/sql/clearRoles.sql", "/sql/createRoles.sql",
			"/sql/clearAddresses.sql", "/sql/createUsers.sql" })
	public void test_search_user_byId() {
		
		List<Long> idList = new ArrayList<Long>();
		idList.add(1l);
		idList.add(2l);
		idList.add(3l);
		UserSearchCriteria userSearch = UserSearchCriteria.builder().tenantId("ap.public").id(idList).build();
		List<User> actualList = userRepository.findAll(userSearch);
		assertThat(actualList.size() == 3);
	}
	
	@Test
	@Sql(scripts = { "/sql/clearUserRoles.sql", "/sql/clearUsers.sql", "/sql/clearRoles.sql", "/sql/createRoles.sql",
			"/sql/clearAddresses.sql", "/sql/createUsers.sql" })
	public void test_search_user_byemail() {

		UserSearchCriteria userSearch = UserSearchCriteria.builder().tenantId("ap.public").emailId("kay.alexander@example.com").build();
		List<User> actualList = userRepository.findAll(userSearch);
		assertThat(actualList.size() == 1);
	}
	
	@Test
	@Sql(scripts = { "/sql/clearUserRoles.sql", "/sql/clearUsers.sql", "/sql/clearRoles.sql", "/sql/createRoles.sql",
			"/sql/clearAddresses.sql", "/sql/createUsers.sql" })
	public void test_search_user_byUsername() {

		UserSearchCriteria userSearch = UserSearchCriteria.builder().tenantId("ap.public").userName("bigcat399").build();
		List<User> actualList = userRepository.findAll(userSearch);
		assertThat(actualList.size() == 1);
	}

	@Test
	@Sql(scripts = { "/sql/clearUserRoles.sql", "/sql/clearUsers.sql", "/sql/clearRoles.sql", "/sql/createRoles.sql",
			"/sql/clearAddresses.sql", "/sql/createUsers.sql" })
	public void test_search_user_byName() {

		UserSearchCriteria userSearch = UserSearchCriteria.builder().tenantId("ap.public").name("Kay Alexander").build();
		List<User> actualList = userRepository.findAll(userSearch);
		assertThat(actualList.size() == 1);
	}
	
	@Test
	@Sql(scripts = { "/sql/clearUserRoles.sql", "/sql/clearUsers.sql", "/sql/clearRoles.sql", "/sql/createRoles.sql",
			"/sql/clearAddresses.sql", "/sql/createUsers.sql" })
	public void test_search_user_bymobilenumber() {

		UserSearchCriteria userSearch = UserSearchCriteria.builder().tenantId("ap.public").mobileNumber("9731123456").build();
		List<User> actualList = userRepository.findAll(userSearch);
		assertThat(actualList.size() == 7);
	}
	
//	@Test
//	@Sql(scripts = { "/sql/clearUserRoles.sql", "/sql/clearUsers.sql", "/sql/clearRoles.sql", "/sql/createRoles.sql",
//			"/sql/clearAddresses.sql", "/sql/createUsers.sql" })
//	public void test_search_user_byadharnumberumber() {
//
//		UserSearchCriteria userSearch = UserSearchCriteria.builder().tenantId("ap.public").aadhaarNumber("12346789011").build();
//		List<User> actualList = userRepository.findAll(userSearch);
//		assertThat(actualList.size() == 7);
//	}
//
//	@Test
//	@Sql(scripts = { "/sql/clearUserRoles.sql", "/sql/clearUsers.sql", "/sql/clearRoles.sql", "/sql/createRoles.sql",
//			"/sql/clearAddresses.sql", "/sql/createUsers.sql" })
//	public void test_search_user_bypan() {
//
//		UserSearchCriteria userSearch = UserSearchCriteria.builder().tenantId("ap.public").pan("ABCDE1234F").build();
//		List<User> actualList = userRepository.findAll(userSearch);
//		assertThat(actualList.size() == 7);
//	}
	
	@Ignore
	@Sql(scripts = { "/sql/clearUserRoles.sql", "/sql/clearUsers.sql", "/sql/clearRoles.sql", "/sql/createRoles.sql",
			"/sql/clearAddresses.sql", "/sql/createUsers.sql" })
	public void test_search_user_bytype() {

		UserSearchCriteria userSearch = UserSearchCriteria.builder().tenantId("ap.public").type(UserType.EMPLOYEE)
				.build();
		List<User> actualList = userRepository.findAll(userSearch);
		assertThat(actualList.size() == 7);
	}
	
	@Test
	@Sql(scripts = { "/sql/clearUserRoles.sql", "/sql/clearUsers.sql", "/sql/clearRoles.sql", "/sql/createRoles.sql",
			"/sql/clearAddresses.sql", "/sql/createUsers.sql" })
	public void test_search_user_bytenantid() {

		UserSearchCriteria userSearch = UserSearchCriteria.builder().tenantId("ap.public").limit(2).build();
		List<User> actualList = userRepository.findAll(userSearch);
		assertThat(actualList.size() == 2);
	}

	@Ignore
	@Test
	public void test_should_update_entity_user() {
		final Set<Role> roles = new HashSet<>();
		final String roleCode = "EMP";
		roles.add(Role.builder().code(roleCode).build());
		User domainUser = User.builder().roles(roles).name("test1").id(1L).username("TestUserName").password("password")
				.emailId("Test@gmail.com").aadhaarNumber("AadharNumber").mobileNumber("1234567890").active(true)
				.gender(Gender.FEMALE).bloodGroup(BloodGroup.A_NEGATIVE).accountLocked(true).loggedInUserId(10L)
				.createdBy(10L).tenantId("ap.public").build();
		userRepository.update(domainUser, domainUser);
		User actualUser = userRepository.findAll(UserSearchCriteria.builder().userName("TestUserName").tenantId("ap" +
                ".public").type(UserType.CITIZEN)
                .build()).get(0);

		assertThat(actualUser != null);
		assertThat(actualUser.getId().equals(1L));
		assertThat(actualUser.getRoles().size() == 1L);
		assertThat(actualUser.getUsername().equals("TestUserName"));
		assertThat(actualUser.getEmailId().equals("Test@gmail.com"));
		assertThat(actualUser.getAadhaarNumber().equals("AadharNumber"));
		assertThat(actualUser.getGender().toString().equals("FEMALE"));
		assertThat(actualUser.getCreatedBy().equals(10L));
		assertThat(actualUser.getLastModifiedBy().equals(10L));
		assertThat(actualUser.getTenantId().equals("ap.public"));
	}
	
	@Ignore
	@Test(expected = InvalidRoleCodeException.class)
	public void test_should_throw_exception_when_updating_user_with_invalid_role_code() {
		final String roleCode = "roleCode1";
		final org.egov.user.domain.model.Role domainRole = org.egov.user.domain.model.Role.builder().name(roleCode)
				.build();
		User domainUser = User.builder()
				.roles(Collections.singleton(domainRole)).id(1L).tenantId("ap.public").build();
		userRepository.update(domainUser, domainUser);
	}

	@Test
    @Ignore
	public void test_should_return_user() {

		List<User> actualUsers = userRepository.findAll(UserSearchCriteria.builder().userName("bigcat399")
                .tenantId("ap.public").type(UserType.EMPLOYEE).build());
		assertTrue(!actualUsers.isEmpty());
	}

}
