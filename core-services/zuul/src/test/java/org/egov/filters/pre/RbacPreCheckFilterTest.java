package org.egov.filters.pre;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import com.netflix.zuul.context.RequestContext;

public class RbacPreCheckFilterTest {
    private MockHttpServletRequest request = new MockHttpServletRequest();

    private List<String> openEndpointsWhitelist = new ArrayList<>();
    private List<String> anonymousEndpointsWhitelist = new ArrayList<>();

    private RbacPreCheckFilter rbacPreCheckFilter;

    @Before
    public void init(){
        openEndpointsWhitelist.add("/user/_details");
        openEndpointsWhitelist.add("open-endpoint2");
        anonymousEndpointsWhitelist.add("/pgr/complaintTypeCategories");
        anonymousEndpointsWhitelist.add("anonymous-endpoint2");
        rbacPreCheckFilter = new RbacPreCheckFilter(openEndpointsWhitelist, anonymousEndpointsWhitelist);
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.clear();
        ctx.setRequest(request);

    }

    @Test
    public void testBasicProperties() {
        assertThat(rbacPreCheckFilter.filterType(), is("pre"));
        assertThat(rbacPreCheckFilter.filterOrder(), is(2));
    }

    @Test
    public void testThatRbacCheckShouldNotHappenForOpenEndpoints() {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI("/user/_details");
        ctx.setRequest(request);
        rbacPreCheckFilter.run();
        assertFalse((Boolean) ctx.get("shouldDoRbac"));
    }

    @Test
    public void test_That_Rbac_Check_Sould_Not_Happen_For_AnonymousEndPoints(){
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI("/pgr/complaintTypeCategories");
        ctx.setRequest(request);
        rbacPreCheckFilter.run();
        assertFalse((Boolean) ctx.get("shouldDoRbac"));
    }

    @Test
    public void test_should_return_true_when_uri_is_not_in_open_or_anonymous_endpoint_and_uri_is_present_in_rbacwhitelist() throws Exception {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI("/pgr/seva/_create");
        ctx.setRequest(request);
        rbacPreCheckFilter.run();
        assertTrue((Boolean) ctx.get("shouldDoRbac"));
    }

}