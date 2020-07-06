package egov.casemanagement.service;

import egov.casemanagement.web.models.ModelCase;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class ReportService {

    @Autowired
    private TenantService tenantService;
    @Autowired
    private CaseService caseService;


    // TODO : Pending

    public void sendDefaulterReport() {

        List<String> tenantIds = tenantService.getAllTenantIds();

        for(String tenantId : tenantIds) {
            List<ModelCase> modelCases = caseService.getDefaulterCases(tenantId);



        }

    }

}
