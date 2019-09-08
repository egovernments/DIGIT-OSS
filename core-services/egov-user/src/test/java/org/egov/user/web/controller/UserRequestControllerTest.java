package org.egov.user.web.controller;

import org.apache.commons.io.IOUtils;
import org.egov.user.TestConfiguration;
import org.egov.user.domain.exception.DuplicateUserNameException;
import org.egov.user.domain.exception.OtpValidationPendingException;
import org.egov.user.domain.exception.UserNotFoundException;
import org.egov.user.domain.model.Role;
import org.egov.user.domain.model.User;
import org.egov.user.domain.model.UserSearchCriteria;
import org.egov.user.domain.model.enums.BloodGroup;
import org.egov.user.domain.model.enums.Gender;
import org.egov.user.domain.model.enums.UserType;
import org.egov.user.domain.service.TokenService;
import org.egov.user.domain.service.UserService;
import org.egov.user.security.CustomAuthenticationKeyGenerator;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(UserController.class)
@Import(TestConfiguration.class)
public class UserRequestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private UserService userService;

    @MockBean
    private TokenService tokenService;
    
    @MockBean
    private CustomAuthenticationKeyGenerator authenticationKeyGenerator;

/*
    @Test
    @WithMockUser
    public void testShouldThrowErrorWhileRegisteringWithInvalidCitizen() throws Exception {
        InvalidUserCreateException exception = new InvalidUserCreateException(org.egov.user.domain.model.User.builder().build());
        when(userService.createCitizen(any(org.egov.user.domain.model.User.class))).thenThrow(exception);

        String fileContents = getFileContents("createCitizenUnsuccessfulRequest.json");
        mockMvc.perform(post("/citizen/_create/")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(fileContents)
        )
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().json(getFileContents("createCitizenUnsuccessfulResponse.json")));
    }
*/

    @Ignore
    @Test
    @WithMockUser
    public void testShouldThrowErrorWhileRegisteringCitizenWithPendingOtpValidation() throws Exception {
        OtpValidationPendingException exception = new OtpValidationPendingException();
        when(userService.createCitizen(any(org.egov.user.domain.model.User.class))).thenThrow(exception);

        String fileContents = getFileContents("createValidatedCitizenSuccessRequest.json");
        mockMvc.perform(post("/citizen/_create")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(fileContents)
        )
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().json(getFileContents("createCitizenOtpFailureResponse.json")));
    }

	private Date toDate(LocalDateTime localDateTime) {
		final ZonedDateTime expectedDateTime = ZonedDateTime.of(localDateTime, ZoneId.of("Asia/Calcutta"));
		return Date.from(expectedDateTime.toInstant());
	}

    private User buildUser() {
        Calendar c = Calendar.getInstance(TimeZone.getTimeZone("GMT"));
        c.set(1917, Calendar.MARCH, 8, 11, 15, 36);
		final Date expectedDOB = toDate(LocalDateTime.of(1986, 8, 4, 5, 30));

		c.set(2017, Calendar.FEBRUARY, 8, 11, 15, 36);
        Date createdDate = c.getTime();
        c.set(2018, Calendar.FEBRUARY, 8, 11, 15, 36);
        Date pwdExpiryDate = c.getTime();
        Role role = Role.builder()
                .name("CITIZEN")
                .description("Citizen role")
                .build();
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        return User.builder()
                .id(12L)
                .name("Jamaal Bhai")
                .username("jamaalbhai")
                .salutation("dawakhana@charminar")
                .gender(Gender.MALE)
                .mobileNumber("9988776655")
                .emailId("jamalbhai@maildrop.cc")
                .pan("AITGC5624P")
                .aadhaarNumber("96a70a9a-03bd-11e7-93ae-92361f002671")
                .active(Boolean.TRUE)
                .dob(expectedDOB)
                .passwordExpiryDate(pwdExpiryDate)
                .locale("en_IN")
                .type(UserType.CITIZEN)
                .accountLocked(Boolean.FALSE)
                .bloodGroup(BloodGroup.O_POSITIVE)
                .identificationMark("Head is missing on the body")
                .createdDate(createdDate)
                .lastModifiedDate(createdDate)
                .createdBy(22L)
                .lastModifiedBy(22L)
                .roles(roles)
                .build();
    }

    private String getFileContents(String fileName) {
        try {
            return IOUtils.toString(this.getClass().getClassLoader().getResourceAsStream(fileName), "UTF-8");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    @WithMockUser
    public void testShouldUpdateACitizen() throws Exception {
        when(userService.updateWithoutOtpValidation(any(org.egov.user.domain.model.User.class))).thenReturn(buildUser());

        String fileContents = getFileContents("updateValidatedCitizenSuccessRequest.json");
        mockMvc.perform(post("/users/_updatenovalidate")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(fileContents)
        )
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().json(getFileContents("updateValidatedCitizenSuccessResponse.json")));
    }

    @Test
    @WithMockUser
    @Ignore
    public void testShouldThrowErrorWhileUpdatingWithDuplicateCitizen() throws Exception {
        DuplicateUserNameException exception = new DuplicateUserNameException(UserSearchCriteria.builder().userName
                ("test").build());
        when(userService.updateWithoutOtpValidation( any(org.egov.user.domain.model.User.class))).thenThrow(exception);

        String fileContents = getFileContents("updateCitizenUnsuccessfulRequest.json");
        mockMvc.perform(post("/users/1/_updatenovalidate")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(fileContents)
        )
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().json(getFileContents("updateCitizenUnsuccessfulResponse.json")));
    }

    @Test
    @WithMockUser
    @Ignore
    public void testShouldThrowErrorWhileUpdatingWithInvalidCitizen() throws Exception {
        UserNotFoundException exception = new UserNotFoundException(UserSearchCriteria.builder().userName
                ("test").build());
        when(userService.updateWithoutOtpValidation(any(org.egov.user.domain.model.User.class))).thenThrow(exception);

        String fileContents = getFileContents("updateCitizenUnsuccessfulRequest.json");
        mockMvc.perform(post("/users/1/_updatenovalidate")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(fileContents)
        )
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().json(getFileContents("updateInvalidCitizenUnsuccessfulResponse.json")));
    }
}
