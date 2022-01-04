package org.egov.chat.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:application.properties")
@Getter
public class ApplicationProperties {

    @Value("${kafka.bootstrap.server}")
    private String kafkaHost;

    @Value("${egov.external.host}")
    private String egovExternalHost;

    @Value("${user.service.chatbot.host}")
    private String userServiceHost;

    @Value("${user.service.oauth.path}")
    private String userServiceOAuthPath;

    @Value("${user.service.create.citizen.path}")
    private String citizenCreatePath;

    @Value("${user.service.chatbot.citizen.passwrord}")
    private String hardcodedPassword;

    @Value("${state.level.tenant.id}")
    private String stateLevelTenantId;

    @Value("${id.timezone}")
    private String timezone;

}
