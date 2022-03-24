package org.egov;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootApplication
public class CustomConsumerApplication {

	public static void main(String[] args) {
		SpringApplication.run(CustomConsumerApplication.class, args);
	}
	
	@Value("egov.redis.host")
	private String redisHost;
	
	@Value("egov.redis.port")
	private int redisPort;
	
	@Bean
	public RestTemplate restTemplate()	{
		return new RestTemplate();
	}
	
	@Bean
	public ObjectMapper objectMapper()	{
		return new ObjectMapper();
	}
	
	@Bean
	JedisConnectionFactory jedisConnectionFactory() {
		JedisConnectionFactory jedisConFactory
	      = new JedisConnectionFactory();
	    jedisConFactory.setHostName(redisHost);
	    jedisConFactory.setPort(redisPort);
	    return jedisConFactory;
	}

	@Bean
	public RedisTemplate<String, Object> redisTemplate() {
	    RedisTemplate<String, Object> template = new RedisTemplate<>();
	    template.setConnectionFactory(jedisConnectionFactory());
	    return template;
	}
	
}
