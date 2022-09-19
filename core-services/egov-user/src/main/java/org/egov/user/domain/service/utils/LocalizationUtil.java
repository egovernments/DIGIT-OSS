package org.egov.user.domain.service.utils;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.reflections.Reflections.log;

@Component
@Slf4j

public class LocalizationUtil {

    @Value("${egov.localization.host}")
    private String localizationServiceHost;
    @Value("${egov.localization.search.endpoint}")
    private String localizationServiceSearchPath;
    @Value("${state.level.tenant.id}")
    private String tenantId;
    @Value("${egov.localization.module}")
    private String module;
    @Value("${egov.localization.default.locale}")
    private String defaultLocale;
    @Autowired
    private RestTemplate restTemplate;

    public String getLocalizedMessage(String code, String locale, RequestInfo requestInfo) {
        if(locale == null)
            locale = defaultLocale;
        String uri = getUri(locale);
        Object responseobj = restTemplate.postForObject(uri, requestInfo, Map.class);
        Object object = JsonPath.read(responseobj,
                "$.messages[?(@.code==\"" + code + "\")].message");
        List<String> messages = (ArrayList<String>) object;
        String message = messages.get(0);
        return message;
    }

    String getUri(String locale) {
        return localizationServiceHost + localizationServiceSearchPath + "?locale=" + locale + "&tenantId=" + tenantId + "&module=" + module;
    }

}
