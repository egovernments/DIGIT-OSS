package org.egov.pt.repository.builder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
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
import lombok.extern.slf4j.Slf4j;

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
            "    \"_score\": {\n" +
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

    private static final String filterTemplate   = "\"filter\": { " +
            "      }";

    /**
     * Builds a elasticsearch search query based on the fuzzy search criteria
     * @param criteria
     * @return
     */
    public String getFuzzySearchQuery(PropertyCriteria criteria, List<String> ids){

        String finalQuery;

        try {
            String baseQuery = addPagination(criteria);
            JsonNode node = mapper.readTree(baseQuery);
            ObjectNode insideMatch = (ObjectNode)node.get("query");
            List<JsonNode> fuzzyClauses = new LinkedList<>();

            if(criteria.getName() != null){
                fuzzyClauses.add(getInnerNode(criteria.getName(),"Data.ownerNames",config.getNameFuziness()));
            }

            if(criteria.getDoorNo() != null){
                fuzzyClauses.add(getInnerNode(criteria.getDoorNo(),"Data.doorNo.keyword",config.getDoorNoFuziness()));
            }

            if(criteria.getOldPropertyId() != null){
                fuzzyClauses.add(getInnerNode(criteria.getOldPropertyId(),"Data.oldPropertyId.keyword",config.getOldPropertyIdFuziness()));
            }

            JsonNode mustNode = mapper.convertValue(new HashMap<String, List<JsonNode>>(){{put("must",fuzzyClauses);}}, JsonNode.class);

            insideMatch.put("bool",mustNode);
            ObjectNode boolNode = (ObjectNode)insideMatch.get("bool");


            if(!CollectionUtils.isEmpty(ids)){
                JsonNode jsonNode = mapper.convertValue(new HashMap<String, List<String>>(){{put("Data.id.keyword",ids);}}, JsonNode.class);
                ObjectNode parentNode = mapper.createObjectNode();
                parentNode.put("terms",jsonNode);
                boolNode.put("filter", parentNode);
            }

            finalQuery = mapper.writeValueAsString(node);

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
    private JsonNode getInnerNode(String param, String var, String fuziness) throws JsonProcessingException {

        String template;
        if(config.getIsSearchWildcardBased())
            template = wildCardQueryTemplate;
        else
            template = fuzzyQueryTemplate;
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
        final String[] metaCharacters = {"\\","/","^","$","{","}","[","]","(",")",".","*","+","?","|","<",">","-","&","%"};
        for (int i = 0 ; i < metaCharacters.length ; i++) {
            if (inputString.contains(metaCharacters[i])) {
                inputString = inputString.replace(metaCharacters[i], "\\\\" + metaCharacters[i]);
            }
        }
        return inputString;
    }

}
