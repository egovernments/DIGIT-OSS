package egov.dataupload.web.controllers;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jackson.JsonLoader;
import com.github.fge.jsonschema.core.exceptions.ProcessingException;
import com.github.fge.jsonschema.core.report.ProcessingReport;
import com.github.fge.jsonschema.main.JsonSchema;
import com.github.fge.jsonschema.main.JsonSchemaFactory;
import egov.dataupload.service.CaseService;
import egov.dataupload.web.models.HealthdetailCreateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.validation.Valid;
import java.io.IOException;
import java.io.InputStreamReader;

@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2020-05-27T12:33:33.069+05:30")

@Controller
@RequestMapping("/healthdetail/v1")
public class HealthdetailApiController {

    private final ObjectMapper objectMapper;
    private CaseService caseService;

    @Value("${health.detail.schema}")
    private String healthDetailSchemaFile;

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    public HealthdetailApiController(ObjectMapper objectMapper, CaseService caseService) {
        this.objectMapper = objectMapper;
        this.caseService = caseService;
    }

    @RequestMapping(value = "/_create", method = RequestMethod.POST)
    public ResponseEntity<Void> activity( @Valid @RequestBody HealthdetailCreateRequest body) throws IOException, ProcessingException {
        Resource resource = resourceLoader.getResource(healthDetailSchemaFile);
        final JsonSchemaFactory factory = JsonSchemaFactory.byDefault();

        JsonNode schema = JsonLoader.fromReader(new InputStreamReader(resource.getInputStream()));
        final JsonSchema jsonSchema = factory.getJsonSchema(schema);
        ProcessingReport report = jsonSchema.validate(body.getHealthDetails());
        System.out.println(report.isSuccess());

        caseService.addHealthDetail(body);

        return new ResponseEntity<Void>(HttpStatus.OK);
    }

}
