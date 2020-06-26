package org.egov.domain.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.persistence.repository.RestCallRepository;
import org.egov.web.contract.RequestInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;

@Service
@Slf4j
public class LocalizationService {

    @Autowired
    private RestCallRepository repository;

    @Value("${egov.localisation.host}")
    private String localizationHost;

    @Value("${egov.localisation.search.endpoint}")
    private String localizationSearchEndpoint;

    /**
     * Populates the localized msg cache
     *
     * @param requestInfo
     * @param tenantId
     * @param locale
     * @param module
     */
    public Map<String, String> getLocalisedMessages(String tenantId, String locale, String module) {
        RequestInfo requestInfo = new RequestInfo("apiId", "ver", new Date(), "action", "did", "key", "msgId", "requesterId", "authToken");
        Map<String, String> mapOfCodesAndMessages = new HashMap<>();
        StringBuilder uri = new StringBuilder();
        Map<String, Object> request = new HashMap<>();
        request.put("RequestInfo", requestInfo);
        uri.append(localizationHost).append(localizationSearchEndpoint).append("?tenantId=" + tenantId).append("&module=" + module).append("&locale=" + locale);
        Optional<Object> response = repository.fetchResult(uri, request);
        try {
            if (response.isPresent()) {
                List<Object> locMessages = (List) ((Map) response.get()).get("messages");
                if (!CollectionUtils.isEmpty(locMessages)) {
                    for (Object message : locMessages) {
                        String code = ((Map<String, String>) message).get("code");
                        String messsage = ((Map<String, String>) message).get("message");
                        mapOfCodesAndMessages.put(code, messsage);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Exception while fetching from localization: " + e);
        }

        return mapOfCodesAndMessages;
    }

}
