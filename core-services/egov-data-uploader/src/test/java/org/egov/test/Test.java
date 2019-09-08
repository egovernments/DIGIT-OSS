package org.egov.test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.jayway.jsonpath.JsonPath;
import org.egov.dataupload.model.Document;
import org.egov.dataupload.model.UploadDefinition;
import org.egov.dataupload.utils.DataUploadUtils;
import org.junit.Ignore;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Ignore
public class Test {

    private DataUploadUtils dataUploadUtils = new DataUploadUtils();

    @org.junit.Test
    public void testGroupingRowsByIndex() throws Exception{
        Document document = dataUploadUtils.readExcelFile(new FileInputStream
                ("C:\\Users\\Nithin\\Documents\\eGov\\egov-services\\core\\egov-data-uploader\\src\\main\\resources" +
                        "\\Immovable_Asset_Template (1).xls"));
        List<Integer> integers = Arrays.asList(0, 3);
        System.out.println(DataUploadUtils.groupRowsByIndexes(document.getRows(), integers));

    }

    @org.junit.Test
    public void testFlatDataUpload() throws Exception{
        Document document = dataUploadUtils.readExcelFile(new FileInputStream
                ("C:\\Users\\Nithin\\Documents\\eGov\\egov-services\\core\\egov-data-uploader\\src\\main\\resources" +
                        "\\Immovable_Asset_Template (1).xls"));
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        UploadDefinition uploadDefinition = mapper.readValue(new FileInputStream
                ("C:\\Users\\Nithin\\Documents\\eGov\\egov-services\\core\\egov-data" +
                "-uploader\\src\\main\\resources" +
                "\\assets.yml"), UploadDefinition.class);
    }

    @org.junit.Test
    public void test() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = "{\"RequestInfo\": null,\"Asset\":{\"anticipatedLife\":15,\"orderNumber\":\"\"," +
                "\"orderDate\":\"\",\"wipReferenceNo\":\"\",\"acquiredFrom\":\"\",\"warrantyAvailable\":false,\"securityDepositRetained\":0,\"securityDepositRealized\":0,\"acquisitionDate\":1417153591000,\"originalValue\":0,\"address\":\"\",\"longitude\":\"\",\"latitude\":\"\",\"tenantId\":\"default\",\"name\":\"corpoaration land\",\"oldCode\":\"oldCodecorpland\",\"department\":{\"id\":null,\"name\":null,\"code\":\"TP\"},\"assetCategory\":{\"name\":\"Open Land\",\"code\":\"043\"},\"modeOfAcquisition\":{\"code\":\"ACQUIRED\"},\"grossValue\":7000000,\"accumulatedDepreciationAccount\":45653245,\"revaluationReserveAccount\":\"\",\"depreciationExpenseAccount\":\"\",\"assetAccount\":\"\",\"description\":\"trucks\",\"dateOfCreation\":13112017,\"defectLiabilityPeriod\":{\"year\":\"1\",\"month\":\"2\",\"day\":\"3\"},\"location\":null,\"fundSource\":null,\"openingDate\":123455656,\"landDetails\":[{}]}}\n";
        System.out.println( JsonPath.read(json, "$.155").toString());
//        JsonNode tree = mapper.readTree(json);
//        StringBuilder builder = new StringBuilder();
//        process(tree, new Object(), builder);
//        System.out.println(builder.toString());
    }


    private void process(JsonNode node, Object result, StringBuilder message) {
        if(!node.get("dependantRequest").isNull()) {
            process(node.get("dependantRequest"), result, message);
        }
        System.out.println(result);
        result = node.get("isParentChild").asBoolean();
        message.append(node.get("uri"));

    }

    @org.junit.Test
    public void readDefinition() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        UploadDefinition definition = mapper.readValue(new FileInputStream("C:\\Users\\Nithin\\Documents\\eGov\\egov-services\\core\\egov-data-uploader\\src\\main\\resources" +
                "\\assets.json"), UploadDefinition.class);
        System.out.println(definition);
    }

    @org.junit.Test
    public void name() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        List<Object> list1 = objectMapper.readValue("[{\"code\":\"EMPLOYEE\"}]", List.class);
        List<Object> list2 = objectMapper.readValue("[{\"code\":\"EMPLOYEE\"}]", List.class);
        System.out.println(list1.get(0).getClass());
        System.out.println(list1.containsAll(list2));
    }
}
