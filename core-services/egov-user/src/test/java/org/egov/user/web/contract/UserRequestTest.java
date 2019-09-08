package org.egov.user.web.contract;

import org.egov.user.domain.model.Address;
import org.egov.user.domain.model.Role;
import org.egov.user.domain.model.User;
import org.egov.user.domain.model.enums.*;
import org.junit.Test;

import java.util.*;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.junit.Assert.*;

public class UserRequestTest {

    @Test
    public void test_domain_to_contract_conversion() {
        User domainUser = getUser();

        UserRequest userRequestContract = new UserRequest(domainUser);

        assertThat(userRequestContract.getId()).isEqualTo(domainUser.getId());
        assertThat(userRequestContract.getUserName()).isEqualTo(domainUser.getUsername());
        assertThat(userRequestContract.getSalutation()).isEqualTo(domainUser.getSalutation());
        assertThat(userRequestContract.getName()).isEqualTo(domainUser.getName());
        assertThat(userRequestContract.getGender()).isEqualTo(domainUser.getGender().toString());
        assertThat(userRequestContract.getMobileNumber()).isEqualTo(domainUser.getMobileNumber());
        assertThat(userRequestContract.getEmailId()).isEqualTo(domainUser.getEmailId());
        assertThat(userRequestContract.getAltContactNumber()).isEqualTo(domainUser.getAltContactNumber());
        assertThat(userRequestContract.getPan()).isEqualTo(domainUser.getPan());
        assertThat(userRequestContract.getAadhaarNumber()).isEqualTo(domainUser.getAadhaarNumber());
        assertThat(userRequestContract.getPermanentAddress()).isEqualTo("post office");
        assertThat(userRequestContract.getPermanentCity()).isEqualTo("city/town/village 1");
        assertThat(userRequestContract.getPermanentPinCode()).isEqualTo("pincode 1");
        assertThat(userRequestContract.getCorrespondenceAddress()).isEqualTo("post office");
        assertThat(userRequestContract.getCorrespondenceCity()).isEqualTo("city/town/village 2");
        assertThat(userRequestContract.getCorrespondencePinCode()).isEqualTo("pincode 2");
        assertThat(userRequestContract.getActive()).isEqualTo(domainUser.getActive());
        assertThat(userRequestContract.getDob()).isEqualTo(domainUser.getDob());
        assertThat(userRequestContract.getPwdExpiryDate()).isEqualTo(domainUser.getPasswordExpiryDate());
        assertThat(userRequestContract.getLocale()).isEqualTo(domainUser.getLocale());
        assertThat(userRequestContract.getType()).isEqualTo(domainUser.getType());
        assertThat(userRequestContract.getAccountLocked()).isEqualTo(domainUser.getAccountLocked());
        assertThat(userRequestContract.getFatherOrHusbandName()).isEqualTo(domainUser.getGuardian());
        assertThat(userRequestContract.getSignature()).isEqualTo(domainUser.getSignature());
        assertThat(userRequestContract.getBloodGroup()).isEqualTo(domainUser.getBloodGroup().getValue());
        assertThat(userRequestContract.getPhoto()).isEqualTo(domainUser.getPhoto());
        assertThat(userRequestContract.getIdentificationMark()).isEqualTo(domainUser.getIdentificationMark());
        assertThat(userRequestContract.getRoles().iterator().next().getName()).isEqualTo("name of the role 1");
        assertThat(userRequestContract.getCreatedBy()).isEqualTo(1L);
        assertThat(userRequestContract.getCreatedDate()).isEqualTo(domainUser.getCreatedDate());
        assertThat(userRequestContract.getLastModifiedBy()).isEqualTo(2L);
        assertThat(userRequestContract.getLastModifiedDate()).isEqualTo(domainUser.getLastModifiedDate());
    }

    @Test
    public void test_contract_to_domain_conversion() {
        UserRequest userRequest = buildUserRequest();

		final long loggedInUserId = 345L;
		User userForCreate = userRequest.toDomain(loggedInUserId, true);

        Calendar c = Calendar.getInstance(TimeZone.getTimeZone("GMT"));
        c.set(2017, 1, 1, 1, 1, 1);
        String expectedDate = c.getTime().toString();

        assertEquals("Kroorveer", userForCreate.getName());
        assertEquals("yakku", userForCreate.getUsername());
        assertEquals("Dr.", userForCreate.getSalutation());
        assertEquals("8967452310", userForCreate.getMobileNumber());
        assertEquals("kroorkool@maildrop.cc", userForCreate.getEmailId());
        assertEquals("0987654321", userForCreate.getAltContactNumber());
        assertEquals("KR12345J", userForCreate.getPan());
        assertEquals("qwerty-1234567", userForCreate.getAadhaarNumber());
        assertEquals(Long.valueOf(loggedInUserId), userForCreate.getLoggedInUserId());
        assertTrue(userForCreate.getActive());
        assertEquals(expectedDate, userForCreate.getDob().toString());
        assertEquals(expectedDate, userForCreate.getPasswordExpiryDate().toString());
        assertEquals("en_IN", userForCreate.getLocale());
        assertEquals(UserType.CITIZEN, userForCreate.getType());
        assertFalse(userForCreate.getAccountLocked());
        assertEquals("signature", userForCreate.getSignature());
        assertEquals("myPhoto", userForCreate.getPhoto());
        assertEquals("hole in the mole", userForCreate.getIdentificationMark());
        assertEquals(Gender.MALE, userForCreate.getGender());
        assertEquals(BloodGroup.O_POSITIVE, userForCreate.getBloodGroup());
        assertNotNull(userForCreate.getLastModifiedDate());
        assertNotNull(userForCreate.getCreatedDate());
        assertNotEquals(expectedDate, userForCreate.getLastModifiedDate().toString());
        assertNotEquals(expectedDate, userForCreate.getCreatedDate().toString());
		final Set<Role> roles = userForCreate.getRoles();
		assertEquals(1, roles.size());
		assertEquals("CITIZEN", roles.iterator().next().getCode());
        assertEquals("ap.public", userForCreate.getTenantId());
        assertEquals("otpreference1", userForCreate.getOtpReference());
        assertEquals("!abcd1234", userForCreate.getPassword());
    }

