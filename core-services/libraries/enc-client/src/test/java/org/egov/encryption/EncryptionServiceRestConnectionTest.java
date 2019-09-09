package org.egov.encryption;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.mockito.Mock;

public class EncryptionServiceRestConnectionTest {

    @Mock
    private EncryptionServiceRestConnection encryptionServiceRestConnection;

    private ObjectMapper mapper;

    @Before
    public void initialize() {
        encryptionServiceRestConnection = new EncryptionServiceRestConnection();
        mapper = new ObjectMapper(new JsonFactory());
    }


}