package org.egov.domain.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
public class LocalDateTimeFactory {

    @Value("${app.timezone}")
    private String timeZone;

    public LocalDateTime now() {
        return LocalDateTime.now(ZoneId.of(timeZone));
    }

}
