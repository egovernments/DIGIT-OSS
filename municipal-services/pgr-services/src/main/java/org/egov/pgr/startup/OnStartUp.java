package org.egov.pgr.startup;

import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.json.JSONObject;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;

@Slf4j
public class OnStartUp {

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


}
