package org.egov.filters.pre;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import org.egov.Utils.ExceptionUtils;
import org.egov.Utils.UserUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.contract.User;
import org.egov.model.*;
import org.egov.model.eservicesso.UserInfo;
import org.egov.wrapper.CustomRequestWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;

import static org.egov.constants.RequestContextConstants.*;
import static org.egov.filters.pre.AuthPreCheckFilter.AUTH_TOKEN_REQUEST_BODY_FIELD_NAME;
import static org.egov.filters.pre.AuthPreCheckFilter.FAILED_TO_SERIALIZE_REQUEST_BODY_MESSAGE;


public class SsoAuthFilter extends ZuulFilter {

    private final UserUtils userUtils;

    @Value("${egov.auth-service-host}${egov.user.search.path}")
    private String userSearchURI;

    @Value("${egov.auth-service-host}${egov.user.create.path}")
    private String createUserUri;

    private final User user;

    private final ObjectMapper objectMapper;

    private final RestTemplate restTemplate;

    public static final String SSO_ENDPOINT = "/tl-services/external/_create";

    public static final String THIRD_PARTY_URL = "https://eservicesuk-staging.prodios.com/api/token/verify/";

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    public SsoAuthFilter(UserUtils userUtils, RestTemplate restTemplate, User user){
        this.userUtils = userUtils;
        this.restTemplate = restTemplate;
        this.user = user;
        objectMapper = new ObjectMapper();
    }

    @Override
    public Object run() throws ZuulException {
        RequestContext context = RequestContext.getCurrentContext();

        //Step 1: Get header from 3rd party API
        String header = getJwtToken(context);

        //step 2: verify token and get JSON response
        SsoUserEntity responsePojo = verifyToken(header, context);

        //step 2.1 Get user info from responsePojo, and then phoneNumber
        UserInfo userInfo = responsePojo.getUser();
        String phoneNumber = userInfo.getPhoneNumber();

        //Get user from the nagarsewa database
        //If the user doesn't exist, create one and then return
        User user = getUser(phoneNumber, responsePojo);

        //sanitise request and set in request context
        CustomRequestWrapper wrapper = new CustomRequestWrapper(getRequest());
        RequestBodyInspector inspector;
        try {
            HashMap<String, Object> requestBody = getRequestBody(wrapper);
            inspector = new RequestBodyInspector(requestBody);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        sanitizeAndSetRequest(inspector, wrapper, user);

        return null;
    }

    private String getJwtToken(RequestContext context){
        //context = RequestContext.getCurrentContext();
        HttpServletRequest request = context.getRequest();

        //step 1: get token from request
        String header = request.getParameter("access_token");

        //if there is no token, throw exception
        if(header==null){
            try {
                throw new ServletException("An exception occurred.");
            } catch (ServletException e) {
                logger.error("Malformed URL");
            }
        }
        return header;
    }

    private SsoUserEntity verifyToken(String token, RequestContext context){

        String uri = THIRD_PARTY_URL + token;
        ResponseEntity<String> jwtResponse = restTemplate.exchange(uri,
                HttpMethod.GET, null, String.class);


        String responseBody = null;

        if (jwtResponse.getStatusCode().is2xxSuccessful()) {
            responseBody = jwtResponse.getBody();
        } else {
            // Handle unsuccessful verification
            context.setSendZuulResponse(false);
            context.setResponseStatusCode(HttpStatus.UNAUTHORIZED.value());
            logger.error("could not verify");
        }

        SsoUserEntity responsePojo;

        try {
            responsePojo = objectMapper.readValue(responseBody, SsoUserEntity.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return responsePojo;
    }

    private User searchUser(String phoneNumber){

        objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        UserSearchRequest request = new UserSearchRequest();
        request.setMobileNumber(phoneNumber);
        return userUtils.fetchUserUtil(userSearchURI, request);
    }

    private User createUser(SsoUserEntity ssoUserEntity){

        objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        CreateUserRequest request = getCreateUserRequest(ssoUserEntity);

        //handle responseInfo later.

        StringBuilder uri = new StringBuilder(createUserUri);
        User user = null;
        try {
            UserDetailResponse response = restTemplate.postForObject(uri.toString(), request, UserDetailResponse.class);
            assert response != null;
            if(!CollectionUtils.isEmpty(response.getUser()))
                user = response.getUser().get(0);
        }
        catch(Exception e) {
            logger.error("Exception while fetching system user: ",e);}
        return user;
    }

    private static CreateUserRequest getCreateUserRequest(SsoUserEntity ssoUserEntity) {
        RequestInfo requestInfo = new RequestInfo();

        CreateUserRequest request = new CreateUserRequest();
        request.setRequestInfo(requestInfo);

        UserRequest userRequest = new UserRequest();
        userRequest.setUuid(ssoUserEntity.getUser().getId());
        userRequest.setType(ssoUserEntity.getUser().getType());
        userRequest.setName(ssoUserEntity.getUser().getFirstName() + " " + ssoUserEntity.getUser().getLastName());
        userRequest.setMobileNumber(ssoUserEntity.getUser().getPhoneNumber());
        userRequest.setEmailId(ssoUserEntity.getUser().getEmail());

        request.setUser(userRequest);
        return request;
    }


    private User getUser(String phoneNumber, SsoUserEntity responsePojo){
        User user = null;

        try{
            //search for user in the database
            User userInDatabase = searchUser(phoneNumber);
            if(userInDatabase!=null){
                user = userInDatabase;
            }else {
                user = createUser(responsePojo);
            }
        }
        catch (Exception e){
            logger.error(String.valueOf(e));
        }
        return user;
    }

    private void sanitizeAndSetRequest(RequestBodyInspector requestBodyInspector, CustomRequestWrapper requestWrapper, User userInfo) {
        HashMap<String, Object> requestInfo = requestBodyInspector.getRequestInfo();
        RequestContext ctx = RequestContext.getCurrentContext();
        requestInfo.remove(USER_INFO_FIELD_NAME);
        requestInfo.remove(AUTH_TOKEN_REQUEST_BODY_FIELD_NAME);
        objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);

        ctx.set(USER_INFO_KEY, userInfo);
        requestBodyInspector.updateRequestInfo(requestInfo);

        try {
            String requestSanitizedBody = objectMapper.writeValueAsString(requestBodyInspector.getRequestBody());
            ctx.set(CURRENT_REQUEST_SANITIZED_BODY, requestBodyInspector.getRequestBody());
            ctx.set(CURRENT_REQUEST_SANITIZED_BODY_STR, requestSanitizedBody);
            requestWrapper.setPayload(requestSanitizedBody);
        }
        catch (JsonProcessingException e) {
            logger.error(FAILED_TO_SERIALIZE_REQUEST_BODY_MESSAGE, e);
            ExceptionUtils.RaiseException(e);
        } catch(Exception e) {
            logger.error("Exception while fetching system user: ",e);
        }
        ctx.setRequest(requestWrapper);
    }

    @Override
    public String filterType() {
        return null;
    }

    @Override
    public int filterOrder() {
        return 0;
    }

    @Override
    public boolean shouldFilter() {
        return false;
    }

    private HttpServletRequest getRequest() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return ctx.getRequest();
    }

    private HashMap<String, Object> getRequestBody(CustomRequestWrapper requestWrapper) throws IOException {
        return objectMapper.readValue(requestWrapper.getPayload(),
            new TypeReference<HashMap<String, Object>>() { });
    }

}



//I must clean this method entirely, and then commit the changes to this branch itself.
//Small work, but huge task.