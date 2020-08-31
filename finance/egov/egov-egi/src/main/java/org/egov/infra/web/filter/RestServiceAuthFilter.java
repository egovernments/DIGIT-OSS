package org.egov.infra.web.filter;

import static org.egov.infra.utils.ApplicationConstant.MS_USER_TOKEN;
import static org.egov.infra.utils.ApplicationConstant.MS_TENANTID_KEY;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpStatus;
import org.apache.http.impl.client.HttpClients;
import org.apache.log4j.Logger;
import org.egov.infra.admin.master.entity.CustomUserDetails;
import org.egov.infra.admin.master.entity.Role;
import org.egov.infra.admin.master.entity.User;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.config.security.authentication.userdetail.CurrentUser;
import org.egov.infra.microservice.contract.Error;
import org.egov.infra.microservice.contract.ErrorResponse;
import org.egov.infra.microservice.contract.RequestInfoWrapper;
import org.egov.infra.microservice.contract.UserSearchResponse;
import org.egov.infra.microservice.contract.UserSearchResponseContent;
import org.egov.infra.microservice.models.RequestInfo;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infra.persistence.entity.enums.Gender;
import org.egov.infra.persistence.entity.enums.UserType;
import org.egov.infra.security.utils.SecurityUtils;
import org.egov.infra.web.rest.handler.RestErrorHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
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
        LOGGER.info("Rest service authentication initiated");
        
        HttpServletRequest httpRequest = (HttpServletRequest)req;
        HttpServletResponse httpResponse = (HttpServletResponse)res;

        if (httpRequest.getRequestURI().contains("/ClearToken")||httpRequest.getRequestURI().contains("/refreshToken"))
        {
            LOGGER.info("Clear Token request recieved ");
            httpRequest.getRequestDispatcher(httpRequest.getServletPath()).forward(req, res);
        }else if(httpRequest.getRequestURI().contains("/rest/voucher/")){
            try {
                // TODO : Need to identify the external and internal to enable/disable authentication.
                RestRequestWrapper request = new RestRequestWrapper(httpRequest);
                String tenantId = readTenantId(request);
                String user_token = readAuthToken(request);
                HttpSession session = httpRequest.getSession();
                session.setAttribute(MS_TENANTID_KEY, tenantId);
                session.setAttribute(MS_USER_TOKEN, user_token);
                CurrentUser user = new CurrentUser(this.getUserDetails(request));
                Authentication auth = this.prepareAuthenticationObj(request, user);
                SecurityContextHolder.getContext().setAuthentication(auth);
                chain.doFilter(request, res);
            } catch (Exception e) {
                httpResponse.setContentType(MediaType.APPLICATION_JSON_VALUE);
                httpResponse.setStatus(HttpStatus.SC_UNAUTHORIZED);
                httpResponse.getWriter().write(getErrorResponse(e.getMessage()));
            }
        }else{
        
        RestRequestWrapper request = new RestRequestWrapper(httpRequest);
        
        try {
            CurrentUser user = new CurrentUser(this.getUserDetails(request));
            Authentication auth = this.prepareAuthenticationObj(request, user);
            SecurityContextHolder.getContext().setAuthentication(auth);
            chain.doFilter(request, res);
            
        } catch (Exception e) {
//            e.printStackTrace();
            res.setContentType(MediaType.APPLICATION_JSON_VALUE);
            res.getWriter().write(getErrorResponse(e.getMessage()));  
           
        }
        }
        LOGGER.info("Rest service authentication completed");
        
 

    }

    private String getErrorResponse(String errorMsg) throws JsonProcessingException {
        ErrorResponse errorResp = new ErrorResponse();
        List<Error> errorlist = new ArrayList<>();

        Error error = new Error();
        error.setCode(401);
        error.setDescription(errorMsg);
        error.setMessage(errorMsg);
        
        errorlist.add(error);
        errorResp.setErrors(errorlist);
        ObjectMapper mapper = new ObjectMapper();
        String response = mapper.writeValueAsString(errorResp);
        return response;

    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void destroy() {
    }

    private Authentication prepareAuthenticationObj(HttpServletRequest request, CurrentUser user) {

    	
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, " ",
                user.getAuthorities());
        WebAuthenticationDetails details = new WebAuthenticationDetails(request);
        auth.setDetails(details);
        return auth;
    }

    private User getUserDetails(HttpServletRequest request) throws Exception {
      
         String user_token = readAuthToken(request);
         String tenantId = readTenantId(request);
         setSchema(tenantId);
        if (user_token == null)
            throw new Exception("AuthToken not found");
        HttpSession session = request.getSession();
        String admin_token = this.microserviceUtils.generateAdminToken(tenantId);
        if(admin_token==null)
            throw new Exception("SI token generation failed");
        session.setAttribute(MS_USER_TOKEN, user_token);
        CustomUserDetails user = this.microserviceUtils.getUserDetails(user_token, admin_token);
        session.setAttribute(MS_TENANTID_KEY, user.getTenantId());
        UserSearchResponse response = this.microserviceUtils.getUserInfo(user_token, user.getTenantId(), user.getUuid());
       
        return parepareCurrentUser(response.getUserSearchResponseContent().get(0));
    }

    private User parepareCurrentUser(UserSearchResponseContent userinfo) {

        User user = new User(UserType.valueOf(userinfo.getType().toUpperCase()));
        user.setId(userinfo.getId());
        user.setUsername(userinfo.getUserName());
        user.setActive(userinfo.getActive());
        user.setAccountLocked(userinfo.getAccountLocked());
        user.setGender(Gender.valueOf(userinfo.getGender().toUpperCase()));
        user.setPassword(" ");
        user.setName(userinfo.getName());
        user.setPwdExpiryDate(userinfo.getPwdExpiryDate());
        user.setLocale(userinfo.getLocale());

        Set<Role> roles = new HashSet<>();

        userinfo.getRoles().forEach(roleReq -> {
            Role role = new Role();
            role.setId(roleReq.getId());
            role.setName(roleReq.getName());
            roles.add(role);
        });

        return user;

    }

    private String readAuthToken(HttpServletRequest request) throws Exception {
        LOGGER.info("Rest service - reading authtoken");

        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
            mapper.setVisibilityChecker(
                    VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));

            // String strReq = request.getReader().lines().collect(Collectors.joining("\n"));
            String strReq = IOUtils.toString(request.getInputStream());
            LOGGER.info("Rest service request json : "+ strReq);
            
            HashMap<Object, Object> reqMap = mapper.readValue(strReq, HashMap.class);
            HashMap<Object, Object> reqInfo = null;
            reqInfo = (HashMap) reqMap.get("RequestInfo");

            String authToken = (String) reqInfo.get("authToken");
            if(authToken==null)
                throw new Exception("authToken not found");

            return authToken;
        } catch (JsonParseException e) {
            e.printStackTrace();
            throw new Exception("Request parsing failed");
        } catch (JsonMappingException e) {
            e.printStackTrace();
            throw new Exception("Request object Mapping failed");
        } catch (IOException e) {
            e.printStackTrace();
            throw new Exception("Request processing failed");
        }
    }
    
    private String readTenantId(HttpServletRequest request) throws Exception{
        LOGGER.info("Rest service - reading tenantId");
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
            mapper.setVisibilityChecker(
                    VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));

            // String strReq = request.getReader().lines().collect(Collectors.joining("\n"));
            String strReq = IOUtils.toString(request.getInputStream());
            HashMap<Object, Object> reqMap = mapper.readValue(strReq, HashMap.class);
            String tenantId = String.valueOf(reqMap.get("tenantId"));
            if(tenantId==null || "null".equalsIgnoreCase(tenantId)){
                LOGGER.info("Trying to read tenantid in query string ");
                tenantId= request.getParameter("tenantId");
            }
            if(tenantId==null || "null".equalsIgnoreCase(tenantId))
                throw new Exception("tenantId is not found");

            return tenantId;
        } catch (JsonParseException e) {
            e.printStackTrace();
            throw new Exception("Request parsing failed");
        } catch (JsonMappingException e) {
            e.printStackTrace();
            throw new Exception("Request object Mapping failed");
        } catch (IOException e) {
            e.printStackTrace();
            throw new Exception("Request processing failed");
        }

        
    }
    
    private void setSchema(String tenantid)
    {
        if(null!=tenantid && ""!=tenantid){
        String[] tenantParts = tenantid.split("\\.");
            if(tenantParts != null||tenantParts.length>1){
                ApplicationThreadLocals.setTenantID(tenantParts[1]); 
            }
        }
        
    }
}
