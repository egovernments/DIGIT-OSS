package org.egov.url.shortening.repository;

import org.egov.url.shortening.model.ShortenRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import redis.clients.jedis.Jedis;

@Repository
@Order(2)
public class URLRedisRepository implements URLRepository {
    private final Jedis jedis;
    private final String idKey;
    private final String urlKey;
    private static final Logger LOGGER = LoggerFactory.getLogger(URLRedisRepository.class);
    
    @Autowired
    private ObjectMapper objectMapper;

    public URLRedisRepository() {
        this.jedis = new Jedis();
        this.idKey = "id";
        this.urlKey = "url:";
    }

    public URLRedisRepository(Jedis jedis, String idKey, String urlKey) {
        this.jedis = jedis;
        this.idKey = idKey;
        this.urlKey = urlKey;
    }

    @Override
    public Long incrementID() {
        Long id = jedis.incr(idKey);
        LOGGER.info("Incrementing ID: {}", id-1);
        return id - 1;
    }

    @Override
    public void saveUrl(String key, ShortenRequest shortenRequest) throws JsonProcessingException {
        LOGGER.info("Saving: {} at {}", shortenRequest.getUrl(), key);
        jedis.hset(urlKey, key, objectMapper.writeValueAsString(shortenRequest));
    }

    @Override
    public String getUrl(Long id) throws Exception {
        LOGGER.info("Retrieving at {}", id);
        String shorteningReqStr = jedis.hget(urlKey, "url:"+id);
        ShortenRequest shortenRequest = objectMapper.readValue(shorteningReqStr, ShortenRequest.class);
        String url = shortenRequest.getUrl();
        LOGGER.info("Retrieved {} at {}", url ,id);
        if (url == null) {
            throw new Exception("URL at key" + id + " does not exist");
        }
        return url;
    }
}
