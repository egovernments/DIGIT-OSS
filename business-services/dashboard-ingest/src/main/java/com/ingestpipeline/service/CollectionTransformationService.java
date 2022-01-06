package com.ingestpipeline.service;

import com.bazaarvoice.jolt.Chainr;
import com.bazaarvoice.jolt.JsonUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.ingestpipeline.util.ConfigLoader;
import com.ingestpipeline.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Service(Constants.Qualifiers.TRANSFORM_COLLECTION_SERVICE)
public class CollectionTransformationService implements TransformService {

    public static final Logger LOGGER = LoggerFactory.getLogger(CollectionTransformationService.class);


    private static final String SEPARATOR = "_";
    private static final String JSON_EXTENSION = ".json";
    private static final String OBJECTIVE = "transform";
    private static final String CONFIGROOT = "config/";
    private static final String JOLT_SPEC = "spec";

    private static final String TRANSACTION_ID = "transactionId";
    private static final String ID = "id";



    @Autowired
    private ConfigLoader configLoader;

    private String previousKey= "";

    @Override
    public Boolean transformData(Map incomingData) {

        Map incomingDataCopy = new HashMap<>();
        incomingDataCopy.putAll(incomingData);
        incomingData.clear();

        String dataContext = incomingDataCopy.get(Constants.DATA_CONTEXT).toString();
        String dataContextVersion = incomingDataCopy.get(Constants.DATA_CONTEXT_VERSION).toString();
        ObjectMapper mapper = new ObjectMapper();
        List chainrSpecJSON = null ;

        try {

            JsonNode incomingNode = mapper.convertValue(incomingDataCopy, JsonNode.class);
            //LOGGER.info("incoming data: "+incomingNode);
            //JsonNode identifier = incomingNode.get(Constants.DATA_OBJECT).get(TRANSACTION_ID);


            //To change: for loading the file from config root
            String trsFile = OBJECTIVE.concat(SEPARATOR).concat(dataContext).concat(SEPARATOR).concat(dataContextVersion).concat(JSON_EXTENSION);
            String strFile = configLoader.get(trsFile);
            JsonNode specNode = mapper.readTree(strFile);
            // LOGGER.info("specNode:## "+specNode);


            /*LOGGER.info("sourceUrl## "+strFile);

            String sourceUrl = CONFIGROOT.concat(OBJECTIVE.concat(SEPARATOR).concat(dataContext).concat(SEPARATOR).concat(dataContextVersion).concat(JSON_EXTENSION));

            LOGGER.info("sourceUrl## "+sourceUrl);

            JsonNode specNode = mapper.readTree(this.getClass().getClassLoader().getResourceAsStream(sourceUrl));

            LOGGER.info("specNode:## "+specNode);*/

            //String sourceUrl = (OBJECTIVE.concat(SEPARATOR).concat(dataContext).concat(SEPARATOR).concat(dataContextVersion).concat(JSON_EXTENSION));
            //JsonNode specNode = mapper.readTree(configLoader.get(sourceUrl));

            String previousField = findParentKey(specNode.findPath(JOLT_SPEC), "$i", "");
            int parentNodeSize = incomingNode.findValues(previousField).get(0).size();

            for(int i=0; (i<parentNodeSize); i++){
                previousField = findParentKey(specNode.findPath(JOLT_SPEC), "$j", "");
                ArrayNode nestedNodes = (ArrayNode)incomingNode.findValues(previousField).get(i);

                for(int j=0; j< nestedNodes.size(); j++){
                    JsonNode idNode = nestedNodes.get(j).get(ID);
                    String spec = specNode.toString();
                    spec = spec.replace("$i", i+"");
                    spec = spec.replace("$j", j+"");


                    InputStream stream = new ByteArrayInputStream(spec.getBytes());
                    chainrSpecJSON = JsonUtils.jsonToList(stream);
                    Chainr chainr = Chainr.fromSpec( chainrSpecJSON );
                    Object inputJSON = incomingDataCopy.get(Constants.DATA_OBJECT);

                    try {
                        Object transformedOutput = chainr.transform( inputJSON );

                        Map incomingMap = new HashMap();
                        incomingMap.put(Constants.DATA_CONTEXT, dataContext);
                        incomingMap.put(Constants.DATA_CONTEXT_VERSION, dataContextVersion);
                        incomingMap.put(Constants.DATA_OBJECT , transformedOutput);

                        incomingMap.put(Constants.IDENTIFIER, idNode.asText());
                        incomingData.put(idNode.asText(), incomingMap);

                    } catch (Exception e) {
                        LOGGER.error("Encountered an error while transforming the JSON : " + e.getMessage());
                        return Boolean.FALSE;
                    }

                }
            }
            // LOGGER.info("After collection transformation incomingData size "+incomingData.size()+" entries "+incomingData.entrySet());
            return Boolean.TRUE;

        } catch (Exception e) {
            LOGGER.error("Encountered an error : " + e.getMessage());
            return Boolean.FALSE;

        }

    }

