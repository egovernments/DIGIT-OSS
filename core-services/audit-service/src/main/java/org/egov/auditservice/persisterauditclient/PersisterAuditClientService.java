package org.egov.auditservice.persisterauditclient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.zafarkhaja.semver.Version;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.PathNotFoundException;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;
import org.apache.commons.lang3.StringUtils;
import org.egov.auditservice.persisterauditclient.models.contract.*;
import org.egov.auditservice.persisterauditclient.utils.AuditUtil;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import static java.util.Objects.isNull;
@Service
@Slf4j
public class PersisterAuditClientService {
    @Autowired
    private ObjectMapper objectMapper;
    @Value("${persister.audit.user.jsonpath}")
    private String userJsonPath;
    @Value("${persister.audit.error.queue}")
    private String auditErrorTopic;
    @Value("${persister.audit.kafka.topic}")
    private String auditTopic;
    @Autowired
    private TopicMap topicMap;
    @Autowired
    private AuditUtil auditUtil;

    @Autowired
    private KafkaTemplate kafkaTemplate;

    public void generateAuditLogs(PersisterClientInput input) {
        Map<String, List<Mapping>> map = topicMap.getTopicMap();
        String topic = input.getTopic();
        String json = input.getJson();
        Object document = Configuration.defaultConfiguration().jsonProvider().parse(json);
        List<Mapping> applicableMappings = filterMappings(map.get(topic), document);
        log.info("{} applicable configs found!", applicableMappings.size());
        List<Map<String, Object>> keyValuePairList;
        for (Mapping mapping : applicableMappings) {
            List<AuditLog> auditLogs = new LinkedList<>();
            List<QueryMap> queryMaps = mapping.getQueryMaps();
            for (QueryMap queryMap : queryMaps) {
                String query = queryMap.getQuery();
                List<JsonMap> jsonMaps = queryMap.getJsonMaps();
                String basePath = queryMap.getBasePath();
                List<RowData> rowDataList = getRowData(jsonMaps, document, basePath, mapping);
                /**
                 * The following code block will generate AuditLog objects for each query that is executed
                 */
                try {
                    auditLogs.addAll(auditUtil.getAuditRecord(rowDataList, query));
                }
                catch (Exception e){
                    log.error("AUDIT_LOG_ERROR","Failed to create audit log for: "+rowDataList);
                    AuditError auditError = AuditError.builder().mapping(mapping)
                            .query(query)
                            .rowDataList(rowDataList)
                            .exception(e)
                            .build();
                    kafkaTemplate.send(auditErrorTopic, auditError);
                }
            }
            if(!CollectionUtils.isEmpty(auditLogs))
                kafkaTemplate.send(auditTopic, auditLogs);
        }
    }
    public List<RowData> getRowData(List<JsonMap> jsonMaps, Object jsonObj, String baseJsonPath, Mapping mapping) {
        Map<AuditAttributes, List<LinkedHashMap<String, Object>>> data = extractData(baseJsonPath, mapping, jsonObj);
        List<RowData> rowDataList = new LinkedList<>();
        for (Map.Entry<AuditAttributes, List<LinkedHashMap<String, Object>>> entry : data.entrySet()) {
            AuditAttributes auditAttributes = entry.getKey();
            List<LinkedHashMap<String, Object>> dataSource = entry.getValue();
            for (int i = 0; i < dataSource.size(); i++) {
                LinkedHashMap<String, Object> rawDataRecord = dataSource.get(i);
                if (rawDataRecord == null)
                    continue;
                if (isChildObjectEmpty(baseJsonPath, rawDataRecord))
                    continue;
                //List<Object> row = new ArrayList<>();
                Map<String, Object> keyValuePairs = new LinkedHashMap<>();
                for (JsonMap jsonMap : jsonMaps) {
                    String jsonPath = jsonMap.getJsonPath();
                    TypeEnum type = jsonMap.getType();
                    TypeEnum dbType = jsonMap.getDbType();
                    Object value = null;
//                if(isNull(jsonPath))
//                    throw new NullPointerException("JSON Path is null: "+jsonMap);
                    if (type == null) {
                        type = TypeEnum.STRING;
                    }
                    if (jsonPath.contains("{")) {
                        String attribute = jsonPath.substring(jsonPath.indexOf("{") + 1, jsonPath.indexOf("}"));
                        jsonPath = jsonPath.replace("{".concat(attribute).concat("}"), "\"" + rawDataRecord.get(attribute).toString() + "\"");
                        JSONArray jsonArray = JsonPath.read(jsonObj, jsonPath);
                        // row.add(jsonArray.get(0));
                        keyValuePairs.put(jsonPath, jsonArray.get(0));
                        continue;
                    } else if (type.equals(TypeEnum.CURRENTDATE)) {
                        if (dbType.equals(TypeEnum.DATE)) {
                            //    row.add(new Date());
                            keyValuePairs.put(jsonPath, new Date());
                        } else if (dbType.equals(TypeEnum.LONG)) {
                            //   row.add(new Date().getTime());
                            keyValuePairs.put(jsonPath, new Date().getTime());
                        }
                        continue;
                    } else if ((type.equals(TypeEnum.ARRAY)) && dbType.equals(TypeEnum.STRING)) {
                        List<Object> list1 = JsonPath.read(jsonObj, jsonPath);
                        if (CollectionUtils.isEmpty(list1)) {
                            value = null;
                        } else {
                            value = StringUtils.join(list1.get(i), ",");
                            value = value.toString().substring(2, value.toString().lastIndexOf("]") - 1).replace("\"", "");
                        }
                    } else if (jsonPath.contains("*.")) {
                        jsonPath = jsonPath.substring(jsonPath.lastIndexOf("*.") + 2);
                        value = extractValueFromTree(rawDataRecord, jsonPath);
                    } else if (!(type.equals(TypeEnum.CURRENTDATE) || jsonPath.startsWith("default"))) {
                        value = JsonPath.read(jsonObj, jsonPath);
                    }
                    if (jsonPath.startsWith("default")) {
                        //    row.add(null);
                        keyValuePairs.put(jsonPath, null);
                    } else if (type.equals(TypeEnum.JSON) && dbType.equals(TypeEnum.STRING)) {
                        try {
                            String json = objectMapper.writeValueAsString(value);
                            //    row.add(json);
                            keyValuePairs.put(jsonPath, json);
                        } catch (JsonProcessingException e) {
                            log.error("Error while processing JSON object to string", e);
                        }
                    } else if (type.equals(TypeEnum.JSON) && dbType.equals(TypeEnum.JSONB)) {
                        try {
                            String json = objectMapper.writeValueAsString(value);
                            PGobject pGobject = new PGobject();
                            pGobject.setType("jsonb");
                            pGobject.setValue(json);
                            //     row.add(pGobject);
                            keyValuePairs.put(jsonPath, pGobject);
                        } catch (JsonProcessingException e) {
                            log.error("Error while processing JSON object to string", e);
                        } catch (SQLException e) {
                            log.error("Error while setting JSONB object", e);
                        }
                    } else if (type.equals(TypeEnum.LONG)) {
                        if (dbType == null) {
                            //    row.add(value);
                            keyValuePairs.put(jsonPath, value);
                        } else if (dbType.equals(TypeEnum.DATE)) {
                            //    row.add(new java.sql.Date(Long.parseLong(value.toString())));
                            keyValuePairs.put(jsonPath, new java.sql.Date(Long.parseLong(value.toString())));
                        }
                    } else if (type.equals(TypeEnum.DATE) & value != null) {
                        String date = value.toString();
                        DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
                        java.util.Date startDate = null;
                        try {
                            startDate = df.parse(date);
                        } catch (ParseException e) {
                            log.error("Unable to parse date", e);
                        }
                        // row.add(startDate);
                        keyValuePairs.put(jsonPath, startDate);
                    } else {
                        //    row.add(value);
                        keyValuePairs.put(jsonPath, value);
                    }
                }
                RowData rowData = RowData.builder().auditAttributes(auditAttributes).keyValueMap(keyValuePairs).build();
                rowDataList.add(rowData);
            }
        }
        return rowDataList;
    }
    /**
     * Extract data from the tree using provided base json path
     *  - If base path signifies bulk, then extract array of data
     *  - If base path is not bulk, then extract single row of data and wrap as list
     *
     * @param baseJsonPath Base json path
     * @param document Data source tree
     * @return Partial data source tree based on provided json base path
     */
    private Map<AuditAttributes, List<LinkedHashMap<String, Object>>> extractData(String baseJsonPath, Mapping mapping, Object document) {
        List<LinkedHashMap<String, Object>> list = null;
        String auditAttributeBasePath = mapping.getAuditAttributeBasePath();
        Map<AuditAttributes, List<LinkedHashMap<String, Object>>> data= new LinkedHashMap<>();
        AuditAttributes auditAttributes = getAuditAttribute(mapping, document);
        String relativeJsonPath = baseJsonPath.substring(auditAttributeBasePath.length() + 1);
        try {
            if (baseJsonPath.contains("*")) {
                /**
                 * Executes the base json path to get list of objects. For example if object is
                 * {"RequestInfo" : {...}, Demands: [...]} and auditAttributeBasePath is $.Demands.*
                 * after executing the auditAttributeBasePath we will get only the list of demands
                 *
                 */
                List<LinkedHashMap<String, Object>> parentObjects = JsonPath.read(document, auditAttributeBasePath);
                /**
                 * We will iterate through the list and create the auditAttribute for each object.
                 * In above example we will create auditAttribute for each demand. We will then execute the
                 * baseJsonPath of that queryMap and create map of auditAttribute vs data extracted using baseJaonPath
                 */
                for (int i = 0; i < parentObjects.size(); i++) {
                    list = JsonPath.read(parentObjects.get(i), relativeJsonPath);
                    data.put(auditAttributes, list);
                }
            } else {
                LinkedHashMap<String, Object> map = JsonPath.read(document, relativeJsonPath);
                list = Collections.singletonList(map);
                data.put(auditAttributes, list);
            }
        }
        catch (Exception e){
            log.error(e.getMessage());
            throw new CustomException("INVALID_JSONPATH","Failed to fetch auditAttributes");
        }
        return data;
    }
    /**
     * Fetch leaf node value recursively based on json path from java represented json tree
     *
     * @param jsonTree Java represented json tree
     * @param jsonPath Path of leaf node
     * @return Value of leaf node
     */
    private Object extractValueFromTree(LinkedHashMap<String, Object> jsonTree, String jsonPath) {
        String[] objDepth = jsonPath.split("\\.");
        Object value = null;
        LinkedHashMap<String, Object> jsonTree1 = null;
        for (int k = 0; k < objDepth.length; k++) {
            if (objDepth.length > 1 && k != objDepth.length - 1) {
                if (jsonTree1 == null)
                    jsonTree1 = (LinkedHashMap<String, Object>) jsonTree.get(objDepth[k]);
                else
                    jsonTree1 = (LinkedHashMap<String, Object>) jsonTree1.get(objDepth[k]);
                if (jsonTree1 == null) {
                    value = null;
                    break;
                }
            }
            if (k == objDepth.length - 1) {
                if (jsonTree1 != null)
                    value = jsonTree1.get(objDepth[k]);
                else
                    value = jsonTree.get(objDepth[k]);
            }
        }
        return value;
    }
    /**
     * Check if leaf node, is null,
     *  for ex, user has optional address in config, if address is null in datasource skip persisting to address table
     *
     * @param baseJsonPath Base json path
     * @param jsonTree Java represented json tree
     * @return If node not available, return true, else false
     */
    private boolean isChildObjectEmpty(String baseJsonPath, LinkedHashMap<String, Object> jsonTree) {
        if ( baseJsonPath.contains("*") && ! baseJsonPath.endsWith("*")) {
            String baseJsonPathForNullCheck = baseJsonPath.substring(baseJsonPath.lastIndexOf("*.") + 2);
            String[] baseObjectsForNullCheck = baseJsonPathForNullCheck.split("\\.");
            LinkedHashMap<String, Object> temp = new LinkedHashMap<>(jsonTree);
            for (String baseObjectForNullCheck : baseObjectsForNullCheck) {
                if (isNull(temp.get(baseObjectForNullCheck))) {
                    log.info("Skipping persisting record with basePath {} as it's empty!", baseJsonPath);
                    return true;
                }
                else
                    temp = (LinkedHashMap<String, Object>) temp.get(baseObjectForNullCheck);
            }
            return false;
        } else
            return false;
    }
    private AuditAttributes getAuditAttribute(Mapping mapping, Object json){
        AuditAttributes auditAttributes = new AuditAttributes();
        Boolean isAuditEnabled = mapping.getIsAuditEnabled();
        if(isAuditEnabled == null){
            isAuditEnabled = false;
        }
        if(isAuditEnabled){
            // Fetch the values required to attribute using mapping and json
            String module = mapping.getModule();
            String tenantId = getValueFromJsonPath(mapping.getTenantIdJsonPath(), json);
            String transactionCode = getValueFromJsonPath(mapping.getTransactionCodeJsonPath(), json);
            String objectId = getValueFromJsonPath(mapping.getObjecIdJsonPath(), json);
            String userUUID = getValueFromJsonPath(userJsonPath, json);
            // Set the values to auditAttribute
            auditAttributes.setModule(module);
            auditAttributes.setObjectId(objectId);
            auditAttributes.setTenantId(tenantId);
            auditAttributes.setTransactionCode(transactionCode);
            auditAttributes.setUserUUID(userUUID);
        }
        return auditAttributes;
    }
    /**
     * Function to execute jsonPath on given json. Returns null in case of error
     * @param jsonPath
     * @param json
     * @return
     */
    private String getValueFromJsonPath(String jsonPath, Object json){
        String value = null;
        try {
            value = JsonPath.read(json, jsonPath);
        }
        catch (Exception e){
            log.error("JSONPATH_ERROR","Error while executing jsonPath: ",jsonPath);
        }
        return value;
    }
    private List<Mapping> filterMappings(List<Mapping> mappings, Object json){
        List<Mapping> filteredMaps = new ArrayList<>();
        String version = "";
        try {
            version = JsonPath.read(json, "$.RequestInfo.ver");
        }catch (PathNotFoundException ignore){
        }
        Version semVer = auditUtil.getSemVer(version);
        for (Mapping map: mappings) {
            if(semVer.satisfies(map.getVersion()))
                filteredMaps.add(map);
        }
        return filteredMaps;
    }
}
