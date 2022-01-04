package org.egov.encryption.util;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;

@Slf4j
public class JacksonUtilsTest {

    ObjectMapper mapper;

    @Before
    public void initializeCommonObjects() {
        JsonFactory jsonFactory = new JsonFactory();
        mapper = new ObjectMapper(jsonFactory);
    }

    @Test
    public void superimposeEncryptedDataOnOriginalNodeTest() throws IOException {
        JsonNode originalNode = mapper.readTree("{\"RequestInfo\":{\"api_id\":\"1\",\"ver\":\"1\",\"ts\":null," +
                "\"action\":\"create\",\"did\":\"\",\"key\":\"\",\"msg_id\":\"\",\"requester_id\":\"\"," +
                "\"auth_token\":null},\"User\":{\"userName\":\"ajay\",\"name\":\"ajay\",\"gender\":\"male\"," +
                "\"mobileNumber\":\"12312312\",\"active\":true,\"type\":\"CITIZEN\",\"password\":\"password\"}}");

        JsonNode encryptedNode = mapper.readTree("{\"User\":{\"userName\":\"123|jkafsdhkjhalfsj\",\"name\":\"123|" +
                "jkafsdhkjhalfsj\",\"mobileNumber\":\"123|hdskjahkjfk\"}}");

        JsonNode outputNode = JacksonUtils.merge(encryptedNode, originalNode);

        JsonNode expectedNode = mapper.readTree("{\"RequestInfo\":{\"api_id\":\"1\",\"ver\":\"1\",\"ts\":null," +
                "\"action\":\"create\",\"did\":\"\",\"key\":\"\",\"msg_id\":\"\",\"requester_id\":\"\"," +
                "\"auth_token\":null},\"User\":{\"userName\":\"123|jkafsdhkjhalfsj\"," +
                "\"name\":\"123|jkafsdhkjhalfsj\",\"gender\":\"male\",\"mobileNumber\":\"123|hdskjahkjfk\"," +
                "\"active\":true,\"type\":\"CITIZEN\",\"password\":\"password\"}}");

        assertEquals(expectedNode, outputNode);

    }

    @Test
    public void filterJsonNode() throws IOException {

        JsonNode originalNode = mapper.readTree("{\"RequestInfo\":{\"api_id\":\"1\",\"ver\":\"1\",\"ts\":null," +
                "\"action\":\"create\",\"did\":\"\",\"key\":\"\",\"msg_id\":\"\",\"requester_id\":\"\"," +
                "\"auth_token\":null},\"User\":{\"userName\":\"ajay\",\"name\":\"ajay\",\"gender\":\"male\"," +
                "\"mobileNumber\":\"12312312\",\"active\":true,\"type\":\"CITIZEN\",\"password\":\"password\"}}");

        List fieldsToBeEncrypted = Arrays.asList("userName", "name", "mobileNumber");

        JsonNode outputNode = JacksonUtils.filterJsonNodeWithFields(originalNode, fieldsToBeEncrypted);

        JsonNode expectedNode = mapper.readTree("{\"User\":{\"userName\":\"ajay\",\"name\":\"ajay\"," +
                "\"mobileNumber\":\"12312312\"}}");

        assertEquals(expectedNode, outputNode);
    }

    @Test
    public void filterJsonNodeWithNoMatchingFields() throws IOException {
        JsonNode originalNode = mapper.readTree("{\"RequestInfo\":{\"api_id\":\"1\",\"ver\":\"1\",\"ts\":null," +
                "\"action\":\"create\",\"did\":\"\",\"key\":\"\",\"msg_id\":\"\",\"requester_id\":\"\"," +
                "\"auth_token\":null},\"User\":{\"userName\":\"ajay\",\"name\":\"ajay\",\"gender\":\"male\"," +
                "\"mobileNumber\":\"12312312\",\"active\":true,\"type\":\"CITIZEN\",\"password\":\"password\"}}");

        List fieldsToBeEncrypted = Arrays.asList();

        JsonNode outputNode = JacksonUtils.filterJsonNodeWithFields(originalNode, fieldsToBeEncrypted);

        assertEquals(null, outputNode);

    }

