package org.egov.filters.pre;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.monitoring.MonitoringHelper;
import org.apache.commons.io.IOUtils;
import org.egov.Utils.UserUtils;
import org.egov.contract.User;
import org.egov.exceptions.CustomException;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.Mockito;
import org.springframework.mock.web.MockHttpServletRequest;

import java.io.IOException;
import java.util.HashSet;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class AuthPreCheckFilterTest {
    private MockHttpServletRequest request = new MockHttpServletRequest();

    private AuthPreCheckFilter authPreCheckFilter;

    private HashSet<String> openEndpointsWhitelist = new HashSet<>();
    private HashSet<String> anonymousEndpointsWhitelist = new HashSet<>();

    private static final String ANONYMOUS_ENDPOINT1="anonymous-endpoint1";

    private static final String SHOULD_DO_AUTH="shouldDoAuth";

    private static final String AUTH_TOKEN="auth-token";

    private static final String TOKEN="token";

    private static final String AUTHTOKEN="authtoken";

    private static final String OTHER_ENDPOINT="other-endpoint";

    private static final String APPLICATION_JSON="application/json";

    private static final String REQUEST_INFO_PATH="{\"RequestInfo\": {\"fu\": \"bar\"}}";

    private static final String SERVICE_REQUEST_PATH="{\"ServiceRequest\": {\"fu\": \"bar\"}}";

    @Rule
    public ExpectedException expectedEx = ExpectedException.none();

    @Before
    public void init() {
        openEndpointsWhitelist.add("open-endpoint1");
        openEndpointsWhitelist.add("open-endpoint2");
        anonymousEndpointsWhitelist.add(ANONYMOUS_ENDPOINT1);
        anonymousEndpointsWhitelist.add("anonymous-endpoint2");
        UserUtils userUtils = Mockito.mock(UserUtils.class);
        Mockito.when(userUtils.fetchSystemUser()).thenReturn(new User());
        authPreCheckFilter = new AuthPreCheckFilter(openEndpointsWhitelist, anonymousEndpointsWhitelist, userUtils);
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.clear();
        ctx.setRequest(request);
    }

    @Test
    public void testBasicProperties() {
        assertThat(authPreCheckFilter.filterType(), is("pre"));
        assertThat(authPreCheckFilter.filterOrder(), is(1));
        assertTrue(authPreCheckFilter.shouldFilter());
    }

    @Test
    public void testThatAuthShouldNotHappenForOpenEndpoints() {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI("open-endpoint1");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(SHOULD_DO_AUTH));

        request.setRequestURI("open-endpoint2");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(SHOULD_DO_AUTH));
    }

    @Test
    public void testThatAuthShouldNotHappenForAnonymousGETEndpointsOnNoAuthToken() {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI(ANONYMOUS_ENDPOINT1);
        request.setMethod("GET");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(SHOULD_DO_AUTH));

        request.setRequestURI(ANONYMOUS_ENDPOINT1);
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(SHOULD_DO_AUTH));
    }

    @Test
    public void testThatAuthShouldHappenForAnonymousGETEndpointsOnAuthTokenInHeader() {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("GET");
        request.addHeader(AUTH_TOKEN, TOKEN);

        request.setRequestURI("/anonymous-endpoint1");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertTrue((Boolean) ctx.get(SHOULD_DO_AUTH));

        request.setRequestURI("/anonymous-endpoint1");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertTrue((Boolean) ctx.get(SHOULD_DO_AUTH));
    }

    @Test
    public void testThatAuthShouldNotHappenForAnonymousPOSTEndpointsOnNoAuthToken() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI(ANONYMOUS_ENDPOINT1);
        request.setMethod("POST");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(REQUEST_INFO_PATH)));
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(SHOULD_DO_AUTH));

        request.setRequestURI(ANONYMOUS_ENDPOINT1);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(REQUEST_INFO_PATH)));
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(SHOULD_DO_AUTH));
    }

    @Test
    public void testThatAuthShouldNotHappenForAnonymousPOSTEndpointsOnNoRequestInfo() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI(ANONYMOUS_ENDPOINT1);
        request.setMethod("POST");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(SERVICE_REQUEST_PATH)));

        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(SHOULD_DO_AUTH));

        request.setRequestURI(ANONYMOUS_ENDPOINT1);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(SERVICE_REQUEST_PATH)));
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(SHOULD_DO_AUTH));
    }

    @Test
    public void testThatAuthShouldNotHappenForAnonymousPUTEndpointsOnNoAuthToken() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI(ANONYMOUS_ENDPOINT1);
        request.setMethod("PUT");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(REQUEST_INFO_PATH)));
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(SHOULD_DO_AUTH));

        request.setRequestURI(ANONYMOUS_ENDPOINT1);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(REQUEST_INFO_PATH)));
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(SHOULD_DO_AUTH));
    }

    @Test
    public void testThatAuthShouldNotHappenForAnonymousPUTEndpointsOnNoRequestInfo() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI(ANONYMOUS_ENDPOINT1);
        request.setMethod("PUT");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(SERVICE_REQUEST_PATH)));

        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(SHOULD_DO_AUTH));

        request.setRequestURI(ANONYMOUS_ENDPOINT1);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(SERVICE_REQUEST_PATH)));
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(SHOULD_DO_AUTH));
    }

    @Test
    public void testThatAuthShouldHappenForOtherGETEndpointsOnAuthTokenInHeader() {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.addHeader(AUTH_TOKEN, TOKEN);
        request.setMethod("GET");
        request.setRequestURI(OTHER_ENDPOINT);
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertTrue((Boolean) ctx.get(SHOULD_DO_AUTH));
    }

    @Test
    public void testThatAuthShouldHappenForOtherPOSTEndpointsOnAuthTokenInRequestBody() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.addHeader(AUTH_TOKEN, TOKEN);
        request.setMethod("POST");
        request.setContentType(APPLICATION_JSON);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream("{\"RequestInfo\": {\"fu\": \"bar\", \"authToken\": \"authtoken\"}}")));
        request.setRequestURI(OTHER_ENDPOINT);
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertTrue((Boolean) ctx.get(SHOULD_DO_AUTH));
        assertEquals(AUTHTOKEN, ctx.get(AUTHTOKEN));
    }

    @Test
    public void testThatAuthShouldHappenForOtherPUTEndpointsOnAuthTokenInRequestBody() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.addHeader(AUTH_TOKEN, TOKEN);
        request.setContentType(APPLICATION_JSON);
        request.setMethod("PUT");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream("{\"RequestInfo\": {\"fu\": \"bar\", \"authToken\": \"authtoken\"}}")));
        request.setRequestURI(OTHER_ENDPOINT);
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertTrue((Boolean) ctx.get(SHOULD_DO_AUTH));
        assertEquals(AUTHTOKEN, ctx.get(AUTHTOKEN));
    }

    @Test(expected = CustomException.class)
    public void testThatFilterShouldAbortForOtherGETEndpointsOnNoAuthToken() throws Throwable {
        MonitoringHelper.initMocks();
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("GET");
        request.setRequestURI(OTHER_ENDPOINT);
        ctx.setRequest(request);

        try {
            authPreCheckFilter.run();
        } catch (RuntimeException ex) {
            CustomException e = (CustomException) ex.getCause();
            assertThat(e.nStatusCode, is(401));
            throw ex.getCause();
        }
    }

    @Test(expected = CustomException.class)
    public void testThatFilterShouldAbortForOtherPOSTEndpointsOnNoAuthToken() throws Throwable {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("POST");
        request.setRequestURI(OTHER_ENDPOINT);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(REQUEST_INFO_PATH)));
        ctx.setRequest(request);

        try {
            authPreCheckFilter.run();
        } catch (RuntimeException ex) {
            CustomException e = (CustomException) ex.getCause();
            assertThat(e.nStatusCode, is(401));
            throw ex.getCause();
        }
    }

    @Test(expected = CustomException.class)
    public void testThatFilterShouldAbortForOtherPOSTEndpointsOnNoRequestnInfo() throws Throwable {
        MonitoringHelper.initMocks();
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("POST");
        request.setRequestURI(OTHER_ENDPOINT);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(SERVICE_REQUEST_PATH)));
        ctx.setRequest(request);

        try {
            authPreCheckFilter.run();
        } catch (RuntimeException ex) {
            CustomException e = (CustomException) ex.getCause();

            assertThat(e.nStatusCode, is(401));
            throw ex.getCause();
        }
    }

    @Test(expected = JsonMappingException.class)
    public void testThatFilterShouldAbortForPOSTEndpointsOnNoRequestBody() throws Throwable {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("POST");
        request.setContentType(APPLICATION_JSON);
        request.setRequestURI(OTHER_ENDPOINT);
        ctx.setRequest(request);

        try {
            authPreCheckFilter.run();
        } catch (RuntimeException ex) {
            throw ex.getCause();
        }

    }

    @Test(expected = CustomException.class)
    public void testThatFilterShouldAbortForOtherPUTEndpointsOnNoAuthToken() throws Throwable {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("PUT");
        request.setRequestURI(OTHER_ENDPOINT);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(REQUEST_INFO_PATH)));
        ctx.setRequest(request);

        try {
            authPreCheckFilter.run();
        } catch (RuntimeException ex) {
            CustomException e = (CustomException) ex.getCause();
            assertThat(e.nStatusCode, is(401));
            throw ex.getCause();
        }
    }

    @Test (expected = CustomException.class)
    public void testThatFilterShouldAbortForOtherPUTEndpointsOnNoRequestnInfo() throws Throwable {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("PUT");
        request.setRequestURI(OTHER_ENDPOINT);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(SERVICE_REQUEST_PATH)));
        ctx.setRequest(request);

        try {
            authPreCheckFilter.run();
        } catch (RuntimeException ex) {
            throw ex.getCause();
        }
    }

    @Test(expected = JsonMappingException.class)
    public void testThatFilterShouldAbortForPUTEndpointsOnNoRequestBody() throws Throwable {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("PUT");
        request.setContentType(APPLICATION_JSON);
        request.setRequestURI(OTHER_ENDPOINT);
        ctx.setRequest(request);

        try {
            authPreCheckFilter.run();
        } catch (RuntimeException ex) {
            throw ex.getCause();
        }
        assertFalse(ctx.sendZuulResponse());
        assertThat(ctx.getResponseStatusCode(), is(500));
    }

    @Test
    public void testThatAuthTokenIsAlwaysReferredFromHeaderForFileStoreEndpoints() {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("POST");
        request.addHeader(AUTH_TOKEN, AUTHTOKEN);
        request.setRequestURI("/filestore/v1/files");
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertEquals(AUTHTOKEN, ctx.get(AUTHTOKEN));
    }

    @Test
    public void testThatRequestInfoIsSanitizedForOtherPUTEndpoints() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.addHeader(AUTH_TOKEN, TOKEN);
        request.setMethod("PUT");
        request.setContentType(APPLICATION_JSON);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream("{\"RequestInfo\": {\"fu\": \"bar\", \"authToken\": \"authtoken\", \"userInfo\": {\"name\": \"fubarred\"}}}")));
        request.setRequestURI(OTHER_ENDPOINT);
        ctx.setRequest(request);

        authPreCheckFilter.run();

        String expectedBody = "{\"RequestInfo\":{\"fu\":\"bar\"}}";
        assertEquals(expectedBody, IOUtils.toString(ctx.getRequest().getInputStream()));
    }
}
