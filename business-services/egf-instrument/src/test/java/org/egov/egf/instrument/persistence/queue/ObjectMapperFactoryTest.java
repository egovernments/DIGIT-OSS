package org.egov.egf.instrument.persistence.queue;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.verify;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

@RunWith(MockitoJUnitRunner.class)
public class ObjectMapperFactoryTest {

    @Mock
    private ObjectMapper objectMapper;

    private ObjectMapperFactory objectMapperFactory;

    @Before
    public void setup() {
        objectMapperFactory = new ObjectMapperFactory(objectMapper);
    }

    @Test
    public void test_create() {

        ObjectMapper actualRequest = objectMapperFactory.create();

        verify(objectMapper).disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

        assertEquals(objectMapper, actualRequest);

    }

}
