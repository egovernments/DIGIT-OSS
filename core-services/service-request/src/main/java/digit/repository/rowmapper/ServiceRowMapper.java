package digit.repository.rowmapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import digit.models.coremodels.AuditDetails;
import digit.web.models.AttributeDefinition;
import digit.web.models.AttributeValue;
import digit.web.models.Service;
import digit.web.models.ServiceDefinition;
import org.apache.commons.lang.StringUtils;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

import static digit.constants.Constants.VALUE_JSON_PATH;

@Component
public class ServiceRowMapper implements ResultSetExtractor<List<Service>> {

    /**
     * Rowmapper that maps every column of the search result set to a key in the model.
     */

    @Autowired
    private ObjectMapper mapper;

    @Override
    public List<Service> extractData(ResultSet rs) throws SQLException, DataAccessException {
        Map<String, Service> serviceMap = new HashMap<>();
        while (rs.next()) {
            String currentId = rs.getString("id");
            Service currentService = serviceMap.get(currentId);
            if (!StringUtils.isBlank(currentId)) {

                if (currentService == null) {

                    AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("createdby"))
                            .createdTime(rs.getLong("createdtime")).lastModifiedBy(rs.getString("lastmodifiedby"))
                            .lastModifiedTime(rs.getLong("lastmodifiedtime")).build();
                    currentService = Service.builder()
                            .id(rs.getString("id"))
                            .tenantId(rs.getString("tenantid"))
                            .serviceDefId(rs.getString("servicedefid"))
                            .referenceId(rs.getString("referenceid"))
                            .auditDetails(auditDetails)
                            .additionalDetails(getAdditionalDetail((PGobject) rs.getObject("additionaldetails")))
                            .accountId(rs.getString("accountid"))
                            .clientId(rs.getString("clientid"))
                            .build();

                }

                addAttributeValues(rs, currentService);
                serviceMap.put(currentId, currentService);
            }

        }
        return new ArrayList<>(serviceMap.values());
    }

    private void addAttributeValues(ResultSet rs, Service service) throws SQLException, DataAccessException {
        PGobject genericValueObject = (PGobject) rs.getObject("attribute_value_value");
        AuditDetails auditDetails = AuditDetails.builder().createdBy(rs.getString("attribute_value_createdby"))
                .createdTime(rs.getLong("attribute_value_createdtime")).lastModifiedBy(rs.getString("attribute_value_lastmodifiedby"))
                .lastModifiedTime(rs.getLong("attribute_value_lastmodifiedtime")).build();
        AttributeValue attributeValue = AttributeValue.builder().id(rs.getString("attribute_value_id"))
                .referenceId(rs.getString("attribute_value_referenceid"))
                .attributeCode(rs.getString("attribute_value_attributecode"))
                .value(getProperTypeCastedAttributeValue(genericValueObject))
                .auditDetails(auditDetails)
                .additionalDetails(getAdditionalDetail((PGobject) rs.getObject("attribute_value_additionaldetails")))
                .build();

        if (CollectionUtils.isEmpty(service.getAttributes())) {
            List<AttributeValue> attributeValues = new ArrayList<>();
            attributeValues.add(attributeValue);
            service.setAttributes(attributeValues);
        } else {
            service.getAttributes().add(attributeValue);
        }


    }

    private Object getProperTypeCastedAttributeValue(PGobject genericValueObject) {
        String valueJson = genericValueObject.getValue();
        return JsonPath.read(valueJson, VALUE_JSON_PATH);
    }

    private JsonNode getAdditionalDetail(PGobject pGobject){

        JsonNode additionalDetail = null;
        try {
            if(pGobject != null){
                additionalDetail = mapper.readTree(pGobject.getValue());
            }
        }
        catch (IOException e){
            throw new CustomException("PARSING_ERROR","Failed to parse additionalDetail object");
        }
        return additionalDetail;
    }

    private JsonNode getJsonValue(PGobject pGobject) {
        try {
            if (Objects.isNull(pGobject) || Objects.isNull(pGobject.getValue()))
                return null;
            else
                return mapper.readTree(pGobject.getValue());
        } catch (IOException e) {
            throw new CustomException("SERVER_ERROR", "Exception occurred while parsing the additionalDetail json : " + e
                    .getMessage());
        }
    }

    private List<String> nodeToList(PGobject pGobject) {
        try {
            if (Objects.isNull(pGobject) || Objects.isNull(pGobject.getValue()))
                return null;
            else
                return mapper.readValue(pGobject.getValue(), new TypeReference<List<String>>() {
                });

        } catch (IOException e) {
            throw new CustomException("SERVER_ERROR", "Exception occurred while parsing the receiver json : " + e
                    .getMessage());
        }
    }

}
