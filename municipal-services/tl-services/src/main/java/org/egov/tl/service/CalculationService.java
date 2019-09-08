package org.egov.tl.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tl.repository.ServiceRequestRepository;
import org.egov.tl.util.TradeUtil;
import org.egov.tl.web.models.TradeLicense;
import org.egov.tl.web.models.TradeLicenseRequest;
import org.egov.tl.web.models.calculation.Calculation;
import org.egov.tl.web.models.calculation.CalculationReq;
import org.egov.tl.web.models.calculation.CalculationRes;
import org.egov.tl.web.models.calculation.CalulationCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;


@Service
public class CalculationService {

    private TradeUtil utils;

    private ServiceRequestRepository serviceRequestRepository;

    private ObjectMapper mapper;


    @Autowired
    public CalculationService(TradeUtil utils, ServiceRequestRepository serviceRequestRepository, ObjectMapper mapper) {
        this.utils = utils;
        this.serviceRequestRepository = serviceRequestRepository;
        this.mapper = mapper;
    }


    /**
     * Adds the calculation object to the request
     * @param request The input create or update request
     * @return request with calculation object added
     */
    public List<TradeLicense> addCalculation(TradeLicenseRequest request){
        RequestInfo requestInfo = request.getRequestInfo();
        List<TradeLicense> licenses = request.getLicenses();

        if(CollectionUtils.isEmpty(licenses))
            throw new CustomException("INVALID REQUEST","The request for calculation cannot be empty or null");

        CalculationRes response = getCalculation(requestInfo,licenses);
        List<Calculation> calculations = response.getCalculations();
        Map<String,Calculation> applicationNumberToCalculation = new HashMap<>();
        calculations.forEach(calculation -> {
            applicationNumberToCalculation.put(calculation.getTradeLicense().getApplicationNumber(),calculation);
        });

        licenses.forEach(license ->{
            license.setCalculation(applicationNumberToCalculation.get(license.getApplicationNumber()));
        });

        return licenses;
    }


    /**
     * Call tl-calculator to get the calculation Object for the given license
     * @param requestInfo The requestInfo of the incoming request
     * @param licenses The tradeLicense to whom the calculation object has to be added
     * @return CalculationRes from the tl-calculator
     */
    private CalculationRes getCalculation(RequestInfo requestInfo,List<TradeLicense> licenses){
        StringBuilder uri = utils.getCalculationURI();
        List<CalulationCriteria> criterias = new LinkedList<>();

        licenses.forEach(license -> {
            criterias.add(new CalulationCriteria(license,license.getApplicationNumber(),license.getTenantId()));
        });

        CalculationReq request = CalculationReq.builder().calulationCriteria(criterias)
                .requestInfo(requestInfo)
                .build();

        Object result = serviceRequestRepository.fetchResult(uri,request);
        CalculationRes response = null;
        try{
            response = mapper.convertValue(result,CalculationRes.class);
        }
        catch (IllegalArgumentException e){
            throw new CustomException("PARSING ERROR","Failed to parse response of calculate");
        }
        return response;
    }

}
