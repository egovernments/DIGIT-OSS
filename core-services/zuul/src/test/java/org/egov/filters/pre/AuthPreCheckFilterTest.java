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

    private String string1="anonymous-endpoint1";

    private String string2="shouldDoAuth";

    private String string3="auth-token";

    private String string4="token";

    private String string5="authtoken";

    private String string6="other-endpoint";

    private String string7="application/json";

    private static final String STRING8="{\"RequestInfo\": {\"fu\": \"bar\"}}";

    private static final String STRING9="{\"ServiceRequest\": {\"fu\": \"bar\"}}";

    @Rule
    public ExpectedException expectedEx = ExpectedException.none();

    @Before
    public void init() {
        openEndpointsWhitelist.add("open-endpoint1");
        openEndpointsWhitelist.add("open-endpoint2");
        anonymousEndpointsWhitelist.add(string1);
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
        assertFalse((Boolean) ctx.get(string2));

        request.setRequestURI("open-endpoint2");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(string2));
    }

    @Test
    public void testThatAuthShouldNotHappenForAnonymousGETEndpointsOnNoAuthToken() {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI(string1);
        request.setMethod("GET");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(string2));

        request.setRequestURI(string1);
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(string2));
    }

    @Test
    public void testThatAuthShouldHappenForAnonymousGETEndpointsOnAuthTokenInHeader() {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("GET");
        request.addHeader(string3, string4);

        request.setRequestURI("/anonymous-endpoint1");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertTrue((Boolean) ctx.get(string2));

        request.setRequestURI("/anonymous-endpoint1");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertTrue((Boolean) ctx.get(string2));
    }

    @Test
    public void testThatAuthShouldNotHappenForAnonymousPOSTEndpointsOnNoAuthToken() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI(string1);
        request.setMethod("POST");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(STRING8)));
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(string2));

        request.setRequestURI(string1);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(STRING8)));
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(string2));
    }

    @Test
    public void testThatAuthShouldNotHappenForAnonymousPOSTEndpointsOnNoRequestInfo() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI(string1);
        request.setMethod("POST");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(STRING9)));

        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(string2));

        request.setRequestURI(string1);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(STRING9)));
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(string2));
    }

    @Test
    public void testThatAuthShouldNotHappenForAnonymousPUTEndpointsOnNoAuthToken() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI(string1);
        request.setMethod("PUT");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(STRING8)));
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(string2));

        request.setRequestURI(string1);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(STRING8)));
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(string2));
    }

    @Test
    public void testThatAuthShouldNotHappenForAnonymousPUTEndpointsOnNoRequestInfo() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI(string1);
        request.setMethod("PUT");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(STRING9)));

        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(string2));

        request.setRequestURI(string1);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(STRING9)));
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get(string2));
    }

    @Test
    public void testThatAuthShouldHappenForOtherGETEndpointsOnAuthTokenInHeader() {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.addHeader(string3, string4);
        request.setMethod("GET");
        request.setRequestURI(string6);
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertTrue((Boolean) ctx.get(string2));
    }

    @Test
    public void testThatAuthShouldHappenForOtherPOSTEndpointsOnAuthTokenInRequestBody() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.addHeader(string3, string4);
        request.setMethod("POST");
        request.setContentType(string7);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream("{\"RequestInfo\": {\"fu\": \"bar\", \"authToken\": \"authtoken\"}}")));
        request.setRequestURI(string6);
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertTrue((Boolean) ctx.get(string2));
        assertEquals(string5, ctx.get(string5));
    }

    @Test
    public void testThatAuthShouldHappenForOtherPUTEndpointsOnAuthTokenInRequestBody() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.addHeader(string3, string4);
        request.setContentType(string7);
        request.setMethod("PUT");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream("{\"RequestInfo\": {\"fu\": \"bar\", \"authToken\": \"authtoken\"}}")));
        request.setRequestURI(string6);
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertTrue((Boolean) ctx.get(string2));
        assertEquals(string5, ctx.get(string5));
    }

    @Test(expected = CustomException.class)
    public void testThatFilterShouldAbortForOtherGETEndpointsOnNoAuthToken() throws Throwable {
        MonitoringHelper.initMocks();
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("GET");
        request.setRequestURI(string6);
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
        request.setRequestURI(string6);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(STRING8)));
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
        request.setRequestURI(string6);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(STRING9)));
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
        request.setContentType(string7);
        request.setRequestURI(string6);
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
        request.setRequestURI(string6);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(STRING8)));
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
        request.setRequestURI(string6);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream(STRING9)));
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
        request.setContentType(string7);
        request.setRequestURI(string6);
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
        request.addHeader(string3, string5);
        request.setRequestURI("/filestore/v1/files");
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertEquals(string5, ctx.get(string5));
    }

    @Test
    public void testThatRequestInfoIsSanitizedForOtherPUTEndpoints() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.addHeader(string3, string4);
        request.setMethod("PUT");
        request.setContentType(string7);
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream("{\"RequestInfo\": {\"fu\": \"bar\", \"authToken\": \"authtoken\", \"userInfo\": {\"name\": \"fubarred\"}}}")));
        request.setRequestURI(string6);
        ctx.setRequest(request);

        authPreCheckFilter.run();

        String expectedBody = "{\"RequestInfo\":{\"fu\":\"bar\"}}";
        assertEquals(expectedBody, IOUtils.toString(ctx.getRequest().getInputStream()));
    }
}
