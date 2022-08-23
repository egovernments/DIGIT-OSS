package org.egov.rn.utils;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class DefaultUuidProvider implements UuidProvider {

    @Override
    public UUID uuid() {
        return UUID.randomUUID();
    }
}
