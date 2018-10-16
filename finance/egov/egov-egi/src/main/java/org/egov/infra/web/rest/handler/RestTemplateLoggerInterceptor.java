package org.egov.infra.web.rest.handler;

import java.io.IOException;
import java.nio.charset.Charset;

import org.apache.log4j.Logger;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.util.StreamUtils;

public class RestTemplateLoggerInterceptor implements ClientHttpRequestInterceptor {

    private static final Logger LOGGER = Logger.getLogger(RestTemplateLoggerInterceptor.class);
    
    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution)
            throws IOException {
        System.out.println("**************** recieved request***********");
        logRequest(request, body);
        ClientHttpResponse response = execution.execute(request, body);
        logResponse(response);
        
        return response;
    }
    

    private void logRequest(HttpRequest request,byte[] body) throws IOException{
//        if(LOGGER.isDebugEnabled()){
//            LOGGER.debug("URI          "+request.getURI());
//            LOGGER.debug("Method       "+request.getMethod());
//            LOGGER.debug("Headers      "+request.getHeaders());
//            LOGGER.debug("Request body "+new String(body,"UTF-8"));
//        }
        
        LOGGER.info("URI          "+request.getURI());
        LOGGER.info("Method       "+request.getMethod());
        LOGGER.info("Headers      "+request.getHeaders());
        LOGGER.info("Request body "+new String(body,"UTF-8"));
      
        
        
    }
    
    private void logResponse(ClientHttpResponse response) throws IOException{
        
//        if(LOGGER.isDebugEnabled()){
//            LOGGER.debug("Status       "+response.getRawStatusCode());
//            LOGGER.debug("Status text  "+response.getStatusText());
//            LOGGER.debug("Headers      "+response.getHeaders());
//            LOGGER.debug("Response body"+StreamUtils.copyToString(response.getBody(), Charset.defaultCharset()));
//        }
        
      LOGGER.info("Status       "+response.getRawStatusCode());
      LOGGER.info("Status text  "+response.getStatusText());
      LOGGER.info("Headers      "+response.getHeaders());
      LOGGER.info("Response body"+StreamUtils.copyToString(response.getBody(), Charset.defaultCharset()));
       
        
    }
    
    
    

}
