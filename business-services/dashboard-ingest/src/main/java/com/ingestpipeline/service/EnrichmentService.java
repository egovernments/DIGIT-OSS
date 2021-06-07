package com.ingestpipeline.service;

import org.springframework.stereotype.Service;

import com.ingestpipeline.model.IncomingData;

import java.util.Map;

@Service
public interface EnrichmentService {
	
	Map enrichData(Map incomingData);
	
}
