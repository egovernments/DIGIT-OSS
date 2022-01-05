package org.egov.user.domain.model;

import org.junit.Test;

import static org.junit.Assert.*;

public class RoleTest {

    private static final String ROLE_DESCRIPTION = "description";

    @Test
    public void test_equals_should_return_true_when_code_is_same_for_both_instance() {
        final Role role1 = Role.builder().code("code").description("description1").build();
        final Role role2 = Role.builder().code("code").description("description2").build();

        assertTrue(role1.equals(role2));
    }

    @Test
    public void test_hashcode_should_match_when_code_is_same_for_both_instance() {
        final Role role1 = Role.builder().code("code").description("description1").build();
        final Role role2 = Role.builder().code("code").description("description2").build();

        assertEquals(role1.hashCode(), role2.hashCode());
    }

    @Test
    public void test_equals_should_return_false_when_code_is_different_for_both_instance() {
        final Role role1 = Role.builder().code("code1").description(ROLE_DESCRIPTION).build();
        final Role role2 = Role.builder().code("code2").description(ROLE_DESCRIPTION).build();

        assertFalse(role1.equals(role2));
    }

    @Test
    public void test_hashcode_should_differ_when_code_is_different_for_both_instance() {
        final Role role1 = Role.builder().code("code1").description(ROLE_DESCRIPTION).build();
        final Role role2 = Role.builder().code("code2").description(ROLE_DESCRIPTION).build();

        assertNotEquals(role1.hashCode(), role2.hashCode());
    }


}