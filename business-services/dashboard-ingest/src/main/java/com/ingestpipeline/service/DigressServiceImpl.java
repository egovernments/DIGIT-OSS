package com.ingestpipeline.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.gson.Gson;
import com.ingestpipeline.model.DigressionPoint;
import com.ingestpipeline.model.IncomingData;
import com.ingestpipeline.model.Path;
import com.ingestpipeline.util.ConfigLoader;
import com.ingestpipeline.util.Constants;

@Service(Constants.Qualifiers.DIGRESS_SERVICE)
public class DigressServiceImpl implements DigressService {
	
	public static final Logger LOGGER = LoggerFactory.getLogger(DigressServiceImpl.class);

	@Autowired
	private ConfigLoader configLoader; 
	
	@Override
	public Boolean digressData(IncomingData incomingData, DigressionPoint digressionPoint) {
		List<JsonNode> productList = null; // getBiProducts(incomingData, digressionPoint);
		/*if(productList != null && productList.size() > 0)  {
			for(JsonNode product : productList) { 
				Map<String, Object> subData = new HashMap<>(); 
				subData.put(Constants.DATA_CONTEXT, incomingData.getDataContext()); 
				subData.put(Constants.DATA_CONTEXT_VERSION, incomingData.getDataContextVersion());
				subData.put(Constants.DATA_OBJECT, product);
			}
		}*/
		return null;
	}
	
	private Object ingestServiceReplace(Map incomingData) {
		
		return null; 
	}
	
	/*private List<JsonNode> getBiProducts(IncomingData incomingData, DigressionPoint point) {
		Object dataObject = incomingData.getDataObject();
		List<Object> dataObjectList = new ArrayList<>(); 
		List<Path> paths = point.getPaths();
		ObjectMapper mapper = new ObjectMapper();
		Gson gson = new Gson(); 
		JsonNode mainNode = null;
	    try {
	    	mainNode = mapper.readTree(gson.toJson(dataObject));
		} catch (Exception ex) {
			LOGGER.error("Encountered an error while converting the data to JSON Node : " + ex.getMessage());
		} 
		List<JsonNode> list = generateBiProducts(point.getPaths(), mainNode); 
		return list; 
	}
	
	private List<JsonNode> generateBiProducts(List<Path> paths, JsonNode mainNode) {
		List<JsonNode> jsonNodeList = new ArrayList<>();
		for(Path path : paths) {
			jsonNodeList = getSplitObjects(path.getRoute(), mainNode, path.getRemoveReplace());
			for(JsonNode subNode : jsonNodeList) { 
				if(path.getPaths() != null && path.getPaths().size() > 0) { 
					generateBiProducts(path.getPaths(), subNode); 
				}
			}
		}
		if(jsonNodeList.size() == 0) { 
			jsonNodeList.add(mainNode);
		}
		return jsonNodeList;
	}
	
	private List<JsonNode> getSplitObjects(String route, JsonNode mainNode, String removeReplace) {
		List<JsonNode> nodeList = new ArrayList<>(); 
		String[] routes = route.split("\\.");
		List<String> routesList = Arrays.asList(routes); 
		JsonNode node = mainNode; 
		for(String r : routes) { 
			node = node.path(r); 
		}
		if(node.isArray()) { 
			ArrayNode arrayNode = (ArrayNode) node; 
			if(arrayNode.size() > 1) { 
				ObjectNode finalSubNode = null; 
				for(int i=0 ; i < arrayNode.size() ; i++) {
					ObjectNode subNode = mainNode.deepCopy();
					JsonNode subJsonNode = mainNode.deepCopy(); 
					for(String r : routes) { 
						if(subNode.get(r).deepCopy().isArray()) {
							ArrayNode arraySubNode = subNode.get(r).deepCopy();
							subNode = arraySubNode.get(i).deepCopy();
						} else { 
							JsonNode jsonSubNode = subNode.get(r).deepCopy();
							subNode = jsonSubNode.deepCopy();
						}
					}
					ObjectNode mainObjectNode = mainNode.deepCopy();
					for(String r : routes) { 
						if(!r.equals(removeReplace)) {
							mainObjectNode = mainObjectNode.get(r).deepCopy(); 
						} else { 
							mainObjectNode.remove(removeReplace); 
							routesList.remove(removeReplace); 
						}
					}
					for(int j =0 ; j<routesList.size(); j++ ) { 
						
					}
					ObjectNode mainObjectNode = mainNode.deepCopy();
					JsonNode mainJsonNode = mainNode; 
					String deepRoute = null; 
					for(String r : routes) { 
						deepRoute = r; 
						mainJsonNode = mainObjectNode.get(r).deepCopy();
						mainObjectNode = mainJsonNode.deepCopy(); 
					}
//					ObjectNode innerNode = arrayNode.get(i).deepCopy();
					mainObjectNode.put(route, subNode); 
// 					subNode.put(route, innerNode); 
					nodeList.add(subNode); 
				}
			}
		}
		return nodeList; 
		
	}*/
	

}
 