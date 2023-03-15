package org.egov.egf.masters.services;

import java.util.ArrayList;
import java.util.List;

import org.egov.commons.Accountdetailkey;
import org.egov.commons.service.AccountDetailKeyService;
import org.egov.commons.service.EntityTypeService;
import org.egov.commons.utils.EntityType;
import org.egov.eis.entity.Employee;
import org.egov.infra.validation.exception.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class EmployeeService implements EntityTypeService {

    @Autowired
    private AccountDetailKeyService accountDetailKeyService;

    
    @Override
    public List<? extends EntityType> getAllActiveEntities(Integer accountDetailTypeId) {
        // TODO Auto-generated method stub
        
        List<Accountdetailkey> accdetails = accountDetailKeyService.findByDetailTypeId(accountDetailTypeId);
        List<Employee> employees = new ArrayList<>();
        
        accdetails.forEach(accdetail->{
            Employee employee = new Employee();
            
            String[] detailNames = accdetail.getDetailname().split("-");
            employee.setId(accdetail.getDetailkey().longValue());
            employee.setCode(detailNames[0]);
            employee.setName(detailNames[1]);
            employees.add(employee);
        });
        
        
        return employees;
    }

    @Override
    public List<? extends EntityType> filterActiveEntities(String filterKey, int maxRecords, Integer accountDetailTypeId) {
        // TODO Auto-generated method stub
       
        List<Accountdetailkey> accdetails = accountDetailKeyService.findByDetailName(accountDetailTypeId, filterKey);
        List<Employee> employees = new ArrayList<>();
        System.out.println("*********accdetails size"+accdetails.size());
        accdetails.forEach(accdetail->{
            Employee employee = new Employee();
            employee.setName(accdetail.getDetailname());
            employee.setId(accdetail.getDetailkey().longValue());
            employees.add(employee);
        });
        
        
        return employees;
    }

    @Override
    public List getAssetCodesForProjectCode(Integer accountdetailkey) throws ValidationException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<? extends EntityType> validateEntityForRTGS(List<Long> idsList) throws ValidationException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<? extends EntityType> getEntitiesById(List<Long> idsList) throws ValidationException {
        // TODO Auto-generated method stub
        return null;
    }

}
