package org.egov.filters.pre;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.io.IOException;

import org.egov.Resources;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.contract.User;
import org.egov.exceptions.CustomException;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.cloud.netflix.zuul.filters.ProxyRequestHelper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.netflix.zuul.context.RequestContext;

public class AuthFilterTest {
    private MockHttpServletRequest request = new MockHttpServletRequest();
    private Resources resources = new Resources();

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private ProxyRequestHelper proxyRequestHelper;
    
    @Mock
    private MultiStateInstanceUtil multiStateInstanceUtil;

    private AuthFilter authFilter;

    private String authServiceHost = "http://localhost:8082/";
    private String authUri = "user/_details?access_token=";
    private String userInfoHeader = "x-user-info";

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
        authFilter = new AuthFilter(proxyRequestHelper, restTemplate, authServiceHost, authUri, multiStateInstanceUtil);
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.clear();
        ctx.setRequest(request);
    }

    @Test
    public void testBasicProperties() {
        assertThat(authFilter.filterType(), is("pre"));
        assertThat(authFilter.filterOrder(), is(3));
    }

    @Test
    public void testThatFilterShouldBeAppliedBasedOnContext() {
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set("shouldDoAuth", false);
        assertFalse(authFilter.shouldFilter());

        ctx.set("shouldDoAuth", true);
        assertTrue(authFilter.shouldFilter());
    }

    @Test
    public void testThatFilterShouldAbortIfValidatingAuthTokenFails() throws IOException, CustomException {
        RequestContext ctx = RequestContext.getCurrentContext();
        String authToken = "dummy-auth-token";
        ctx.set("authToken", authToken);
        request.setMethod("POST");
        ctx.setRequest(request);
        ctx.setResponse(new MockHttpServletResponse());
        String authUrl = String.format("%s%s%s", authServiceHost, authUri, authToken);
        when(restTemplate.postForObject(eq(authUrl), any(HttpEntity.class), eq(User.class)))
            .thenThrow(new HttpClientErrorException(HttpStatus.UNAUTHORIZED));

        try {
            authFilter.run();
            assertFalse("Shouldn't reach here", true );
        } catch (RuntimeException ex) {
            assertThat(((HttpClientErrorException)ex.getCause()).getStatusCode().value(), is(401));
        }
    }

}