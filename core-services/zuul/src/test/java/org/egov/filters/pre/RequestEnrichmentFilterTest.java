package org.egov.filters.pre;

import com.netflix.zuul.context.RequestContext;
import org.apache.commons.io.IOUtils;
import org.egov.Resources;
import org.egov.contract.Role;
import org.egov.contract.User;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class RequestEnrichmentFilterTest {

    private RequestEnrichmentFilter filter;
    private Resources resources = new Resources();

    private static final String EXPECTED_CORREALTION_ID = "someCorrelationId";
    private static final String CURRENT_CONTEXT_CORRELATION_ID = "CORRELATION_ID";
    private static final String SET_REQUEST_URI_CREATE = "http://foo/bar/v1/_create";
    private static final String CURRENT_CONTEXT_USER_INFO = "USER_INFO";
    private static final String SET_TENANT_ID_DEFAULT = "default";

    @Before
    public void before() {
        filter = new RequestEnrichmentFilter();
        RequestContext.getCurrentContext().clear();
    }

    @Test
    public void test_should_set_filter_order_to_execute_last() {
        assertEquals(5, filter.filterOrder());
    }

    @Test
    public void test_should_always_execute_filter() {
        assertTrue(filter.shouldFilter());
    }

    @Test
    public void test_should_add_correlation_id_request_header() {
        final RequestContext currentContext = RequestContext.getCurrentContext();
        final MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("GET");
        currentContext.setRequest(request);
        final String expectedCorrelationId = EXPECTED_CORREALTION_ID;
        currentContext.set(CURRENT_CONTEXT_CORRELATION_ID, expectedCorrelationId);

        filter.run();

        final Map<String, String> zuulRequestHeaders = currentContext.getZuulRequestHeaders();
        assertEquals(2, zuulRequestHeaders.size());
        assertEquals(expectedCorrelationId, zuulRequestHeaders.get("x-correlation-id"));
    }

    @Test
    public void test_should_add_correlation_id_to_request_info_section_of_request_body() throws IOException {
        final RequestContext currentContext = RequestContext.getCurrentContext();
        final MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("POST");
        request.setRequestURI(SET_REQUEST_URI_CREATE);
        request.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
        request.setContent(getContent("postRequestFromConsumer.json"));
        currentContext.setRequest(request);
        final String expectedCorrelationId = EXPECTED_CORREALTION_ID;
        currentContext.set(CURRENT_CONTEXT_CORRELATION_ID, expectedCorrelationId);
        currentContext.set(CURRENT_CONTEXT_USER_INFO, null);

        filter.run();

        String expectedBody = resources.getFileContents("postRequestWithCorrelationId.json");
        assertEquals(expectedBody, IOUtils.toString(currentContext.getRequest().getInputStream()));
    }

    @Test
    public void test_should_add_user_info_to_request_info_section_of_request_body() throws IOException {
        final RequestContext currentContext = RequestContext.getCurrentContext();
        final MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("POST");
        request.setRequestURI(SET_REQUEST_URI_CREATE);
        request.setContent(getContent("postRequestFromConsumer.json"));
        request.setContentType(MediaType.APPLICATION_JSON_VALUE);
        currentContext.setRequest(request);
        final String expectedCorrelationId = EXPECTED_CORREALTION_ID;
        currentContext.set(CURRENT_CONTEXT_CORRELATION_ID, expectedCorrelationId);
        currentContext.set(CURRENT_CONTEXT_USER_INFO, getUser());

        filter.run();

        String expectedBody = resources.getFileContents("enrichedPostRequest.json");
        assertEquals(expectedBody, IOUtils.toString(currentContext.getRequest().getInputStream()));
    }

    @Test
    public void test_should_add_user_info_request_header_for_GET_request_type() throws IOException {
        final RequestContext currentContext = RequestContext.getCurrentContext();
        final MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("GET");
        request.setRequestURI("http://foo/bar/v1/_search");
        currentContext.setRequest(request);
        currentContext.set(CURRENT_CONTEXT_CORRELATION_ID, EXPECTED_CORREALTION_ID);
        currentContext.set(CURRENT_CONTEXT_USER_INFO, getUser());

        filter.run();

        String expectedHeaderValue = resources.getFileContents("userInfoHeader.json");
        final Map<String, String> zuulRequestHeaders = currentContext.getZuulRequestHeaders();
        assertEquals(expectedHeaderValue, zuulRequestHeaders.get("x-user-info"));
    }

    @Test
    public void test_should_not_modify_request_body_when_request_info_section_is_not_present() throws IOException {
        final RequestContext currentContext = RequestContext.getCurrentContext();
        final MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("POST");
        request.setRequestURI(SET_REQUEST_URI_CREATE);
        request.setContent(getContent("postRequestWithoutRequestInfoFromConsumer.json"));
        currentContext.setRequest(request);
        final String expectedCorrelationId = EXPECTED_CORREALTION_ID;
        currentContext.set(CURRENT_CONTEXT_CORRELATION_ID, expectedCorrelationId);
        currentContext.set(CURRENT_CONTEXT_USER_INFO, getUser());

        filter.run();

        String expectedBody = resources.getFileContents("postRequestWithoutRequestInfoFromConsumer.json");
        assertEquals(expectedBody, IOUtils.toString(currentContext.getRequest().getInputStream()));
    }

    private User getUser() {
        User mockUser = new User();
        mockUser.setId(30);
        mockUser.setUserName("userName");
        mockUser.setUuid("asdfgvcxzawertyjnbvcxzasdfgh");
        mockUser.setName("name");
        mockUser.setMobileNumber("1234567890");
        mockUser.setEmailId("fu@bar.com");
        mockUser.setTenantId(SET_TENANT_ID_DEFAULT);
        mockUser.setType("EMPLOYEE");
        Role mockRole1 = new Role();
        mockRole1.setId(1L);
        mockRole1.setName("Employee");
        mockRole1.setCode("EMPLOYEE");
        mockRole1.setTenantId(SET_TENANT_ID_DEFAULT);
        Role mockRole2 = new Role();
        mockRole2.setId(2L);
        mockRole2.setName("ULB Operator");
        mockRole2.setCode("ULB");
        mockRole2.setTenantId(SET_TENANT_ID_DEFAULT);
        List<Role> roles = new ArrayList<>();
        roles.add(mockRole1);
        roles.add(mockRole2);
        mockUser.setRoles(roles);
        return mockUser;
    }

    private byte[] getContent(String fileName) {
        try {
            return IOUtils.toByteArray(IOUtils.toInputStream(resources.getFileContents(fileName)));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}