package org.egov.url.shortening.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.url.shortening.model.ShortenRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import redis.clients.jedis.Jedis;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ContextConfiguration(classes = {URLRedisRepository.class})
@ExtendWith(SpringExtension.class)
public class URLRedisRepositoryTest {

    @MockBean
    private JdbcTemplate jdbcTemplate;

    @MockBean
    private ObjectMapper objectMapper;

    @Autowired
    private URLRedisRepository uRLRedisRepository;

    @MockBean
    private Jedis jedis;


    @Test
    @DisplayName("Should throw an exception when the id does not exist")
    public void testGetUrlWhenIdDoesNotExistThenThrowException() {

        when(jedis.hget(anyString(), anyString())).thenReturn(null);
        assertThrows(Exception.class, () -> uRLRedisRepository.getUrl(1L));
    }



    @Test
    @DisplayName("Should throws an exception when the key is already taken")
    public void testSaveUrlWhenKeyIsAlreadyTakenThenThrowsException() {

        when(jedis.hget(anyString(), anyString())).thenReturn("{\"url\":\"http://www.google.com\"}");
        assertThrows(Exception.class, () -> uRLRedisRepository.saveUrl("url:1", new ShortenRequest()));
    }

    @Test
    void IncrementID() {
        Jedis jedis = mock(Jedis.class);
        when(jedis.incr((String) any())).thenReturn(1L);
        assertEquals(0L,
                (new URLRedisRepository(jedis, "https://example.org/example", "https://example.org/example")).incrementID()
                        .longValue());
        verify(jedis).incr((String) any());
    }
}

