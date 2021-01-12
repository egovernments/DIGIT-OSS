package org.egov.Utils;

import com.netflix.zuul.context.RequestContext;
import lombok.extern.slf4j.Slf4j;
import org.egov.model.EventLogRequest;
import org.egov.model.RequestCaptureCriteria;
import org.egov.producer.Producer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
@Slf4j
public class EventLoggerUtil {
    @Autowired
    Producer producer;

    @Value("${eventlog.captureInputBody:false}")
    private boolean captureInputBody;

    @Value("${eventlog.captureOutputBody:false}")
    private boolean captureOutputBody;

    @Value("${eventlog.captureOutputBodyOnlyOnError:true}")
    private boolean captureOutputBodyOnlyOnError;

    private RequestCaptureCriteria criteria;

    @PostConstruct
    public void init(){
        criteria = RequestCaptureCriteria.builder()
            .captureInputBody(captureInputBody)
            .captureOutputBody(captureOutputBody)
            .captureOutputBodyOnlyForError(captureOutputBodyOnlyOnError)
            .build();
    }

    public Object logCurrentRequest(String topic){
        try {
            EventLogRequest request = EventLogRequest.fromRequestContext(RequestContext.getCurrentContext(), criteria);
            producer.push(topic, request);
        } catch (Exception ex) {
            log.error("event logger", ex);
        }
        return null;
    }
}
