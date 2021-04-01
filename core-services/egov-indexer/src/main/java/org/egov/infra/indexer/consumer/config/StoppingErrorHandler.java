package org.egov.infra.indexer.consumer.config;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.config.KafkaListenerEndpointRegistry;
import org.springframework.kafka.listener.ErrorHandler;
import org.springframework.stereotype.Component;

@Component
public class StoppingErrorHandler implements ErrorHandler {

  @Autowired
  private KafkaListenerEndpointRegistry kafkaListenerEndpointRegistry;
  
  @Override
  public void handle(Exception thrownException, ConsumerRecord<?, ?> record) {
    kafkaListenerEndpointRegistry.stop();
  }

}
