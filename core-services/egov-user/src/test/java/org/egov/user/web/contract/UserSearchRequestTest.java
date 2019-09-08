package org.egov.user.web.contract;

import org.egov.user.domain.model.UserSearchCriteria;
import org.egov.user.domain.model.enums.UserType;
import org.junit.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class UserSearchRequestTest {

    @Test
    public void test_to_domain() throws Exception {
        List<Long> ids = Arrays.asList(1L, 2L, 3L);
        UserSearchRequest userSearchRequest = new UserSearchRequest();
        userSearchRequest.setId(ids);
        userSearchRequest.setUserName("userName");
        userSearchRequest.setName("name");
        userSearchRequest.setMobileNumber("mobileNumber");
        userSearchRequest.setAadhaarNumber("aadhaarNumber");
        userSearchRequest.setEmailId("emailId");
        userSearchRequest.setPan("pan");
        userSearchRequest.setFuzzyLogic(false);
        userSearchRequest.setActive(true);
        userSearchRequest.setUserType("CITIZEN");

        UserSearchCriteria userSearch = userSearchRequest.toDomain();

        assertThat(userSearch.getId()).isEqualTo(ids);
        assertThat(userSearch.getUserName()).isEqualTo("userName");
        assertThat(userSearch.getName()).isEqualTo("name");
        assertThat(userSearch.getMobileNumber()).isEqualTo("mobileNumber");
        assertThat(userSearch.getEmailId()).isEqualTo("emailId");
        assertThat(userSearch.isFuzzyLogic()).isFalse();
        assertThat(userSearch.getActive()).isTrue();
        assertThat(userSearch.getLimit()).isEqualTo(0);
        assertThat(userSearch.getOffset()).isEqualTo(0);
        assertThat(userSearch.getSort()).isEqualTo(Collections.singletonList("name"));
        assertThat(userSearch.getType()).isEqualTo(UserType.CITIZEN);
    }
}