	private UserRequest buildUserRequest() {
        Set<RoleRequest> roles = new HashSet<>();
        roles.add(RoleRequest.builder().code("CITIZEN").build());
        roles.add(RoleRequest.builder().code("CITIZEN").build());
        return getUserBuilder(roles).build();
    }

    private UserRequest.UserRequestBuilder getUserBuilder(Set<RoleRequest> roles) {
        Calendar c = Calendar.getInstance(TimeZone.getTimeZone("GMT"));
        c.set(2017, 1, 1, 1, 1, 1);
        Date dateToTest = c.getTime();
        return UserRequest.builder()
                .name("Kroorveer")
                .userName("yakku")
                .salutation("Dr.")
                .mobileNumber("8967452310")
                .emailId("kroorkool@maildrop.cc")
                .altContactNumber("0987654321")
                .pan("KR12345J")
                .aadhaarNumber("qwerty-1234567")
                .active(Boolean.TRUE)
                .dob(dateToTest)
                .pwdExpiryDate(dateToTest)
                .locale("en_IN")
                .type(UserType.CITIZEN)
                .accountLocked(Boolean.FALSE)
                .signature("signature")
                .photo("myPhoto")
                .identificationMark("hole in the mole")
                .gender("Male")
                .bloodGroup("O_positive")
                .lastModifiedDate(dateToTest)
                .createdDate(dateToTest)
                .tenantId("ap.public")
                .otpReference("otpreference1")
                .password("!abcd1234")
                .roles(roles);
    }

    private User getUser() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(1990, Calendar.JULY, 1);
        Date date = calendar.getTime();

        return User.builder()
                .id(1L)
                .username("userName")
                .salutation("salutation")
                .name("name")
                .gender(Gender.FEMALE)
                .mobileNumber("mobileNumber1")
                .emailId("email")
                .altContactNumber("mobileNumber2")
                .pan("pan")
                .aadhaarNumber("aadhaarNumber")
                .permanentAddress(getPermanentAddress())
                .correspondenceAddress(getCorrespondenceAddress())
                .active(true)
                .dob(date)
                .passwordExpiryDate(date)
                .locale("en_IN")
                .type(UserType.CITIZEN)
                .accountLocked(false)
                .roles(getListOfRoles())
                .guardian("name of relative")
                .guardianRelation(GuardianRelation.Father)
                .signature("7a9d7f12-bdcb-4487-9d43-709838a0ad39")
                .bloodGroup(BloodGroup.A_POSITIVE)
                .photo("3b26fb49-e43d-401b-899a-f8f0a1572de0")
                .identificationMark("identification mark")
                .createdBy(1L)
                .createdDate(date)
                .lastModifiedBy(2L)
                .lastModifiedDate(date)
                .build();
    }

    private Address getPermanentAddress() {
		return Address.builder()
				.type(AddressType.PERMANENT)
				.city("city/town/village 1")
				.address("post office")
				.pinCode("pincode 1")
				.build();
	}

	private Address getCorrespondenceAddress() {
    	return Address.builder()
				.type(AddressType.CORRESPONDENCE)
				.city("city/town/village 2")
				.address("post office")
				.pinCode("pincode 2")
				.build();
	}

    private Set<Role> getListOfRoles() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(1990, Calendar.JULY, 1);

        Role role1 = Role.builder()
                .name("name of the role 1")
                .description("description")
                .createdBy(1L)
                .createdDate(calendar.getTime())
                .lastModifiedBy(1L)
                .lastModifiedDate(calendar.getTime())
                .build();

        Role role2 = Role.builder()
                .name("name of the role 2")
                .description("description")
                .createdBy(1L)
                .createdDate(calendar.getTime())
                .lastModifiedBy(1L)
                .lastModifiedDate(calendar.getTime())
                .build();

        return new HashSet<>(Arrays.asList(role1, role2));
    }
}