package org.egov.url.shortening.validator;

import org.egov.url.shortening.model.ShortenRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class URLValidatorTest {

    private URLValidator urlValidator;
    private ShortenRequest shortenRequest;

    @BeforeEach
    public void setUp() {
        urlValidator = URLValidator.INSTANCE;
    }

    @Test
    @DisplayName("Should return true when the url is valid")
    public void testValidateURLWhenUrlIsValid() {

        String url = "https://www.google.com";
        assertTrue(urlValidator.validateURL(url));
    }

    @Test
    @DisplayName("Should return false when the url is invalid")
    public void testValidateURLWhenUrlIsInvalid() {

        String url = "http://www.google.com";
        assertTrue(urlValidator.validateURL(url));
    }

}

