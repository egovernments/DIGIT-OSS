package org.egov.infra.web.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.impl.client.HttpClients;
import org.apache.log4j.Logger;
import org.egov.infra.admin.master.entity.CustomUserDetails;
import org.egov.infra.microservice.contract.Error;
import org.egov.infra.microservice.contract.ErrorResponse;
import org.egov.infra.microservice.contract.RequestInfoWrapper;
import org.egov.infra.microservice.models.RequestInfo;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infra.web.rest.handler.RestErrorHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.introspect.VisibilityChecker;

public class RestServiceAuthFilter implements Filter {

    private static final Logger LOGGER = Logger.getLogger(RestServiceAuthFilter.class);

    private static final String INVALID_TOKEN = "InvalidToken";
    private static final String INVALID_REQUEST = "InvalidRequest";

    @Value("${egov.services.user.authsrvc.url}")
    private String authSrvcUrl;

    @Autowired
    public MicroserviceUtils microserviceUtils;

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        // TODO Auto-generated method stub
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        mapper.setVisibilityChecker(VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));

        try {

            String strReq = request.getReader().lines().collect(Collectors.joining());
            RequestInfoWrapper wrapper = mapper.readValue(strReq, RequestInfoWrapper.class);
            String authToken = wrapper.getRequestInfo().getAuthToken();
            System.out.println("AuthToken ::" + authToken);
            CustomUserDetails user = getUserDetails(authToken);

            if (null != user && user.getId() != null)
                request.getRequestDispatcher(request.getServletPath()).forward(req, res);
            else
                response.getWriter()
                        .write(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(getErrorResponse(INVALID_TOKEN)));
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter()
                    .write(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(getErrorResponse(INVALID_REQUEST)));
        }

    }

    private CustomUserDetails getUserDetails(String authtoken) {
        ClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(HttpClients.createDefault());
        RestTemplate restTemplate = new RestTemplate(requestFactory);
        restTemplate.setErrorHandler(new RestErrorHandler());

        final String authurl = authSrvcUrl + "?access_token=" + authtoken;

        RequestInfo reqInfo = new RequestInfo();
        RequestInfoWrapper reqWrapper = new RequestInfoWrapper();

        reqInfo.setAuthToken(authtoken);
        reqWrapper.setRequestInfo(reqInfo);

        CustomUserDetails user = restTemplate.postForObject(authurl, reqWrapper, CustomUserDetails.class);
        return user;
    }

    private ErrorResponse getErrorResponse(String errorType) {
        ErrorResponse errorResp = new ErrorResponse();
        List<Error> errorlist = new ArrayList<>();

        Error error = new Error();

        switch (errorType) {
        case INVALID_REQUEST: {

            error.setCode(403);
            error.setDescription(INVALID_REQUEST);
            error.setMessage(INVALID_REQUEST);
            break;
        }
        case INVALID_TOKEN: {
            error.setCode(401);
            error.setDescription(INVALID_TOKEN);
            error.setMessage(INVALID_TOKEN);
            break;
        }
        default:
            error.setCode(401);
            error.setDescription(INVALID_TOKEN);
            error.setMessage(INVALID_TOKEN);
        }

        errorlist.add(error);
        errorResp.setErrors(errorlist);
        return errorResp;

    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void destroy() {
    }

}