    @Test
    public void checkIfAnyFieldExistsInJsonNode() throws IOException {
        JsonNode originalNode = mapper.readTree("{\"tenantDetails\":{\"tenantId\":\"pb.amritsar\"}," +
                "\"name\":{\"firstName\":\"Customer Name\"}}");
        List<String> fields = Arrays.asList("firstName");
        assertEquals(false, JacksonUtils.checkIfNoFieldExistsInJsonNode(originalNode, fields));
    }

    @Test
    public void checkIfNoFieldExistsInJsonNode() throws IOException {
        JsonNode originalNode = mapper.readTree("{\"tenantDetails\":{\"tenantId\":\"pb.amritsar\"}," +
                "\"name\":{\"firstName\":\"Customer Name\"}}");
        List<String> fields = Arrays.asList("asd");
        assertEquals(true, JacksonUtils.checkIfNoFieldExistsInJsonNode(originalNode, fields));
    }


    @Test
    public void filterJsonNodeForPathTest() throws IOException {
        JsonNode jsonNode = mapper.readTree("{\"RequestInfo\":{\"api_id\":\"1\",\"ver\":\"1\",\"ts\":null," +
                "\"action\":\"create\",\"did\":\"\",\"key\":\"\",\"msg_id\":\"\",\"requester_id\":\"\"," +
                "\"auth_token\":null},\"User\":[{\"userName\":\"ajay\",\"gender\":\"male\"," +
                "\"mobileNumber\":\"12312312\",\"active\":true,\"type\":\"CITIZEN\",\"password\":\"password\"}," +
                "{\"userName\":\"ajay\",\"name\":\"ajay\",\"gender\":\"male\",\"mobileNumber\":\"12312312\"," +
                "\"active\":true,\"type\":\"CITIZEN\",\"password\":\"password\"}]}");


        JsonNode newNode = JacksonUtils.filterJsonNodeForPaths(jsonNode, Arrays.asList("User/*/name", "RequestInfo" +
                "/api_id", "asd/qwe"));

        JsonNode expectedNode = mapper.readTree("{\"RequestInfo\":{\"api_id\":\"1\"},\"User\":[{},{\"name\":\"ajay\"}]}");

        assertEquals(expectedNode, newNode);
    }

