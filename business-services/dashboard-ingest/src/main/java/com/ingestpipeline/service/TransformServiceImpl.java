package com.ingestpipeline.service;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bazaarvoice.jolt.Chainr;
import com.bazaarvoice.jolt.JsonUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.ingestpipeline.model.DigressionPoint;
import com.ingestpipeline.util.ConfigLoader;
import com.ingestpipeline.util.Constants;
	
/**
 * This is a Service Implementation for all the actions which are with respect to Elastic Search 
 * @author Darshan Nagesh
 *
 */
@Service(Constants.Qualifiers.TRANSFORM_SERVICE)
public class TransformServiceImpl implements TransformService {
	
	public static final Logger LOGGER = LoggerFactory.getLogger(TransformServiceImpl.class);
	private static final String SEPARATOR = "_"; 
	private static final String JSON_EXTENSION = ".json"; 
	private static final String OBJECTIVE = "transform"; 
	private static final String CONFIGROOT = "config/";
	
	@Autowired
	private ConfigLoader configLoader;

	@Override
	public Boolean transformData(Map incomingData) {
		String dataContext = incomingData.get(Constants.DATA_CONTEXT).toString(); 
		String dataContextVersion = incomingData.get(Constants.DATA_CONTEXT_VERSION).toString();
		List chainrSpecJSON = null ;
		InputStream inputStream = null;
		try {
			String sourceUrl = CONFIGROOT.concat(OBJECTIVE.concat(SEPARATOR).concat(dataContext).concat(SEPARATOR).concat(dataContextVersion).concat(JSON_EXTENSION));
			inputStream = this.getClass().getClassLoader().getResourceAsStream(sourceUrl);
			chainrSpecJSON = JsonUtils.jsonToList(inputStream);

		} catch (Exception e) {
			LOGGER.error("Encountered an error : " + e.getMessage());
		}
		finally {
			IOUtils.closeQuietly(inputStream);
		}

       Chainr chainr = Chainr.fromSpec( chainrSpecJSON );
        Object inputJSON = incomingData.get(Constants.DATA_OBJECT);
        try { 
            Object transformedOutput = chainr.transform( inputJSON );
            incomingData.put(Constants.DATA_OBJECT , transformedOutput);
            return Boolean.TRUE; 
        } catch (Exception e) { 
        	LOGGER.error("Encountered an error while tranforming the JSON : " + e.getMessage());
        	return Boolean.FALSE; 
        }
	}
	
	public Boolean digressData(Object dataObject, DigressionPoint digressionPoint) {
		ObjectMapper mapper = new ObjectMapper();
		Gson gson = new Gson(); 
		try {
	    	mapper.readTree(gson.toJson(dataObject));
		} catch (Exception ex) {
			LOGGER.error("Encountered an error while converting the data to JSON Node : " + ex.getMessage());
		} 
		return null;
	}
}
 