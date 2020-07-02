package com.ingestpipeline.producer;

import java.util.Map;

import org.apache.kafka.common.serialization.Serializer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HashMapSerializer implements Serializer<Map> {
	@Override
	public void close() {
		// TODO Auto-generated method stub
	}

	@Override
	public void configure(Map<String, ?> arg0, boolean arg1) {
		// TODO Auto-generated method stub
	}

	@Override
	public byte[] serialize(String topic, Map data) {
		byte[] value = null;
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			value = objectMapper.writeValueAsString(data).getBytes();
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return value;
	}
}