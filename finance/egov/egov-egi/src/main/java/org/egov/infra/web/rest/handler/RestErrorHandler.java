package org.egov.infra.web.rest.handler;

import java.io.IOException;

import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatus.Series;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.ResponseErrorHandler;

public class RestErrorHandler implements ResponseErrorHandler {
    private static final Logger LOGGER = Logger.getLogger(RestErrorHandler.class);

	@Override
	public boolean hasError(ClientHttpResponse response) throws IOException {
		
		return (response.getStatusCode().series()==Series.CLIENT_ERROR || 
			   response.getStatusCode().series()==Series.SERVER_ERROR);
	}

	  @Override
	    public void handleError(ClientHttpResponse httpResponse) 
	      throws IOException {
	      LOGGER.info("HTTPResponse -"+httpResponse.getStatusCode() +":"+ httpResponse.getStatusText());
	        if (httpResponse.getStatusCode()
	          .series() == HttpStatus.Series.SERVER_ERROR) {
	        } else if (httpResponse.getStatusCode()
	          .series() == HttpStatus.Series.CLIENT_ERROR) {
	            if (httpResponse.getStatusCode() == HttpStatus.NOT_FOUND) {
	                throw new IOException();
	            }
	        }
	    }


}
