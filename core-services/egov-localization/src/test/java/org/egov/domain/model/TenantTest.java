package org.egov.domain.model;

import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

public class TenantTest {

    private static final String NEW_TENANT = "tenant1";
    private static final String NEW_TENANT_ABCD = "a.b.c.d";
    private static final String ASSERT_EQUALS_TENANT_ABC = "a.b.c";
    private static final String ASSERT_EQUALS_TENANT_DEFAULT = "default";

    @Test
    public void test_equality_should_return_true_when_both_instances_have_same_tenant_id() {
        final Tenant tenant1 = new Tenant(NEW_TENANT);
        final Tenant tenant2 = new Tenant(NEW_TENANT);

        assertTrue(tenant1.equals(tenant2));
    }

    @Test
    public void test_hashcode_should_be_same_when_both_instances_have_same_tenant_id() {
        final Tenant tenant1 = new Tenant(NEW_TENANT);
        final Tenant tenant2 = new Tenant(NEW_TENANT);

        assertEquals(tenant1.hashCode(), tenant2.hashCode());
    }

    @Test
    public void test_equality_should_return_false_when_both_instances_have_different_tenant_id() {
        final Tenant tenant1 = new Tenant(NEW_TENANT);
        final Tenant tenant2 = new Tenant("tenant2");

        assertFalse(tenant1.equals(tenant2));
    }

    @Test
    public void test_hashcode_should_be_different_when_both_instances_have_different_tenant_id() {
        final Tenant tenant1 = new Tenant(NEW_TENANT);
        final Tenant tenant2 = new Tenant("tenant2");

        assertNotEquals(tenant1.hashCode(), tenant2.hashCode());
    }

    @Test
    public void test_should_split_name_spaced_tenant_code_to_hierarchy_list() {
        final Tenant tenant = new Tenant(NEW_TENANT_ABCD);

        final List<Tenant> tenantHierarchyList = tenant.getTenantHierarchy();

        assertEquals(5, tenantHierarchyList.size());
        assertEquals(new Tenant(NEW_TENANT_ABCD), tenantHierarchyList.get(0));
        assertEquals(new Tenant(ASSERT_EQUALS_TENANT_ABC), tenantHierarchyList.get(1));
        assertEquals(new Tenant("a.b"), tenantHierarchyList.get(2));
        assertEquals(new Tenant("a"), tenantHierarchyList.get(3));
        assertEquals(new Tenant(ASSERT_EQUALS_TENANT_DEFAULT), tenantHierarchyList.get(4));
    }

    @Test
    public void test_should_return_default_tenant_along_with_tenant_id_when_namespace_not_present() {
        final Tenant tenant = new Tenant("a");

        final List<Tenant> tenantHierarchyList = tenant.getTenantHierarchy();

        assertEquals(2, tenantHierarchyList.size());
        assertEquals(new Tenant("a"), tenantHierarchyList.get(0));
        assertEquals(new Tenant(ASSERT_EQUALS_TENANT_DEFAULT), tenantHierarchyList.get(1));
    }

    @Test
    public void test_is_default_tenant_should_return_true_when_tenant_is_default() {
        final Tenant tenant = new Tenant(ASSERT_EQUALS_TENANT_DEFAULT);

        assertTrue(tenant.isDefaultTenant());
    }

    @Test
    public void test_is_default_tenant_should_return_false_when_tenant_is_not_default() {
        final Tenant tenant = new Tenant(ASSERT_EQUALS_TENANT_ABC);

        assertFalse(tenant.isDefaultTenant());
    }

    @Test
    public void test_is_more_specific_compared_to_should_return_false_when_other_tenant_has_same_id() {
        final Tenant tenant = new Tenant(ASSERT_EQUALS_TENANT_ABC);

        assertFalse(tenant.isMoreSpecificComparedTo(new Tenant(ASSERT_EQUALS_TENANT_ABC)));
    }

    @Test
    public void test_is_more_specific_compared_to_should_return_false_when_other_tenant_is_more_specific_in_hierarchy() {
        final Tenant tenant = new Tenant(ASSERT_EQUALS_TENANT_ABC);

        assertFalse(tenant.isMoreSpecificComparedTo(new Tenant(NEW_TENANT_ABCD)));
    }

    @Test
    public void test_is_more_specific_compared_to_should_return_false_when_other_tenant_is_of_different_hierarchy() {
        final Tenant tenant = new Tenant(ASSERT_EQUALS_TENANT_ABC);

        assertFalse(tenant.isMoreSpecificComparedTo(new Tenant("d.e")));
    }

    @Test
    public void test_is_more_specific_compared_to_should_return_true_when_other_tenant_is_less_specific_in_hierarchy() {
        final Tenant tenant = new Tenant(NEW_TENANT_ABCD);

        assertTrue(tenant.isMoreSpecificComparedTo(new Tenant("a.b")));
    }

}