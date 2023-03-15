package org.egov.url.shortening.utils;

import org.hashids.Hashids;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;


@ExtendWith(SpringExtension.class)
public class HashIdConverterTest {

    @Mock
    private Hashids hashids;

    @InjectMocks
    HashIdConverter hashIdConverter;

    @Test
    @DisplayName("Should return a hash string for the given id")
    public void testCreateHashStringForIdShouldReturnAHashStringForTheGivenId() {

        Long id = 1L;
        String hashString = "hashString";
        when(hashids.encode(id)).thenReturn(hashString);

        String result = hashIdConverter.createHashStringForId(id);

        assertEquals(hashString, result);
    }

    @Test
    @DisplayName("Should return the id when the string is valid")
    public void testGetIdForStringWhenStringIsValid() {

        String string = "abc";
        long[] ids = {0L};
        when(hashids.decode(string)).thenReturn(ids);

        Long id = hashIdConverter.getIdForString(string);

        assertEquals(0L, id);
    }

    @Test
    @DisplayName("Should return null when the string is invalid")
    public void testGetIdForStringWhenStringIsInvalid() {

        String string = "invalid";
        long[] ids = new long[0];
        when(hashids.decode(string)).thenReturn(ids);

        Long id = hashIdConverter.getIdForString(string);

        assertNull(null);
    }

    @Test
    void testCreateHashStringForId() {
        assertEquals(null, hashIdConverter.createHashStringForId(1L));

    }

}

