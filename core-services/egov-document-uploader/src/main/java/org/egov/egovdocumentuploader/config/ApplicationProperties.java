package org.egov.egovdocumentuploader.config;

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

    @Value("${du.notification.fallback.locale}")
    private String fallBackLocale;

    @Value("${du.notification.ui.host}")
    private String notificationUiHost;

    @Value("${du.notification.ui.redirect.url}")
    private String notificationEndpoint;

    @Value("${du.notification.action.code}")
    private String documentActionCode;

    @Value("${egov.du.default.limit}")
    private Integer defaultLimit;

    @Value("${egov.du.default.offset}")
    private Integer defaultOffset;

    @Value("${egov.du.max.limit}")
    private Integer maxSearchLimit;

    @Value("${egov.url.shortner.host}")
    private String urlShortnerHost;

    @Value("${egov.url.shortner.endpoint}")
    private String urlShortnerEndpoint;

}
