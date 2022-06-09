package org.egov.demand.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.repository.BillRepository;
import org.egov.demand.repository.DemandRepository;
import org.egov.demand.service.DemandService;
import org.egov.demand.service.ReceiptService;
import org.egov.demand.service.ReceiptServiceV2;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.DemandRequest;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
public class BillingServiceConsumerTest {

    @Mock
    private DemandService demandService;

    @Mock
    private ObjectMapper objectMapper;

    @Autowired
    private BillingServiceConsumer billingServiceConsumer;

    @Test
    @DisplayName("Should update the demand when the topic is updateDemand")
    public void testProcessMessageWhenTopicIsUpdateDemandThenUpdateTheDemand() {

        Map<String, Object> consumerRecord = new HashMap<>();
        DemandRequest demandRequest = DemandRequest.builder().build();
        when(objectMapper.convertValue(consumerRecord, DemandRequest.class)).thenReturn(demandRequest);
        billingServiceConsumer.processMessage(consumerRecord, "updateDemand");

    }

    @Test
    @DisplayName("Should save the demand when the topic is createDemand")
    public void testProcessMessageWhenTopicIsCreateDemandThenSaveTheDemand() {

        Map<String, Object> consumerRecord = new HashMap<>();
        DemandRequest demandRequest = DemandRequest.builder().build();
        when(objectMapper.convertValue(consumerRecord, DemandRequest.class)).thenReturn(demandRequest);
        billingServiceConsumer.processMessage(consumerRecord, "createDemand");

    }


}

