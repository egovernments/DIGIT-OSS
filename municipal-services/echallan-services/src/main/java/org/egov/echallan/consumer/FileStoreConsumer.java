package org.egov.echallan.consumer;


import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.kafka.common.protocol.types.Field;
import org.egov.echallan.model.Challan;
import org.egov.echallan.repository.ChallanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import static org.egov.echallan.util.ChallanConstants.*;


@Component
@Slf4j
public class FileStoreConsumer {


    @Autowired
    private ChallanRepository challanRepository;

    @KafkaListener(topics = { "${kafka.topics.filestore}" })
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
    	try {
        List<Map<String,Object>> jobMaps = (List<Map<String,Object>>)record.get(KEY_PDF_JOBS);

        List<Challan> challans = new ArrayList<>();
        jobMaps.forEach(job -> {
            if(job.get(KEY_NAME).toString().equalsIgnoreCase("mcollect-challan")) {
            	Challan challan = new Challan();
            	challan.setId((String) job.get(KEY_PDF_ENTITY_ID));
            	challan.setFilestoreid(StringUtils.join((List<String>)job.get(KEY_PDF_FILESTOREID),','));
            	challans.add(challan);
            	log.info("Updating filestorid for: "+challans);
            }
        });


        challanRepository.updateFileStoreId(challans);
    	 } catch (final Exception e) {
             log.error("Error while listening to value: " + record + " on topic: " + topic + ": ", e.getMessage());
         }

    }



}