    @Test
    public void test() throws IOException {

        JsonNode jsonNode = mapper.readTree("[{\"key\":126,\"uuid\":\"bb67df56-3a2d-4892-9e0a-b6f02cc525d8\"," +
                "\"tenantId\":\"pb.amritsar\",\"username\":\"785515|BxWK0HrbI2iyfcGyqEO3wovO8IsyIAnU\"," +
                "\"title\":null,\"password\":\"$2a$10$d2wVj8WZgVDv2rGkmCWskOUMR3lwB6u5itnIn1Fdf9SkmITk7UGmu\"," +
                "\"salutation\":null,\"guardian\":\"785515|IhuDk17SYzKwDptHupfwUWkv7Vf7WO+PRJk=\"," +
                "\"guardianRelation\":null,\"name\":\"785515|HheDx0fddjewkpIXq8AJOByREfokf6c1Xw==\"," +
                "\"gender\":\"MALE\",\"mobileNumber\":\"785515|W0DDgiqKISfHRkC0NdtJaubFLRRNpcE=\"," +
                "\"emailId\":\"785515|EguK83/edjO5Ug2GH2rax9xyzGGwec0BaePMsJs=\"," +
                "\"altContactNumber\":\"785515|U0vJhCCLL2PtSrBrhHHxnfIaFu7HbwqVpT8=\"," +
                "\"pan\":\"785515|CxyT23DbfzK9nnp0M8puv2zuHBBP+PNydg==\"," +
                "\"aadhaarNumber\":\"785515|XUDHgC+FJG3nSl3eQIcoWKc57lX/QLpPvcx7Rvg=\"," +
                "\"permanentAddress\":{\"pinCode\":\"454040\",\"city\":\"Mumbai\"," +
                "\"address\":\"785515|Bx2Y0nTfdnqyHQKAUs6+0WAFy0PgJY7CpVpvyhkoACD7ZTI=\",\"type\":\"PERMANENT\"," +
                "\"key\":70,\"tenantId\":\"pb.amritsar\",\"userId\":126,\"addressType\":\"PERMANENT\"," +
                "\"lastModifiedBy\":null,\"lastModifiedDate\":null}," +
                "\"correspondenceAddress\":{\"pinCode\":\"111111\",\"city\":\"bangalore\"," +
                "\"address\":\"785515|DxWfxTjAYyiwGU6ME8mgROhcA2g6ARrCO+5Yj9Ha\",\"type\":\"CORRESPONDENCE\"," +
                "\"key\":69,\"tenantId\":\"pb.amritsar\",\"userId\":126,\"addressType\":\"CORRESPONDENCE\"," +
                "\"lastModifiedBy\":null,\"lastModifiedDate\":null},\"addresses\":[{\"pinCode\":\"111111\"," +
                "\"city\":\"bangalore\",\"address\":\"785515|DxWfxTjAYyiwGU6ME8mgROhcA2g6ARrCO+5Yj9Ha\"," +
                "\"type\":\"CORRESPONDENCE\",\"key\":69,\"tenantId\":\"pb.amritsar\",\"userId\":126," +
                "\"addressType\":\"CORRESPONDENCE\",\"lastModifiedBy\":null,\"lastModifiedDate\":null}," +
                "{\"pinCode\":\"454040\",\"city\":\"Mumbai\"," +
                "\"address\":\"785515|Bx2Y0nTfdnqyHQKAUs6+0WAFy0PgJY7CpVpvyhkoACD7ZTI=\",\"type\":\"PERMANENT\"," +
                "\"key\":70,\"tenantId\":\"pb.amritsar\",\"userId\":126,\"addressType\":\"PERMANENT\"," +
                "\"lastModifiedBy\":null,\"lastModifiedDate\":null}],\"active\":true," +
                "\"roles\":[{\"name\":\"Employee\",\"code\":\"EMPLOYEE\",\"description\":\"Default role for all " +
                "employees\",\"createdBy\":null,\"createdDate\":null,\"lastModifiedBy\":null," +
                "\"lastModifiedDate\":null,\"tenantId\":\"pb.amritsar\"}],\"dob\":\"1990-07-23\"," +
                "\"passwordExpiryDate\":1559548533586,\"locale\":\"en_us\",\"type\":\"EMPLOYEE\",\"bloodGroup\":null," +
                "\"identificationMark\":null,\"signature\":null,\"photo\":null,\"accountLocked\":false," +
                "\"lastModifiedDate\":1551772534229,\"createdDate\":1551772534229,\"otpReference\":null," +
                "\"createdBy\":0,\"lastModifiedBy\":0,\"loggedInUserId\":null,\"otpValidationMandatory\":false," +
                "\"mobileValidationMandatory\":false}]");

        List<String> paths = Arrays.asList("*/name", "*/mobileNumber", "*/emailId", "*/username", "*/guardian",
                "*/altContactNumber", "*/pan", "*/aadhaarNumber", "*/guardianRelation", "*/permanentAddress/address",
                "*/correspondenceAddress/address", "*/addresses/*/address");

        paths = Arrays.asList("*/name", "*/mobileNumber", "*/guardianRelation");

        JsonNode outputNode = JacksonUtils.filterJsonNodeForPaths(jsonNode, paths);

        log.info(String.valueOf(outputNode));

    }


