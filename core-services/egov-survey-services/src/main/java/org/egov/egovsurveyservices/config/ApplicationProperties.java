package org.egov.egovsurveyservices.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
public class ApplicationProperties {

    @Value("${egov.localization.host}")
    private String localizationHost;

    @Value("${egov.localization.search.endpoint}")
    private String localizationEndpoint;

    @Value("${ss.notification.fallback.locale}")
    private String fallBackLocale;

    @Value("${ss.notification.ui.host}")
    private String notificationUiHost;

    @Value("${ss.notification.ui.redirect.url}")
    private String notificationEndpoint;

    @Value("${egov.ss.default.limit}")
    private Integer defaultLimit;

    @Value("${egov.ss.default.offset}")
    private Integer defaultOffset;

    @Value("${egov.ss.max.limit}")
    private Integer maxSearchLimit;

}
