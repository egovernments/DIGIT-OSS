package org.egov.infra.mdms.avm.api;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.stereotype.Component;

@Component
public class ApiIntegration {
	
	private static String MCA_COMPANY_INFO ="https://apisetu.gov.in/mca/v1/companies";
	private static String URL_GSTIN = "https://apisetu.gov.in/gstn/v2/taxpayers/";
	//
	

	public StringBuffer getMcaCompanyInformation() throws ClientProtocolException, IOException {
		
		String cin = "U72200CH1998PTC022006";
		
		System.out.println("url is : " + MCA_COMPANY_INFO+"/"+cin);
	
		CloseableHttpClient httpClient = HttpClients.createDefault();
		HttpGet httpGet = new HttpGet(MCA_COMPANY_INFO+"/"+cin);
		httpGet.addHeader("accept", "application/json");
		httpGet.addHeader("X-APISETU-CLIENTID", "in.gov.tcpharyana");
		httpGet.addHeader("X-APISETU-APIKEY", "PDSHazinoV47E18bhNuBVCSEm90pYjEF");
		CloseableHttpResponse httpResponse = httpClient.execute(httpGet);
		
		BufferedReader reader = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
		String inputLine;
		StringBuffer response = new StringBuffer();

		while ((inputLine = reader.readLine()) != null) {
			response.append(inputLine);
		}
		System.out.println("get company info : " + response);
		reader.close();
		
		
		//HttpEntity stringEntity = new StringEntity(jsonString,ContentType.APPLICATION_JSON);
		return response;
	}
	
	
	public StringBuffer getGstInInfo() throws ClientProtocolException, IOException {
		
		String cin = "18AABCU9603R1ZM";
		CloseableHttpClient httpClient = HttpClients.createDefault();
		HttpGet httpGet = new HttpGet(MCA_COMPANY_INFO+"/"+cin);
		httpGet.addHeader("accept", "application/json");
		httpGet.addHeader("X-APISETU-CLIENTID", "in.gov.tcpharyana");
		httpGet.addHeader("X-APISETU-APIKEY", "MdqP0CrfvKwYd8SAjoZQiGKjWfQDlDWz");
		CloseableHttpResponse httpResponse = httpClient.execute(httpGet);
		
		BufferedReader reader = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
		String inputLine;
		StringBuffer response = new StringBuffer();

		while ((inputLine = reader.readLine()) != null) {
			response.append(inputLine);
		}
		System.out.println("get gstin info : " + response);
		reader.close();
	
		return response;
	}
	
	
	

}
