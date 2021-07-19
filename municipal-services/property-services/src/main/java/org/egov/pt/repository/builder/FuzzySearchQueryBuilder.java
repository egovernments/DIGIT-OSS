package org.egov.pt.repository.builder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;

import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;

import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.web.contracts.FuzzySearchCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class FuzzySearchQueryBuilder {


    private ObjectMapper mapper;

    private PropertyConfiguration config;


    @Autowired
    public FuzzySearchQueryBuilder(ObjectMapper mapper, PropertyConfiguration config) {
        this.mapper = mapper;
        this.config = config;
    }


    private static final String BASE_QUERY = "{\n" +
            "  \"from\": {{OFFSET}},\n" +
            "  \"size\": {{LIMIT}},\n" +
            "  \"sort\": {\n" +
            "    \"Data.propertyId.keyword\": {\n" +
            "      \"order\": \"desc\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"query\": {\n" +
            "  }\n" +
            "}";

    private static final String fuzzyQueryTemplate = "{\n" +
            "          \"match\": {\n" +
            "            \"{{VAR}}\": {\n" +
            "              \"query\": \"{{PARAM}}\",\n" +
            "              \"fuzziness\": \"{{FUZZINESS}}\"\n" +
            "            }\n" +
            "          }\n" +
            "        }";

    private static final String wildCardQueryTemplate = "{\n" +
            "          \"query_string\": {\n" +
            "            \"default_field\": \"{{VAR}}\",\n" +
            "            \"query\": \"*{{PARAM}}*\"\n" +
            "          }\n" +
            "        }";

    private static final String queryTemplate = "{\n" +
            "          \"query_string\": {\n" +
            "            \"default_field\": \"{{VAR}}\",\n" +
            "            \"query\": \"{{PARAM}}\"\n" +
            "          }\n" +
            "        }";

    private static final String filterTemplate   = "\"filter\": { " +
            "      }";

    /**
     * Builds a elasticsearch search query based on the fuzzy search criteria
     * @param criteria
     * @return
     */
    public String getFuzzySearchQuery(PropertyCriteria criteria){

        String finalQuery;

        try {
            String baseQuery = addPagination(criteria);
            JsonNode node = mapper.readTree(baseQuery);
            ObjectNode insideMatch = (ObjectNode)node.get("query");
            List<JsonNode> fuzzyClauses = new LinkedList<>();
            List<JsonNode> innerFuzzyClauses = new LinkedList<>();
            List<JsonNode> innerList = new LinkedList<>();
            JsonNode mustNode = null;
            JsonNode tenantClauseNode = null;
            JsonNode localityClauseNode = null;
            if(criteria.getTenantId() != null){
                tenantClauseNode = getInnerNode(criteria.getTenantId(),"Data.tenantId.keyword","",false);
            }

            if(criteria.getName() != null){
                fuzzyClauses.add(getInnerNode(criteria.getName(),"Data.ownerNames",config.getNameFuziness(),true));
                innerFuzzyClauses.add(getInnerNode(criteria.getName(),"Data.ownerNames",config.getNameFuziness(),true));

            }

            if(criteria.getDoorNo() != null){
                fuzzyClauses.add(getInnerNode(criteria.getDoorNo(),"Data.doorNo.keyword",config.getDoorNoFuziness(),true));
                innerFuzzyClauses.add(getInnerNode(criteria.getDoorNo(),"Data.doorNo.keyword",config.getDoorNoFuziness(),true));
            }

            if(criteria.getOldPropertyId() != null){
                fuzzyClauses.add(getInnerNode(criteria.getOldPropertyId(),"Data.oldPropertyId.keyword",config.getOldPropertyIdFuziness(),true));
                innerFuzzyClauses.add(getInnerNode(criteria.getOldPropertyId(),"Data.oldPropertyId.keyword",config.getOldPropertyIdFuziness(),true));
            }

            if(criteria.getLocality() != null){
                localityClauseNode = getInnerNode(criteria.getLocality(),"Data.locality.keyword","",false);
            }
            if((criteria.getLocality() != null && criteria.getDoorNo() != null && criteria.getName() != null) || (criteria.getDoorNo() != null && criteria.getName() != null)){
                 JsonNode innerShouldNode = mapper.convertValue(new HashMap<String, List<JsonNode>>(){{put("should",innerFuzzyClauses);}}, JsonNode.class);
            	 JsonNode innerNode = mapper.convertValue(new HashMap<String, JsonNode>(){{put("bool",innerShouldNode);}}, JsonNode.class);
             	 innerList.add(innerNode);
            	 mustNode = mapper.convertValue(new HashMap<String, List<JsonNode>>(){{put("must",innerList);}}, JsonNode.class);

            }
            else{
            	mustNode = mapper.convertValue(new HashMap<String, List<JsonNode>>(){{put("must",fuzzyClauses);}}, JsonNode.class);
            }
            List<JsonNode> outerMustArray = mapper.convertValue(mustNode.get("must"), LinkedList.class);
            JsonNode tenantObject = mapper.convertValue(tenantClauseNode, JsonNode.class);
            outerMustArray.add(tenantObject);
            if(localityClauseNode != null){
                JsonNode localityObject = mapper.convertValue(localityClauseNode, JsonNode.class);
                outerMustArray.add(localityObject);
            }
            mustNode = mapper.convertValue(new HashMap<String, List<JsonNode>>(){{put("must",outerMustArray);}}, JsonNode.class);
            insideMatch.put("bool",mustNode);
            ObjectNode boolNode = (ObjectNode)insideMatch.get("bool");

            log.info(boolNode.toString());
//            if(!CollectionUtils.isEmpty(ids)){
//                JsonNode jsonNode = mapper.convertValue(new HashMap<String, List<String>>(){{put("Data.id.keyword",ids);}}, JsonNode.class);
//                ObjectNode parentNode = mapper.createObjectNode();
//                parentNode.put("terms",jsonNode);
//                boolNode.put("filter", parentNode);
//            }

            finalQuery = mapper.writeValueAsString(node);
            log.info(finalQuery);
        }
        catch (Exception e){
        	log.error("ES_ERROR",e);
            throw new CustomException("JSONNODE_ERROR","Failed to build json query for fuzzy search");
        }

        return finalQuery;

    }


    /**
     * Creates inner query using the query template
     * @param param
     * @param var
     * @param fuziness
     * @return
     * @throws JsonProcessingException
     */
    private JsonNode getInnerNode(String param, String var, String fuziness, boolean isWildCard) throws JsonProcessingException {

        String template;
        if(isWildCard)
            template = wildCardQueryTemplate;
        else
            template = queryTemplate;
        String innerQuery = template.replace("{{PARAM}}",getEscapedString(param));
        innerQuery = innerQuery.replace("{{VAR}}",var);

        if(!config.getIsSearchWildcardBased())
            innerQuery = innerQuery.replace("{{FUZZINESS}}", fuziness);

        JsonNode innerNode = mapper.readTree(innerQuery);
        return innerNode;
    }


    private String addPagination(PropertyCriteria criteria) {


        Long limit = config.getDefaultLimit();
        Long offset = config.getDefaultOffset();

        if (criteria.getLimit() != null && criteria.getLimit() <= config.getMaxSearchLimit())
            limit = criteria.getLimit();

        if (criteria.getLimit() != null && criteria.getLimit() > config.getMaxSearchLimit())
            limit = config.getMaxSearchLimit();

        if (criteria.getOffset() != null)
            offset = criteria.getOffset();

        String baseQuery = BASE_QUERY.replace("{{OFFSET}}", offset.toString());
        baseQuery = baseQuery.replace("{{LIMIT}}", limit.toString());

        return baseQuery;
    }
    
    /**
     * Escapes special characters in given string
     * @param inputString
     * @return
     */
    private String getEscapedString(String inputString){
        final String[] metaCharacters = {"\\","/","^","$","{","}","[","]","(",")","*","+","?","|","<",">","-","&","%"};
        for (int i = 0 ; i < metaCharacters.length ; i++) {
            if (inputString.contains(metaCharacters[i])) {
                inputString = inputString.replace(metaCharacters[i], "\\\\" + metaCharacters[i]);
            }
        }
        return inputString;
    }

}
