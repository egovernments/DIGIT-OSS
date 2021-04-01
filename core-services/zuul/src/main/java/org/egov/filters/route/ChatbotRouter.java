package org.egov.filters.route;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
@ConditionalOnProperty( value = "home.isolation.chatbot.router.enabled", havingValue = "true")
public class ChatbotRouter extends ZuulFilter {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private RestTemplate restTemplate;

    @Value("${chatbot.context.path}")
    private String chatbotContextPath;

    @Value("${egov.user.isolation.service.host}")
    private String isolationUserServiceHost;
    @Value("${egov.user.isolation.service.search.path}")
    private String userSearchPath;

    @Value("${egov.statelevel.tenant}")
    public String stateLevelTenantId;

    @Value("${home.isolation.chatbot.host}")
    private String homeIsolationChatbotHost;

    @Override
    public String filterType() {
        return "route";
    }

    @Override
    public int filterOrder() {
        return 0;
    }

    @Override
    public boolean shouldFilter() {
        String uri = RequestContext.getCurrentContext().getRequest().getRequestURI();
        return uri.contains(chatbotContextPath);
    }

    @SneakyThrows
    @Override
    public Object run() throws ZuulException {
        RequestContext context = RequestContext.getCurrentContext();
        HttpServletRequest request = context.getRequest();

        String mobileNumber = get10DigitMobileNumber(request);
        
        log.debug("chatbot user is "+ mobileNumber);

        boolean isIsolatedUser = isHomeIsolatedUser(mobileNumber);
        
        log.debug("isolatedUser "+ isIsolatedUser);

        if(isIsolatedUser) {
            URL url = new URL(homeIsolationChatbotHost);
            context.setRouteHost(url);
            log.debug("Redirecting user to home isolation chatbot");
        }

        return null;
    }

    public String get10DigitMobileNumber(HttpServletRequest request) {
        if(request.getParameter("from") != null)
            return request.getParameter("from").substring(2);
        else if(request.getParameter("mobile_number") != null) {
            return request.getParameter("mobile_number").substring(2);
        }
        return "";
    }

    public boolean isHomeIsolatedUser(String mobileNumber) throws IOException, ParseException {
        String searchUserRequestBody = "{\"RequestInfo\":{},\"tenantId\":\"\",\"mobileNumber\":\"\"}";
        ObjectNode request = (ObjectNode) objectMapper.readTree(searchUserRequestBody);
        request.put("tenantId", stateLevelTenantId);
        request.put("mobileNumber", mobileNumber);
        JsonNode response = restTemplate.postForObject(isolationUserServiceHost + userSearchPath, request,
            JsonNode.class);
        log.debug("user response is", response.toString());
        
        JsonNode users = response.get("user");
       

        if(users.size() > 0) {
            Long currentEpoch = System.currentTimeMillis();
            SimpleDateFormat df = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");

            for(JsonNode user : users) {
                Date date = df.parse(user.get("createdDate").asText());
                long createdEpoch = date.getTime();
                long caseEndEpoch = createdEpoch + TimeUnit.DAYS.toMillis(14);
                if(caseEndEpoch > currentEpoch) {
                    return true;
                }
            }
        }
        return false;
    }

}
