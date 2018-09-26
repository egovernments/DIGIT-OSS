package org.egov.infra.web.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.http.impl.client.HttpClients;
import org.apache.log4j.Logger;
import org.egov.infra.admin.master.entity.CustomUserDetails;
import org.egov.infra.admin.master.entity.User;
import org.egov.infra.config.security.authentication.userdetail.CurrentUser;
import org.egov.infra.microservice.contract.Error;
import org.egov.infra.microservice.contract.ErrorResponse;
import org.egov.infra.microservice.contract.RequestInfoWrapper;
import org.egov.infra.microservice.models.RequestInfo;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infra.security.utils.SecurityUtils;
import org.egov.infra.web.rest.handler.RestErrorHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.core.type.TypeReference;
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

    @Autowired
    private SecurityUtils securityUtils;

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        chain.doFilter(req, res);
        
        
//        HttpServletRequest request = (HttpServletRequest) req;
//        HttpServletResponse response = (HttpServletResponse) res;
//
//        if (request.getRequestURI().contains("ClearToken")) {
//         
//            ObjectMapper mapper = new ObjectMapper();
////            mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
////            mapper.setVisibilityChecker(VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));
//            
////            String strReq = request.getReader().lines().collect(Collectors.joining("\n"));
//            String strReq =  IOUtils.toString(request.getInputStream());
//              HashMap<String,String>reqMap = mapper.readValue(strReq, new TypeReference<Map<String, String>>(){});
//              String authToken = reqMap.get("authtoken");
//              
//              
//            
//            
//            request.getRequestDispatcher(request.getServletPath()).forward(request, response);
////            return;

//        }

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
