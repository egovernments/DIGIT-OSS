package org.egov.filestore.domain.service;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class IdGeneratorServiceTest {

    @Test
    public void shouldGenerateId() throws Exception {
        IdGeneratorService idGeneratorService = new IdGeneratorService();

        assertEquals(36, idGeneratorService.getId().length());
    }
}