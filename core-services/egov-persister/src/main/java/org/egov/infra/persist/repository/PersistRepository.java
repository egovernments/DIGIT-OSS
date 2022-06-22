package org.egov.infra.persist.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;
import org.apache.commons.lang3.StringUtils;
import org.egov.infra.persist.web.contract.JsonMap;
import org.egov.infra.persist.web.contract.RowData;
import org.egov.infra.persist.web.contract.TypeEnum;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import java.sql.SQLException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static java.util.Objects.isNull;

@Repository
@Slf4j
public class PersistRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ObjectMapper objectMapper;


    public void persist(String query, List<Object[]> rows) {

        try {
            if( ! rows.isEmpty()) {
                log.info("Executing query : "+ query);
                jdbcTemplate.batchUpdate(query, rows);
                log.info("Persisted {} row(s) to DB!", rows.size());
            }
        } catch (Exception ex) {
            log.error("Failed to persist {} row(s) using query: {}", rows.size(), query, ex);
            throw ex;
        }
    }

    public List<Map<String, Object>> persist(String query, List<JsonMap> jsonMaps, Object jsonObj, String baseJsonPath) {

        RowData rowData = getRowsAndKeyValuePairs(jsonMaps,jsonObj,baseJsonPath);
        List<Object[]> rows = rowData.getRows();
        List<Map<String, Object>> keyValuePairPersisted = rowData.getKeyValuePairsList();
        try {
            if( ! rows.isEmpty()) {
                log.info("Executing query : "+ query);
                jdbcTemplate.batchUpdate(query, rows);
                log.info("Persisted {} row(s) to DB!", rows.size(), baseJsonPath);
            }
        } catch (Exception ex) {
            log.error("Failed to persist {} row(s) using query: {}", rows.size(), query, ex);
            throw ex;
        }

        return keyValuePairPersisted;
    }


    public RowData getRowsAndKeyValuePairs(List<JsonMap> jsonMaps, Object jsonObj, String baseJsonPath) {

        List<LinkedHashMap<String, Object>> dataSource = extractData(baseJsonPath, jsonObj);

        List<Object[]> rows = new ArrayList<>();
        List<Map<String, Object>> keyValuePairsList = new LinkedList<>();

        for (int i = 0; i < dataSource.size(); i++) {
            LinkedHashMap<String, Object> rawDataRecord = dataSource.get(i);

            if (rawDataRecord == null)
                continue;

            if (isChildObjectEmpty(baseJsonPath, rawDataRecord))
                continue;


            List<Object> row = new ArrayList<>();
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
                    row.add(jsonArray.get(0));
                    keyValuePairs.put(jsonPath, jsonArray.get(0));
                    continue;

                }

                else if (type.equals(TypeEnum.CURRENTDATE)) {
                    if (dbType.equals(TypeEnum.DATE)) {
                        row.add(new Date());
                        keyValuePairs.put(jsonPath, new Date());
                    }
                    else if (dbType.equals(TypeEnum.LONG)) {
                        row.add(new Date().getTime());
                        keyValuePairs.put(jsonPath, new Date().getTime());
                    }
                    continue;
                }

                else if ((type.equals(TypeEnum.ARRAY)) && dbType.equals(TypeEnum.STRING)) {
                    List<Object> list1 = JsonPath.read(jsonObj, jsonPath);
                    if (CollectionUtils.isEmpty(list1)) {
                        value = null;
                    } else {
                        value = StringUtils.join(list1.get(i), ",");
                        value = value.toString().substring(2, value.toString().lastIndexOf("]") - 1).replace("\"", "");
                    }
                }

                else if (jsonPath.contains("*.")) {
                    jsonPath = jsonPath.substring(jsonPath.lastIndexOf("*.") + 2);
                    value = extractValueFromTree(rawDataRecord, jsonPath);
                }

                else if (!(type.equals(TypeEnum.CURRENTDATE) || jsonPath.startsWith("default"))) {
                    value = JsonPath.read(jsonObj, jsonPath);
                }

                if (jsonPath.startsWith("default")) {
                    row.add(null);
                    keyValuePairs.put(jsonPath, null);
                }

                else if (type.equals(TypeEnum.JSON) && dbType.equals(TypeEnum.STRING)) {
                    try {
                        String json = objectMapper.writeValueAsString(value);
                        row.add(json);
                        keyValuePairs.put(jsonPath, json);
                    } catch (JsonProcessingException e) {
                        log.error("Error while processing JSON object to string", e);
                    }
                }

                else if (type.equals(TypeEnum.JSON) && dbType.equals(TypeEnum.JSONB)) {
                    try {
                        String json = objectMapper.writeValueAsString(value);

                        PGobject pGobject = new PGobject();
                        pGobject.setType("jsonb");
                        pGobject.setValue(json);
                        row.add(pGobject);
                        keyValuePairs.put(jsonPath, pGobject);
                    } catch (JsonProcessingException e) {
                        log.error("Error while processing JSON object to string", e);
                    } catch (SQLException e) {
                        log.error("Error while setting JSONB object", e);
                    }
                }

                else if (type.equals(TypeEnum.LONG)) {
                    if (dbType == null) {
                        row.add(value);
                        keyValuePairs.put(jsonPath, value);
                    }
                    else if (dbType.equals(TypeEnum.DATE)){
                        row.add(new java.sql.Date(Long.parseLong(value.toString())));
                        keyValuePairs.put(jsonPath, new java.sql.Date(Long.parseLong(value.toString())));
                    }
                }

                else if (type.equals(TypeEnum.DATE) & value != null) {

                    String date = value.toString();
                    DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
                    java.util.Date startDate = null;
                    try {
                        startDate = df.parse(date);
                    } catch (ParseException e) {
                        log.error("Unable to parse date", e);
                    }
                    row.add(startDate);
                    keyValuePairs.put(jsonPath, startDate);
                }

                else {
                    row.add(value);
                    keyValuePairs.put(jsonPath, value);
                }
            }
            rows.add(row.toArray());
            keyValuePairsList.add(keyValuePairs);
        }

        RowData rowData = RowData.builder().rows(rows).keyValuePairsList(keyValuePairsList).build();
        return rowData;

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
    private List<LinkedHashMap<String, Object>> extractData(String baseJsonPath, Object document) {
        List<LinkedHashMap<String, Object>> list = null;
        if(baseJsonPath.contains("*")) {
            String arrayBasePath = baseJsonPath.substring(0, baseJsonPath.lastIndexOf(".*") + 2);
            list = JsonPath.read(document, arrayBasePath);
        }
        else {
            LinkedHashMap<String, Object> map = JsonPath.read(document, baseJsonPath);
            list = Collections.singletonList(map);
        }
        return list;
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


}