    private String findParentKey(JsonNode node, String value, String key) {
        Iterator<Map.Entry<String, JsonNode>> fields = node.fields();
        while (fields.hasNext()) {
            Map.Entry<String, JsonNode> entry = fields.next();

            if (entry.getKey().equalsIgnoreCase(value)) {
                previousKey = key;
                break;
            } else if (entry.getValue().isObject()) {
                key = entry.getKey();
                findParentKey(entry.getValue(), value, key);
            }
        }
        return previousKey;

    }


    /*public void transformData() {

        Map incomingData = new HashMap();
*//*        Map incomingDataCopy = new HashMap();
        incomingDataCopy.putAll(incomingData);*//*
        incomingData.clear();
        //String dataContext = incomingData.get(Constants.DATA_CONTEXT).toString();
        //String dataContextVersion = incomingData.get(Constants.DATA_CONTEXT_VERSION).toString();
        ObjectMapper mapper = new ObjectMapper();
        List chainrSpecJSON = null ;
        List<Object> incomingDataList = new ArrayList<>();

        try {

            JsonNode specNode = mapper.readTree(configLoader.get("anytransform_collection_v2.json"));

            JsonNode incoming = mapper.readTree(configLoader.get("anyinput.json"));//TODO: use incomming node object
            Map incommingMap = new HashMap();
            incommingMap = mapper.convertValue(incoming, new TypeReference<Map<String, Object>>(){});

            String previousField = findKey(specNode.findPath(JOLT_SPEC), "$i", "");
            int parentNodeSize = incoming.findValues(previousField).get(0).size();

            for(int i=0; (i<parentNodeSize); i++){
                previousField = findKey(specNode.findPath(JOLT_SPEC), "$j", "");
                ArrayNode nestedNodes = (ArrayNode)incoming.findValues(previousField).get(i);
                for(int j=0; j< nestedNodes.size(); j++){
                    String spec = specNode.toString();
                    LOGGER.info("\"$i\" "+i);
                    LOGGER.info("\"$j\" "+j);


                    spec = spec.replace("$i", i+"");
                    spec = spec.replace("$j", j+"");


                    InputStream stream = new ByteArrayInputStream(spec.getBytes());
                    chainrSpecJSON = JsonUtils.jsonToList(stream);
                    Chainr chainr = Chainr.fromSpec( chainrSpecJSON );
                    Object inputJSON = incommingMap.get(Constants.DATA_OBJECT);
                    try {
                        Object transformedOutput = chainr.transform( inputJSON );
                        LOGGER.info("transformered date "+transformedOutput);

                        Map incomingDataCopy = new HashMap();
                        //incomingDataCopy.putAll(incomingData);

                        incomingDataCopy.put(Constants.DATA_OBJECT , transformedOutput);
                        incomingData.put(i+"-"+j, incomingDataCopy);

                    } catch (Exception e) {
                        LOGGER.error("Encountered an error while tranforming the JSON : " + e.getMessage());
                    }

                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            LOGGER.error("Encountered an error : " + e.getMessage());
        }

        LOGGER.info("incomingData.size() "+incomingData.size()+" keySet "+incomingData.entrySet());



    }*/


}




