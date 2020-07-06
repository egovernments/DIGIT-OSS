package egov.casemanagement.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import egov.casemanagement.service.EmployeeService;
import egov.casemanagement.service.UserService;
import egov.casemanagement.utils.EmailNotificationService;
import egov.casemanagement.web.models.EmployeeCreateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

@Controller
@RequestMapping("/employee/v1")
public class EmployeeController {

    private final ObjectMapper objectMapper;

    private final HttpServletRequest request;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EmailNotificationService emailNotificationService;

    @Autowired
    public EmployeeController(ObjectMapper objectMapper, HttpServletRequest request, UserService userService) {
        this.objectMapper = objectMapper;
        this.request = request;
    }

    @RequestMapping(value = "/_create", method = RequestMethod.POST)
    public ResponseEntity<Void> createEmployee(@Valid @RequestBody EmployeeCreateRequest employeeCreateRequest) throws Exception{
        employeeService.createEmployee(employeeCreateRequest);
        return new ResponseEntity<Void>(HttpStatus.OK);
    }

}
