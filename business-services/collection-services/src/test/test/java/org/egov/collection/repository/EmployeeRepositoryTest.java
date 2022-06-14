package org.egov.collection.repository;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.collection.web.contract.Employee;
import org.egov.collection.web.contract.EmployeeResponse;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@ContextConfiguration(classes = {EmployeeRepository.class})
@ExtendWith(SpringExtension.class)
class EmployeeRepositoryTest {
    @Autowired
    private EmployeeRepository employeeRepository;

    @MockBean
    private RestTemplate restTemplate;

    @Test
    void testGetPositionsForEmployee() throws RestClientException {
        EmployeeResponse employeeResponse = new EmployeeResponse();
        ArrayList<Employee> employeeList = new ArrayList<>();
        employeeResponse.setEmployees(employeeList);
        employeeResponse.setResponseInfo(new ResponseInfo());
        when(this.restTemplate.postForObject((String) any(), (Object) any(), (Class<EmployeeResponse>) any(),
                (Object[]) any())).thenReturn(employeeResponse);
        List<Employee> actualPositionsForEmployee = this.employeeRepository.getPositionsForEmployee(new RequestInfo(), 123L,
                "42");
        assertSame(employeeList, actualPositionsForEmployee);
        assertTrue(actualPositionsForEmployee.isEmpty());
        verify(this.restTemplate).postForObject((String) any(), (Object) any(), (Class<EmployeeResponse>) any(),
                (Object[]) any());
    }
}

