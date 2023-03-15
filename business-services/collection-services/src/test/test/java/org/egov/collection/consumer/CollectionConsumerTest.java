package org.egov.collection.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;

import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.service.BankAccountMappingService;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;


class CollectionConsumerTest {
    @MockBean
    private boolean aBoolean;

    @MockBean
    private BankAccountMappingService bankAccountMappingService;

    @Autowired
    private CollectionConsumer collectionConsumer;

    @MockBean
    private ObjectMapper objectMapper;

    @Test

    void testListen() {

        this.collectionConsumer.listen(new HashMap<>(), "Topic");
    }
}

