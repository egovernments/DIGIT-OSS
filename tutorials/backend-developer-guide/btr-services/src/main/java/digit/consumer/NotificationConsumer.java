package digit.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import digit.service.NotificationService;
import digit.web.models.BirthRegistrationRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.util.HashMap;

@Component
@Slf4j
public class NotificationConsumer {

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private NotificationService notificationService;

    @KafkaListener(topics = {"${btr.kafka.create.topic}"})
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {

        try {

            BirthRegistrationRequest request = mapper.convertValue(record, BirthRegistrationRequest.class);
            //log.info(request.toString());
            notificationService.prepareEventAndSend(request);

        } catch (final Exception e) {

            log.error("Error while listening to value: " + record + " on topic: " + topic + ": ", e);
        }
    }

}
