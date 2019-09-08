package org.egov.user.web.contract;

import org.junit.Test;

import java.util.Calendar;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

public class RoleRequestTest {

    @Test
    public void test_model_to_contract_conversion() throws Exception {
        Calendar calendar = Calendar.getInstance();
        calendar.set(1990, Calendar.JULY, 1);
        Date date = calendar.getTime();

        org.egov.user.domain.model.Role domainRole = org.egov.user.domain.model.Role.builder()
                .name("name of the roleRequest 1")
                .code("code")
                .description("description")
                .createdBy(1L)
                .lastModifiedBy(1L)
                .createdDate(date)
                .lastModifiedDate(date)
                .build();

        RoleRequest roleRequest = new RoleRequest(domainRole);

        assertThat(roleRequest.getName()).isEqualTo("name of the roleRequest 1");
        assertThat(roleRequest.getCode()).isEqualTo("code");
    }
}