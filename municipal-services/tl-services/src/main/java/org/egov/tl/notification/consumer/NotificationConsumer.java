package org.egov.tl.notification.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.service.EnrichmentService;
import org.egov.tl.util.NotificationUtil;
import org.egov.tl.util.TLConstants;
import org.egov.tl.web.models.SMSRequest;
import org.egov.tl.web.models.TradeLicense;
import org.egov.tl.web.models.TradeLicenseRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import java.util.*;

import static org.egov.tl.util.TLConstants.*;

@Service
@Slf4j
@Data
public class NotificationConsumer {

    @Autowired
    EnrichmentService enrichmentService;

    private NotificationUtil util;

    private TLConfiguration config;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    public NotificationConsumer(NotificationUtil util, TLConfiguration config) {
        this.util = util;
        this.config = config;
    }

    /*
     * Kafka consumer
     *
     * @param record
     * @param topic
     */
    @KafkaListener(topics = {"${egov.tl.batch.expire.error.topic}"})
    public void listen(HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        List<SMSRequest> requests = new LinkedList<>();
        try {
            TradeLicenseRequest req = objectMapper.convertValue(record, TradeLicenseRequest.class);
            List<TradeLicense> licenses = req.getLicenses();
            for (TradeLicense tl : licenses) {
                if (tl.getBusinessService().contains(TLConstants.businessService_TL)) {
                    List<String> configuredChannelNames = util.fetchChannelList(new RequestInfo(), tl.getTenantId(), TL_BUSINESSSERVICE, ACTION_EXPIRE);
                    if (configuredChannelNames.contains(CHANNEL_NAME_SMS)) {
                        util.sendSMSNotification(req);
                    }
                    if (configuredChannelNames.contains(CHANNEL_NAME_EMAIL)) {
                        util.sendEmailNotification(req);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Exception while reading from the queue: ", e);
        }
    }
}