    @Test
    public void test1() throws IOException {

        JsonNode jsonNode = mapper.readTree("{\"key\":126,\"uuid\":\"bb67df56-3a2d-4892-9e0a-b6f02cc525d8\"," +
                "\"tenantId\":\"pb.amritsar\",\"username\":\"785515|BxWK0HrbI2iyfcGyqEO3wovO8IsyIAnU\"," +
                "\"title\":null,\"password\":\"$2a$10$d2wVj8WZgVDv2rGkmCWskOUMR3lwB6u5itnIn1Fdf9SkmITk7UGmu\"," +
                "\"salutation\":null,\"guardian\":\"785515|IhuDk17SYzKwDptHupfwUWkv7Vf7WO+PRJk=\"," +
                "\"guardianRelation\":null,\"name\":\"785515|HheDx0fddjewkpIXq8AJOByREfokf6c1Xw==\"," +
                "\"gender\":\"MALE\",\"mobileNumber\":\"785515|W0DDgiqKISfHRkC0NdtJaubFLRRNpcE=\"," +
                "\"emailId\":\"785515|EguK83/edjO5Ug2GH2rax9xyzGGwec0BaePMsJs=\"," +
                "\"altContactNumber\":\"785515|U0vJhCCLL2PtSrBrhHHxnfIaFu7HbwqVpT8=\"," +
                "\"pan\":\"785515|CxyT23DbfzK9nnp0M8puv2zuHBBP+PNydg==\"," +
                "\"aadhaarNumber\":\"785515|XUDHgC+FJG3nSl3eQIcoWKc57lX/QLpPvcx7Rvg=\"," +
                "\"permanentAddress\":{\"pinCode\":\"454040\",\"city\":\"Mumbai\"," +
                "\"address\":\"785515|Bx2Y0nTfdnqyHQKAUs6+0WAFy0PgJY7CpVpvyhkoACD7ZTI=\",\"type\":\"PERMANENT\"," +
                "\"key\":70,\"tenantId\":\"pb.amritsar\",\"userId\":126,\"addressType\":\"PERMANENT\"," +
                "\"lastModifiedBy\":null,\"lastModifiedDate\":null}," +
                "\"correspondenceAddress\":{\"pinCode\":\"111111\",\"city\":\"bangalore\"," +
                "\"address\":\"785515|DxWfxTjAYyiwGU6ME8mgROhcA2g6ARrCO+5Yj9Ha\",\"type\":\"CORRESPONDENCE\"," +
                "\"key\":69,\"tenantId\":\"pb.amritsar\",\"userId\":126,\"addressType\":\"CORRESPONDENCE\"," +
                "\"lastModifiedBy\":null,\"lastModifiedDate\":null},\"addresses\":[{\"pinCode\":\"111111\"," +
                "\"city\":\"bangalore\",\"address\":\"785515|DxWfxTjAYyiwGU6ME8mgROhcA2g6ARrCO+5Yj9Ha\"," +
                "\"type\":\"CORRESPONDENCE\",\"key\":69,\"tenantId\":\"pb.amritsar\",\"userId\":126," +
                "\"addressType\":\"CORRESPONDENCE\",\"lastModifiedBy\":null,\"lastModifiedDate\":null}," +
                "{\"pinCode\":\"454040\",\"city\":\"Mumbai\"," +
                "\"address\":\"785515|Bx2Y0nTfdnqyHQKAUs6+0WAFy0PgJY7CpVpvyhkoACD7ZTI=\",\"type\":\"PERMANENT\"," +
                "\"key\":70,\"tenantId\":\"pb.amritsar\",\"userId\":126,\"addressType\":\"PERMANENT\"," +
                "\"lastModifiedBy\":null,\"lastModifiedDate\":null}],\"active\":true," +
                "\"roles\":[{\"name\":\"Employee\",\"code\":\"EMPLOYEE\",\"description\":\"Default role for all " +
                "employees\",\"createdBy\":null,\"createdDate\":null,\"lastModifiedBy\":null," +
                "\"lastModifiedDate\":null,\"tenantId\":\"pb.amritsar\"}],\"dob\":\"1990-07-23\"," +
                "\"passwordExpiryDate\":1559548533586,\"locale\":\"en_us\",\"type\":\"EMPLOYEE\",\"bloodGroup\":null," +
                "\"identificationMark\":null,\"signature\":null,\"photo\":null,\"accountLocked\":false," +
                "\"lastModifiedDate\":1551772534229,\"createdDate\":1551772534229,\"otpReference\":null," +
                "\"createdBy\":0,\"lastModifiedBy\":0,\"loggedInUserId\":null,\"otpValidationMandatory\":false," +
                "\"mobileValidationMandatory\":false}");

        List<String> paths = Arrays.asList("*/name", "*/mobileNumber", "*/emailId", "*/username", "*/guardian",
                "*/altContactNumber", "*/pan", "*/aadhaarNumber", "*/guardianRelation", "*/permanentAddress/address",
                "*/correspondenceAddress/address", "*/addresses/*/address");

        paths = Arrays.asList("name", "mobileNumber", "guardianRelation");

        JsonNode outputNode = JacksonUtils.filterJsonNodeForPaths(jsonNode, paths);

        log.info(String.valueOf(outputNode));

    }



}