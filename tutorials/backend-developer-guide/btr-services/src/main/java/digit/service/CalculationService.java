package digit.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import digit.config.BTRConfiguration;
import digit.repository.ServiceRequestRepository;
import digit.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CalculationService {

    @Autowired
    private BTRConfiguration btrConfiguration;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    public CalculationRes getCalculation(BirthRegistrationRequest request){

        List<CalculationCriteria> calculationCriteriaList = new ArrayList<>();
        for(BirthRegistrationApplication application : request.getBirthRegistrationApplications()) {
            CalculationCriteria calculationCriteria = CalculationCriteria.builder()
                    .birthregistrationapplication(application)
                    .tenantId(application.getTenantId())
                    .applicationNumber(application.getApplicationNumber())
                    .build();
            calculationCriteriaList.add(calculationCriteria);
        }

        CalculationReq calculationReq = CalculationReq.builder()
                .requestInfo(request.getRequestInfo())
                .calculationCriteria(calculationCriteriaList)
                .build();

        StringBuilder url = new StringBuilder().append(btrConfiguration.getBtrCalculatorHost())
                .append(btrConfiguration.getBtrCalculatorCalculateEndpoint());

        Object response = serviceRequestRepository.fetchResult(url, calculationReq);
        CalculationRes calculationRes = mapper.convertValue(response, CalculationRes.class);

        return calculationRes;
    }
}
