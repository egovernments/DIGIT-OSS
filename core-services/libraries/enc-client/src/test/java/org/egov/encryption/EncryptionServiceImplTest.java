package org.egov.encryption;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Slf4j
//@RunWith(SpringJUnit4ClassRunner.class)
//@EnableConfigurationProperties
//@SpringBootTest(classes = TestConfiguration.class)
public class EncryptionServiceImplTest {

    @Autowired
    private EncryptionServiceImpl encryptionServiceImpl;

    ObjectMapper mapper;
    User user;

    @Before
    public void init() throws InstantiationException, IllegalAccessException, IOException {
        Role role1 = Role.builder().code("GRO").build();
        Role role2 = Role.builder().code("LME").build();
        user = User.builder().roles(Arrays.asList(role1, role2)).build();

        mapper = new ObjectMapper(new JsonFactory());

    }


    @Ignore
    @Test
    public void encryptValueTest() throws IOException {
        log.info( encryptionServiceImpl.encryptValue(1, "pb", "Normal") );
    }

    @Ignore
    @Test
    public void encryptJsonUsingKey() throws IOException {
        JsonNode plaintext = mapper.readTree("{\"RequestInfo\":{\"api_id\":\"1\",\"ver\":\"1\",\"ts\":null," +
                "\"action\":\"create\",\"did\":\"\",\"key\":\"\",\"msg_id\":\"\",\"requester_id\":\"\"," +
                "\"auth_token\":null},\"User\":{\"userName\":\"ajay\",\"name\":\"ajay\",\"gender\":\"male\"," +
                "\"mobileNumber\":\"12312312\",\"active\":true,\"type\":\"CITIZEN\",\"password\":\"password\"}}");

        JsonNode ciphertext = encryptionServiceImpl.encryptJson(plaintext, "User", "pb");
        log.info(ciphertext.toString());
    }


    @Ignore
    @Test
    public void decryptJsonArrayUsingRoles() throws IOException {
        JsonNode ciphertext = mapper.readTree("[{\"User\":{\"mobileNumber\":\"341642|WfYfJPRug15R2wFh17PlQr5d9YhNkFk1" +
                "\",\"name\":\"341642|Ca5NbGHu3aB2ufjrNfZarW1VGBA=\"," +
                "\"userName\":\"341642|Ca5NbGHu3aB2ufjrNfZarW1VGBA=\",\"gender\":\"male\",\"active\":true," +
                "\"type\":\"CITIZEN\",\"password\":\"password\"},\"RequestInfo\":{\"api_id\":\"1\",\"ver\":\"1\"," +
                "\"ts\":null,\"action\":\"create\",\"did\":\"\",\"key\":\"\",\"msg_id\":\"\",\"requester_id\":\"\"," +
                "\"auth_token\":null}}]");
        User user = User.builder().roles(Arrays.asList(Role.builder().code("GRO").build())).build();
        JsonNode plaintext = encryptionServiceImpl.decryptJson(ciphertext, "PGR-Complaints-Report", user);
        log.info(plaintext.toString());
    }

    @Ignore
    @Test
    public void decryptJsonObjectUsingRoles() throws IOException {
        JsonNode ciphertext = mapper.readTree("{\"User\":{\"mobileNumber\":\"341642|WfYfJPRug15R2wFh17PlQr5d9YhNkFk1" +
                "\",\"name\":\"341642|Ca5NbGHu3aB2ufjrNfZarW1VGBA=\"," +
                "\"userName\":\"341642|Ca5NbGHu3aB2ufjrNfZarW1VGBA=\",\"gender\":\"male\",\"active\":true," +
                "\"type\":\"CITIZEN\",\"password\":\"password\"},\"RequestInfo\":{\"api_id\":\"1\",\"ver\":\"1\"," +
                "\"ts\":null,\"action\":\"create\",\"did\":\"\",\"key\":\"\",\"msg_id\":\"\",\"requester_id\":\"\"," +
                "\"auth_token\":null}}");
        User user = User.builder().roles(Arrays.asList(Role.builder().code("GRO").build())).build();
        JsonNode plaintext = encryptionServiceImpl.decryptJson(ciphertext, "PGR-Complaints-Report", user, JsonNode.class);
        log.info(plaintext.toString());
    }

    @Ignore
    @Test
    public void test() throws IOException {
        Map<String, Object> data = new HashMap<>();
        data.put("name", "341642|Ca5NbGHu3aB2ufjrNfZarW1VGBA=");
        data.put("mobileNumber", "341642|WfYfJPRug15R2wFh17PlQr5d9YhNkFk1");
        user.setRoles(Arrays.asList(Role.builder().code("CITIZEN").build()));

        data = encryptionServiceImpl.decryptJson(data, "User", user, Map.class);
        log.info(String.valueOf(data));
    }


}