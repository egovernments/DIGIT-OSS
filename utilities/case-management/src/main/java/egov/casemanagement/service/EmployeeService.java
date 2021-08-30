package egov.casemanagement.service;

import egov.casemanagement.utils.EmailNotificationService;
import egov.casemanagement.web.models.Employee;
import egov.casemanagement.web.models.EmployeeCreateRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.validator.routines.EmailValidator;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmployeeService {

    @Autowired
    private UserService userService;
    @Autowired
    private EmailNotificationService emailNotificationService;

    public void createEmployee(EmployeeCreateRequest employeeCreateRequest) throws Exception {
        validateEmployeeCreateRequest(employeeCreateRequest);
        userService.createEmployee(employeeCreateRequest);
        emailNotificationService.sendOnboardingEmployeeEmail(employeeCreateRequest);
    }

    public boolean validateEmployeeCreateRequest(EmployeeCreateRequest employeeCreateRequest) {
        boolean isValid = false;
        Employee employee = employeeCreateRequest.getEmployee();

        EmailValidator emailValidator = EmailValidator.getInstance();
        isValid = emailValidator.isValid(employee.getEmailId());

        if(isValid)
            return true;
        else {
            throw new CustomException("Invalid EmailId", "Invalid EmailId");
        }
    }

}
