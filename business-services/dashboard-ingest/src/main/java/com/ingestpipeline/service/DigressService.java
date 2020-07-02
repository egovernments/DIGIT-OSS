package com.ingestpipeline.service;

import com.ingestpipeline.model.DigressionPoint;
import com.ingestpipeline.model.IncomingData;

public interface DigressService {
	
	Boolean digressData(IncomingData incomingData, DigressionPoint digressionPoint);

}
