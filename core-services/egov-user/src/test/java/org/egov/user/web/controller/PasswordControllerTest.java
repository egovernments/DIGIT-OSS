package org.egov.user.web.controller;

import org.egov.user.Resources;
import org.egov.user.TestConfiguration;
import org.egov.user.domain.model.NonLoggedInUserUpdatePasswordRequest;
import org.egov.user.domain.service.UserService;
import org.egov.user.security.CustomAuthenticationKeyGenerator;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(PasswordController.class)
@Import(TestConfiguration.class)
public class PasswordControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private UserService userService;
	
	@MockBean
	private JdbcTemplate jdbcTemplate;
	
	@MockBean
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	
	@MockBean
    private CustomAuthenticationKeyGenerator authenticationKeyGenerator;

	private Resources resources = new Resources();

	@Test
	@WithMockUser
	public void test_should_update_password_for_logged_in_user() throws Exception {
		mockMvc.perform(post("/password/_update")
				.contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(resources.getFileContents("loggedInUserUpdatePasswordRequest.json")))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(resources.getFileContents("updatePasswordResponse.json")));

//		final LoggedInUserUpdatePasswordRequest expectedRequest = LoggedInUserUpdatePasswordRequest.builder()
//				.existingPassword("oldPassword")
//				.newPassword("newPassword")
//				.userName("greenfish424")
//				.tenantId("foo")
//				.build();
//
//		verify(userService).updatePasswordForLoggedInUser(expectedRequest);
	}

	@Test
	@WithMockUser
	public void test_should_update_password_for_non_logged_in_user() throws Exception {
		mockMvc.perform(post("/password/nologin/_update")
				.contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(resources.getFileContents("nonLoggedInUserUpdatePasswordRequest.json")))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(resources.getFileContents("updatePasswordResponse.json")));

		final NonLoggedInUserUpdatePasswordRequest expectedRequest = NonLoggedInUserUpdatePasswordRequest.builder()
				.tenantId("tenant")
				.newPassword("newPassword")
				.otpReference("otpReference")
				.userName("userName")
				.build();

		verify(userService).updatePasswordForNonLoggedInUser(expectedRequest);
	}

}