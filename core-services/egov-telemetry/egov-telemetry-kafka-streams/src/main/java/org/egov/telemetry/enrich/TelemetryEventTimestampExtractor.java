package org.egov.telemetry.enrich;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.streams.processor.TimestampExtractor;
import org.json.JSONObject;

@Slf4j
public class TelemetryEventTimestampExtractor implements TimestampExtractor {

    private Long getTimestamp(JSONObject jsonObject) {
        return jsonObject.getLong("ets");
    }

    @Override
    public long extract(ConsumerRecord<Object, Object> record, long previousTimestamp) {
        JSONObject jsonObject = new JSONObject( (String) record.value());
        return getTimestamp(jsonObject);
    }

}
