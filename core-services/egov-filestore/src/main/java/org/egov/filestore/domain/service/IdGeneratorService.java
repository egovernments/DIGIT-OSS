package org.egov.filestore.domain.service;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class IdGeneratorService {

    public String getId() {
        return UUID.randomUUID().toString();
    }
}
