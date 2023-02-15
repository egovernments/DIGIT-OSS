package digit.web.controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import digit.service.CalculationService;
import digit.service.DemandService;
import digit.util.ResponseInfoFactory;
import digit.web.models.*;
import io.swagger.annotations.ApiParam;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-11-04T14:15:45.774+05:30")

@Controller
@RequestMapping("/v1")
public class V1ApiController {

    private final ObjectMapper objectMapper;

    private final HttpServletRequest request;

    @Autowired
    private CalculationService calculationService;
    @Autowired
    private DemandService demandService;

    @Autowired
    private ResponseInfoFactory responseInfoFactory;

    @Autowired
    public V1ApiController(ObjectMapper objectMapper, HttpServletRequest request) {
        this.objectMapper = objectMapper;
        this.request = request;
    }

    @RequestMapping(value = "/_calculate", method = RequestMethod.POST)
    public ResponseEntity<CalculationRes> v1CalculatePost(@ApiParam(value = "required parameters have to be populated", required = true) @Valid @RequestBody CalculationReq calculationReq) {
        List<Calculation> calculations = calculationService.calculate(calculationReq);
        ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(calculationReq.getRequestInfo(),true);
        CalculationRes calculationRes = CalculationRes.builder().responseInfo(responseInfo).calculation(calculations).build();
        return new ResponseEntity<CalculationRes>(calculationRes, HttpStatus.OK);
    }

    @RequestMapping(value = "/_getbill", method = RequestMethod.POST)
    public ResponseEntity<BillResponse> v1GetbillPost(@NotNull @ApiParam(value = "Unique id for a tenant.", required = true) @Valid @RequestParam(value = "tenantId", required = true) String tenantId, @NotNull @ApiParam(value = "Unique birth registration application number.", required = true) @Valid @RequestParam(value = "applicationNumber", required = true) String applicationNumber, @ApiParam(value = "Parameter to carry Request metadata in the request body") @Valid @RequestBody RequestInfoWrapper requestInfoWrapper) {
        BillResponse billResponse = demandService.getBill(requestInfoWrapper, tenantId, applicationNumber);
        return new ResponseEntity<BillResponse>(billResponse, HttpStatus.OK);
    }

}
