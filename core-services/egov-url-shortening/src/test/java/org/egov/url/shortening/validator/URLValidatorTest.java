package org.egov.url.shortening.validator;

import org.egov.url.shortening.model.ShortenRequest;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class URLValidatorTest {



    private ShortenRequest shortenRequest;

    @InjectMocks
    private URLValidator urlValidator;

    @Test

    void testValidateURL() {
        URLValidator urlValidator = new URLValidator();
        urlValidator.validateURL("https://github.com/egovernments/DIGIT-Dev");

    }
}

