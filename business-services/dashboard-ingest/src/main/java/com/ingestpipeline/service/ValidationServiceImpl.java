package com.ingestpipeline.service;

import java.util.HashMap;
import java.util.Map;

import org.everit.json.schema.Schema;
import org.everit.json.schema.ValidationException;
import org.everit.json.schema.loader.SchemaLoader;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.google.gson.GsonBuilder;
import com.ingestpipeline.util.Constants;

/**
 * This is a Service Implementation for all the actions which are with respect to Elastic Search 
 * @author Darshan Nagesh
 *
 */
@Service(Constants.Qualifiers.VALIDATOR_SERVICE)
public class ValidationServiceImpl implements ValidationService {
	
	public static final Logger LOGGER = LoggerFactory.getLogger(ValidationServiceImpl.class);
	private static final String OBJECTIVE = "validator"; 
	private static final String SEPARATOR = "_";
	private static final String JSON_EXTENSION = ".json";
	private static final String CONFIGROOT = "config/";
	private static Map<String, Schema> schemaCache = new HashMap<>();

	@Override
	public Boolean validateData(Map incomingData) {
		
		//JSONObject jsonSubject = new JSONObject(new GsonBuilder().create().toJson(incomingData.getDataObject()));
		JSONObject jsonSubject = new JSONObject(new GsonBuilder().create().toJson(incomingData.get("dataObject")));

		try {
			//getSchema(OBJECTIVE.concat(SEPARATOR).concat(incomingData.getDataContext()).concat(SEPARATOR).concat(incomingData.getDataContextVersion())
			getSchema(OBJECTIVE.concat(SEPARATOR).concat(incomingData.get("dataContext").toString()).concat(SEPARATOR).concat(incomingData.get("dataContextVersion").toString())
					.concat(JSON_EXTENSION)).validate(jsonSubject);
		} catch (ValidationException ve) {
			LOGGER.info("Validation Exception : " + ve.getMessage());
			return Boolean.FALSE;
		} catch (Exception e) {
			LOGGER.info("Validation Exception : " + e);
			return Boolean.FALSE;
		}
		return Boolean.TRUE;
	}

	private Schema getSchema(String location) {
		Schema schema = schemaCache.get(location);
		if (schema == null) {
			try { 
				schema = loadSchema(location);
				schemaCache.put(location, schema);
			} catch(Exception e) { 
				LOGGER.error("Encountered an Exception while loading Schema : " + e.getMessage());
			}
		}
		return schema;
	}

	private Schema loadSchema(String location) {
		JSONObject jsonSchema = new JSONObject(
				new JSONTokener(ClassLoader.getSystemClassLoader().getResourceAsStream(CONFIGROOT + location)));
		return SchemaLoader.load(jsonSchema);
	}

}
 