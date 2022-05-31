package org.egov.pgr.startup;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONObject;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public class OnStartUp {

    String token;

    @EventListener(ApplicationReadyEvent.class)
    public void createSuperUser() throws URISyntaxException, IOException {

        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost("http://localhost:8080/user/users/_createnovalidate");
        URI url = new URI("http://localhost:8080/user/users/_createnovalidate");
        String jsonString = "{\n" +
                "    \"requestInfo\": {\n" +
                "        \"apiId\": \"Rainmaker\",\n" +
                "        \"ver\": \".01\",\n" +
                "        \"ts\": null,\n" +
                "        \"action\": \"_update\",\n" +
                "        \"did\": \"1\",\n" +
                "        \"key\": \"\",\n" +
                "        \"msgId\": \"20170310130900|en_IN\",\n" +
                "        \"authToken\": \"ec6a2db1-c000-4927-af21-f4ce13c1d75f\",\n" +
                "        \"userInfo\": {\n" +
                "            \"id\": 23287,\n" +
                "            \"uuid\": \"4632c941-cb1e-4b83-b2d4-200022c1a137\",\n" +
                "            \"userName\": \"PalashS\",\n" +
                "            \"name\": \"Palash S\",\n" +
                "            \"mobileNumber\": \"9949032246\",\n" +
                "            \"emailId\": null,\n" +
                "            \"type\": \"EMPLOYEE\",\n" +
                "            \"roles\": [\n" +
                "                {\n" +
                "                    \"name\": \"superuser\",\n" +
                "                    \"code\": \"SUPERUSER\",\n" +
                "                    \"tenantId\": \"pg.citya\"\n" +
                "                },\n" +
                "                {\n" +
                "                    \"name\": \"PGR Last Mile Employee\",\n" +
                "                    \"code\": \"PGR_LME\",\n" +
                "                    \"tenantId\": \"pg.citya\"\n" +
                "                },\n" +
                "                {\n" +
                "                    \"name\": \"superuser\",\n" +
                "                    \"code\": \"SUPERUSER\",\n" +
                "                    \"tenantId\": \"pg\"\n" +
                "                }\n" +
                "            ],\n" +
                "            \"tenantId\": \"pg.citya\"\n" +
                "        }\n" +
                "    },\n" +
                "    \"user\": {\n" +
                "        \"userName\": \"GRO\",\n" +
                "        \"name\": \"GRO\",\n" +
                "        \"gender\": null,\n" +
                "        \"mobileNumber\": \"8855899544\",\n" +
                "        \"type\": \"EMPLOYEE\",\n" +
                "        \"active\": true,\n" +
                "        \"password\": \"eGov@4321\",\n" +
                "        \"roles\": [\n" +
                "            {\n" +
                "                \"name\": \"Employee\",\n" +
                "                \"code\": \"EMPLOYEE\",\n" +
                "                \"tenantId\": \"pg\"\n" +
                "            },\n" +
                "            {\n" +
                "                \"name\": \"PGR LME\",\n" +
                "                \"code\": \"PGR_LME\",\n" +
                "                \"tenantId\": \"pg.citya\"\n" +
                "            },\n" +
                "            {\n" +
                "               \"code\": \"GRO\",\n" +
                "               \"name\": \"Grievance Routing Officer\",\n" +
                "               \"description\": null,\n" +
                "               \"tenantId\": \"pg.citya\"\n" +
                "            },\n" +
                "            {\n" +
                "                \"name\": \"superuser\",\n" +
                "                \"code\": \"SUPERUSER\",\n" +
                "                \"tenantId\": \"pg\"\n" +
                "            }\n" +
                "        ],\n" +
                "        \"tenantId\": \"pg.citya\"\n" +
                "    }\n" +
                "}";
        StringEntity entity = new StringEntity(jsonString);
        httpPost.setEntity(entity);
        httpPost.setHeader("Accept", "application/json");
        httpPost.setHeader("Content-type", "application/json");
        CloseableHttpResponse response = httpClient.execute(httpPost);
        log.info(String.valueOf(response.getStatusLine().getStatusCode()));
    }


    @EventListener(ApplicationReadyEvent.class)
    public void createCitizenUser() throws URISyntaxException, IOException {

        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost("http://localhost:8080/user/users/_createnovalidate");
        URI url = new URI("http://localhost:8080/user/users/_createnovalidate");
        String jsonString = "{\n" +
                "  \"requestInfo\": {\n" +
                "    \"apiId\": \"Rainmaker\",\n" +
                "    \"ver\": \".01\",\n" +
                "    \"ts\": null,\n" +
                "    \"action\": \"_update\",\n" +
                "    \"did\": \"1\",\n" +
                "    \"key\": \"\",\n" +
                "    \"msgId\": \"20170310130900|en_IN\",\n" +
                "    \"authToken\": \"dce88a06-7e09-4923-97f9-f15af2deea66\",\n" +
                "    \"userInfo\": {\n" +
                "      \"id\": 91,\n" +
                "      \"uuid\": \"8b67d214-5212-4639-bd8b-944a85161449\",\n" +
                "      \"userName\": \"PGRLME1\",\n" +
                "      \"name\": \"PGRLME\",\n" +
                "      \"mobileNumber\": \"9949032246\",\n" +
                "      \"emailId\": null,\n" +
                "      \"locale\": null,\n" +
                "      \"type\": \"EMPLOYEE\",\n" +
                "      \"roles\": [\n" +
                "        {\n" +
                "          \"name\": \"Employee\",\n" +
                "          \"code\": \"EMPLOYEE\",\n" +
                "          \"tenantId\": \"pg\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"PGR Last Mile Employee\",\n" +
                "          \"code\": \"PGR_LME\",\n" +
                "          \"tenantId\": \"pg.citya\"\n" +
                "        },\n" +
                "        {\n" +
                "          \"name\": \"Super User\",\n" +
                "          \"code\": \"SUPERUSER\",\n" +
                "          \"tenantId\": \"pg\"\n" +
                "        }\n" +
                "      ],\n" +
                "      \"active\": true,\n" +
                "      \"tenantId\": \"pg.citya\",\n" +
                "      \"permanentCity\": null\n" +
                "    }\n" +
                "  },\n" +
                "  \"user\": {\n" +
                "    \"userName\": \"9999999999\",\n" +
                "    \"name\": \"Rupesh\",\n" +
                "    \"gender\": \"Male\",\n" +
                "    \"mobileNumber\": \"9999999999\",\n" +
                "    \"type\": \"CITIZEN\",\n" +
                "    \"active\": true,\n" +
                "    \"password\": \"eGov@4321\",\n" +
                "    \"roles\": [\n" +
                "      {\n" +
                "        \"name\": \"Citizen\",\n" +
                "        \"code\": \"CITIZEN\",\n" +
                "        \"tenantId\": \"pg\"\n" +
                "      }\n" +
                "    ],\n" +
                "    \"tenantId\": \"pg.citya\"\n" +
                "  }\n" +
                "}";
        StringEntity entity = new StringEntity(jsonString);
        httpPost.setEntity(entity);
        httpPost.setHeader("Accept", "application/json");
        httpPost.setHeader("Content-type", "application/json");
        CloseableHttpResponse response = httpClient.execute(httpPost);
        log.info(String.valueOf(response.getStatusLine().getStatusCode()));
    }


    @EventListener(ApplicationReadyEvent.class)
    public void accessTokenGeneration() throws IOException {

        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost("http://quickstart.local.digit/user/oauth/token");
        List<NameValuePair> params = new ArrayList<NameValuePair>();
        params.add(new BasicNameValuePair("username", "GRO"));
        params.add(new BasicNameValuePair("password", "eGov@4321"));
        params.add(new BasicNameValuePair("grant_type", "password"));
        params.add(new BasicNameValuePair("scope", "read"));
        params.add(new BasicNameValuePair("tenantId", "pg.citya"));
        params.add(new BasicNameValuePair("userType", "EMPLOYEE"));
        httpPost.setEntity(new UrlEncodedFormEntity(params));
        httpPost.setHeader("authority", "quickstart.local.digit");
        httpPost.setHeader("sec-ch-ua", "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"");
        httpPost.setHeader("accept", "application/json, text/plain, */*");
        httpPost.setHeader("authorization", "Basic ZWdvdi11c2VyLWNsaWVudDo=");
        httpPost.setHeader("sec-ch-ua-mobile", "?0");
        httpPost.setHeader("user-agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36");
        httpPost.setHeader("content-type", "application/x-www-form-urlencoded");
        httpPost.setHeader("origin", "http://quickstart.local.digit");
        httpPost.setHeader("sec-fetch-site", "same-origin");
        httpPost.setHeader("sec-fetch-mode", "cors");
        httpPost.setHeader("sec-fetch-dest", "empty");
        httpPost.setHeader("referer", "http://quickstart.local.digit/employee/user/login");
        httpPost.setHeader("accept-language", "en-GB,en;q=0.9");

        CloseableHttpResponse response = httpClient.execute(httpPost);
        token = response.getEntity().getContent().toString();
        log.info(String.valueOf(response.getStatusLine().getStatusCode()));
    }


    @EventListener(ApplicationReadyEvent.class)
    public void upsertRainmakerCommon1 () throws IOException {

        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost("http://quickstart.local.digit/localization/messages/v1/_upsert");

        httpPost.setHeader("Content-Type", "application/json");
        FileInputStream fis = new FileInputStream("src/test/resources/requestBody/upsertrainmakercommon1.txt");
        String jsonString = IOUtils.toString(fis, "UTF-8");
        StringEntity entity = new StringEntity(jsonString);
        httpPost.setEntity(entity);
        CloseableHttpResponse response = httpClient.execute(httpPost);
        log.info(String.valueOf(response.getStatusLine().getStatusCode()));
    }


    @EventListener(ApplicationReadyEvent.class)
    public void upsertRainmakerCommon2 () throws IOException {

        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost("http://quickstart.local.digit/localization/messages/v1/_upsert");

        httpPost.setHeader("Content-Type", "application/json");

        FileInputStream fis = new FileInputStream("src/test/resources/requestBody/upsertrainmakercommon2.txt");
        String jsonString = IOUtils.toString(fis, "UTF-8");
        StringEntity entity = new StringEntity(jsonString);
        httpPost.setEntity(entity);
        CloseableHttpResponse response = httpClient.execute(httpPost);
        log.info(String.valueOf(response.getStatusLine().getStatusCode()));
    }


    @EventListener(ApplicationReadyEvent.class)
    public void upsertRainmakerCommon3 () throws IOException {

        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost("http://quickstart.local.digit/localization/messages/v1/_upsert");

        httpPost.setHeader("Content-Type", "application/json");

        FileInputStream fis = new FileInputStream("src/test/resources/requestBody/upsertrainmakercommon3.txt");
        String jsonString = IOUtils.toString(fis, "UTF-8");
        StringEntity entity = new StringEntity(jsonString);
        httpPost.setEntity(entity);
        CloseableHttpResponse response = httpClient.execute(httpPost);
        log.info(String.valueOf(response.getStatusLine().getStatusCode()));
    }


    @EventListener(ApplicationReadyEvent.class)
    public void upsertRainmakerPgr1 () throws IOException {

        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost("http://quickstart.local.digit/localization/messages/v1/_upsert");

        httpPost.setHeader("Content-Type", "application/json");

        FileInputStream fis = new FileInputStream("src/test/resources/requestBody/upsertrainmakerpgr1.txt");
        String jsonString = IOUtils.toString(fis, "UTF-8");
        StringEntity entity = new StringEntity(jsonString);
        httpPost.setEntity(entity);
        CloseableHttpResponse response = httpClient.execute(httpPost);
        log.info(String.valueOf(response.getStatusLine().getStatusCode()));
    }


    @EventListener(ApplicationReadyEvent.class)
    public void upsertRainmakerPgr2 () throws IOException {

        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost("http://quickstart.local.digit/localization/messages/v1/_upsert");

        httpPost.setHeader("Content-Type", "application/json");


        FileInputStream fis = new FileInputStream("src/test/resources/requestBody/upsertrainmakerpgr2.txt");
        String jsonString = IOUtils.toString(fis, "UTF-8");
        StringEntity entity = new StringEntity(jsonString);
        httpPost.setEntity(entity);
        CloseableHttpResponse response = httpClient.execute(httpPost);
        log.info(String.valueOf(response.getStatusLine().getStatusCode()));
    }


    @EventListener(ApplicationReadyEvent.class)
    public void hrmsEmployeeCreation () throws IOException {

        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost("http://quickstart.local.digit/egov-hrms/employees/_create?tenantId=pg.citya");

        httpPost.setHeader("authority", "quickstart.local.digit");
        httpPost.setHeader("accept", "application/json, text/plain, */*");
        httpPost.setHeader("user-agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36");
        httpPost.setHeader("content-type", "application/json;charset=UTF-8");
        httpPost.setHeader("origin", "quickstart.local.digit");
        httpPost.setHeader("sec-fetch-site", "same-origin");
        httpPost.setHeader("sec-fetch-mode", "cors");
        httpPost.setHeader("referer", "http://quickstart.local.digit/employee/hrms/review");
        httpPost.setHeader("accept-encoding", "gzip, deflate, br");
        httpPost.setHeader("accept-language", "en-GB,en-US;q=0.9,en;q=0.8");
        httpPost.setHeader("cookie", "SESSIONID=5afffb34-ca97-4132-9f59-cd19805446d8");
        String jsonString = "{\n" +
                "    \"RequestInfo\": {\n" +
                "        \"apiId\": \"Rainmaker\",\n" +
                "        \"ver\": \".01\",\n" +
                "        \"action\": \"\",\n" +
                "        \"did\": \"1\",\n" +
                "        \"key\": \"\",\n" +
                "        \"msgId\": \"20170310130900|en_IN\",\n" +
                "        \"requesterId\": \"\",\n" +
                "        \"authToken\": \"{{token}}\"\n" +
                "    },\n" +
                "    \"Employees\": [\n" +
                "        {\n" +
                "            \"employeeStatus\": \"EMPLOYED\",\n" +
                "            \"user\": {\n" +
                "                \"name\": \"Lata Naik\",\n" +
                "                \"mobileNumber\": \"7590609411\",\n" +
                "                \"fatherOrHusbandName\": \"test\",\n" +
                "                \"gender\": \"FEMALE\",\n" +
                "                \"dob\": 1534727942000,\n" +
                "                \"correspondenceAddress\": \"test\",\n" +
                "                \"roles\": [\n" +
                "                    {\n" +
                "                        \"code\": \"PGR_LME\",\n" +
                "                        \"name\": \"PGR Last Mile Employee\",\n" +
                "                        \"description\": null,\n" +
                "                        \"tenantId\": \"pg.citya\"\n" +
                "                    }\n" +
                "                ],\n" +
                "                \"tenantId\": \"pg.citya\"\n" +
                "            },\n" +
                "            \"code\": \"LATANAIK\",\n" +
                "            \"employeeType\": \"PERMANENT\",\n" +
                "            \"jurisdictions\": [\n" +
                "                {\n" +
                "                    \"hierarchy\": \"REVENUE\",\n" +
                "                    \"boundaryType\": \"City\",\n" +
                "                    \"boundary\": \"pg.citya\",\n" +
                "                    \"tenantId\": \"pg.citya\"\n" +
                "                }\n" +
                "            ],\n" +
                "            \"assignments\": [\n" +
                "                {\n" +
                "                    \"fromDate\": 1582137000000,\n" +
                "                    \"isCurrentAssignment\": true,\n" +
                "                    \"toDate\": null,\n" +
                "                    \"department\": \"DEPT_3\",\n" +
                "                    \"designation\": \"DESIG_01\"\n" +
                "                }\n" +
                "            ],\n" +
                "            \"serviceHistory\": [],\n" +
                "            \"education\": [],\n" +
                "            \"tests\": [],\n" +
                "            \"tenantId\": \"pg.citya\"\n" +
                "        }\n" +
                "    ]\n" +
                "}";
        StringEntity entity = new StringEntity(jsonString);
        httpPost.setEntity(entity);
        CloseableHttpResponse response = httpClient.execute(httpPost);
        log.info(String.valueOf(response.getStatusLine().getStatusCode()));
    }


    @EventListener(ApplicationReadyEvent.class)
    public void businessSvcWorkflowCreation () throws IOException {

        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost("http://quickstart.local.digit/egov-workflow-v2/egov-wf/businessservice/_create");

        httpPost.setHeader("Content-Type", "application/json");

        FileInputStream fis = new FileInputStream("src/test/resources/requestBody/businesssvcworkflowcreation.txt");
        String jsonString = IOUtils.toString(fis, "UTF-8");
        StringEntity entity = new StringEntity(jsonString);
        httpPost.setEntity(entity);
        CloseableHttpResponse response = httpClient.execute(httpPost);
        log.info(String.valueOf(response.getStatusLine().getStatusCode()));
    }
}
