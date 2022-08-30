package org.egov.filestore.domain.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {IdGeneratorService.class})
@ExtendWith(SpringExtension.class)
class IdGeneratorServiceTest {
    @Autowired
    private IdGeneratorService idGeneratorService;


    @Test
    void testGetId() {
        idGeneratorService.getId();
    }
}

