package org.egov.collection.consumer;


import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.kafka.common.protocol.types.Field;
import org.egov.collection.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import static org.egov.collection.config.CollectionServiceConstants.*;

@Component
@Slf4j
public class FileStoreConsumer {


    @Autowired
    private PaymentRepository paymentRepository;

    @KafkaListener(topics = { "${kafka.topics.filestore}" })
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {

        List<Map<String,Object>> jobMaps = (List<Map<String,Object>>)record.get(KEY_PDF_JOBS);

        List<Map<String, String>> idTofileStoreIdMaps = new LinkedList<>();

        jobMaps.forEach(job -> {
            Map<String, String> idToFileStore = new HashMap<>();
            idToFileStore.put(KEY_ID,(String) job.get(KEY_PDF_ENTITY_ID));
            idToFileStore.put(KEY_FILESTOREID, StringUtils.join((List<String>)job.get(KEY_PDF_FILESTOREID),','));
            idTofileStoreIdMaps.add(idToFileStore);
            log.info("Updating filestorid for: "+idToFileStore.get(KEY_ID));
        });


        paymentRepository.updateFileStoreId(idTofileStoreIdMaps);


    }



}
