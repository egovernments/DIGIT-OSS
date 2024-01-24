package digit.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.*;
import org.egov.tracer.config.TracerConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.TimeZone;

@Component
@Data
@Import({TracerConfiguration.class})
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class Configuration {
    @Value("${app.timezone}")
    private String timeZone;

    @PostConstruct
    public void initialize() {
        TimeZone.setDefault(TimeZone.getTimeZone(timeZone));
    }

    @Bean
    @Autowired
    public MappingJackson2HttpMessageConverter jacksonConverter(ObjectMapper objectMapper) {
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(objectMapper);
        return converter;
    }

    // Pagination
    @Value("${egov.service.request.default.offset}")
    private Integer defaultOffset;

    @Value("${egov.service.request.default.limit}")
    private Integer defaultLimit;

    @Value("${egov.service.request.max.limit}")
    private Integer maxLimit;

    // Kafka topics
    @Value("${egov.service.definition.create.topic}")
    private String serviceDefinitionCreateTopic;

    @Value("${egov.service.create.topic}")
    private String serviceCreateTopic;

    @Value("${egov.service.create.indexer.topic}")
    private String serviceCreateIndexerTopic;

    @Value("${egov.max.string.input.size}")
    private Integer maxStringInputSize;

}
