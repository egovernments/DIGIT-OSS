package digit.service;

import digit.util.MdmsUtil;
import digit.util.ResponseInfoFactory;
import digit.web.models.Calculation;
import digit.web.models.CalculationCriteria;
import digit.web.models.CalculationReq;
import digit.web.models.CalculationRes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class CalculationService {

    @Autowired
    private MdmsUtil mdmsUtil;

    @Autowired
    private ResponseInfoFactory responseInfoFactory;

    @Autowired
    private DemandService demandService;

    public List<Calculation> calculate(CalculationReq calculationReq){
        List<Calculation> calculations = getCalculations(calculationReq);
        CalculationRes calculationRes = CalculationRes.builder().responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(calculationReq.getRequestInfo(),true)).calculation(calculations).build();

        demandService.generateDemands(calculationReq.getRequestInfo(),calculations);
        return calculations;
    }

    public List<Calculation> getCalculations(CalculationReq calculationReq){
        List<Calculation> calculations = new LinkedList<>();
        for(CalculationCriteria calculationCriteria : calculationReq.getCalculationCriteria()) {
            Calculation calculation = new Calculation();
            calculation.setApplicationNumber(calculationCriteria.getApplicationNumber());
            calculation.setTenantId(calculationCriteria.getTenantId());
            calculation.setTotalAmount(Double.valueOf(getAmount(calculationReq)));
            calculations.add(calculation);
        }
        return calculations;
    }

    private Integer getAmount(CalculationReq calculationReq) {
        return mdmsUtil.fetchRegistrationChargesFromMdms(calculationReq.getRequestInfo(), calculationReq.getCalculationCriteria().get(0).getTenantId());
    }

}
