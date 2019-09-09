package org.egov;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.tracer.config.TracerConfiguration;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.TransportAddress;
import org.elasticsearch.transport.client.PreBuiltTransportClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import javax.annotation.PostConstruct;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.TimeZone;

@Import({ TracerConfiguration.class })
@SpringBootApplication
public class EgfInstrumentApplication {

    public static void main(String[] args) {
        SpringApplication.run(EgfInstrumentApplication.class, args);
    }

    private static final String CLUSTER_NAME = "cluster.name";

    @Value("${app.timezone}")
    private String timeZone;

    @Value("${es.host}")
    private String elasticSearchHost;

    @Value("${es.transport.port}")
    private Integer elasticSearchTransportPort;

    @Value("${es.cluster.name}")
    private String elasticSearchClusterName;

    private TransportClient client;

    @PostConstruct
    public void init() throws UnknownHostException {
        TimeZone.setDefault(TimeZone.getTimeZone(timeZone));
        Settings settings = Settings.builder().put(CLUSTER_NAME, elasticSearchClusterName).build();
        final InetAddress esAddress = InetAddress.getByName(elasticSearchHost);
        final TransportAddress transportAddress = new TransportAddress(esAddress, elasticSearchTransportPort);
        client = new PreBuiltTransportClient(settings).addTransportAddress(transportAddress);
    }

    @Bean
    public MappingJackson2HttpMessageConverter jacksonConverter() {
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        // mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS,
        // false);
        mapper.setDateFormat(new SimpleDateFormat("dd-MM-yyyy"));
        mapper.setTimeZone(TimeZone.getTimeZone(timeZone));
        converter.setObjectMapper(mapper);
        return converter;
    }

    @Bean
    public WebMvcConfigurerAdapter webMvcConfigurerAdapter() {
        return new WebMvcConfigurerAdapter() {

            @Override
            public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
                configurer.defaultContentType(MediaType.APPLICATION_JSON_UTF8);
            }

        };
    }

    @Bean
    public TransportClient getTransportClient() {
        return client;
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
