package egov.casemanagement.web.controllers;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jackson.JsonLoader;
import com.github.fge.jsonschema.core.exceptions.ProcessingException;
import com.github.fge.jsonschema.core.report.ProcessingReport;
import com.github.fge.jsonschema.main.JsonSchema;
import com.github.fge.jsonschema.main.JsonSchemaFactory;
import egov.casemanagement.service.CaseService;
import egov.casemanagement.web.models.HealthdetailCreateRequest;
import org.apache.commons.io.IOUtils;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.validation.Valid;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2020-05-27T12:33:33.069+05:30")

@Controller
@RequestMapping("/healthdetail/v1")
public class HealthdetailApiController {

    private final ObjectMapper objectMapper;
    private CaseService caseService;
    private final JsonSchema jsonSchema;

    @Value("${health.detail.schema}")
    private String healthDetailSchemaFile;

    @Autowired
    public HealthdetailApiController(ObjectMapper objectMapper, CaseService caseService, @Value("${health.detail.schema}")Resource resource) throws IOException,
            ProcessingException {
        this.objectMapper = objectMapper;
        this.caseService = caseService;

        final JsonSchemaFactory factory = JsonSchemaFactory.byDefault();

        InputStream inputStream = null;
        JsonNode schema = null;

        try {
            inputStream = resource.getInputStream();
            schema = JsonLoader.fromReader(new InputStreamReader(inputStream));
        }
        catch (IOException e){
            throw new CustomException("IO ERROR","Failed to read the resource");
        }
        finally {
            IOUtils.closeQuietly(inputStream);
        }

        jsonSchema = factory.getJsonSchema(schema);
    }

    @RequestMapping(value = "/_create", method = RequestMethod.POST)
    public ResponseEntity<Void> activity( @Valid @RequestBody HealthdetailCreateRequest body) throws ProcessingException {

        ProcessingReport report = jsonSchema.validate(body.getHealthDetails());
        Map<String, String> errorMap = new HashMap<>();
        if(!report.isSuccess()){
            report.forEach(m -> {
                errorMap.put("VALIDATION_FAILED", m.getMessage());
            });
        }

        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);

        caseService.addHealthDetail(body);

        return new ResponseEntity<Void>(HttpStatus.OK);
    }

}
