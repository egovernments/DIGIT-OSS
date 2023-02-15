package digit.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import digit.config.BTRCalculatorConfigs;
import digit.repository.ServiceRequestRepository;
import digit.web.models.*;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
public class DemandService {

    @Autowired
    private BTRCalculatorConfigs btrCalculatorConfigs;

    @Autowired
    private ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private ServiceRequestRepository repository;

    public List<Demand> generateDemands(RequestInfo requestInfo, List<Calculation> calculations){
        List<Demand> demands = new ArrayList<>();

        for(Calculation calculation : calculations){
            DemandDetail demandDetail = DemandDetail.builder()
                    .tenantId(calculation.getTenantId())
                    .taxAmount(BigDecimal.valueOf(calculation.getTotalAmount()))
                    .taxHeadMasterCode(btrCalculatorConfigs.getTaxHeadMasterCode()).build();

            Demand demand = Demand.builder()
                    .tenantId(calculation.getTenantId()).consumerCode(calculation.getApplicationNumber())
                    .consumerType("PAYMENT_BND_CONSUMER_CODE")
                    .businessService(btrCalculatorConfigs.getModuleCode())
                    .taxPeriodFrom(System.currentTimeMillis()).taxPeriodTo(System.currentTimeMillis())
                    .demandDetails(Collections.singletonList(demandDetail))
                    .build();

            demands.add(demand);
        }

        StringBuilder url = new StringBuilder().append(btrCalculatorConfigs.getBillingServiceHost())
                .append(btrCalculatorConfigs.getDemandCreateEndpoint());

        DemandRequest demandRequest = DemandRequest.builder().requestInfo(requestInfo).demands(demands).build();

        Object response = repository.fetchResult(url,demandRequest);

        DemandResponse demandResponse = mapper.convertValue(response,DemandResponse.class);
        return demandResponse.getDemands();
    }

    public BillResponse getBill(RequestInfoWrapper requestInfoWrapper, String tenantId, String applicationNumber) {
        String uri = getFetchBillURI();
        uri = uri.replace("{1}", tenantId);
        uri = uri.replace("{2}", applicationNumber);
        uri = uri.replace("{3}", btrCalculatorConfigs.getModuleCode());

        Object response = repository.fetchResult(new StringBuilder(uri), requestInfoWrapper);
        BillResponse billResponse = mapper.convertValue(response, BillResponse.class);

        return billResponse;
    }

    public String getFetchBillURI(){
        StringBuilder url = new StringBuilder(btrCalculatorConfigs.getBillingServiceHost());
        url.append(btrCalculatorConfigs.getFetchBillEndpoint());
        url.append("?");
        url.append("tenantId=");
        url.append("{1}");
        url.append("&");
        url.append("consumerCode=");
        url.append("{2}");
        url.append("&");
        url.append("businessService=");
        url.append("{3}");

        return url.toString();
    }
}
