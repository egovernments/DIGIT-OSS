package org.egov.persistence.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.domain.model.Tenant;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class MessageCacheRepositoryTest {

    private static final String MESSAGE_HASH_KEY = "messages";
    private static final String COMPUTED_MESSAGE_HASH_KEY = "computedMessages";
    @Mock
    private StringRedisTemplate stringRedisTemplate;

    @Mock
    private HashOperations<String, Object, Object> hashOperations;

    private MessageCacheRepository cacheRepository;

    @Before
    public void before() {
        when(stringRedisTemplate.opsForHash()).thenReturn(hashOperations);
        cacheRepository = new MessageCacheRepository(stringRedisTemplate, new ObjectMapper());
    }

    @Test
    public void test_should_delete_messages_cached_from_db_for_a_given_tenant_and_locale() {
        final Tenant tenant = new Tenant("a.b.c");
        final String locale = "en_IN";

        cacheRepository.bustCacheEntry(locale, tenant);

        final String messageCacheKey = "en_IN:a.b.c";
        verify(hashOperations).delete(MESSAGE_HASH_KEY, messageCacheKey);
    }

    @Test
    public void test_should_delete_computed_messages_cached_from_db_for_a_given_locale_tenant_and_its_derived_tenants() {
        final Tenant tenant = new Tenant("a.b");
        final String locale = "en_IN";
        final List<Object> cacheKeys =
            Arrays.asList("mr_IN:a.b", "en_IN:a.b", "mr_IN:a.b.c", "en_IN:a.b.c", "mr_IN:a.b.d", "en_IN:a.b.d", "en_IN:d.e");
        when(hashOperations.keys(COMPUTED_MESSAGE_HASH_KEY)).thenReturn(new HashSet<>(cacheKeys));

        cacheRepository.bustCacheEntry(locale, tenant);

        verify(hashOperations).delete(COMPUTED_MESSAGE_HASH_KEY, "en_IN:a.b");
        verify(hashOperations).delete(COMPUTED_MESSAGE_HASH_KEY, "en_IN:a.b.c");
        verify(hashOperations).delete(COMPUTED_MESSAGE_HASH_KEY, "en_IN:a.b.d");
    }

    @Test
    public void test_should_delete_all_computed_messages_cached_from_db_when_tenant_is_default() {
        final Tenant tenant = new Tenant("default");
        final String locale = "en_IN";

        cacheRepository.bustCacheEntry(locale, tenant);

        verify(stringRedisTemplate).delete(COMPUTED_MESSAGE_HASH_KEY);
    }

}