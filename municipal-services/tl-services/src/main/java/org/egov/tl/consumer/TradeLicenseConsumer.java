package org.egov.tl.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.tl.service.TradeLicenseService;
import org.egov.tl.service.notification.TLNotificationService;
import org.egov.tl.util.TradeUtil;
import org.egov.tl.web.models.TradeLicenseRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import java.util.HashMap;

import static org.egov.tl.util.TLConstants.businessService_BPA;
import static org.egov.tl.util.TLConstants.businessService_TL;


@Slf4j
@Component
public class TradeLicenseConsumer {

    private TLNotificationService notificationService;

    private TradeLicenseService tradeLicenseService;

    @Autowired
    public TradeLicenseConsumer(TLNotificationService notificationService, TradeLicenseService tradeLicenseService) {
        this.notificationService = notificationService;
        this.tradeLicenseService = tradeLicenseService;
    }

    @KafkaListener(topics = {"${persister.update.tradelicense.topic}","${persister.save.tradelicense.topic}","${persister.update.tradelicense.workflow.topic}"})
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        ObjectMapper mapper = new ObjectMapper();
        TradeLicenseRequest tradeLicenseRequest = new TradeLicenseRequest();
        try {
            tradeLicenseRequest = mapper.convertValue(record, TradeLicenseRequest.class);
        } catch (final Exception e) {
            log.error("Error while listening to value: " + record + " on topic: " + topic + ": " + e);
        }
        if (!tradeLicenseRequest.getLicenses().isEmpty()) {
            String businessService = tradeLicenseRequest.getLicenses().get(0).getBusinessService();
            if (businessService == null)
                businessService = businessService_TL;
            switch (businessService) {
                case businessService_BPA:
                    try {
                        tradeLicenseService.checkEndStateAndAddBPARoles(tradeLicenseRequest);
                    } catch (final Exception e) {
                        log.error("Error occurred while adding roles for BPA user " + e);
                    }
                    break;
            }
        }
        notificationService.process(tradeLicenseRequest);
    }
}
