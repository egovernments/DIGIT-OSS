package org.egov.user;


import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.tracer.config.TracerConfiguration;
import org.egov.user.security.CustomAuthenticationKeyGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.redis.RedisTokenStore;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import redis.clients.jedis.JedisShardInfo;

import javax.annotation.PostConstruct;
import java.text.SimpleDateFormat;
import java.util.Locale;
import java.util.TimeZone;

@SpringBootApplication
@Import(TracerConfiguration.class)
public class EgovUserApplication {



	private static final String DATE_FORMAT = "dd-MM-yyyy HH:mm:ss";

	@Value("${app.timezone}")
	private String timeZone;

	@Value("${spring.redis.host}")
	private String host;
	
	@Autowired
	private CustomAuthenticationKeyGenerator customAuthenticationKeyGenerator;


	@PostConstruct
	public void initialize() {
		TimeZone.setDefault(TimeZone.getTimeZone(timeZone));
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
	public MappingJackson2HttpMessageConverter jacksonConverter() {
		MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
		ObjectMapper mapper = new ObjectMapper();
		mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
		mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
		mapper.setDateFormat(new SimpleDateFormat(DATE_FORMAT, Locale.ENGLISH));
		mapper.setTimeZone(TimeZone.getTimeZone(timeZone));
		converter.setObjectMapper(mapper);
		return converter;
	}
	
	@Bean
	public ObjectMapper objectMapper(){
		
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.setTimeZone(TimeZone.getTimeZone(timeZone));
		return objectMapper;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public TokenStore tokenStore() {
		RedisTokenStore redisTokenStore =  new RedisTokenStore(connectionFactory());
		redisTokenStore.setAuthenticationKeyGenerator(customAuthenticationKeyGenerator);
		return redisTokenStore;
	}

	@Bean
	public JedisConnectionFactory connectionFactory() {
		return new JedisConnectionFactory(new JedisShardInfo(host));
	}

	public static void main(String[] args) {
		SpringApplication.run(EgovUserApplication.class, args);
	}

}