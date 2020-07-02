package com.ingestpipeline.util;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.gson.Gson;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class JSONUtil {
	@Autowired
	public ObjectMapper mapper;
	@Autowired
	public Gson gson;

	/**
	 * Field value to replace by new text. Replace node by given text to Parent's
	 * hierarchy. Field will not be added if not found existing already
	 *
	 * @param parent
	 * @param fieldName
	 * @param newValue
	 */
	public static void replaceFieldValue(ObjectNode parent, String fieldName, String newValue) {
		if (parent.has(fieldName)) {
			parent.put(fieldName, newValue);
		}
		parent.fields().forEachRemaining(entry -> {
			JsonNode entryValue = entry.getValue();
			if (entryValue.isArray()) {
				for (int i = 0; i < entryValue.size(); i++) {
					if (entry.getValue().get(i).isObject())
						replaceFieldValue((ObjectNode) entry.getValue().get(i), fieldName, newValue);
				}
			} else if (entryValue.isObject()) {
				replaceFieldValue((ObjectNode) entry.getValue(), fieldName, newValue);
			}
		});
	}

	/**
	 * Finds the value for a given key from the tree
	 * @param parent   the tree
	 * @param key      the field name
	 * @param value    the value for the given field
	 */
	public static void findValue(ObjectNode parent, String key, StringBuffer value) {
		parent.fields().forEachRemaining(entry -> {
			if(entry.getKey().equalsIgnoreCase(key)){
				value.append(entry.getValue().asText());
			} else {
				JsonNode entryValue = entry.getValue();
				if(entryValue.isArray()){
					for (int i=0; i < entryValue.size(); i++){
						if (entry.getValue().get(i).isObject())
							findValue((ObjectNode) entry.getValue().get(i), key, value);
					}
				} else if (entryValue.isObject()){
					findValue((ObjectNode) entry.getValue(), key, value);
				}
			}
		});
	}


	/**
	 * @return
	 */
	public static String getJsonString(ObjectMapper objectMapper,Object object) throws JsonProcessingException {
		if(objectMapper != null){
			return  objectMapper.writeValueAsString(object);
		}
		return null;
	}

	public ObjectMapper getMapper() {
		return mapper;
	}

	public void setObjectMapper(ObjectMapper objectMapper){
		mapper=objectMapper;
	}

	public Gson getGson() {
		return gson;
	}

	public void setGson(Gson gsonn)
	{
		gson = gsonn;
	}
}
